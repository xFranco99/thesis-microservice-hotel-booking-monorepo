import os
from http import HTTPStatus
import sqlite3

from fastapi import HTTPException
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.retrieval import create_retrieval_chain
from langchain_chroma import Chroma
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_ollama import OllamaEmbeddings, ChatOllama

from config.costants import VECTOR_DB_FOLDER_PATH, VECTOR_DB_NAME
from utils.util import LOG
from vector_database.vectorized_db_manager import vectorized_db_exist


class RAGChatAssistant:
    def __init__(self, max_history_length=10):
        """
        Initialize RAG chat assistant with configurable history management

        :param max_history_length: Maximum number of messages to retain in chat history
        """
        self.chat_history = []
        self.max_history_length = max_history_length

        # Persistent configuration
        self.persistent_directory = os.path.join(VECTOR_DB_FOLDER_PATH, VECTOR_DB_NAME)

        # Embeddings configuration
        self.embeddings = OllamaEmbeddings(model="nomic-embed-text")

        # Initialize Chroma client for more robust database management
        self.db = None

        # System prompts
        self.contextualize_q_system_prompt = (
            "Given a chat history and the last user question "
            "which might reference context in the chat history, "
            "formulate a standalone question which can be understood "
            "without the chat history. Do NOT answer the question, just "
            "reformulate it if needed and otherwise return it as is."
        )

        self.qa_system_prompt = (
            "You are Botto, an assistant for question-answering task. "
            "Use the following pieces of retrieved context only to answer the "
            "question. If you don't know the answer or it is not in the context, "
            "just say: 'I don't know, but you can call the assistant phone number: "
            "(555) 123-4567 for further assistance.'. "
            "Use three sentences maximum and keep the answer concise. "
            "Remember: You can't answer to anything that is not context related. "
            "\n\n"
            "Context: {context}"
        )

    def _manage_chat_history(self):
        """
        Trim chat history to maintain maximum length
        """
        if len(self.chat_history) > self.max_history_length * 2:
            self.chat_history = self.chat_history[-(self.max_history_length * 2):]

    def retrieve_llm_response(self, query: str):
        """
        Retrieve LLM response using RAG approach

        :param query: User's input query
        :return: LLM generated response
        """
        LOG.info("Start chatting with the AI!")

        try:
            if not vectorized_db_exist():
                raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                                    detail="vectorized db not found")

            self.db = Chroma(
                persist_directory=str(self.persistent_directory),
                embedding_function=self.embeddings
            )

            retriever = self.db.as_retriever(
                search_type="similarity_score_threshold",
                search_kwargs={"k": 3, "score_threshold": 0.1}
            )

            llm = ChatOllama(
                temperature=0,
                model="llama3.2"
            )

            contextualize_q_prompt = ChatPromptTemplate.from_messages([
                ("system", self.contextualize_q_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}")
            ])

            history_aware_retriever = create_history_aware_retriever(
                llm, retriever, contextualize_q_prompt
            )

            qa_prompt = ChatPromptTemplate.from_messages([
                ("system", self.qa_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}")
            ])

            question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
            rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

            result = rag_chain.invoke({
                "input": query,
                "chat_history": self.chat_history
            })

            LOG.info(f"AI: {result['answer']}")

            # Update chat history
            self.chat_history.append(HumanMessage(content=query))
            self.chat_history.append(SystemMessage(content=result['answer']))

            # Manage history length
            self._manage_chat_history()

            del self.db._persist_directory
            del self.db
            del retriever
            del history_aware_retriever
            del question_answer_chain
            del rag_chain

            return result['answer']

        except Exception as e:
            LOG.error(f"Error in RAG retrieval: {e}")
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"An error occurred during retrieval: {str(e)}"
            )

    def reset_chat_history(self):
        """
        Reset the chat history
        """
        self.chat_history = []
        LOG.info("Chat history reset successfully")
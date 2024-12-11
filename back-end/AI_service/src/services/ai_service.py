import os
from http import HTTPStatus

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
from vector_database.vectorized_db_manager import initializer

chat_history = []

persistent_directory = os.path.join(VECTOR_DB_FOLDER_PATH, VECTOR_DB_NAME)

embeddings = OllamaEmbeddings(model="nomic-embed-text")

if initializer():
    db = Chroma(
        persist_directory=str(persistent_directory),
        embedding_function=embeddings
    )

    retriever = db.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={"k": 3, "score_threshold": 0.1}
    )

    llm = ChatOllama(
        temperature=0,
        model="llama3.2"
    )

    contextualize_q_system_prompt = (
        "Given a chat history and the last user question"
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, just "
        "reformulate it if needed and otherwise return it as is."
    )

    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}")
        ]
    )

    _history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )

    qa_system_prompt = (
        "You are Botto, an assistant for question-answering task. "
        "Use the following pieces of retrieved context only to answer the "
        "question. If you don't know the answer or it is not in the context, "
        "just say: 'I don't know, but you can call the assistant phone number: "
        "(555) 123-4567 for further assistance.'. "
        "Use three sentences maximum and keep the answer concise."
        "Remember: You can't answer to anything that is not context related."
        "\n\n"
        "Context: {context}"
    )

    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}")
        ]
    )

    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(_history_aware_retriever, question_answer_chain)

def retrieve_llm_response(query: str):
    LOG.info("Start chatting with the AI!")

    if not initializer():
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail="RAG text file not found.")

    result = rag_chain.invoke({"input": query, "chat_history": chat_history})
    LOG.info(f"AI: {result['answer']}")

    chat_history.append(HumanMessage(content=query))
    chat_history.append(SystemMessage(content=result['answer']))

    return result['answer']
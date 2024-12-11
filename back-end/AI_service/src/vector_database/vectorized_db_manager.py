import os
import shutil

from langchain.text_splitter import TextSplitter
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_ollama import OllamaEmbeddings

from config.costants import RAG_TXT_SEPARATOR, VECTOR_DB_NAME, OLLAMA_EMBEDDER, RAG_TXT_NAME, VECTOR_DB_FOLDER_PATH
from utils.util import LOG

current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_dir, "data", RAG_TXT_NAME)

class CustomTextSplitter(TextSplitter):
    def split_text(self, text: str):
        return text.split(RAG_TXT_SEPARATOR)

def initializer():
    if not os.path.exists(file_path):
        LOG.error(f"--- The file {file_path} does not exist, can't start the application. Please check the path.")
        return False

    loader = TextLoader(file_path, encoding = 'UTF-8')
    documents = loader.load()

    embeddings = OllamaEmbeddings(model=OLLAMA_EMBEDDER)

    LOG.info("--- Using Custom Splitting")
    custom_splitter = CustomTextSplitter()
    char_docs = custom_splitter.split_documents(documents)

    persistent_directory = os.path.join(VECTOR_DB_FOLDER_PATH, VECTOR_DB_NAME)
    if not os.path.exists(persistent_directory):
        LOG.info(f"--- Create a vector store {VECTOR_DB_NAME}")
        Chroma.from_documents(
            char_docs,
            embeddings,
            persist_directory=str(persistent_directory)
        )
        LOG.info(f"--- Finished creating vector store {VECTOR_DB_NAME}")
    else:
        LOG.info(f"--- Vector store {VECTOR_DB_NAME} already exist. No need to initialize.")

    return True

def clear_vectorized_db():
    persistent_directory = os.path.join(VECTOR_DB_FOLDER_PATH, VECTOR_DB_NAME)
    if not os.path.exists(persistent_directory):
        LOG.info(f"--- Vector store {VECTOR_DB_NAME} not exist. No need to delete.")
        return

    shutil.rmtree(persistent_directory)
    LOG.info(f"--- Vector store {VECTOR_DB_NAME} correctly removed")
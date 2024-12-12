import os
import shutil
import sqlite3
from threading import Lock

from fastapi import UploadFile, HTTPException
from langchain.text_splitter import TextSplitter
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_ollama import OllamaEmbeddings
from win32ctypes.pywin32.pywintypes import datetime

from config.costants import RAG_TXT_SEPARATOR, VECTOR_DB_NAME, OLLAMA_EMBEDDER, RAG_TXT_NAME, VECTOR_DB_FOLDER_PATH
from utils.util import LOG

current_dir = os.path.dirname(os.path.abspath(__file__))
data_folder = os.path.join(current_dir, "data")
file_path = os.path.join(data_folder, RAG_TXT_NAME)
file_id = RAG_TXT_NAME + str(datetime.now())

db_lock = Lock()

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
            persist_directory=str(persistent_directory),
            ids=file_id
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

def save_rag_file(file: UploadFile):
    try:
        clear_vectorized_db()

        if not file.filename.endswith(".txt"):
            raise HTTPException(status_code=500, detail='This is not a txt file, please upload a .txt file.')

        if not os.path.exists(os.path.abspath(data_folder)):
            os.makedirs(os.path.abspath(data_folder))

        contents = file.file.read()

        with open(file_path, 'wb') as f:
            f.write(contents)
    except HTTPException as he:
        raise he
    except Exception:
        raise HTTPException(status_code=500, detail='Something went wrong')
    finally:
        file.file.close()
        clear_vectorized_db()
        initializer()

    return {"message": f"RAG file successfully uploaded {file.filename}"}
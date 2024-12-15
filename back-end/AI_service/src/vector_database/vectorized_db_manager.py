import os

from fastapi import UploadFile, HTTPException
from langchain.text_splitter import TextSplitter
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_ollama import OllamaEmbeddings

from config.costants import RAG_TXT_SEPARATOR, VECTOR_DB_NAME, OLLAMA_EMBEDDER, RAG_TXT_NAME, VECTOR_DB_FOLDER_PATH
from utils.util import LOG

current_dir = os.path.dirname(os.path.abspath(__file__))
data_folder = os.path.join(current_dir, "data")
file_path = os.path.join(data_folder, RAG_TXT_NAME)

class CustomTextSplitter(TextSplitter):
    def split_text(self, text: str):
        return text.split(RAG_TXT_SEPARATOR)

def vectorized_db_exist():
    persistent_directory = os.path.join(VECTOR_DB_FOLDER_PATH, VECTOR_DB_NAME)
    return os.path.exists(persistent_directory)

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

    LOG.info(f"--- Create a vector store {VECTOR_DB_NAME}")

    db = Chroma(
        persist_directory=str(persistent_directory),
        embedding_function=embeddings
    )

    db.from_documents(
        char_docs,
        embeddings,
        persist_directory=str(persistent_directory)
    )

    del db
    LOG.info(f"--- Finished creating vector store {VECTOR_DB_NAME}")

    return True

def save_rag_file(file: UploadFile):
    #clear_vectorized_db()
    try:
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
        initializer()

    return {"message": f"RAG file successfully uploaded {file.filename}"}
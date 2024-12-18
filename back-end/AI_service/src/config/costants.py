import os

# vector db
RAG_TXT_SEPARATOR = "\n---\n"
VECTOR_DB_NAME = "vectorized_db"
RAG_TXT_NAME = "rag_file.txt"
VECTOR_DB_FOLDER_PATH = os.path.abspath("./vector_database/db")

# ollama
OLLAMA_EMBEDDER = "nomic-embed-text"
OLLAMA_CHAT_MODEL = "llama3.1:8b"
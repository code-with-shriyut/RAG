from pathlib import Path
import shutil
import json
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.ingestion.loader import load_pdf
from src.ingestion.cleaner import clean_documents
from src.ingestion.chunker import chunk_documents
from src.embeddings.embedder import embed_documents
from src.vectorstore.store import FAISSVectorStore
from src.generation.llm import generate_answer

app = FastAPI(title="Yomiko RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vector_store = FAISSVectorStore()

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

VECTORSTORE_DIR = Path("data/vectorstores")
VECTORSTORE_DIR.mkdir(parents=True, exist_ok=True)

DOCUMENTS_FILE = Path("data/documents.json")

if not DOCUMENTS_FILE.exists():
    DOCUMENTS_FILE.write_text("[]")


# -----------------------------
# Request Models
# -----------------------------
class ChatRequest(BaseModel):
    question: str


# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
def home():
    return {"message": "Yomiko RAG API Running 🌸"}


# -----------------------------
# Upload Endpoint
# -----------------------------
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are allowed.")

    pdf_path = UPLOAD_DIR / file.filename

    with pdf_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    documents = load_pdf(str(pdf_path))
    cleaned = clean_documents(documents)
    chunks = chunk_documents(cleaned)
    embedded = embed_documents(chunks)

    global vector_store
    vector_store = FAISSVectorStore()
    vector_store.add_documents(embedded)

    # ---------- Save document metadata ----------

    with open(DOCUMENTS_FILE, "r") as f:
        documents_db = json.load(f)

    doc_id = len(documents_db) + 1

    # Save FAISS for this document
    doc_folder = VECTORSTORE_DIR / str(doc_id)
    vector_store.save(str(doc_folder))

    documents_db.append({
        "id": doc_id,
        "filename": file.filename,
        "pages": len(documents),
        "uploaded_at": datetime.now().strftime("%d %b %Y, %I:%M %p")
    })

    with open(DOCUMENTS_FILE, "w") as f:
        json.dump(documents_db, f, indent=4)

    return {
        "message": "Document indexed successfully",
        "filename": file.filename,
        "pages": len(documents),
        "document_id": doc_id
    }


# -----------------------------
# Ask Endpoint
# -----------------------------
@app.post("/ask")
async def ask_question(request: ChatRequest):

    if vector_store.total_vectors() == 0:
        raise HTTPException(
            400,
            "Please upload a PDF before asking questions."
        )

    # 1. Retrieve
    retrieved_chunks = vector_store.similarity_search(
        request.question,
        k=4
    )

    # 2. Build Context
    context = "\n\n".join(
        chunk["text"] for chunk in retrieved_chunks
    )

    prompt = f"""
You are Yomiko, a helpful RAG assistant.

Answer ONLY using the provided context.
If the answer is not present, clearly say:
'I couldn't find that information in the uploaded document.'

Context:
{context}

Question:
{request.question}

Answer:
"""

    # 3. Generate
    answer = generate_answer(prompt)

    # 4. Extract page citations
    sources = []

    for chunk in retrieved_chunks:

        page = chunk["metadata"].get("page")

        if page is not None:
            sources.append(f"Page {page}")

    # Remove duplicates
    sources = list(dict.fromkeys(sources))

    return {
        "answer": answer,
        "sources": sources
    }
@app.get("/documents")
def get_documents():

    with open(DOCUMENTS_FILE, "r") as f:
        documents = json.load(f)

    return documents

@app.post("/documents/{document_id}/open")
def open_document(document_id: int):

    folder = VECTORSTORE_DIR / str(document_id)

    if not folder.exists():
        raise HTTPException(404, "Document not found.")

    global vector_store
    vector_store = FAISSVectorStore()
    vector_store.load(str(folder))

    return {
        "message": "Document loaded successfully",
        "document_id": document_id
    }
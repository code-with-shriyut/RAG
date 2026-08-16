from src.ingestion.loader import load_pdf
from src.ingestion.cleaner import clean_documents
from src.ingestion.chunker import chunk_documents
from src.embeddings.embedder import embed_documents
from src.vectorstore.store import FAISSVectorStore


pdf_path = "data/documents/RAG_Fundamentals_Notes.pdf"

# Pipeline
documents = load_pdf(pdf_path)
cleaned = clean_documents(documents)
chunks = chunk_documents(cleaned)
embedded = embed_documents(chunks)

# Create vector store
store = FAISSVectorStore()

store.add_documents(embedded)

print("Total vectors stored:", store.total_vectors())

# Save to disk
store.save("data/processed")

print("Vector store saved successfully!")
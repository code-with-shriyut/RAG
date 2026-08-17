from src.ingestion.loader import load_pdf
from src.ingestion.cleaner import clean_documents
from src.ingestion.chunker import chunk_documents
from src.embeddings.embedder import embed_documents


pdf_path = "data/documents/RAG_Fundamentals_Notes.pdf"

# Step 1
documents = load_pdf(pdf_path)

# Step 2
cleaned_documents = clean_documents(documents)

# Step 3
chunks = chunk_documents(cleaned_documents)

# Step 4
embedded_chunks = embed_documents(chunks)

print("Total chunks:", len(embedded_chunks))

print("\nFirst embedded chunk metadata:")
print(embedded_chunks[0]["metadata"])

print("\nEmbedding dimension:")
print(len(embedded_chunks[0]["embedding"]))

print("\nFirst 10 embedding values:")
print(embedded_chunks[0]["embedding"][:10])
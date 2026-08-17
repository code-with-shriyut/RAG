from src.ingestion.loader import load_pdf
from src.ingestion.cleaner import clean_documents
from src.ingestion.chunker import chunk_documents


pdf_path = "data/documents/RAG_Fundamentals_Notes.pdf"

# Step 1: Load PDF
documents = load_pdf(pdf_path)

# Step 2: Clean extracted text
cleaned_documents = clean_documents(documents)

# Step 3: Create chunks
chunks = chunk_documents(
    cleaned_documents,
    chunk_size=1000,
    chunk_overlap=200
)

print("Total pages:", len(cleaned_documents))
print("Total chunks:", len(chunks))

print("\nFirst chunk:")
print(chunks[0])

print("\nFirst chunk metadata:")
print(chunks[0]["metadata"])

print("\nFirst chunk length:")
print(len(chunks[0]["text"]))

print("\nSecond chunk:")
print(chunks[1])

print("\nSecond chunk length:")
print(len(chunks[1]["text"]))
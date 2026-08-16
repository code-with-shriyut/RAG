from src.vectorstore.store import FAISSVectorStore
from src.retrieval.retriever import Retriever
from src.generation.prompt_builder import build_prompt
from src.generation.llm import generate_answer

# Load vector database
store = FAISSVectorStore()
store.load("data/processed")

# Retriever
retriever = Retriever(store)

query = "What is chunk overlap?"

# Retrieve relevant chunks
chunks = retriever.retrieve(query, top_k=3)

# Build prompt
prompt = build_prompt(query, chunks)

# Generate answer
answer = generate_answer(prompt)

print("\nQuestion:")
print(query)

print("\nAnswer:")
print(answer)
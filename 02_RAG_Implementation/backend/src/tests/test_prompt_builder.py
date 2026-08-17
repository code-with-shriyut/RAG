from src.vectorstore.store import FAISSVectorStore
from src.retrieval.retriever import Retriever
from src.generation.prompt_builder import build_prompt


store = FAISSVectorStore()
store.load("data/processed")

retriever = Retriever(store)

query = "What is chunk overlap?"

chunks = retriever.retrieve(query, top_k=3)

prompt = build_prompt(query, chunks)

print(prompt)
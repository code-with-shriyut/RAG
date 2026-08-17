# from src.vectorstore.store import FAISSVectorStore
# from src.retrieval.retriever import Retriever


# # Load the saved vector database
# store = FAISSVectorStore()
# store.load("data/processed")

# # Create retriever
# retriever = Retriever(store)

# # Ask a question
# results = retriever.retrieve(
#     "What is chunk overlap?",
#     top_k=3
# )

# print(f"Retrieved {len(results)} chunks\n")

# for i, chunk in enumerate(results, start=1):
#     print("=" * 50)
#     print(f"Result {i}")
#     print("Page:", chunk["metadata"]["page"])
#     print("Chunk:", chunk["metadata"]["chunk_id"])
#     print("\nText Preview:")
#     print(chunk["text"][:300])
#     print()

import faiss
import numpy as np
import pickle
from pathlib import Path


class FAISSVectorStore:
    """
    A simple FAISS-based vector store for RAG.

    Responsibilities:
    - Create a FAISS index
    - Store embedding vectors
    - Save / Load the index
    - Preserve text and metadata
    """

    def __init__(self, embedding_dim: int = 384):
        """
        Initialize an empty FAISS index.

        Args:
            embedding_dim: Dimension of embedding vectors.
                           all-MiniLM-L6-v2 = 384
        """

        self.embedding_dim = embedding_dim

        # L2 (Euclidean Distance) index
        self.index = faiss.IndexFlatL2(embedding_dim)

        # Stores original text + metadata
        self.documents = []

    def add_documents(self, embedded_chunks: list[dict]):
        """
        Add embedded chunks to the FAISS index.

        Args:
            embedded_chunks: Output from embedder.py
        """

        vectors = []

        for chunk in embedded_chunks:

            vectors.append(chunk["embedding"])

            self.documents.append({
                "text": chunk["text"],
                "metadata": chunk["metadata"]
            })

        # Convert Python list -> NumPy float32 array
        vectors = np.array(vectors, dtype=np.float32)

        # Insert vectors into FAISS
        self.index.add(vectors)

    def save(self, folder_path: str):
        """
        Save FAISS index and document metadata.

        Creates:
        vector.index
        documents.pkl
        """

        folder = Path(folder_path)
        folder.mkdir(parents=True, exist_ok=True)

        # Save FAISS index
        faiss.write_index(
            self.index,
            str(folder / "vector.index")
        )

        # Save text + metadata
        with open(folder / "documents.pkl", "wb") as f:
            pickle.dump(self.documents, f)

    def load(self, folder_path: str):
        """
        Load an existing FAISS index and documents.
        """

        folder = Path(folder_path)

        self.index = faiss.read_index(
            str(folder / "vector.index")
        )

        with open(folder / "documents.pkl", "rb") as f:
            self.documents = pickle.load(f)

    def total_vectors(self) -> int:
        """
        Returns the total number of vectors stored.
        """

        return self.index.ntotal
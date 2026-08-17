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

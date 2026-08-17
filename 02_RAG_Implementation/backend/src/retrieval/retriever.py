import numpy as np
from sentence_transformers import SentenceTransformer

from src.vectorstore.store import FAISSVectorStore


# Load the SAME embedding model used during indexing.
model = SentenceTransformer("all-MiniLM-L6-v2")


class Retriever:
    """
    Retrieves the most relevant document chunks from FAISS.
    """

    def __init__(self, vector_store: FAISSVectorStore):
        """
        Args:
            vector_store: Loaded FAISS vector store.
        """
        self.vector_store = vector_store

    def retrieve(self, query: str, top_k: int = 3) -> list[dict]:
        """
        Retrieve the Top-K most relevant chunks for a user query.

        Args:
            query: User's question.
            top_k: Number of chunks to return.

        Returns:
            List of dictionaries containing text and metadata.
        """

        # Step 1: Convert the user query into a 384-d embedding.
        query_embedding = model.encode(
            query,
            convert_to_numpy=True
        )

        # Step 2: FAISS expects a 2D float32 array.
        query_embedding = np.array(
            [query_embedding],
            dtype=np.float32
        )

        # Step 3: Search the FAISS index.
        distances, indices = self.vector_store.index.search(
            query_embedding,
            top_k
        )

        # Step 4: Collect the matching chunks.
        results = []

        for idx in indices[0]:

            if idx != -1:
                results.append(
                    self.vector_store.documents[idx]
                )

        return results
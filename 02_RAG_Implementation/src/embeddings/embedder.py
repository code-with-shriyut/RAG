from sentence_transformers import SentenceTransformer


# Load the embedding model only once.
# all-MiniLM-L6-v2 produces 384-dimensional embeddings.
model = SentenceTransformer("all-MiniLM-L6-v2")


def embed_documents(chunks: list[dict]) -> list[dict]:
    """
    Convert text chunks into embedding vectors while preserving metadata.

    Args:
        chunks: List of chunk dictionaries containing text and metadata.

    Returns:
        A new list where each chunk contains:
        - text
        - embedding
        - metadata
    """

    embedded_chunks = []

    for chunk in chunks:

        # Generate a 384-dimensional embedding for the chunk text.
        embedding = model.encode(
            chunk["text"],
            convert_to_numpy=True
        )

        # Preserve text and metadata, then attach the embedding.
        embedded_chunk = {
            "text": chunk["text"],
            "embedding": embedding.tolist(),
            "metadata": chunk["metadata"].copy()
        }

        embedded_chunks.append(embedded_chunk)

    return embedded_chunks
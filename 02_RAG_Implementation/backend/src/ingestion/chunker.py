def chunk_documents(
    documents: list[dict],
    chunk_size: int = 1000,
    chunk_overlap: int = 200
) -> list[dict]:
    """
    Split cleaned documents into fixed-size character chunks
    while preserving and extending their metadata.

    Args:
        documents: List of cleaned page-wise documents.
        chunk_size: Maximum number of characters in each chunk.
        chunk_overlap: Number of characters shared between
                       consecutive chunks.

    Returns:
        A list of chunk dictionaries containing:
        - chunk text
        - source
        - page number
        - chunk ID
    """

    # Validate chunk configuration.
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than 0.")

    if chunk_overlap < 0:
        raise ValueError("chunk_overlap cannot be negative.")

    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be smaller than chunk_size.")

    chunks = []

    for document in documents:

        text = document["text"]
        metadata = document["metadata"]

        source = metadata["source"]
        page = metadata["page"]

        # Track which chunk we are creating for this page.
        chunk_number = 1

        # Start position of the current chunk.
        start = 0

        while start < len(text):

            # Calculate the end position of the current chunk.
            end = start + chunk_size

            chunk_text = text[start:end]

            # Create a descriptive ID using source, page and chunk number.
            chunk_id = (
                f"{source.rsplit('.', 1)[0]}"
                f"_p{page:02d}"
                f"_c{chunk_number:02d}"
            )

            # Preserve existing metadata and add chunk-specific metadata.
            chunk_metadata = metadata.copy()
            chunk_metadata["chunk_id"] = chunk_id

            # Create the chunk.
            chunk = {
                "text": chunk_text,
                "metadata": chunk_metadata
            }

            chunks.append(chunk)

            chunk_number += 1

            # Move forward while keeping the required overlap.
            start += chunk_size - chunk_overlap

    return chunks
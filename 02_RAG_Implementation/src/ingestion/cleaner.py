import re


def clean_text(text: str) -> str:
    """
    Clean extracted text by removing unnecessary whitespace
    and normalizing line breaks.

    Args:
        text: Raw text extracted from a document.

    Returns:
        Cleaned text.
    """

    # Remove carriage returns that may appear in extracted text.
    text = text.replace("\r", "")

    # Replace tabs with a normal space.
    text = text.replace("\t", " ")

    # Remove zero-width spaces while preserving bullets and line breaks.
    text = text.replace("\u200b", "")

    # Remove leading and trailing whitespace from each line.
    lines = [line.strip() for line in text.split("\n")]

    # Remove completely empty lines.
    lines = [line for line in lines if line]

    # Join the remaining lines with a single newline.
    text = "\n".join(lines)

    # Replace multiple consecutive spaces with a single space.
    text = re.sub(r" {2,}", " ", text)

    # Remove leading/trailing whitespace from the final text.
    return text.strip()


def clean_documents(documents: list[dict]) -> list[dict]:
    """
    Clean a list of page-wise documents while preserving metadata.

    Args:
        documents: List of dictionaries containing text and metadata.

    Returns:
        A new list containing cleaned text and the original metadata.
    """

    cleaned_documents = []

    for document in documents:

        cleaned_document = {
            "text": clean_text(document["text"]),
            "metadata": document["metadata"].copy()
        }

        cleaned_documents.append(cleaned_document)

    return cleaned_documents
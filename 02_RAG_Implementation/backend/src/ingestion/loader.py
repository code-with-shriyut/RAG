import fitz
from pathlib import Path


def load_pdf(pdf_path: str) -> list[dict]:
    """
    Load a PDF and extract page-wise text along with metadata.

    Args:
        pdf_path: Path to the PDF file.

    Returns:
        A list of dictionaries, where each dictionary represents
        one page and contains its text and metadata.
    """

    # Convert the provided path string into a Path object
    # for easier and safer file-system operations.
    pdf_path = Path(pdf_path)

    # Make sure the provided PDF actually exists before
    # attempting to open it.
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    # This loader is specifically designed for PDF files,
    # so reject other file types.
    if pdf_path.suffix.lower() != ".pdf":
        raise ValueError(f"Expected a PDF file, got: {pdf_path.suffix}")

    # This list will contain one dictionary for every
    # page extracted from the PDF.
    documents = []

    # Open the PDF using PyMuPDF.
    # The 'with' statement automatically closes the document
    # after processing is complete.
    with fitz.open(pdf_path) as pdf:

        # Iterate through every page in the PDF.
        # enumerate(..., start=1) gives us human-readable
        # page numbers starting from 1 instead of 0.
        for page_number, page in enumerate(pdf, start=1):

            # Extract the textual content from the current page.
            text = page.get_text()

            # Store the extracted text together with metadata
            # so that we can trace the text back to its source
            # during retrieval and citation.
            document = {
                "text": text,
                "metadata": {
                    "source": pdf_path.name,
                    "page": page_number
                }
            }

            # Add the current page's document to our collection.
            documents.append(document)

    # Return all extracted pages with their associated metadata.
    return documents
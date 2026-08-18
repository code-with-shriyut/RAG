# Chapter 03 — Backend Implementation

## Purpose of this Chapter

This chapter documents the complete backend implementation of Yomiko👩🏻🌸 the RAG Assistant. Every module is explained individually, including its responsibility, input, output, internal processing, and how it contributes to the Retrieval Augmented Generation pipeline.

---

# 1. Backend Architecture

The backend is organized into independent functional modules rather than one large application file.

```text
backend/
│
├── app.py
│
├── src/
│   ├── ingestion/
│   │   ├── loader.py
│   │   ├── cleaner.py
│   │   └── chunker.py
│   │
│   ├── embeddings/
│   │   └── embedder.py
│   │
│   ├── vectorstore/
│   │   └── store.py
│   │
│   ├── retrieval/
│   │   └── retriever.py
│   │
│   └── generation/
│       ├── prompt_builder.py
│       └── llm.py
│
└── tests/
```

Each module follows the **Single Responsibility Principle**, making the project modular and easy to maintain.

---

# 2. Execution Order

Whenever a new PDF is uploaded, the modules execute in the following sequence.

```text
PDF Upload
    │
    ▼
loader.py
    │
    ▼
cleaner.py
    │
    ▼
chunker.py
    │
    ▼
embedder.py
    │
    ▼
store.py
    │
    ▼
Session State
```

When a question is asked, a different execution path is followed.

```text
User Question
      │
      ▼
retriever.py
      │
      ▼
prompt_builder.py
      │
      ▼
llm.py
      │
      ▼
Final Answer
```

The indexing pipeline and the question-answering pipeline are intentionally separated.

---
# Module 1 — loader.py

## Responsibility

The loader module extracts page-wise text from a PDF while preserving document metadata.

This is the first stage of the RAG pipeline.

---

## Why do we need it?

Large Language Models cannot read PDF files directly.

Therefore, the document must first be converted into structured textual data.

---

## Input

```python
pdf_path: str
```

Example:

```python
load_pdf("RAG_Fundamentals.pdf")
```

---

## Output Structure

```python
[
    {
        "text": "...page text...",
        "metadata": {
            "source": "RAG_Fundamentals.pdf",
            "page": 1
        }
    }
]
```

Every page becomes an independent document object.

---

## Internal Workflow

1. Validate file existence
2. Validate `.pdf` extension
3. Open PDF using PyMuPDF
4. Iterate through every page
5. Extract text
6. Attach metadata
7. Return page-wise documents

---

## Metadata Design

| Field | Purpose |
|--------|----------|
| source | Original filename |
| page | Human-readable page number |

Metadata is preserved throughout the entire pipeline.

---

## Time Complexity

**O(P)**

Where **P** is the number of pages.

---

# Module 2 — cleaner.py

## Responsibility

Normalize noisy text extracted from PDFs before chunking.

---

## Problems Found in Raw PDFs

- Carriage returns (`\r`)
- Tabs (`\t`)
- Zero-width spaces
- Multiple blank lines
- Repeated spaces

---

## Cleaning Operations

| Operation | Reason |
|-----------|--------|
| Remove `\r` | Normalize line endings |
| Replace tabs | Consistent spacing |
| Remove zero-width spaces | Hidden Unicode cleanup |
| Strip whitespace | Cleaner formatting |
| Remove empty lines | Better chunk quality |
| Collapse spaces | Stable embeddings |

---

## Input

```python
{
    "text": raw_text,
    "metadata": {...}
}
```

---

## Output

```python
{
    "text": cleaned_text,
    "metadata": {...}
}
```

Notice that metadata is never modified.

---

## Why preserve line breaks?

Line breaks often represent paragraphs and bullet lists, which improve semantic understanding during retrieval.

---

## Time Complexity

**O(N)**

Where **N** is the number of characters.

---

# Module 3 — chunker.py

## Responsibility

Split cleaned documents into overlapping chunks suitable for embedding models.

---

## Configuration

| Parameter | Value |
|-----------|------:|
| chunk_size | 1000 |
| chunk_overlap | 200 |

---

## Why Chunking?

Embedding models have practical context limits.

Instead of embedding an entire page, we divide it into smaller semantic units.

---

## Overlap Strategy

Chunk 1

```
0 ───────────────────────── 1000
```

Chunk 2

```
800 ─────────────────────── 1800
```

Shared overlap = **200 characters**

This prevents sentences from being split across chunk boundaries.

---

## Chunk ID

Each chunk receives a unique identifier.

Example:

```text
RAG_Fundamentals_p08_c02
```

Meaning:

- Source document
- Page 8
- Chunk 2

This greatly simplifies debugging and citation.

---

## Output Structure

```python
{
    "text": "...",
    "metadata": {
        "source": "...",
        "page": 8,
        "chunk_id": "..."
    }
}
```

---

## Time Complexity

**O(N)**

Where **N** is the document length.

---

# Module Summary

| Module | Input | Output |
|---------|-------|--------|
| loader.py | PDF | Page Documents |
| cleaner.py | Raw Documents | Clean Documents |
| chunker.py | Clean Documents | Text Chunks |

These three modules collectively form the **Document Ingestion Layer** of the RAG architecture.

---


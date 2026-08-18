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

# Module 4 — embedder.py

## Responsibility

The embedding module converts every text chunk into a dense numerical vector that captures its semantic meaning.

This is the bridge between **human language** and **vector search**.

---

## Why Embeddings?

Computers cannot directly compare meanings between sentences.

Example:

| Sentence A | Sentence B |
|------------|------------|
| Customer defaulted on EMI | Borrower failed to repay the loan |

Although the wording is different, both describe the same concept.

Embeddings place semantically similar sentences close together in vector space.

---

## Embedding Model

**Model Used:** `all-MiniLM-L6-v2`

| Property | Value |
|----------|------:|
| Dimensions | 384 |
| Framework | Sentence Transformers |
| Output Type | NumPy Vector |
| Purpose | Semantic Retrieval |

The same model is used for both document chunks and user queries.

---

## Input

```python
{
    "text": "...chunk...",
    "metadata": {...}
}
```

---

## Output

```python
{
    "text": "...chunk...",
    "embedding": [0.18, -0.44, ...],
    "metadata": {...}
}
```

Each embedding contains **384 floating-point values**.

---

## Internal Workflow

1. Read chunk text
2. Pass text into SentenceTransformer
3. Generate 384-dimensional vector
4. Convert NumPy array into Python list
5. Preserve metadata
6. Return embedded chunk

---

## Why `convert_to_numpy=True`?

FAISS expects numerical vectors in NumPy format. Converting immediately avoids unnecessary type conversions later.

---

## Time Complexity

**O(C)**

Where **C** is the number of chunks.

---

# Module 5 — store.py

## Responsibility

Store document embeddings inside a FAISS vector index for efficient similarity search.

---

## What is FAISS?

FAISS (**Facebook AI Similarity Search**) is a vector database library optimized for nearest-neighbor search over high-dimensional embeddings.

Instead of searching text directly, FAISS searches vectors.

---

## Index Used

```python
faiss.IndexFlatL2()
```

This implementation uses **L2 (Euclidean Distance)** for similarity.

---

## Internal Objects

The `FAISSVectorStore` class maintains two independent objects.

| Object | Purpose |
|---------|----------|
| index | Stores embeddings |
| documents | Stores text + metadata |

This separation allows vectors to remain lightweight while preserving human-readable content.

---

## Input

```python
embedded_chunks
```

---

## Stored Structure

```python
self.documents = [
    {
        "text": "...",
        "metadata": {...}
    }
]
```

The FAISS index stores only numerical vectors.

---

## Why not store text inside FAISS?

FAISS is optimized for mathematical vector operations.

Text retrieval happens by mapping FAISS indices back to the `documents` list.

---

## Public Methods

| Method | Purpose |
|---------|----------|
| add_documents() | Insert vectors |
| total_vectors() | Return vector count |
| save() | Persist index |
| load() | Restore index |

---

## Time Complexity

Adding vectors:

**O(C)**

Searching:

**O(N)** for `IndexFlatL2`, where **N** is the number of stored vectors.

---

# Module 6 — retriever.py

## Responsibility

Retrieve the Top-K most relevant document chunks using semantic similarity.

This is the **core intelligence** of the RAG pipeline.

---

## Input

```python
query: str
```

Example:

```text
What is chunk overlap?
```

---

## Internal Workflow

1. Convert query into embedding
2. Convert embedding to float32
3. Search FAISS
4. Receive nearest indices
5. Map indices back to documents
6. Return retrieved chunks

---

## Why use the same embedding model?

Both document embeddings and query embeddings must exist in the **same semantic vector space**.

Different embedding models produce incompatible representations.

---

## Returned Structure

```python
[
    {
        "text": "...",
        "metadata": {
            "page": 8
        }
    }
]
```

---

## Top-K Retrieval

Current configuration:

```python
top_k = 3
```

Why 3?

- Sufficient context
- Lower latency
- Lower token usage
- Reduced irrelevant information

---

## Engineering Decision

The retriever never communicates with the LLM.

Its only responsibility is finding evidence.

This separation improves modularity and testing.

---

## Time Complexity

FAISS Search:

**O(N)** using IndexFlatL2.

---

# Module 7 — prompt_builder.py

## Responsibility

Construct a grounded prompt by combining retrieved chunks and the user's question.

---

## Why Prompt Building?

Instead of sending the entire PDF, only the retrieved evidence is forwarded to the LLM.

This dramatically reduces hallucinations.

---

## Input

- User Question
- Retrieved Chunks

---

## Output

A single formatted string.

Example:

```text
Context:

[Page 8]
Chunk...

Question:
What is chunk overlap?

Answer:
```

---

## Prompt Design Principles

- Use only retrieved context
- Preserve page numbers
- Separate instructions from context
- Keep question explicit

---

## Why include page numbers?

Although the LLM mainly uses text, page references improve explainability and allow the UI to display citations afterward.

---

# Module 8 — llm.py

## Responsibility

Generate the final answer using Groq's hosted Llama model.

This module contains **no retrieval logic**.

---

## Input

```python
prompt: str
```

---

## Output

```python
answer: str
```

---

## API Workflow

1. Receive prompt
2. Call Groq Chat Completion API
3. Generate response
4. Return answer text

---

## Why isolate the LLM?

Replacing the LLM becomes extremely easy.

Possible alternatives:

- GPT
- Gemini
- Claude
- Mistral

Only this module would change.

---

# Module 9 — app.py

## Responsibility

`app.py` is the **orchestrator** of the entire application.

It coordinates all modules but does not implement AI logic itself.

---

## Primary Responsibilities

| Feature | Description |
|----------|-------------|
| PDF Upload | Accept user documents |
| Indexing | Execute ingestion pipeline |
| Session State | Cache FAISS index |
| Question Input | Accept user queries |
| Retrieval | Invoke retriever |
| Generation | Display final answer |

---

## Session State Variables

| Variable | Purpose |
|----------|----------|
| vector_store | Cached FAISS index |
| filename | Detect new uploads |
| is_indexed | Track indexing status |

---

## Why Session State?

Without caching:

Every question would regenerate embeddings.

With Session State:

- Upload once
- Index once
- Ask unlimited questions

This significantly improves performance.

---

## Two Independent Pipelines

### Indexing Pipeline

```text
Upload PDF
    ↓
Loader
    ↓
Cleaner
    ↓
Chunker
    ↓
Embedder
    ↓
FAISS
```

### Question Pipeline

```text
Question
    ↓
Retriever
    ↓
Prompt Builder
    ↓
Groq
    ↓
Answer
```

Keeping these pipelines independent is one of the most important architectural decisions in this project.

---

# Backend Module Summary

| Module | Responsibility |
|---------|----------------|
| loader.py | Extract PDF pages |
| cleaner.py | Normalize text |
| chunker.py | Create overlapping chunks |
| embedder.py | Generate embeddings |
| store.py | Store vectors in FAISS |
| retriever.py | Semantic Top-K retrieval |
| prompt_builder.py | Grounded prompt creation |
| llm.py | LLM answer generation |
| app.py | Application orchestration |

Together, these modules implement the complete Retrieval Augmented Generation backend while maintaining clear separation of concerns and high modularity.
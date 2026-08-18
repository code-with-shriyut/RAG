# Chapter 04 — Retrieval Engine

## Purpose of this Chapter

This chapter explains the retrieval engine that powers Yomiko👩🏻🌸 the RAG Assistant. It covers semantic embeddings, vector similarity search, FAISS indexing, Top-K retrieval, metadata mapping, and the engineering decisions behind the retrieval architecture.

---

# 1. Why Retrieval is the Brain of RAG

A common misconception is that the Large Language Model is the most important part of a RAG system.

In reality, the retriever determines the quality of the final answer.

If retrieval returns irrelevant chunks, even the most powerful LLM will generate a poor response because it only receives incorrect context.

Therefore:

> **Better Retrieval = Better Generation**

---

# 2. Retrieval Architecture

The retrieval engine operates independently from the document ingestion pipeline.

```text
User Question
      │
      ▼
Query Embedding
      │
      ▼
FAISS Vector Search
      │
      ▼
Nearest Vector IDs
      │
      ▼
Metadata Mapping
      │
      ▼
Top-K Chunks
      │
      ▼
Prompt Builder
```

Notice that the original PDF is never searched directly.

Only vectors are searched.

---

# 3. What is an Embedding?

An embedding is a dense numerical representation of text that preserves semantic meaning.

Example:

Sentence:

Customer defaulted on EMI.

Vector:

[0.18, -0.44, 0.92, ...]

Every sentence becomes a point inside a 384-dimensional vector space.

---

# 4. Why Semantic Search Works

Traditional search compares words.

Semantic search compares meaning.

Example:

| User Query | Document |
|------------|----------|
| borrower failed to repay | customer defaulted on loan |

Although the wording is different, the semantic meaning is nearly identical.

Embeddings place these sentences close together inside vector space.

This allows FAISS to retrieve them successfully.

---

# 5. Query Embedding

When a user asks a question, the application does **not** compare raw text.

Instead, the same SentenceTransformer model generates a query embedding.

Example:

```python
query_embedding = model.encode(
    query,
    convert_to_numpy=True
)
```

Using the same embedding model ensures that document vectors and query vectors occupy the same semantic space.

---

# 6. FAISS Vector Database

FAISS stands for **Facebook AI Similarity Search**.

Its purpose is to efficiently search millions of high-dimensional vectors.

In this project, the following index is used:

```python
faiss.IndexFlatL2()
```

This index performs exact nearest-neighbor search using Euclidean distance.

---

# 7. L2 (Euclidean) Distance

The similarity between two vectors is measured using Euclidean distance.

Formula:

d = √Σ(xᵢ − yᵢ)²

Interpretation:

- Smaller distance → More similar
- Larger distance → Less similar

The retriever always selects the vectors with the smallest distance.

---

# 8. Top-K Retrieval

The retriever requests:

```python
top_k = 3
```

Meaning only the three most relevant chunks are returned.

## Why not retrieve everything?

| Top-K = 1 | May miss context |
|------------|-----------------|
| Top-K = 3 | Balanced |
| Top-K = 20 | Too much irrelevant information |

Three chunks provide enough surrounding context while minimizing token usage.

---

# 9. Metadata Mapping

FAISS returns vector indices, not text.

Example:

```text
Indices = [17, 3, 9]
```

These indices are mapped back into the document collection.

Result:

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

This enables page-wise citations inside the user interface.

---

# 10. Similarity Search Lifecycle

The complete retrieval lifecycle is:

1. User enters a question.
2. Question becomes an embedding.
3. FAISS searches all stored vectors.
4. Nearest vector IDs are returned.
5. IDs are mapped to original chunks.
6. Top-K chunks are sent to the Prompt Builder.

The retriever never communicates directly with the LLM.

Its only responsibility is finding evidence.

---

# 11. Why Retrieval and Generation are Separated

The project intentionally separates these responsibilities.

| Retrieval | Generation |
|-----------|------------|
| Finds evidence | Explains evidence |
| Uses FAISS | Uses Groq |
| Mathematical search | Natural language generation |
| Deterministic | Generative |

This architecture improves modularity and makes each component independently replaceable.

---

# 12. Engineering Decisions

## Why FAISS?

- Fast vector search
- Lightweight
- Production proven
- Easily scalable

## Why all-MiniLM-L6-v2?

- 384-dimensional embeddings
- Fast inference
- Excellent semantic performance
- Open-source

## Why Top-3?

- Lower latency
- Reduced hallucination
- Lower API token consumption
- Sufficient contextual coverage

---

# Chapter Summary

The Retrieval Engine converts user questions into semantic vectors and performs nearest-neighbor search over document embeddings stored inside FAISS. Rather than searching text directly, the system retrieves meaningfully similar chunks using L2 distance, maps them back to their original metadata, and provides grounded evidence for the language model. This separation between retrieval and generation is the core architectural principle that makes Retrieval Augmented Generation reliable and scalable.
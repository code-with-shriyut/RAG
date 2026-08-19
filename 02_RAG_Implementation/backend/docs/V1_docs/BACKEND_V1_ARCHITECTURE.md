# Yomiko Backend V1.0 Architecture

Version: 1.0
Status: Stable (Frozen)
Date: 19 August 2026

---

## Overview

Yomiko V1 is a Retrieval-Augmented Generation (RAG) backend that allows users to upload PDF documents and ask natural language questions. The system retrieves the most relevant document chunks using semantic search and generates contextual answers using Groq LLM.

The objective of V1 was to build a modular, production-style RAG backend with REST APIs and a multi-document workspace.

---

# Backend Architecture

User
   │
   ▼
FastAPI API
   │
   ▼
PDF Ingestion
   │
   ▼
Recursive Text Splitter
   │
   ▼
MiniLM Embedding Model
   │
   ▼
FAISS Vector Store
   │
   ▼
Semantic Retriever (Top-K)
   │
   ▼
Prompt Builder
   │
   ▼
Groq LLM
   │
   ▼
Response + Page Citation

---

# Folder Structure

backend/

├── src/
│   ├── api.py
│   ├── ingestion/
│   ├── embeddings/
│   ├── vectorstore/
│   ├── llm/
│   └── prompt_builder/
│
├── data/
│   ├── uploads/
│   └── vectorstores/
│
└── docs/

---

# Core Features

## AI Document Chat

- Natural language question answering
- Context-aware responses
- Page citations included

## PDF Upload & Indexing

Pipeline:

1. Upload PDF
2. Extract text
3. Clean content
4. Split into chunks
5. Generate embeddings
6. Store vectors in FAISS

## Semantic Search

Embedding Model:
- all-MiniLM-L6-v2

Vector Database:
- FAISS

Similarity:
- L2 Distance

Retrieval:
- Top-K semantic chunks

## Multi-Document Workspace

Each document maintains an independent FAISS index.

Example:

data/vectorstores/

├── 1/
│   ├── vector.index
│   └── documents.pkl
├── 2/
│   ├── vector.index
│   └── documents.pkl

Users can switch between indexed documents without rebuilding embeddings.

---

# REST API

| Endpoint | Method | Purpose |
|----------|--------|----------|
| `/` | GET | Health check |
| `/upload` | POST | Upload & index PDF |
| `/ask` | POST | Ask questions |
| `/documents` | GET | List documents |
| `/documents/{id}/open` | POST | Select active document |

---

# Technologies

| Layer | Technology |
|--------|------------|
| API | FastAPI |
| Embeddings | Sentence Transformers |
| Vector DB | FAISS |
| LLM | Groq |
| Language | Python |

---

# Current Limitations

- Supports only PDF files.
- Cannot process scanned PDFs.
- One active document at a time.
- No OCR pipeline.
- No reranking after retrieval.

This document represents the frozen architecture of Yomiko Backend V1.0 and should not be modified further.
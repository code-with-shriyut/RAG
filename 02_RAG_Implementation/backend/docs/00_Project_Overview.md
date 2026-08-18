# RAG Architecture Handbook v1.0

**Project Name:** Yomiko👩🏻🌸 RAG Assistant

**Version:** 1.0

**Author:** Shriyut Janardan

**Tech Stack:** Python, Streamlit, FAISS, Sentence Transformers, Groq API

---

# 1. Project Overview

Yomiko👩🏻🌸 a RAG Assistant is an end-to-end Retrieval Augmented Generation (RAG) application that enables users to upload PDF documents and ask natural language questions based on their content.

Unlike a traditional Large Language Model (LLM), which relies only on its pre-trained knowledge, this application retrieves relevant information directly from the uploaded document before generating an answer. This significantly reduces hallucinations and produces grounded, explainable responses with page citations.

---

# 2. Problem Statement

Large Language Models cannot directly understand newly uploaded documents. If a user uploads a company policy, research paper, or technical manual, the model may generate inaccurate or fabricated information because that document was never part of its training data.

The goal of this project is to solve that limitation using Retrieval Augmented Generation.

The system first converts the document into semantic vector embeddings, stores them inside a FAISS vector database, retrieves the most relevant chunks for every question, and finally provides an answer using only the retrieved context.

---

# 3. Objectives

- Upload PDF documents interactively
- Extract page-wise textual content
- Clean and normalize extracted text
- Split documents into overlapping chunks
- Generate semantic embeddings
- Store embeddings inside FAISS
- Retrieve Top-K relevant chunks
- Generate grounded answers using Groq Llama 3.1
- Display page citations for transparency

---

# 4. Key Features

| Feature | Description |
|----------|-------------|
| PDF Upload | Supports user-uploaded PDF files |
| Intelligent Chunking | 1000-character chunks with overlap |
| Semantic Search | Embedding-based retrieval |
| Vector Database | FAISS IndexFlatL2 |
| Grounded Generation | Uses retrieved context only |
| Explainability | Page-wise citations |
| Session Caching | Avoids repeated indexing |

---

# 5. Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend Prototype | Streamlit |
| Future Frontend | React + Tailwind CSS |
| Backend | Python |
| PDF Parsing | PyMuPDF |
| Embeddings | all-MiniLM-L6-v2 |
| Vector Database | FAISS |
| LLM | Groq (Llama 3.1) |
| State Management | Streamlit Session State |

---

# 6. Expected Workflow

1. User uploads a PDF.
2. The document is parsed into page-wise text.
3. Text is cleaned and normalized.
4. Pages are divided into overlapping chunks.
5. Each chunk is converted into a 384-dimensional embedding.
6. Embeddings are stored inside FAISS.
7. User asks a question.
8. The question is embedded using the same model.
9. FAISS retrieves the Top-3 most relevant chunks.
10. A grounded prompt is created.
11. Groq generates the final answer with citations.

---

# 7. Repository Structure

```text
02_RAG_Implementation/
│
├── backend/
│   ├── app.py
│   └── src/
│
├── frontend/
│
└── docs/
```

This handbook explains every architectural decision, implementation module, retrieval mechanism, and execution workflow used throughout the project.
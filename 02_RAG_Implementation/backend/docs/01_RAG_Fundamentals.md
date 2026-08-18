# Chapter 01 — RAG Fundamentals

## Purpose of this Chapter

This chapter introduces the fundamental concepts behind Retrieval Augmented Generation (RAG). It explains why traditional Large Language Models struggle with private documents, how semantic retrieval solves that problem, and the complete theory behind the architecture implemented in this project.

---

# 1. What is a Large Language Model (LLM)?

A Large Language Model (LLM) is an AI model trained on massive amounts of text to understand and generate human language.

Examples include:

- GPT
- Llama
- Gemini
- Claude

These models generate answers by predicting the next most probable token based on patterns learned during training.

> **Important:** An LLM does not automatically know the contents of a PDF uploaded by the user.

---

# 2. The Limitation of Traditional LLMs

Consider the following scenario.

A user uploads a research paper and asks:

> *What is chunk overlap?*

The uploaded PDF was never part of the model's training data.

The LLM therefore has two choices:

- Guess from prior knowledge
- Hallucinate an answer

This creates unreliable responses.

---

# 3. What is Hallucination?

Hallucination is the phenomenon where an LLM generates information that sounds convincing but is not supported by factual evidence.

Example:

| User Question | Traditional LLM |
|--------------|----------------|
| What is the company refund policy? | Invents a policy |

Hallucinations are especially dangerous for:

- Banking
- Healthcare
- Legal documents
- Enterprise knowledge bases

---

# 4. The Solution — Retrieval Augmented Generation

Retrieval Augmented Generation (RAG) improves an LLM by providing relevant external knowledge before generation.

Instead of relying only on memory, the model receives evidence from the uploaded document.

RAG consists of two independent stages:

1. Retrieval
2. Generation

The retriever finds relevant document chunks.

The generator creates the final answer using only those retrieved chunks.

---

# 5. High-Level RAG Pipeline

PDF
↓
Text Extraction
↓
Cleaning
↓
Chunking
↓
Embeddings
↓
FAISS Vector Store
↓
User Question
↓
Semantic Retrieval
↓
Prompt Construction
↓
LLM
↓
Answer + Citation

---

# 6. Why RAG is Better Than Fine-Tuning

| Fine-Tuning | RAG |
|-------------|-----|
| Requires retraining | No retraining |
| Expensive | Cost-effective |
| Static knowledge | Dynamic knowledge |
| Difficult to update | Simply upload new documents |
| Larger infrastructure | Lightweight architecture |

This project intentionally uses RAG because documents can change without modifying the model.

---

# 7. Core Components of RAG

A RAG system contains five essential components.

### Document Ingestion

Converts PDFs into structured text.

### Chunking

Splits long documents into manageable overlapping segments.

### Embeddings

Converts text into numerical semantic vectors.

### Vector Database

Stores embeddings for efficient similarity search.

### Generator

Produces the final grounded response.

---

# 8. Why Semantic Search Instead of Keyword Search?

Keyword search compares words.

Semantic search compares meaning.

Example:

Query:

> borrower failed to repay

Document:

> customer defaulted on the loan

Although no exact keywords match, embeddings recognize that both sentences describe the same concept.

This is the primary advantage of vector search.

---

# 9. What is an Embedding?

An embedding is a dense numerical representation of text.

Example:

Text:

Customer defaulted on EMI.

Embedding:

[0.18, -0.44, 0.92, ...]

In this project, every embedding contains **384 dimensions** using the **all-MiniLM-L6-v2** model.

---

# 10. Why Metadata Matters

Every extracted page stores metadata.

Example:

{
  "text": "...",
  "metadata": {
      "source": "RAG.pdf",
      "page": 8
  }
}

Metadata enables explainability by allowing the application to display page citations alongside generated answers.

---

# Chapter Summary

This chapter established the theoretical foundation of Retrieval Augmented Generation.

Key takeaways:

- LLMs cannot inherently understand uploaded PDFs.
- Hallucinations occur when models answer without evidence.
- RAG retrieves relevant context before generation.
- Semantic embeddings enable meaning-based retrieval.
- Metadata provides transparent page citations.
- RAG offers a scalable alternative to fine-tuning for document question answering.
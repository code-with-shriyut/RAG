# Yomiko Backend V2.0 Roadmap

Version: 2.0
Status: Planning
Date: 19 August 2026

---

# Vision

Yomiko V2 focuses on improving the document ingestion and retrieval pipeline while preserving the modular architecture established in Version 1.

The goal is to transform Yomiko into a more practical RAG system capable of handling multiple document formats, multiple knowledge sources, and scanned documents.

---

# Phase 1 Objectives

## Feature 1 — Multi-Format Document Support

Description:
Allow the backend to ingest multiple document formats instead of only PDFs.

Supported formats:

- PDF
- DOCX
- TXT
- Markdown (.md)

Outcome:

- Unified document loader
- Format-specific parsers
- Common text extraction interface

---

## Feature 2 — Multi-Document Upload & Querying

Description:
Users should be able to upload multiple documents and ask questions across the entire document collection.

Objectives:

- Upload one or many documents
- Index each document independently
- Search across all indexed documents
- Return source document with every answer

Expected Architecture:

Documents
      │
      ▼
Individual Vector Indexes
      │
      ▼
Combined Retrieval
      │
      ▼
Groq LLM

---

## Feature 3 — OCR Support

Description:
Enable text extraction from scanned PDFs that contain images instead of selectable text.

OCR Workflow:

PDF
 │
 ▼
Text Available?
 │
 ├── Yes → Normal Extraction
 │
 └── No
      │
      ▼
 OCR Engine
      │
      ▼
 Extracted Text
      │
      ▼
 Chunking & Embedding

Expected Result:

- Scanned notes become searchable.
- Image-based textbooks become usable.
- Transparent fallback without changing user workflow.

---

# Development Milestones

- Freeze Backend V1
- Implement Multi-Format Loader
- Implement Multi-Document Retrieval
- Implement OCR Fallback
- UI/UX Refinement
- Begin Reranking (Phase 2)

---

# Future Features (Phase 2)

The following features are intentionally postponed:

- Cross-Encoder Reranking
- Metadata Registry
- Configurable Chunking
- Retrieval Evaluation
- Hybrid Search

These will be developed after Phase 1 is completed.
# RAG Implementation

A basic Retrieval-Augmented Generation (RAG) application built to gain hands-on understanding of the complete RAG pipeline.

## Objective

The objective of this project is to understand and implement the major components of a RAG system:

- Document ingestion
- Text extraction
- Text cleaning
- Chunking
- Embeddings
- Vector storage
- Similarity search
- Top-K retrieval
- Context augmentation
- Prompt construction
- LLM generation
- Source attribution

## Architecture

The application follows two major pipelines.

### 1. Ingestion / Indexing Pipeline

Documents  
↓  
Document Loader / Parser  
↓  
Text Cleaning  
↓  
Chunking  
↓  
Embedding Model  
↓  
Vector Store

### 2. Retrieval & Generation Pipeline

User Query  
↓  
Query Embedding  
↓  
Similarity Search  
↓  
Top-K Retrieval  
↓  
Context Construction  
↓  
LLM  
↓  
Answer + Sources

## Project Structure

```text
src/
├── ingestion/
├── embeddings/
├── vectorstore/
├── retrieval/
├── generation/
└── app.py

data/
├── documents/
└── processed/

notebooks/
tests/
docs/

## Project Status

🚧 Under Development

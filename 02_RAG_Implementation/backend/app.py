import streamlit as st
import tempfile

# ---------- Ingestion ----------
from src.ingestion.loader import load_pdf
from src.ingestion.cleaner import clean_documents
from src.ingestion.chunker import chunk_documents

# ---------- Embeddings ----------
from src.embeddings.embedder import embed_documents

# ---------- Vector Store ----------
from src.vectorstore.store import FAISSVectorStore

# ---------- Retrieval + Generation ----------
from src.retrieval.retriever import Retriever
from src.generation.prompt_builder import build_prompt
from src.generation.llm import generate_answer


# ==========================================================
# Page Configuration
# ==========================================================

st.set_page_config(
    page_title="Kawaii RAG Assistant",
    page_icon="🌸",
    layout="wide"
)

st.title("🌸 Kawaii RAG Assistant")
st.caption("AI-powered document question answering using RAG")
st.divider()


# ==========================================================
# Session State
# ==========================================================

if "vector_store" not in st.session_state:
    st.session_state.vector_store = None

if "is_indexed" not in st.session_state:
    st.session_state.is_indexed = False

if "filename" not in st.session_state:
    st.session_state.filename = None

if "pages" not in st.session_state:
    st.session_state.pages = 0

if "chunks" not in st.session_state:
    st.session_state.chunks = 0

if "vectors" not in st.session_state:
    st.session_state.vectors = 0


# ==========================================================
# PDF Upload
# ==========================================================

uploaded_file = st.file_uploader(
    "📄 Upload a PDF document",
    type=["pdf"]
)


# ==========================================================
# Index PDF (ONLY ONCE)
# ==========================================================

if uploaded_file is not None:

    if st.session_state.filename != uploaded_file.name:

        with st.spinner("Indexing document..."):

            # Save uploaded file temporarily
            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".pdf"
            ) as tmp:

                tmp.write(uploaded_file.getbuffer())
                pdf_path = tmp.name

            # ---------------- RAG Pipeline ----------------

            documents = load_pdf(pdf_path)

            cleaned_docs = clean_documents(documents)

            chunks = chunk_documents(cleaned_docs)

            embedded_chunks = embed_documents(chunks)

            vector_store = FAISSVectorStore()
            vector_store.add_documents(embedded_chunks)

            # Save everything in session state
            st.session_state.vector_store = vector_store
            st.session_state.filename = uploaded_file.name
            st.session_state.is_indexed = True

            st.session_state.pages = len(documents)
            st.session_state.chunks = len(chunks)
            st.session_state.vectors = vector_store.total_vectors()


# ==========================================================
# Chat Interface
# ==========================================================

if st.session_state.is_indexed:

    st.success(
        f"'{st.session_state.filename}' indexed successfully!"
    )

    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric("Pages", st.session_state.pages)

    with col2:
        st.metric("Chunks", st.session_state.chunks)

    with col3:
        st.metric("Vectors", st.session_state.vectors)

    st.divider()

    question = st.text_input(
        "💬 Ask a question about your document",
        placeholder="Example: What is chunk overlap?"
    )

    ask = st.button(
        "Generate Answer",
        use_container_width=True
    )

    if ask:

        if question.strip() == "":
            st.warning("Please enter a question.")
        else:

            with st.spinner("Thinking..."):

                # Retrieve Top-K chunks
                retriever = Retriever(st.session_state.vector_store)

                retrieved_chunks = retriever.retrieve(
                    query=question,
                    top_k=3
                )

                # Build prompt
                prompt = build_prompt(
                    question,
                    retrieved_chunks
                )

                # Generate answer
                answer = generate_answer(prompt)

            st.markdown("## 🤖 Answer")
            st.write(answer)

            st.markdown("### 📚 Source Pages")

            pages = []

            for chunk in retrieved_chunks:
                page = chunk["metadata"]["page"]

                if page not in pages:
                    pages.append(page)

            st.write(", ".join([f"Page {p}" for p in pages]))
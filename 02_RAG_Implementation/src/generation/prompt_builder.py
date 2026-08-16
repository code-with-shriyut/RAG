def build_prompt(query: str, retrieved_chunks: list[dict]) -> str:
    """
    Build a single prompt for the LLM using the retrieved chunks.

    Args:
        query: User's question.
        retrieved_chunks: Output from retriever.py

    Returns:
        A formatted prompt string.
    """

    context = ""

    # Merge all retrieved chunks into one context block
    for chunk in retrieved_chunks:

        page = chunk["metadata"]["page"]
        text = chunk["text"]

        context += f"[Page {page}]\n{text}\n\n"

    # Final prompt sent to the LLM
    prompt = f"""You are a helpful AI assistant.

Answer the user's question ONLY using the provided context.
If the answer is not present in the context, reply:
"I couldn't find the answer in the uploaded document."

Context:
{context}

Question:
{query}

Answer:
"""

    return prompt
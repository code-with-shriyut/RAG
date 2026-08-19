const BASE_URL = "http://127.0.0.1:8000";

export type ChatResponse = {
  answer: string;
  sources: string[];
};

export const askQuestion = async (
  question: string
): Promise<ChatResponse> => {
  const response = await fetch(`${BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to get response.");
  }

  return response.json();
};
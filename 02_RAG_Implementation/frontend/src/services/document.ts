const BASE_URL = "http://127.0.0.1:8000";

import type { DocumentItem } from "../types/document";

export const getDocuments = async (): Promise<DocumentItem[]> => {
  const response = await fetch(`${BASE_URL}/documents`);

  if (!response.ok) {
    throw new Error("Failed to fetch documents.");
  }

  return response.json();
};

export const openDocument = async (
  documentId: number
): Promise<void> => {
  const response = await fetch(
    `${BASE_URL}/documents/${documentId}/open`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to open document.");
  }
};
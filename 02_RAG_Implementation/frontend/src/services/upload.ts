export type UploadResponse = {
  filename: string;
  pages: number;
  chunks: number;
  message: string;
};

const BASE_URL = "http://127.0.0.1:8000";

export const uploadPDF = async (
  file: File
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload document.");
  }

  return response.json();
};
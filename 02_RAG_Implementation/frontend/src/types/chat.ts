export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  sources?: string[];
}
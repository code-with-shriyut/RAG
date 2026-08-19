import { Paperclip, Sparkles, SendHorizontal } from "lucide-react";
import { useState } from "react";

import { askQuestion } from "../../services/chat";
import type { Message } from "../../types/chat";

type ChatInputProps = {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatInput = ({
  setMessages,
  setIsThinking,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSend = async () => {
    if (!message.trim()) return;

    const question = message;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: question,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsThinking(true);

    try {
      const result = await askQuestion(question);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: result.answer,
        time: getCurrentTime(),
        sources: result.sources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Sorry! I couldn't connect to the RAG server.",
        time: getCurrentTime(),
        sources: [],
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="rounded-[22px] border border-pink-200 bg-white/95 p-3 shadow-sm">
      <textarea
        rows={1}
        placeholder="Ask Yomiko anything about your PDF..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        className="min-h-[38px] max-h-24 w-full resize-none bg-transparent text-[15px] leading-6 text-slate-700 outline-none placeholder:text-slate-400"
      />

      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-white text-pink-500 hover:bg-pink-50">
            <Paperclip size={18} />
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-white text-pink-500 hover:bg-pink-50">
            <Sparkles size={18} />
          </button>
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-5 text-sm font-medium text-white shadow-md disabled:opacity-50"
        >
          <SendHorizontal size={16} />
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
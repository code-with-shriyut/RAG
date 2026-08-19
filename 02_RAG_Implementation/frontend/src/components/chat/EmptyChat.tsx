import { Sparkles } from "lucide-react";

const EmptyChat = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-sky-100 shadow-md">
        ☁️
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-700">
        Ask Yomiko Anything
      </h2>

      <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
        Upload a PDF and ask questions about your document.
        Yomiko will retrieve the most relevant pages and answer with citations.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
        <Sparkles size={16} className="text-pink-500" />
        <span className="text-sm font-medium text-slate-600">
          AI-powered RAG Assistant
        </span>
      </div>
    </div>
  );
};

export default EmptyChat;
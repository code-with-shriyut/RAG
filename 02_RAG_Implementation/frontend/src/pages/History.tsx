import {
  Clock3,
  MessageSquareText,
  ArrowRight,
  Search,
} from "lucide-react";

import AppLayout from "../components/layout/AppLayout";

const conversations = [
  {
    id: 1,
    title: "What is Chunk Overlap in RAG?",
    preview:
      "Chunk overlap preserves context between consecutive text chunks during retrieval.",
    time: "Today • 10:24 AM",
  },
  {
    id: 2,
    title: "Explain FAISS Vector Search",
    preview:
      "FAISS performs nearest-neighbor search over embedding vectors for semantic retrieval.",
    time: "Yesterday • 8:42 PM",
  },
  {
    id: 3,
    title: "How Embeddings Work",
    preview:
      "Embeddings convert text into 384-dimensional vectors representing semantic meaning.",
    time: "16 Aug 2026",
  },
];

const History = () => {
  return (
    <AppLayout
      title="Chat History"
      subtitle="Revisit your previous RAG conversations"
    >
      <div className="flex h-full flex-col gap-5">
        {/* Search */}
        <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input
            placeholder="Search conversations..."
            className="w-full bg-transparent text-slate-600 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Conversation List */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">
                    <MessageSquareText
                      className="text-pink-500"
                      size={22}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-700">
                      {chat.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {chat.preview}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <Clock3 size={13} />
                      {chat.time}
                    </div>
                  </div>
                </div>

                <button className="rounded-xl bg-sky-50 p-2 text-sky-600 transition hover:bg-sky-100">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default History;
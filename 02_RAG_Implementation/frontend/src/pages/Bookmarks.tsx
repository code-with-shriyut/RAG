import {
  BookmarkCheck,
  FileText,
  Calendar,
  Trash2,
} from "lucide-react";

import AppLayout from "../components/layout/AppLayout";

const savedAnswers = [
  {
    id: 1,
    question: "What is Chunk Overlap?",
    answer:
      "Chunk overlap preserves context by sharing 200 characters between consecutive chunks.",
    pages: ["Page 8", "Page 9"],
    date: "18 Aug 2026",
  },
  {
    id: 2,
    question: "Why do we use FAISS?",
    answer:
      "FAISS enables efficient nearest-neighbor search over embedding vectors for semantic retrieval.",
    pages: ["Page 12"],
    date: "17 Aug 2026",
  },
  {
    id: 3,
    question: "What is an Embedding Model?",
    answer:
      "An embedding model converts text into dense numerical vectors representing semantic meaning.",
    pages: ["Page 5", "Page 6"],
    date: "15 Aug 2026",
  },
];

const Bookmarks = () => {
  return (
    <AppLayout
      title="Bookmarks"
      subtitle="Your saved AI answers and citations"
    >
      <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1">
        {savedAnswers.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">
                  <BookmarkCheck
                    className="text-pink-500"
                    size={22}
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-700">
                    {item.question}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.answer}
                  </p>

                  {/* Citations */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.pages.map((page) => (
                      <span
                        key={page}
                        className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600"
                      >
                        <FileText size={11} className="mr-1 inline" />
                        {page}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                    <Calendar size={12} />
                    {item.date}
                  </div>
                </div>
              </div>

              <button className="rounded-xl bg-rose-50 p-2 text-rose-500 transition hover:bg-rose-100">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Bookmarks;
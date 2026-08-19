import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, BookOpen } from "lucide-react";

import {
  getDocuments,
  openDocument,
} from "../services/document";import type { DocumentItem } from "../types/document";

const Documents = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await getDocuments();
        setDocuments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  return (
    <div className="h-full rounded-[30px] bg-white/60 p-6 backdrop-blur-sm">
      <div>
        <h1 className="text-3xl font-bold text-slate-700">
          My Documents
        </h1>

        <p className="mt-1 text-slate-500">
          {documents.length} uploaded document(s)
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-slate-500">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-slate-500">
            No documents uploaded yet.
          </p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-pink-100 p-3">
                  <FileText className="text-pink-500" size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-700">
                    {doc.filename}
                  </h3>

                  <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} />
                      {doc.pages} Pages
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {doc.uploaded_at}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={async () => {
                    try {
                    await openDocument(doc.id);

                    navigate("/", {
                        state: {
                        activeDocument: doc,
                        },
                    });
                    } catch (err) {
                    alert("Failed to open document.");
                    }
                }}
                className="rounded-xl bg-sky-100 px-4 py-2 text-sm font-medium text-sky-600 transition hover:bg-sky-200"
                >
                Open
             </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Documents;
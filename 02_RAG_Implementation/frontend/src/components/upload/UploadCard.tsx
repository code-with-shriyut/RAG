import { UploadCloud, FileUp, FileText } from "lucide-react";

import { uploadPDF } from "../../services/upload";
import type { UploadResult } from "../../types/upload";
import type { DocumentItem } from "../../types/document";

type UploadCardProps = {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;

  isIndexing: boolean;
  setIsIndexing: React.Dispatch<React.SetStateAction<boolean>>;

  setIsIndexed: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadResult: React.Dispatch<
    React.SetStateAction<UploadResult | null>
  >;

  // Current document opened from Documents page
  activeDocument?: DocumentItem;
};

const UploadCard = ({
  selectedFile,
  setSelectedFile,
  isIndexing,
  setIsIndexing,
  setIsIndexed,
  setUploadResult,
  activeDocument,
}: UploadCardProps) => {
  const handleChooseFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setIsIndexed(false);
    setUploadResult(null);
  };

  const handleIndex = async () => {
    if (!selectedFile) return;

    try {
      setIsIndexing(true);
      setIsIndexed(false);

      const result = await uploadPDF(selectedFile);

      setUploadResult(result);
      setIsIndexed(true);
    } catch (error) {
      console.error(error);
      alert("Failed to index document.");
    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <section className="w-full rounded-[28px] border-[1.5px] border-dashed border-sky-300 bg-white/70 p-7 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-pink-100">
            <UploadCloud size={38} className="text-sky-500" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-700">
              Upload your PDF
            </h2>

            <p className="mt-1 text-slate-500">
              Choose a PDF to build your RAG knowledge base
            </p>

            {/* Current document */}
            {selectedFile ? (
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-sky-600">
                <FileText size={16} />
                {selectedFile.name}
              </div>
            ) : activeDocument ? (
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600">
                <FileText size={16} />
                {activeDocument.filename}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                Maximum file size: 50 MB
              </p>
            )}
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex gap-3">
          <label className="cursor-pointer rounded-2xl bg-sky-500 px-5 py-3 text-white shadow-md transition hover:bg-sky-600">
            <div className="flex items-center gap-2">
              <FileUp size={18} />
              Choose
            </div>

            <input
              type="file"
              accept=".pdf"
              onChange={handleChooseFile}
              className="hidden"
            />
          </label>

          {/* Show Index only for newly selected files */}
          {selectedFile && (
            <button
              onClick={handleIndex}
              disabled={isIndexing}
              className="flex min-w-[110px] items-center justify-center rounded-2xl bg-pink-500 px-5 py-3 font-medium text-white shadow-md transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isIndexing ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Indexing
                </div>
              ) : (
                "Index"
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadCard;
import { CheckCircle2, FileText, BookOpen } from "lucide-react";
import type { UploadResult } from "../../types/upload";

type SuccessBannerProps = {
  result: UploadResult;
};

const SuccessBanner = ({ result }: SuccessBannerProps) => {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm">
      <div className="flex items-start gap-3">
        <CheckCircle2
          size={24}
          className="mt-0.5 text-emerald-600"
        />

        <div className="flex-1">
          <h3 className="font-semibold text-emerald-700">
            Document indexed successfully!
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
            <FileText size={15} />
            <span className="truncate">{result.filename}</span>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
            <BookOpen size={13} />
            {result.pages} Pages
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessBanner;
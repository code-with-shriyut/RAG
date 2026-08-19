import { Bot } from "lucide-react";

type AIMessageProps = {
  text: string;
  time: string;
  sources: string[];
};

const AIMessage = ({ text, time, sources }: AIMessageProps) => {
  return (
    <div className="mb-5 flex items-end justify-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#cbe8ff] shadow-[0_8px_16px_rgba(99,163,255,0.15)]">
        <Bot className="h-6 w-6 text-[#4f86ff]" />
      </div>

      <div className="max-w-[78%] rounded-[24px] border border-[#d1e6ff] bg-[#edf6ff] px-4 py-3 shadow-[0_8px_18px_rgba(129,164,255,0.08)]">
        <p className="text-[1.02rem] leading-7 text-[#334763]">{text}</p>

        {sources.length > 0 && (
          <div className="mt-2 text-sm text-[#516a89]">
            <span className="font-semibold">Source:</span> {sources.join(", ")}
          </div>
        )}

        <p className="mt-2 text-right text-[11px] font-medium text-[#7b8ca6]">{time}</p>
      </div>
    </div>
  );
};

export default AIMessage;
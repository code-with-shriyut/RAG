import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex items-end justify-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#cbe8ff] shadow-[0_8px_16px_rgba(99,163,255,0.15)]">
        <Bot className="h-6 w-6 text-[#4f86ff]" />
      </div>

      <div className="rounded-[24px] border border-[#d1e6ff] bg-[#edf6ff] px-5 py-4 shadow-[0_8px_18px_rgba(129,164,255,0.08)]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#8da7bf] [animation-delay:0ms]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#8da7bf] [animation-delay:150ms]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#8da7bf] [animation-delay:300ms]" />
          </div>
          <span className="text-sm font-medium text-[#6e8098]">Typing...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
import { MessageCircle } from "lucide-react";

import ChatSection from "./ChatSection";
import ChatInput from "./ChatInput";

import type { Message } from "../../types/chat";

type ChatCardProps = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isThinking: boolean;
  setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatCard = ({
  messages,
  setMessages,
  isThinking,
  setIsThinking,
}: ChatCardProps) => {
  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] rounded-[28px] border border-pink-200 bg-[#FFF8FB]/90 p-5 shadow-sm">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
            <MessageCircle size={20} className="text-pink-500" />
          </div>

          <h2 className="text-2xl font-semibold text-slate-700">Chat</h2>
        </div>

        <div className="mt-4 h-px bg-pink-200" />
      </div>

      {/* Messages */}
      <div className="min-h-0 overflow-y-auto py-4 pr-2">
        <ChatSection
          messages={messages}
          isThinking={isThinking}
        />
      </div>

      {/* Input */}
      <div className="border-t border-pink-100 pt-4">
        <ChatInput
          setMessages={setMessages}
          setIsThinking={setIsThinking}
        />
      </div>
    </div>
  );
};

export default ChatCard;
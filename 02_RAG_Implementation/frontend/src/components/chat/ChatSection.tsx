import { useEffect, useRef } from "react";

import UserMessage from "./UserMessage";
import AIMessage from "./AIMessage";
import TypingIndicator from "./TypingIndicator";
import EmptyChat from "./EmptyChat";

import type { Message } from "../../types/chat";

type ChatSectionProps = {
  messages: Message[];
  isThinking: boolean;
};

const ChatSection = ({
  messages,
  isThinking,
}: ChatSectionProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 🌸 Auto-scroll whenever a new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  // Empty State
  if (messages.length === 0 && !isThinking) {
    return <EmptyChat />;
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {messages.map((message) =>
        message.role === "user" ? (
          <UserMessage
            key={message.id}
            text={message.text}
            time={message.time}
          />
        ) : (
          <AIMessage
            key={message.id}
            text={message.text}
            time={message.time}
            sources={message.sources ?? []}
          />
        )
      )}

      {isThinking && <TypingIndicator />}

      {/* Auto-scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatSection;
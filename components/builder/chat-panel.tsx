"use client";

import { memo } from "react";

import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageActions,
  MessageContent,
  MessageCopyButton,
  MessageResponse,
} from "@/components/ai-elements/message";
import { WorkflowMentionInput } from "@/components/workflow-mention-input";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

const ChatMessageItem = memo(function ChatMessageItem({
  message,
}: {
  message: ChatMessage;
}) {
  const isAssistant = message.role === "assistant";

  return (
    <Message from={message.role}>
      <MessageContent>
        {isAssistant ? (
          message.content && <MessageResponse>{message.content}</MessageResponse>
        ) : (
          message.content
        )}
      </MessageContent>
      <MessageActions
        className={cn(
          "opacity-0 transition-opacity group-hover:opacity-100",
          !isAssistant && "ms-auto",
        )}
      >
        <MessageCopyButton text={message.content} />
      </MessageActions>
    </Message>
  );
});

interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: (content: string) => void;
  isLoading: boolean;
}

export function ChatPanel({
  messages,
  input,
  onInputChange,
  onSend,
  isLoading,
}: ChatPanelProps): React.JSX.Element {
  return (
    <Conversation className="h-full">
      <ConversationContent className="space-y-2">
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
      </ConversationContent>

      <WorkflowMentionInput
        value={input}
        onChange={onInputChange}
        onSubmit={onSend}
        placeholder="Tell me what you'd like to create... (type @ to mention a workflow)"
        isLoading={isLoading}
        inputClassName="p-4"
      />
    </Conversation>
  );
}

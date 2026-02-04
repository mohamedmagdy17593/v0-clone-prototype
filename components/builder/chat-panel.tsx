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
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
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

      <PromptInput onSubmit={(msg) => onSend(msg.text)} className="p-4">
        <PromptInputTextarea
          placeholder="Tell me what you'd like to create..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
          </PromptInputTools>
          <PromptInputSubmit
            disabled={!input.trim() && !isLoading}
            status={isLoading ? "streaming" : undefined}
          />
        </PromptInputFooter>
      </PromptInput>
    </Conversation>
  );
}

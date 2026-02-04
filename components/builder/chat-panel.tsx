"use client";

import { memo } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { Sparkles } from "lucide-react";
import {
  Message,
  MessageActions,
  MessageContent,
  MessageCopyButton,
} from "@/components/ai-elements/message";
import { DemoStreamMessage } from "@/components/ai-elements/demo-stream-message";
import { StreamingMessage } from "@/components/ai-elements/streaming-message";
import { WorkflowMentionInput } from "@/components/workflow-mention-input";
import { cn } from "@/lib/utils";
import type { DemoActivityItem } from "@/lib/demo/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  demoStreamItems?: DemoActivityItem[];
}

const ChatMessageItem = memo(function ChatMessageItem({
  message,
  isStreaming = false,
  customAssistantContent,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
  customAssistantContent?: React.ReactNode;
}) {
  const isAssistant = message.role === "assistant";

  return (
    <Message from={message.role}>
      <MessageContent>
        {isAssistant ? (
          customAssistantContent ? (
            customAssistantContent
          ) : (
            (message.content || isStreaming) && (
              <StreamingMessage
                content={message.content}
                isStreaming={isStreaming}
              />
            )
          )
        ) : (
          message.content
        )}
      </MessageContent>
      {!isStreaming && (
        <MessageActions
          className={cn(
            "opacity-0 transition-opacity group-hover:opacity-100",
            !isAssistant && "ms-auto",
          )}
        >
          <MessageCopyButton text={message.content} />
        </MessageActions>
      )}
    </Message>
  );
});

const SUGGESTION_PROMPTS = [
  "CV reviewer @cv_reviewer",
  "r/nextjs to Slack @reddit_weekly_summary",
  "Auto-label inbox @gmail_ai_labeler",
  "Workflow runs dashboard",
];

interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: (content: string) => void;
  isLoading: boolean;
  streamingContent?: string;
  streamingMessageId?: string;
  demoStreamMessageId?: string;
  demoStreamItems?: DemoActivityItem[];
}

export function ChatPanel({
  messages,
  input,
  onInputChange,
  onSend,
  isLoading,
  streamingContent,
  streamingMessageId,
  demoStreamMessageId,
  demoStreamItems,
}: ChatPanelProps): React.JSX.Element {
  const hasMessages = messages.length > 0;

  return (
    <Conversation className="h-full">
      {hasMessages ? (
        <ConversationContent className="space-y-2">
          {messages.map((message) => {
            const isStreaming = streamingMessageId === message.id;
            const resolvedDemoItems =
              demoStreamMessageId && message.id === demoStreamMessageId
                ? (demoStreamItems ?? [])
                : (message.demoStreamItems ?? []);
            const isDemoStreamMessage =
              message.role === "assistant" && resolvedDemoItems.length > 0;

            return (
              <ChatMessageItem
                key={message.id}
                message={
                  isStreaming
                    ? { ...message, content: streamingContent ?? "" }
                    : message
                }
                isStreaming={isStreaming}
                customAssistantContent={
                  isDemoStreamMessage ? (
                    <DemoStreamMessage
                      items={resolvedDemoItems}
                      isStreaming={isStreaming}
                    />
                  ) : undefined
                }
              />
            );
          })}
        </ConversationContent>
      ) : (
        <ConversationEmptyState className="px-4">
          <Sparkles className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            What would you like to build?
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {SUGGESTION_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onInputChange(prompt)}
                className="rounded-md border border-border/80 bg-background px-2.5 py-1 text-[11px] font-normal text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </ConversationEmptyState>
      )}

      <WorkflowMentionInput
        value={input}
        onChange={onInputChange}
        onSubmit={onSend}
        placeholder="Tell me what you'd like to create... (type @ to mention a workflow)"
        isLoading={isLoading}
        inputClassName="p-3"
      />
    </Conversation>
  );
}

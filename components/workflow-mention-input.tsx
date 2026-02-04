"use client";

import { useRef } from "react";
import { WorkflowIcon } from "lucide-react";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Mention,
  MentionContent,
  MentionInput,
  MentionItem,
} from "@/components/ui/mention";
import { cn } from "@/lib/utils";

// Mock workflow data
const MOCK_WORKFLOWS = [
  { id: "cv_reviewer", label: "cv_reviewer" },
  { id: "cv_parser", label: "cv_parser" },
  { id: "email_generator", label: "email_generator" },
  { id: "text_summarizer", label: "text_summarizer" },
  { id: "sentiment_analyzer", label: "sentiment_analyzer" },
];

interface WorkflowMentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  textareaClassName?: string;
  inputClassName?: string;
  footerClassName?: string;
}

export function WorkflowMentionInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Type @ to mention a workflow...",
  disabled,
  isLoading,
  textareaClassName,
  inputClassName,
  footerClassName,
}: WorkflowMentionInputProps) {
  const mentionOpenRef = useRef(false);

  const handleSubmit = (msg: { text: string }) => {
    if (mentionOpenRef.current) return;
    onSubmit(msg.text);
  };

  return (
    <Mention
      className="w-full [&_[data-slot='input-group']>div:first-child]:w-full"
      onInputValueChange={onChange}
      inputValue={value}
      onOpenChange={(open) => {
        mentionOpenRef.current = open;
      }}
    >
      <PromptInput onSubmit={handleSubmit} className={cn(inputClassName)}>
        <MentionInput asChild>
          <PromptInputTextarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(textareaClassName)}
          />
        </MentionInput>
        <PromptInputFooter className={cn(footerClassName)}>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
          </PromptInputTools>
          <PromptInputSubmit
            disabled={disabled ?? !value.trim()}
            status={isLoading ? "streaming" : undefined}
          />
        </PromptInputFooter>
      </PromptInput>
      <MentionContent>
        {MOCK_WORKFLOWS.map((workflow) => (
          <MentionItem key={workflow.id} value={workflow.id} label={workflow.label}>
            <WorkflowIcon className="size-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">@{workflow.label}</span>
          </MentionItem>
        ))}
      </MentionContent>
    </Mention>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, FilePlus2, FilePenLine, Loader2 } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import type { DemoActivityItem } from "@/lib/demo/types";
import { MessageResponse } from "@/components/ai-elements/message";

interface DemoStreamMessageProps {
  items: DemoActivityItem[];
  isStreaming?: boolean;
  className?: string;
}

function WordStreamText({ text }: { text: string }) {
  const [wordCount, setWordCount] = useState(0);
  const tokens = useMemo(() => text.split(/(\s+)/).filter(Boolean), [text]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordCount((prev) => {
        if (prev >= tokens.length) {
          window.clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 35);

    return () => window.clearInterval(timer);
  }, [tokens.length]);

  return <>{tokens.slice(0, wordCount).join("")}</>;
}

function FileActivityCard({
  item,
  isLatest,
  isStreaming,
}: {
  item: Extract<DemoActivityItem, { type: "file" }>;
  isLatest: boolean;
  isStreaming: boolean;
}) {
  const isAdding = item.action === "add";
  const Icon = isAdding ? FilePlus2 : FilePenLine;
  const label = isAdding ? "Adding file" : "Editing file";
  const isInProgress = isStreaming && isLatest;

  return (
    <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Icon className="size-3.5" />
          <span>{label}</span>
        </div>
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          {isInProgress ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              <span>In progress</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="size-3 text-emerald-500" />
              <span>Done</span>
            </>
          )}
        </div>
      </div>
      <div className="rounded-md border border-border/70 bg-background/70 px-2 py-1.5">
        <p className="font-mono text-xs text-foreground/90">{item.path}</p>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
    </div>
  );
}

export const DemoStreamMessage = memo(function DemoStreamMessage({
  items,
  isStreaming = false,
  className,
}: DemoStreamMessageProps) {
  const lastFileIndex = (() => {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i]?.type === "file") return i;
    }
    return -1;
  })();

  const lastItem = items[items.length - 1];
  const activeTextItem =
    isStreaming && lastItem && (lastItem.type === "text" || lastItem.type === "done")
      ? lastItem
      : null;

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        if (item.type === "text") {
          const isActiveStreamingText = activeTextItem?.id === item.id;

          return (
            <MessageResponse key={item.id}>
              <p className="whitespace-pre-wrap leading-relaxed">
                {isActiveStreamingText ? (
                  <WordStreamText key={item.id} text={item.text} />
                ) : (
                  item.text
                )}
              </p>
            </MessageResponse>
          );
        }

        if (item.type === "file") {
          return (
            <FileActivityCard
              key={item.id}
              item={item}
              isLatest={index === lastFileIndex}
              isStreaming={isStreaming}
            />
          );
        }

        const isActiveStreamingText = activeTextItem?.id === item.id;
        return (
          <MessageResponse key={item.id}>
            <p className="whitespace-pre-wrap leading-relaxed">
              {isActiveStreamingText ? (
                <WordStreamText key={item.id} text={item.text} />
              ) : (
                item.text
              )}
            </p>
          </MessageResponse>
        );
      })}
    </div>
  );
});

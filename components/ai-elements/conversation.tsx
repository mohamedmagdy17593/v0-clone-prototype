"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const SCROLL_THRESHOLD = 100;

function Conversation({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="conversation"
      className={cn("flex h-full flex-col", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ConversationContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const isAtBottom = React.useRef(true);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      isAtBottom.current = distanceFromBottom <= SCROLL_THRESHOLD;
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, []);

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    if (isAtBottom.current) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [children]);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="flex-1 overflow-hidden" viewportRef={viewportRef}>
        <div
          data-slot="conversation-content"
          className={cn("px-4 py-2 min-w-0", className)}
          {...props}
        >
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}

function ConversationEmptyState({
  title,
  description,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  title?: string;
  description?: string;
}) {
  return (
    <div
      data-slot="conversation-empty-state"
      className={cn(
        "flex h-full flex-col items-center justify-center gap-2 text-center",
        className,
      )}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}

export { Conversation, ConversationContent, ConversationEmptyState };

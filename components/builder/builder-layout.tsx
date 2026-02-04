"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_DEMO_ID,
  DEMO_REGISTRY,
  extractWorkflowMentions,
  getDemoById,
  pickDemoForPrompt,
} from "@/lib/demo/demo-registry";
import type { DemoConfig } from "@/lib/demo/types";
import { useGenerationFlow } from "@/hooks/use-generation-flow";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatPanel, type ChatMessage } from "./chat-panel";
import { Navbar } from "./navbar";
import { PreviewPanel } from "./preview-panel";
import type { GenerationStageInfo } from "@/types/generation";

interface BuilderLayoutProps {
  initialPrompt?: string;
  template?: string;
}

const STREAM_REVEAL_INTERVAL = 1100;
const FILE_CARD_REVEAL_INTERVAL = 3600;

function getRevealDelay(activityStream: DemoConfig["activityStream"], index: number) {
  const nextItem = activityStream[index];
  if (!nextItem) return STREAM_REVEAL_INTERVAL;
  return nextItem.type === "file" ? FILE_CARD_REVEAL_INTERVAL : STREAM_REVEAL_INTERVAL;
}

const FALLBACK_DEMO = getDemoById(DEFAULT_DEMO_ID) ?? DEMO_REGISTRY[0];
if (!FALLBACK_DEMO) {
  throw new Error("Demo registry is empty. Add at least one demo configuration.");
}

export function BuilderLayout({ initialPrompt, template }: BuilderLayoutProps) {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [demoComplete, setDemoComplete] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const [demoStreamMessageId, setDemoStreamMessageId] = useState<string | null>(null);
  const [visibleActivityCount, setVisibleActivityCount] = useState(0);
  const [selectedDemo, setSelectedDemo] = useState<DemoConfig>(FALLBACK_DEMO);
  const hasInitialized = useRef(false);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);
  const isStreamingRef = useRef(false);
  const selectedDemoRef = useRef<DemoConfig>(FALLBACK_DEMO);

  useEffect(() => {
    selectedDemoRef.current = selectedDemo;
  }, [selectedDemo]);

  // Keep refs in sync with state for use in callbacks
  useEffect(() => {
    streamingMessageIdRef.current = streamingMessageId;
  }, [streamingMessageId]);

  useEffect(() => {
    isStreamingRef.current = isStreaming;
  }, [isStreaming]);

  // Generation flow hook
  const { state: generationState, start: startGeneration } = useGenerationFlow({
    onStageChange: (stage) => {
      // Start streaming when PLANNING begins
      if (stage === "PLANNING" && !isStreamingRef.current) {
        setVisibleActivityCount(1);
        setIsStreaming(true);
      }
    },
    onComplete: () => {
      isStreamingRef.current = false;
      setIsStreaming(false);
      setDemoComplete(true);
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
        activityTimerRef.current = null;
      }

      const activeDemo = selectedDemoRef.current;

      // Finalize message with full content
      const msgId = streamingMessageIdRef.current;
      if (msgId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === msgId
              ? {
                  ...msg,
                  content: activeDemo.chatTranscriptText,
                  demoStreamItems: activeDemo.activityStream,
                }
              : msg,
          ),
        );
        setStreamingContent(activeDemo.chatTranscriptText);
      }
      setVisibleActivityCount(activeDemo.activityStream.length);
      setStreamingMessageId(null);
    },
  });

  // Reveal mocked stream items progressively while generation is active.
  useEffect(() => {
    if (!isStreaming || !streamingMessageId) {
      return;
    }

    const activityStream = selectedDemo.activityStream;
    const maxBeforeComplete = activityStream.length - 1;
    if (visibleActivityCount >= maxBeforeComplete) {
      return;
    }

    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
      activityTimerRef.current = null;
    }

    const delay = getRevealDelay(activityStream, visibleActivityCount);
    activityTimerRef.current = setTimeout(() => {
      setVisibleActivityCount((prev) => Math.min(prev + 1, maxBeforeComplete));
    }, delay);

    return () => {
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
        activityTimerRef.current = null;
      }
    };
  }, [isStreaming, selectedDemo, streamingMessageId, visibleActivityCount]);

  // Derive loading state from generation flow
  const isLoading = generationState.isActive;

  // Create generation stage info for overlay
  const generationStageInfo: GenerationStageInfo | undefined =
    generationState.stage !== "IDLE" && generationState.stage !== "COMPLETE"
      ? {
        stage: generationState.stage,
        message: generationState.message,
        progress: generationState.progress,
        currentFile: generationState.currentFile || undefined,
      }
      : undefined;

  const handleSend = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      const nextDemo = pickDemoForPrompt(content);
      selectedDemoRef.current = nextDemo;
      setSelectedDemo(nextDemo);

      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
        activityTimerRef.current = null;
      }

      // Create user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
      };

      // Create placeholder assistant message for streaming
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        demoStreamItems: [],
      };

      // Reset streaming state
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setStreamingMessageId(assistantMessageId);
      setDemoStreamMessageId(assistantMessageId);
      setInput("");
      setDemoComplete(false);
      setIsStreaming(false);
      setStreamingContent("");
      setVisibleActivityCount(0);

      // Extract workflow mentions for custom messages
      const mentions = extractWorkflowMentions(content);
      const mentionedWorkflow = mentions[0] || nextDemo.mentions[0];

      // Start the generation flow
      startGeneration({ mentionedWorkflow, mode: nextDemo.flowMode });
    },
    [startGeneration],
  );

  // Auto-trigger generation when coming from home with a prompt or template
  useEffect(() => {
    if (hasInitialized.current) return;

    const promptToSend = initialPrompt || (template ? `Create a ${template} interface` : null);
    if (promptToSend) {
      hasInitialized.current = true;
      // Use timeout to avoid synchronous setState in effect
      const timer = setTimeout(() => handleSend(promptToSend), 0);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt, template, handleSend]);

  if (isMobile) {
    return (
      <div className="flex h-full flex-col">
        <Navbar />
        <Tabs defaultValue="chat" className="flex flex-1 flex-col overflow-hidden">
          <TabsList className="mx-4 mt-4 self-start">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-1 overflow-hidden">
            <ChatPanel
              messages={messages}
              input={input}
              onInputChange={setInput}
              onSend={handleSend}
              isLoading={isLoading}
              streamingContent={streamingMessageId ? streamingContent : undefined}
              streamingMessageId={streamingMessageId || undefined}
              demoStreamMessageId={demoStreamMessageId || undefined}
              demoStreamItems={selectedDemo.activityStream.slice(0, visibleActivityCount)}
            />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-hidden">
            <PreviewPanel
              isGenerating={isLoading}
              generationStageInfo={generationStageInfo}
              demoMode={demoComplete}
              demoComponent={selectedDemo.previewComponent}
              currentCode={demoComplete ? selectedDemo.codeContent : ""}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        <ResizablePanel defaultSize="25" minSize="20" maxSize="50">
          <ChatPanel
            messages={messages}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            isLoading={isLoading}
            streamingContent={streamingMessageId ? streamingContent : undefined}
            streamingMessageId={streamingMessageId || undefined}
            demoStreamMessageId={demoStreamMessageId || undefined}
            demoStreamItems={selectedDemo.activityStream.slice(0, visibleActivityCount)}
          />
        </ResizablePanel>
        <ResizableHandle className="bg-transparent" />
        <ResizablePanel className="overflow-hidden! pb-3 pr-3">
          <div className="h-full overflow-hidden rounded-lg border border-border">
            <PreviewPanel
              isGenerating={isLoading}
              generationStageInfo={generationStageInfo}
              demoMode={demoComplete}
              demoComponent={selectedDemo.previewComponent}
              currentCode={demoComplete ? selectedDemo.codeContent : ""}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

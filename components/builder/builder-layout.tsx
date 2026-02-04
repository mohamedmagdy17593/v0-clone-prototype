"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { ChatPanel, type ChatMessage } from "./chat-panel";
import { Navbar } from "./navbar";
import { PreviewPanel } from "./preview-panel";

interface BuilderLayoutProps {
  previewUrl?: string;
}

export function BuilderLayout({ previewUrl = "https://example.com" }: BuilderLayoutProps) {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you want to create: "${content}"\n\nThis is a demo response. In the full implementation, I would generate the code and update the preview.`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

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
            />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-hidden">
            <PreviewPanel previewUrl={previewUrl} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        <ResizablePanel defaultSize="35" minSize="25" maxSize="50">
          <ChatPanel
            messages={messages}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </ResizablePanel>
        <ResizableHandle className="bg-transparent" />
        <ResizablePanel className="!overflow-hidden pb-2 pr-2">
          <div className="h-full overflow-hidden rounded-lg border border-border">
            <PreviewPanel previewUrl={previewUrl} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

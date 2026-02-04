"use client";

import {
  CodeBlockActions,
  CodeBlockContainer,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block";
import { GeneratingOverlay } from "@/components/ai-elements/generating-overlay";
import {
  WebPreview,
  WebPreviewBody,
} from "@/components/ai-elements/web-preview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  CodeIcon,
  ExternalLinkIcon,
  EyeIcon,
  Loader2Icon,
  MonitorIcon,
  RefreshCwIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react";
import { useCallback, useState } from "react";

interface PreviewPanelProps {
  previewUrl: string;
  currentCode?: string;
  isGenerating?: boolean;
}

type ViewportSize = "desktop" | "tablet" | "mobile";

const VIEWPORT_SIZES: Record<
  ViewportSize,
  { width: string; icon: typeof MonitorIcon; label: string }
> = {
  desktop: { width: "100%", icon: MonitorIcon, label: "Desktop" },
  tablet: { width: "768px", icon: TabletIcon, label: "Tablet" },
  mobile: { width: "375px", icon: SmartphoneIcon, label: "Mobile" },
};

function IconButton({
  tooltip,
  onClick,
  disabled,
  active,
  children,
}: {
  tooltip: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "size-8 p-0 text-muted-foreground hover:text-foreground sm:size-7",
              active && "bg-muted text-foreground",
            )}
            aria-label={tooltip}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function PreviewPanel({ previewUrl, currentCode = "", isGenerating = false }: PreviewPanelProps) {
  const [manualRefresh, setManualRefresh] = useState(0);
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const urlWithRefresh = previewUrl ? `${previewUrl}${previewUrl.includes("?") ? "&" : "?"}refresh=${manualRefresh}` : "";

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setManualRefresh((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 300);
  }, []);

  const handleOpenExternal = useCallback(() => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  }, [previewUrl]);

  if (!previewUrl) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
          <EyeIcon className="size-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">No preview yet</p>
          <p className="text-xs text-muted-foreground text-balance">
            Start a conversation to generate your first design
          </p>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="preview" className="flex h-full flex-col gap-0">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-muted/30 px-3 sm:h-10">
        <TabsList className="h-8 bg-transparent p-0 sm:h-7">
          <TabsTrigger
            value="preview"
            className="h-8 gap-1.5 rounded-md px-2.5 text-xs data-[state=active]:bg-muted data-[state=active]:shadow-none sm:h-7 sm:px-2"
          >
            <EyeIcon className="size-4 sm:size-3.5" />
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="h-8 gap-1.5 rounded-md px-2.5 text-xs data-[state=active]:bg-muted data-[state=active]:shadow-none sm:h-7 sm:px-2"
          >
            <CodeIcon className="size-4 sm:size-3.5" />
            Code
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-0.5">
          <div className="mr-1 hidden items-center rounded-md p-0.5 md:flex">
            {(["desktop", "tablet", "mobile"] as const).map((size) => {
              const config = VIEWPORT_SIZES[size];
              const Icon = config.icon;
              return (
                <button
                  key={size}
                  onClick={() => setViewport(size)}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground",
                    viewport === size && "bg-muted text-foreground",
                  )}
                  aria-label={config.label}
                >
                  <Icon className="size-3.5" />
                </button>
              );
            })}
          </div>

          <IconButton
            tooltip="Refresh preview"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2Icon className="size-4 animate-spin sm:size-3.5" />
            ) : (
              <RefreshCwIcon className="size-4 sm:size-3.5" />
            )}
          </IconButton>

          <IconButton tooltip="Open in new tab" onClick={handleOpenExternal}>
            <ExternalLinkIcon className="size-4 sm:size-3.5" />
          </IconButton>
        </div>
      </div>

      <TabsContent
        value="preview"
        className="relative m-0 flex-1 overflow-hidden"
      >
        <div className="flex h-full items-start justify-center overflow-auto bg-muted/20">
          <div
            className={cn(
              "h-full w-full bg-background transition-all duration-200 md:w-auto",
              viewport !== "desktop" && "shadow-sm",
            )}
            style={{
              width:
                viewport === "desktop"
                  ? "100%"
                  : VIEWPORT_SIZES[viewport].width,
              maxWidth: "100%",
            }}
          >
            <WebPreview
              defaultUrl={urlWithRefresh}
              className="h-full rounded-none border-0 bg-transparent"
            >
              <WebPreviewBody src={urlWithRefresh} />
            </WebPreview>
          </div>
        </div>

        <GeneratingOverlay isGenerating={isGenerating} minDisplayTime={2000} />
      </TabsContent>

      <TabsContent
        value="code"
        className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <CodeBlockContainer
          language="html"
          className="flex min-h-0 flex-1 flex-col rounded-none border-0"
        >
          <CodeBlockHeader className="shrink-0 border-b border-border bg-transparent py-1.5">
            <CodeBlockTitle>
              <CodeBlockFilename className="text-xs text-muted-foreground">
                page.html
              </CodeBlockFilename>
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton code={currentCode} className="size-7 sm:size-6" />
            </CodeBlockActions>
          </CodeBlockHeader>
          <div className="min-h-0 flex-1 overflow-auto">
            <CodeBlockContent
              code={currentCode || "<!-- No code generated yet -->"}
              language="html"
              showLineNumbers
            />
          </div>
        </CodeBlockContainer>
      </TabsContent>
    </Tabs>
  );
}

"use client";

import {
  CodeBlockContainer,
} from "@/components/ai-elements/code-block";
import { CodeEditorPane } from "@/components/builder/code-editor-pane";
import { GeneratingOverlay } from "@/components/ai-elements/generating-overlay";
import { StarterTemplate } from "@/components/demo/starter-template";
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
  MonitorIcon,
  RefreshCwIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react";
import { useState } from "react";
import type { GenerationStageInfo } from "@/types/generation";

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

interface PreviewPanelProps {
  currentCode?: string;
  isGenerating?: boolean;
  generationStageInfo?: GenerationStageInfo;
  demoMode?: boolean;
  demoComponent?: React.ReactNode;
}

export function PreviewPanel({
  currentCode = "",
  isGenerating = false,
  generationStageInfo,
  demoMode = false,
  demoComponent,
}: PreviewPanelProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");

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

          <IconButton tooltip="Refresh preview">
            <RefreshCwIcon className="size-4 sm:size-3.5" />
          </IconButton>

          <IconButton tooltip="Open in new tab">
            <ExternalLinkIcon className="size-4 sm:size-3.5" />
          </IconButton>
        </div>
      </div>

      <TabsContent
        value="preview"
        className="relative m-0 flex-1 overflow-hidden"
      >
        {demoMode && demoComponent ? (
          <div className="h-full overflow-auto bg-background">
            {demoComponent}
          </div>
        ) : (
          <StarterTemplate />
        )}

        <GeneratingOverlay
          isGenerating={isGenerating}
          stageInfo={generationStageInfo}
          minDisplayTime={2000}
        />
      </TabsContent>

      <TabsContent
        value="code"
        className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <CodeBlockContainer
          language="html"
          className="flex min-h-0 flex-1 flex-col rounded-none border-0"
        >
          <CodeEditorPane currentCode={currentCode} />
        </CodeBlockContainer>
      </TabsContent>
    </Tabs>
  );
}

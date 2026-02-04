"use client";

import { Shimmer } from "@/components/ai-elements/shimmer";
import { Progress } from "@/components/ui/progress";
import CodeWords from "@/components/icons/code-words";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Code,
  ListTodo,
  Package,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import type { GenerationStageInfo } from "@/types/generation";

interface GeneratingOverlayProps {
  isGenerating: boolean;
  stageInfo?: GenerationStageInfo;
  minDisplayTime?: number;
  className?: string;
}

const LOADING_MESSAGES = [
  "Generating your interface",
  "Crafting the layout",
  "Refining components",
  "Almost there",
];

const STAGE_ICONS = {
  THINKING: Brain,
  PLANNING: ListTodo,
  GENERATING: Code,
  BUILDING: Package,
  BUILD_FAILED: AlertTriangle,
  RECOVERING: RefreshCw,
  INTERRUPTED: WifiOff,
  COMPLETE: CheckCircle,
} as const;

export function GeneratingOverlay({
  isGenerating,
  stageInfo,
  minDisplayTime = 2000,
  className,
}: GeneratingOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const hasStageInfo = !!stageInfo;

  // Handle visibility based on isGenerating
  // Note: setState in effect is intentional here - we need to synchronize
  // visibility state with the isGenerating prop to support minimum display time
  useEffect(() => {
    if (isGenerating) {
      setIsVisible(true);
      setMessageIndex(0);
      return;
    }
    // When isGenerating becomes false, delay hiding
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, minDisplayTime);
    return () => clearTimeout(timer);
  }, [isGenerating, minDisplayTime]);

  // Cycle messages only when visible and no stageInfo
  useEffect(() => {
    if (!isVisible || hasStageInfo) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isVisible, hasStageInfo]);

  const StageIcon = stageInfo ? STAGE_ICONS[stageInfo.stage] : null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.88, 0.92, 0.88] }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          transition={{
            opacity: {
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            },
          }}
          className={cn(
            "absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background backdrop-blur-md motion-reduce:opacity-90",
            className
          )}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
            className="relative flex items-center justify-center"
          >
            {hasStageInfo && StageIcon ? (
              <motion.div
                key={stageInfo.stage}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-foreground/80"
              >
                <StageIcon className="size-10" strokeWidth={1.5} />
              </motion.div>
            ) : (
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  rotate: {
                    duration: 4,
                    ease: "linear",
                    repeat: Infinity,
                  },
                  scale: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  },
                }}
                className="text-foreground/80 motion-reduce:animate-none"
              >
                <CodeWords />
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col items-center gap-3"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={hasStageInfo ? stageInfo.message : messageIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <Shimmer className="text-base font-medium tracking-tight" duration={2.5}>
                  {hasStageInfo ? stageInfo.message : LOADING_MESSAGES[messageIndex]}
                </Shimmer>
              </motion.div>
            </AnimatePresence>

            {/* Show current file when available */}
            {hasStageInfo && stageInfo.currentFile && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground font-mono"
              >
                {stageInfo.currentFile}
              </motion.p>
            )}

            {/* Progress indicator */}
            {hasStageInfo ? (
              <div className="w-48">
                <Progress value={stageInfo.progress} className="h-1" />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {LOADING_MESSAGES.map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "size-1 rounded-full transition-colors duration-200",
                      i <= messageIndex ? "bg-foreground/60" : "bg-foreground/15"
                    )}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

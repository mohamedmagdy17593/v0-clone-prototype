"use client";

import { Shimmer } from "@/components/ai-elements/shimmer";
import CodeWords from "@/components/icons/code-words";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface GeneratingOverlayProps {
  isGenerating: boolean;
  minDisplayTime?: number;
  className?: string;
}

const LOADING_MESSAGES = [
  "Generating your interface",
  "Crafting the layout",
  "Refining components",
  "Almost there",
];

export function GeneratingOverlay({
  isGenerating,
  minDisplayTime = 2000,
  className,
}: GeneratingOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      setIsVisible(true);
      setMessageIndex(0);
    } else if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, minDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, isVisible, minDisplayTime]);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isVisible]);

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
            "absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-background backdrop-blur-md motion-reduce:opacity-90",
            className
          )}
        >
          {/* Icon container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
            className="relative flex items-center justify-center"
          >
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
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <Shimmer className="text-base font-medium tracking-tight" duration={2.5}>
                {LOADING_MESSAGES[messageIndex]}
              </Shimmer>
              <span className="text-base font-medium text-muted-foreground">
                <LoadingDots />
              </span>
            </div>

            {/* Progress indicator */}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex w-5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className="motion-reduce:opacity-60"
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

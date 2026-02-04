'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Shimmer } from '@/components/ai-elements/shimmer'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Code,
  ListTodo,
  Package,
  RefreshCw,
  WifiOff,
} from 'lucide-react'
import type { GenerationFlowState } from '@/types/generation'

interface GenerationProgressCardProps {
  state: GenerationFlowState
  className?: string
}

const STAGE_ICONS = {
  IDLE: null,
  THINKING: Brain,
  PLANNING: ListTodo,
  GENERATING: Code,
  BUILDING: Package,
  BUILD_FAILED: AlertTriangle,
  RECOVERING: RefreshCw,
  INTERRUPTED: WifiOff,
  COMPLETE: CheckCircle,
} as const

const STAGE_COLORS = {
  IDLE: 'text-muted-foreground',
  THINKING: 'text-blue-500',
  PLANNING: 'text-purple-500',
  GENERATING: 'text-orange-500',
  BUILDING: 'text-green-500',
  BUILD_FAILED: 'text-destructive',
  RECOVERING: 'text-amber-500',
  INTERRUPTED: 'text-muted-foreground',
  COMPLETE: 'text-green-600',
} as const

export function GenerationProgressCard({
  state,
  className,
}: GenerationProgressCardProps) {
  const { stage, message, progress, currentFile, isActive } = state

  if (stage === 'IDLE' || !isActive) {
    return null
  }

  const Icon = STAGE_ICONS[stage]
  const iconColor = STAGE_COLORS[stage]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={cn('w-full', className)}
      >
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              {/* Icon */}
              {Icon && (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className={cn('mt-0.5', iconColor)}
                >
                  <Icon className="size-4" strokeWidth={2} />
                </motion.div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <Shimmer
                    className="text-sm font-medium"
                    duration={2}
                  >
                    {message}
                  </Shimmer>
                </div>

                {/* Current file */}
                {currentFile && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground font-mono truncate"
                  >
                    {currentFile}
                  </motion.p>
                )}

                {/* Progress bar */}
                <Progress value={progress} className="h-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

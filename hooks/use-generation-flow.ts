'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { GenerationStage, GenerationFlowState } from '@/types/generation'

interface StageConfig {
  message: string
  messageWithWorkflow?: (workflow: string) => string
  duration: number
  progress: number
  currentFile?: string
}

const STAGE_CONFIGS: Record<Exclude<GenerationStage, 'IDLE'>, StageConfig> = {
  THINKING: {
    message: 'Understanding your request...',
    messageWithWorkflow: (workflow) => `Fetching @${workflow} schema...`,
    duration: 1500,
    progress: 10,
  },
  PLANNING: {
    message: 'Planning component structure...',
    duration: 2000,
    progress: 30,
  },
  GENERATING: {
    message: 'Writing code...',
    duration: 5000,
    progress: 60,
    currentFile: 'CVReviewForm.tsx',
  },
  BUILDING: {
    message: 'Building preview...',
    duration: 2500,
    progress: 90,
  },
  COMPLETE: {
    message: 'Complete!',
    duration: 0,
    progress: 100,
  },
}

const STAGE_ORDER: Array<Exclude<GenerationStage, 'IDLE'>> = [
  'THINKING',
  'PLANNING',
  'GENERATING',
  'BUILDING',
  'COMPLETE',
]

interface UseGenerationFlowOptions {
  onStageChange?: (stage: GenerationStage) => void
  onComplete?: () => void
}

// Helper to get state for a stage
function getStateForStage(
  stage: Exclude<GenerationStage, 'IDLE'>,
  workflow: string | null
): GenerationFlowState {
  const config = STAGE_CONFIGS[stage]
  let message = config.message
  if (stage === 'THINKING' && workflow && config.messageWithWorkflow) {
    message = config.messageWithWorkflow(workflow)
  }
  return {
    stage,
    message,
    progress: config.progress,
    currentFile: config.currentFile || null,
    isActive: stage !== 'COMPLETE',
  }
}

export function useGenerationFlow(options: UseGenerationFlowOptions = {}) {
  const { onStageChange, onComplete } = options
  const [state, setState] = useState<GenerationFlowState>({
    stage: 'IDLE',
    message: '',
    progress: 0,
    currentFile: null,
    isActive: false,
  })
  const [stageIndex, setStageIndex] = useState(-1)

  const workflowRef = useRef<string | null>(null)
  const onCompleteRef = useRef(onComplete)
  const onStageChangeRef = useRef(onStageChange)

  // Keep refs updated
  useEffect(() => {
    onCompleteRef.current = onComplete
    onStageChangeRef.current = onStageChange
  }, [onComplete, onStageChange])

  // Effect to handle stage transitions
  useEffect(() => {
    if (stageIndex < 0) return // Not started

    const stage = STAGE_ORDER[stageIndex]
    if (!stage) return

    const config = STAGE_CONFIGS[stage]
    const newState = getStateForStage(stage, workflowRef.current)
    setState(newState)
    onStageChangeRef.current?.(stage)

    if (stage === 'COMPLETE') {
      onCompleteRef.current?.()
      return
    }

    // Schedule next stage
    if (config.duration > 0 && stageIndex < STAGE_ORDER.length - 1) {
      const timer = setTimeout(() => {
        setStageIndex((prev) => prev + 1)
      }, config.duration)
      return () => clearTimeout(timer)
    }
  }, [stageIndex])

  const start = useCallback((opts?: { mentionedWorkflow?: string }) => {
    workflowRef.current = opts?.mentionedWorkflow || null
    setStageIndex(0) // Start at THINKING
  }, [])

  const reset = useCallback(() => {
    workflowRef.current = null
    setStageIndex(-1)
    setState({
      stage: 'IDLE',
      message: '',
      progress: 0,
      currentFile: null,
      isActive: false,
    })
  }, [])

  const setFile = useCallback((filename: string | null) => {
    setState((prev) => ({
      ...prev,
      currentFile: filename,
    }))
  }, [])

  return {
    state,
    start,
    reset,
    setFile,
  }
}

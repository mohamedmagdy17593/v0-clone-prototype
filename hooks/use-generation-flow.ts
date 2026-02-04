'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type {
  GenerationFlowMode,
  GenerationFlowState,
  GenerationStage,
} from '@/types/generation'

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
    duration: 1200,
    progress: 8,
  },
  PLANNING: {
    message: 'Planning component structure...',
    duration: 1600,
    progress: 24,
  },
  GENERATING: {
    message: 'Writing code...',
    duration: 2800,
    progress: 56,
    currentFile: 'app/page.tsx',
  },
  BUILDING: {
    message: 'Building preview...',
    duration: 1800,
    progress: 82,
  },
  BUILD_FAILED: {
    message: 'Build failed. Reading error logs...',
    duration: 1400,
    progress: 70,
    currentFile: 'build.log',
  },
  RECOVERING: {
    message: 'Applying automatic fix and retrying...',
    duration: 1700,
    progress: 76,
    currentFile: 'next.config.ts',
  },
  INTERRUPTED: {
    message: 'Connection interrupted. Attempting to resume...',
    duration: 1300,
    progress: 48,
  },
  COMPLETE: {
    message: 'Complete!',
    duration: 0,
    progress: 100,
  },
}

const FLOW_SEQUENCES: Record<GenerationFlowMode, Array<Exclude<GenerationStage, 'IDLE'>>> = {
  happy_path: ['THINKING', 'PLANNING', 'GENERATING', 'BUILDING', 'COMPLETE'],
  build_retry: [
    'THINKING',
    'PLANNING',
    'GENERATING',
    'BUILDING',
    'BUILD_FAILED',
    'RECOVERING',
    'BUILDING',
    'COMPLETE',
  ],
  interrupt_resume: [
    'THINKING',
    'PLANNING',
    'GENERATING',
    'INTERRUPTED',
    'RECOVERING',
    'GENERATING',
    'BUILDING',
    'COMPLETE',
  ],
}

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
  const flowModeRef = useRef<GenerationFlowMode>('happy_path')
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

    const sequence = FLOW_SEQUENCES[flowModeRef.current]
    const stage = sequence[stageIndex]
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
    if (config.duration > 0 && stageIndex < sequence.length - 1) {
      const timer = setTimeout(() => {
        setStageIndex((prev) => prev + 1)
      }, config.duration)
      return () => clearTimeout(timer)
    }
  }, [stageIndex])

  const start = useCallback(
    (opts?: { mentionedWorkflow?: string; mode?: GenerationFlowMode }) => {
      workflowRef.current = opts?.mentionedWorkflow || null
      flowModeRef.current = opts?.mode || 'happy_path'
      setStageIndex(0) // Start at THINKING
    },
    []
  )

  const reset = useCallback(() => {
    workflowRef.current = null
    flowModeRef.current = 'happy_path'
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

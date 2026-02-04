export type GenerationStage = 'IDLE' | 'THINKING' | 'PLANNING' | 'GENERATING' | 'BUILDING' | 'COMPLETE'

export interface GenerationStageInfo {
  stage: Exclude<GenerationStage, 'IDLE'>
  message: string
  progress: number // 0-100
  currentFile?: string
}

export interface GenerationFlowState {
  stage: GenerationStage
  message: string
  progress: number
  currentFile: string | null
  isActive: boolean
}

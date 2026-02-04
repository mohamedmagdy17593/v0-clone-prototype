export interface WorkflowSchema {
  id: string
  name: string
  description: string
  inputs: {
    name: string
    type: string
    description: string
    required?: boolean
  }[]
  outputs: {
    name: string
    type: string
    description: string
  }[]
}

export type DemoActivityItem =
  | {
      id: string
      type: 'text'
      text: string
    }
  | {
      id: string
      type: 'file'
      action: 'add' | 'edit'
      path: string
      description: string
    }
  | {
      id: string
      type: 'done'
      text: string
    }

export interface DemoConfig {
  id: string
  title: string
  description: string
  mentions: string[]
  keywords: string[]
  workflows?: WorkflowSchema[]
  activityStream: DemoActivityItem[]
  codeContent: string
  chatTranscriptText: string
  previewComponent: React.ReactNode
}

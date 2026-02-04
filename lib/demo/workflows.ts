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

export const MOCK_WORKFLOWS: Record<string, WorkflowSchema> = {
  cv_reviewer: {
    id: 'cv_reviewer',
    name: 'CV Reviewer',
    description: 'Analyzes resumes against job descriptions and provides detailed feedback',
    inputs: [
      {
        name: 'resume',
        type: 'file',
        description: 'The resume/CV file to analyze (PDF, DOCX, or TXT)',
        required: true,
      },
      {
        name: 'job_description',
        type: 'string',
        description: 'The job description to match against',
        required: true,
      },
    ],
    outputs: [
      {
        name: 'score',
        type: 'number',
        description: 'Overall match score from 0-100',
      },
      {
        name: 'feedback',
        type: 'string',
        description: 'Detailed analysis of strengths and weaknesses',
      },
      {
        name: 'suggestions',
        type: 'string[]',
        description: 'Actionable suggestions to improve the resume',
      },
    ],
  },
}

export function getWorkflowById(id: string): WorkflowSchema | undefined {
  return MOCK_WORKFLOWS[id]
}

export function extractWorkflowMentions(text: string): string[] {
  const mentions = text.match(/@(\w+)/g)
  return mentions ? mentions.map((m) => m.slice(1)) : []
}

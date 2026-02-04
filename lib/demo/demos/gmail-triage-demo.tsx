import { GmailTriageDemo } from '@/components/demo/gmail-triage-demo'
import type { DemoConfig } from '@/lib/demo/types'

const activityStream: DemoConfig['activityStream'] = [
  {
    id: 'intro',
    type: 'text',
    text: "Perfect. I'll scaffold an inbox triage flow on top of @gmail_ai_labeler with connection state handling.",
  },
  {
    id: 'schema',
    type: 'text',
    text: 'Loaded schema. Creating controls for inbox, dry-run mode, and review queue output.',
  },
  {
    id: 'add-ui',
    type: 'file',
    action: 'add',
    path: 'components/demo/gmail-triage-demo.tsx',
    description: 'Create Gmail triage controls and status cards for labels + confidence.',
  },
  {
    id: 'interrupt',
    type: 'text',
    text: 'Stream interrupted while requesting Gmail labels (expired token). Attempting checkpoint resume.',
  },
  {
    id: 'edit-flow',
    type: 'file',
    action: 'edit',
    path: 'hooks/use-generation-flow.ts',
    description: 'Add interruption + recovery stages to demonstrate real-world resiliency.',
  },
  {
    id: 'done',
    type: 'done',
    text: 'Done. Preview now shows interruption recovery and completion after token refresh.',
  },
]

const codeContent = `'use client'

import { useState } from 'react'

export function GmailTriageDemo() {
  const [connected, setConnected] = useState(false)
  const [state, setState] = useState<'idle' | 'interrupted' | 'recovering' | 'done'>('idle')

  const run = async () => {
    if (!connected) return
    setState('interrupted')
    await new Promise((r) => setTimeout(r, 1100))
    setState('recovering')
    await new Promise((r) => setTimeout(r, 1300))
    setState('done')
  }

  return <button onClick={run}>Run triage</button>
}`

const chatTranscriptText = activityStream
  .map((item) => {
    if (item.type === 'text' || item.type === 'done') return item.text
    return `[${item.action.toUpperCase()}] ${item.path} - ${item.description}`
  })
  .join('\n')

export const gmailTriageDemo: DemoConfig = {
  id: 'gmail-triage',
  title: 'Gmail Auto Triage',
  description: 'Applies AI labels to inbound mail and routes uncertain emails to review.',
  mentions: ['gmail_ai_labeler'],
  keywords: ['gmail', 'inbox', 'support', 'labels', 'triage', 'email'],
  flowMode: 'interrupt_resume',
  workflows: [
    {
      id: 'gmail_ai_labeler',
      name: 'Gmail AI Labeler',
      description: 'Classifies incoming support email threads into labels and priority buckets.',
      inputs: [
        {
          name: 'inbox',
          type: 'string',
          description: 'Mailbox to monitor.',
          required: true,
        },
        {
          name: 'dry_run',
          type: 'boolean',
          description: 'If true, returns proposed labels without writing changes.',
          required: true,
        },
      ],
      outputs: [
        {
          name: 'labeled',
          type: 'number',
          description: 'Number of threads confidently auto-labeled.',
        },
        {
          name: 'needs_review',
          type: 'number',
          description: 'Threads sent to manual review queue.',
        },
      ],
    },
  ],
  activityStream,
  codeContent,
  chatTranscriptText,
  previewComponent: <GmailTriageDemo />,
}

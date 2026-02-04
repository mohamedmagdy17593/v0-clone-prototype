import { StarterTemplate } from '@/components/demo/starter-template'
import type { DemoConfig } from '@/lib/demo/types'

const activityStream: DemoConfig['activityStream'] = [
  {
    id: 'intro',
    type: 'text',
    text: 'Starting from a blank template. I will scaffold structure first, then layer components from your prompt.',
  },
  {
    id: 'add-page',
    type: 'file',
    action: 'add',
    path: 'app/page.tsx',
    description: 'Create a clean page shell as the starting canvas.',
  },
  {
    id: 'add-section',
    type: 'file',
    action: 'add',
    path: 'components/sections/hero.tsx',
    description: 'Add the first reusable section based on the request.',
  },
  {
    id: 'done',
    type: 'done',
    text: 'Blank template initialized. Ready for next refinements.',
  },
]

const chatTranscriptText = activityStream
  .map((item) => {
    if (item.type === 'text' || item.type === 'done') return item.text
    return `[${item.action.toUpperCase()}] ${item.path} - ${item.description}`
  })
  .join('\n')

const codeContent = `'use client'\n\nexport default function Page() {\n  return <main className="min-h-screen p-8">Blank canvas</main>\n}`

export const blankCanvasDemo: DemoConfig = {
  id: 'blank-canvas',
  title: 'Blank Canvas',
  description: 'Starts with a blank template and scaffolds base structure.',
  mentions: [],
  keywords: ['blank', 'from scratch', 'start from blank', 'starter'],
  flowMode: 'happy_path',
  activityStream,
  codeContent,
  chatTranscriptText,
  previewComponent: <StarterTemplate />,
}

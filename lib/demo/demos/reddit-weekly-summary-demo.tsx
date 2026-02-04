import { RedditWeeklySummaryDemo } from '@/components/demo/reddit-weekly-summary'
import type { DemoConfig } from '@/lib/demo/types'

const activityStream: DemoConfig['activityStream'] = [
  {
    id: 'intro',
    type: 'text',
    text:
      "Great use case. I'll create a Reddit-to-Slack insight flow with @reddit_weekly_summary and safe retry handling.",
  },
  {
    id: 'schema',
    type: 'text',
    text: 'Fetching workflow schema and generating input controls for subreddit, range, and Slack channel.',
  },
  {
    id: 'add-page',
    type: 'file',
    action: 'add',
    path: 'components/demo/reddit-weekly-summary.tsx',
    description: 'Create weekly summary form with async retry fallback when sync timeout occurs.',
  },
  {
    id: 'edit-builder',
    type: 'file',
    action: 'edit',
    path: 'components/builder/builder-layout.tsx',
    description: 'Map this prompt to the build-retry generation mode for unhappy-path preview.',
  },
  {
    id: 'timeout',
    type: 'text',
    text:
      'Build check: first sync run exceeded timeout (504). Switching workflow invocation to async polling mode and retrying.',
  },
  {
    id: 'done',
    type: 'done',
    text: 'Done. Preview now demonstrates timeout recovery and successful completion.',
  },
]

const codeContent = `'use client'

import { useState } from 'react'

export function RedditWeeklySummaryDemo() {
  const [state, setState] = useState<'idle' | 'running' | 'retrying' | 'done'>('idle')

  const run = async () => {
    setState('running')
    await new Promise((r) => setTimeout(r, 1200))
    setState('retrying')
    await new Promise((r) => setTimeout(r, 1400))
    setState('done')
  }

  return <button onClick={run}>Generate weekly summary</button>
}`

const chatTranscriptText = activityStream
  .map((item) => {
    if (item.type === 'text' || item.type === 'done') return item.text
    return `[${item.action.toUpperCase()}] ${item.path} - ${item.description}`
  })
  .join('\n')

export const redditWeeklySummaryDemo: DemoConfig = {
  id: 'reddit-weekly-summary',
  title: 'Reddit Weekly Summary',
  description: 'Summarizes subreddit activity and sends digest to Slack with retry fallback.',
  mentions: ['reddit_weekly_summary'],
  keywords: ['reddit', 'slack', 'community', 'summary', 'insights'],
  flowMode: 'build_retry',
  workflows: [
    {
      id: 'reddit_weekly_summary',
      name: 'Reddit Weekly Summary',
      description: 'Collect posts, summarize themes, and notify Slack.',
      inputs: [
        {
          name: 'subreddit',
          type: 'string',
          description: 'Subreddit name like r/nextjs.',
          required: true,
        },
        {
          name: 'time_range',
          type: 'enum',
          description: 'Time window (24h, 7d, 30d).',
          required: true,
        },
        {
          name: 'slack_channel',
          type: 'string',
          description: 'Slack channel for the summary output.',
          required: true,
        },
      ],
      outputs: [
        {
          name: 'summary',
          type: 'string',
          description: 'Natural-language summary of community themes.',
        },
        {
          name: 'top_topics',
          type: 'string[]',
          description: 'Most discussed topics for the selected period.',
        },
      ],
    },
  ],
  activityStream,
  codeContent,
  chatTranscriptText,
  previewComponent: <RedditWeeklySummaryDemo />,
}

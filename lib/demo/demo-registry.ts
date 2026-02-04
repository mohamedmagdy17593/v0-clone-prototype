/**
 * How to add a new demo:
 * 1) Create a single demo config file in `lib/demo/demos/` (copy `cv-review-demo.tsx`).
 * 2) Export one `DemoConfig` object with:
 *    - `id`, `mentions`, `keywords` for matching prompt -> demo
 *    - `activityStream`, `chatTranscriptText`, `codeContent` for chat/code simulation
 *    - `previewComponent` for rendered interactive preview
 * 3) Import that config here and append it to `DEMO_REGISTRY`.
 * 4) Optionally set `DEFAULT_DEMO_ID` to your preferred fallback demo id.
 */
import { cvReviewDemo } from '@/lib/demo/demos/cv-review-demo'
import { gmailTriageDemo } from '@/lib/demo/demos/gmail-triage-demo'
import { redditWeeklySummaryDemo } from '@/lib/demo/demos/reddit-weekly-summary-demo'
import type { DemoConfig } from '@/lib/demo/types'

export const DEMO_REGISTRY: DemoConfig[] = [
  cvReviewDemo,
  redditWeeklySummaryDemo,
  gmailTriageDemo,
]

export const DEFAULT_DEMO_ID = 'cv-review'

export function extractWorkflowMentions(text: string): string[] {
  const mentions = text.match(/@([a-zA-Z0-9_]+)/g)
  return mentions ? mentions.map((m) => m.slice(1)) : []
}

function scoreByKeywords(content: string, keywords: string[]) {
  let score = 0
  for (const keyword of keywords) {
    if (content.includes(keyword.toLowerCase())) {
      score += 1
    }
  }
  return score
}

export function getDemoById(id: string): DemoConfig | undefined {
  return DEMO_REGISTRY.find((demo) => demo.id === id)
}

export function pickDemoForPrompt(prompt: string): DemoConfig {
  const mentions = extractWorkflowMentions(prompt)

  if (mentions.length > 0) {
    const mentionMatchedDemo = DEMO_REGISTRY.find((demo) =>
      mentions.some((mention) => demo.mentions.includes(mention))
    )
    if (mentionMatchedDemo) {
      return mentionMatchedDemo
    }
  }

  const normalized = prompt.toLowerCase()
  let bestDemo: DemoConfig | null = null
  let bestScore = 0

  for (const demo of DEMO_REGISTRY) {
    const score = scoreByKeywords(normalized, demo.keywords)
    if (score > bestScore) {
      bestScore = score
      bestDemo = demo
    }
  }

  return bestDemo ?? getDemoById(DEFAULT_DEMO_ID) ?? DEMO_REGISTRY[0]
}

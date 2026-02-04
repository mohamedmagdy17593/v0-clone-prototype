'use client'

import { useCallback, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock3, Loader2, RefreshCw, Send } from 'lucide-react'

interface WeeklySummaryResult {
  totalPosts: number
  sentiment: 'positive' | 'mixed' | 'negative'
  summary: string
  topTopics: string[]
}

const MOCK_RESULT: WeeklySummaryResult = {
  totalPosts: 128,
  sentiment: 'mixed',
  summary:
    'Users are actively discussing API cost control and rollout guardrails. Most friction comes from flaky retries and missing alerting around long-running jobs.',
  topTopics: ['workflow retries', 'cost controls', 'rate limits', 'deployment guardrails'],
}

type RunState = 'idle' | 'running' | 'retrying' | 'done'

export function RedditWeeklySummaryDemo() {
  const [subreddit, setSubreddit] = useState('r/nextjs')
  const [timeRange, setTimeRange] = useState('7d')
  const [slackChannel, setSlackChannel] = useState('#product-insights')
  const [state, setState] = useState<RunState>('idle')
  const [result, setResult] = useState<WeeklySummaryResult | null>(null)

  const handleRun = useCallback(async () => {
    if (!subreddit.trim() || !slackChannel.trim()) return

    setResult(null)
    setState('running')
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Simulated unhappy path: sync run times out, then retries in async mode.
    setState('retrying')
    await new Promise((resolve) => setTimeout(resolve, 1400))

    setResult(MOCK_RESULT)
    setState('done')
  }, [slackChannel, subreddit])

  return (
    <div className="h-full overflow-auto p-6">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            Weekly Reddit Insights
            <Badge variant="secondary">@reddit_weekly_summary</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pull top subreddit conversations and ship a summary to Slack.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subreddit">Subreddit</Label>
              <Input
                id="subreddit"
                value={subreddit}
                onChange={(event) => setSubreddit(event.target.value)}
                placeholder="r/nextjs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slack-channel">Slack Channel</Label>
              <Input
                id="slack-channel"
                value={slackChannel}
                onChange={(event) => setSlackChannel(event.target.value)}
                placeholder="#product-insights"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {state === 'retrying' && (
            <Alert>
              <Clock3 className="h-4 w-4" />
              <AlertTitle>Sync timeout detected</AlertTitle>
              <AlertDescription>
                Falling back to async execution with polling so the summary can still complete.
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleRun} disabled={state === 'running' || state === 'retrying'} className="w-full">
            {state === 'running' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running workflow...
              </>
            ) : state === 'retrying' ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Retrying asynchronously...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Generate weekly summary
              </>
            )}
          </Button>

          {result && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">Posts: {result.totalPosts}</Badge>
                <Badge variant="outline">Sentiment: {result.sentiment}</Badge>
                <Badge variant="outline">Range: {timeRange}</Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
              <div className="flex flex-wrap gap-2">
                {result.topTopics.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

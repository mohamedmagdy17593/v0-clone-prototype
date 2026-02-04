'use client'

import { useCallback, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AlertTriangle, CheckCircle2, Loader2, Mail } from 'lucide-react'

interface TriageResult {
  labeled: number
  needsReview: number
  confidence: number
}

const MOCK_RESULT: TriageResult = {
  labeled: 42,
  needsReview: 6,
  confidence: 91,
}

type RunState = 'idle' | 'interrupted' | 'recovering' | 'done'

export function GmailTriageDemo() {
  const [inbox, setInbox] = useState('support@company.com')
  const [dryRun, setDryRun] = useState(true)
  const [connected, setConnected] = useState(false)
  const [state, setState] = useState<RunState>('idle')
  const [result, setResult] = useState<TriageResult | null>(null)

  const handleRun = useCallback(async () => {
    if (!connected || !inbox.trim()) return

    setResult(null)
    setState('interrupted')
    await new Promise((resolve) => setTimeout(resolve, 1100))

    setState('recovering')
    await new Promise((resolve) => setTimeout(resolve, 1300))

    setResult(MOCK_RESULT)
    setState('done')
  }, [connected, inbox])

  return (
    <div className="h-full overflow-auto p-6">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            Gmail Auto-Triage
            <Badge variant="secondary">@gmail_ai_labeler</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Label incoming support emails and route low-confidence threads for review.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inbox">Inbox</Label>
            <Input
              id="inbox"
              value={inbox}
              onChange={(event) => setInbox(event.target.value)}
              placeholder="support@company.com"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Dry run mode</p>
              <p className="text-xs text-muted-foreground">Preview labels before writing to Gmail.</p>
            </div>
            <Switch checked={dryRun} onCheckedChange={setDryRun} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant={connected ? 'outline' : 'default'} onClick={() => setConnected((prev) => !prev)}>
              {connected ? 'Disconnect Gmail' : 'Connect Gmail'}
            </Button>
            <Button onClick={handleRun} disabled={!connected || state === 'recovering'}>
              {state === 'recovering' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resuming run...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Run triage
                </>
              )}
            </Button>
          </div>

          {!connected && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Action needed</AlertTitle>
              <AlertDescription>Connect Gmail before starting this workflow.</AlertDescription>
            </Alert>
          )}

          {state === 'interrupted' && connected && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Token expired mid-run</AlertTitle>
              <AlertDescription>Refreshing auth token and resuming from the latest checkpoint.</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Completed {dryRun ? 'in dry run' : 'with live labels'}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Labeled: {result.labeled}</Badge>
                <Badge variant="outline">Needs review: {result.needsReview}</Badge>
                <Badge variant="outline">Confidence: {result.confidence}%</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

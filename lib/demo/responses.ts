export const DEMO_PLAN_TEXT = `I'll create a CV review form that integrates with the @cv_reviewer workflow. Here's my plan:

**Component Structure:**
- File upload input for resume (PDF, DOCX, TXT)
- Textarea for job description
- Submit button with loading state
- Results display showing score, feedback, and suggestions

**Features:**
- Drag-and-drop file upload support
- Form validation
- Loading states during processing
- Clear results visualization with score badge`

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

export const DEMO_ACTIVITY_STREAM: DemoActivityItem[] = [
  {
    id: 'intro',
    type: 'text',
    text:
      "Got it. I'll build a CV review experience using @cv_reviewer.\nPlan: 1) scaffold form UI 2) wire fake workflow response 3) connect preview + generation flow.",
  },
  {
    id: 'start-work',
    type: 'text',
    text: 'Starting implementation now.',
  },
  {
    id: 'add-form',
    type: 'file',
    action: 'add',
    path: 'components/demo/cv-review-form.tsx',
    description:
      'Create interactive CV form with file upload, job description input, loading state, and results.',
  },
  {
    id: 'edit-layout',
    type: 'file',
    action: 'edit',
    path: 'components/builder/builder-layout.tsx',
    description:
      'Wire mocked generation flow, stage transitions, and chat/preview synchronization.',
  },
  {
    id: 'edit-preview',
    type: 'file',
    action: 'edit',
    path: 'components/builder/preview-panel.tsx',
    description: 'Render generated component and keep code output available in the code panel.',
  },
  {
    id: 'build-preview',
    type: 'text',
    text: 'Building preview and validating interaction states...',
  },
  {
    id: 'done',
    type: 'done',
    text: 'Done. Your CV review demo is ready in preview.',
  },
]

export const DEMO_CODE_CONTENT = `'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface ReviewResult {
  score: number
  feedback: string
  suggestions: string[]
}

export function CVReviewForm() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) setFile(selectedFile)
  }, [])

  const handleSubmit = async () => {
    if (!file || !jobDescription.trim()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500))

    setResult({
      score: 78,
      feedback: "Strong technical background with relevant experience...",
      suggestions: [
        "Add more quantifiable achievements",
        "Include relevant keywords from job description",
        "Expand on leadership experience"
      ]
    })
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>CV Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <Label>Resume</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>{file.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload resume
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <Label>Job Description</Label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!file || !jobDescription.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Review CV'
          )}
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{result.score}</span>
              <span className="text-muted-foreground">/100 Match Score</span>
            </div>
            <p className="text-sm">{result.feedback}</p>
            <div className="space-y-2">
              <span className="text-sm font-medium">Suggestions:</span>
              <ul className="list-disc list-inside text-sm space-y-1">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}`

export const DEMO_COMPLETION_MESSAGE = `I've created a CV review form component that integrates with the @cv_reviewer workflow. The form includes:

- **File upload** for resume documents (PDF, DOCX, TXT)
- **Job description textarea** for matching against
- **Loading state** during analysis
- **Results display** showing match score, feedback, and actionable suggestions

You can try it out in the preview panel!`

export const DEMO_CHAT_TRANSCRIPT_TEXT = [
  ...DEMO_ACTIVITY_STREAM.map((item) => {
    if (item.type === 'text' || item.type === 'done') return item.text
    return `[${item.action.toUpperCase()}] ${item.path} - ${item.description}`
  }),
].join('\n')

export const MOCK_WORKFLOW_RESPONSE = {
  score: 78,
  feedback:
    'Strong technical background with relevant experience in React and TypeScript. Good progression of responsibilities. Could benefit from more specific metrics and achievements to quantify impact.',
  suggestions: [
    'Add more quantifiable achievements (e.g., "Improved performance by 40%")',
    'Include relevant keywords from the job description',
    'Expand on leadership and mentoring experience',
    'Add specific technologies mentioned in the job posting',
    'Consider restructuring to highlight most relevant experience first',
  ],
}

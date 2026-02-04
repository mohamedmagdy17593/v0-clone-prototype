'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ReviewResult {
  score: number
  feedback: string
  suggestions: string[]
}

const DEFAULT_MOCK_RESPONSE: ReviewResult = {
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

interface CVReviewFormProps {
  mockResponse?: ReviewResult
}

export function CVReviewForm({ mockResponse = DEFAULT_MOCK_RESPONSE }: CVReviewFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) setFile(selectedFile)
    },
    []
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ]
      if (
        validTypes.includes(droppedFile.type) ||
        droppedFile.name.endsWith('.txt')
      ) {
        setFile(droppedFile)
      }
    }
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!file || !jobDescription.trim()) return

    setIsLoading(true)
    // Simulate API call with 2.5s delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setResult(mockResponse)
    setIsLoading(false)
  }, [file, jobDescription, mockResponse])

  const handleReset = () => {
    setFile(null)
    setJobDescription('')
    setResult(null)
  }

  return (
    <div className="w-full h-full p-6 flex items-start justify-center overflow-auto">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">CV Review</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your resume and job description to get AI-powered feedback
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume-upload">Resume</Label>
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
                isDragOver && 'border-primary bg-primary/5',
                file && 'border-green-500/50 bg-green-500/5'
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                {file ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click or drag to upload resume (PDF, DOCX, TXT)
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={5}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!file || !jobDescription.trim() || isLoading}
            className="w-full"
            size="lg"
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
              {/* Score */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'text-3xl font-bold',
                    result.score >= 80
                      ? 'text-green-600'
                      : result.score >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  )}
                >
                  {result.score}
                </div>
                <div className="text-muted-foreground">
                  <span className="text-sm">/100</span>
                  <p className="text-xs">Match Score</p>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-1">
                <Label className="text-sm font-medium">Feedback</Label>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.feedback}
                </p>
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Suggestions</Label>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i} className="leading-relaxed">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full"
              >
                Review Another CV
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

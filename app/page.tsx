"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/home/header"
import { TemplateCard } from "@/components/home/template-card"
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
} from "@/components/ai-elements/prompt-input"
import {
  BlankPreview,
  WorkflowFormPreview,
  UploadProcessPreview,
  MultiStepPreview,
  ResultsViewPreview,
  ComparisonPreview,
} from "@/components/home/template-previews"

// Mock data - in a real app this would come from an API
const mockUser = {
  name: "Mohamed",
  email: "mo@codewords.com",
  initials: "MO",
}

const templates = [
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch",
    preview: <BlankPreview />,
  },
  {
    id: "workflow-form",
    name: "Form",
    description: "Input → workflow → results",
    preview: <WorkflowFormPreview />,
  },
  {
    id: "upload-process",
    name: "Upload",
    description: "File upload → processing",
    preview: <UploadProcessPreview />,
  },
  {
    id: "multi-step",
    name: "Multi-Step",
    description: "Wizard with chained workflows",
    preview: <MultiStepPreview />,
  },
  {
    id: "results-view",
    name: "Results",
    description: "Display workflow outputs",
    preview: <ResultsViewPreview />,
  },
  {
    id: "comparison",
    name: "Compare",
    description: "Side-by-side workflow runs",
    preview: <ComparisonPreview />,
  },
]

export default function HomePage() {
  const router = useRouter()
  const [input, setInput] = useState("")

  const handleSubmit = (message: { text: string }) => {
    if (message.text.trim()) {
      router.push(`/create?prompt=${encodeURIComponent(message.text.trim())}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header user={mockUser} />

      <main className="flex-1 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl">
          {/* Hero Section */}
          <section className="mb-20">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                What do you want to{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  create
                </span>
                ?
              </h1>
              <p className="text-base text-muted-foreground">
                Describe your interface — connect it to your workflows
              </p>
            </div>

            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                placeholder="A form that reviews CVs using @cv_reviewer and displays match scores..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-24 px-4 py-3 text-lg"
              />
              <PromptInputFooter className="px-3 pb-3">
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                </PromptInputTools>
                <PromptInputSubmit disabled={!input.trim()} />
              </PromptInputFooter>
            </PromptInput>
          </section>

          {/* Templates */}
          <section>
            <h2 className="mb-6 text-sm font-medium text-muted-foreground">
              Or pick a starting point
            </h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  {...template}
                  href={`/create?template=${template.id}`}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

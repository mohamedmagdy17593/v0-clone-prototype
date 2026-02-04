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
  LandingPreview,
  DashboardPreview,
  FormPreview,
  ListPreview,
  CardsPreview,
  BlankPreview,
} from "@/components/home/template-previews"

// Mock data - in a real app this would come from an API
const mockUser = {
  name: "Mohamed",
  email: "mo@codewords.com",
  initials: "MO",
}

const templates = [
  {
    id: "landing",
    name: "Landing",
    description: "Hero, features, and CTA sections",
    preview: <LandingPreview />,
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Charts, KPIs, and data tables",
    preview: <DashboardPreview />,
  },
  {
    id: "form",
    name: "Form",
    description: "Input fields with validation",
    preview: <FormPreview />,
  },
  {
    id: "list",
    name: "List",
    description: "Filterable list with actions",
    preview: <ListPreview />,
  },
  {
    id: "cards",
    name: "Cards",
    description: "Grid of content cards",
    preview: <CardsPreview />,
  },
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch",
    preview: <BlankPreview />,
  },
]

export default function HomePage() {
  const router = useRouter()
  const [input, setInput] = useState("")

  const handleTemplateSelect = (templateId: string) => {
    router.push(`/create?template=${templateId}`)
  }

  const handleSubmit = (message: { text: string }) => {
    if (message.text.trim()) {
      router.push(`/create?prompt=${encodeURIComponent(message.text.trim())}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header user={mockUser} />

      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          {/* Hero Section */}
          <section className="mb-16">
            <div className="mb-8 text-center">
              <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                What do you want to{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  build
                </span>
                ?
              </h1>
              <p className="text-sm text-muted-foreground">
                Describe your UI and watch it come to life
              </p>
            </div>

            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                placeholder="A dashboard with user analytics, a chart showing weekly activity, and a table of recent signups..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-24"
              />
              <PromptInputFooter>
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
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">
              Or start from a template
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  {...template}
                  onClick={() => handleTemplateSelect(template.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

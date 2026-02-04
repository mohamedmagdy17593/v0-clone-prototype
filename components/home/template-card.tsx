"use client"

import { cn } from "@/lib/utils"

type TemplateCardProps = {
  id: string
  name: string
  description: string
  preview: React.ReactNode
  onClick?: () => void
}

export function TemplateCard({
  name,
  description,
  preview,
  onClick,
}: TemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-2 rounded-lg border border-border/50 bg-card p-3 text-left transition-all",
        "hover:border-border hover:bg-muted/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md border border-border/30 bg-muted/30">
        <div className="flex h-full w-full items-center justify-center p-3 text-muted-foreground/60">
          {preview}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted-foreground line-clamp-1">
          {description}
        </span>
      </div>
    </button>
  )
}

import Link from "next/link"
import { cn } from "@/lib/utils"

type TemplateCardProps = {
  id: string
  name: string
  description: string
  preview: React.ReactNode
  href: string
}

export function TemplateCard({
  name,
  description,
  preview,
  href,
}: TemplateCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all",
        "hover:border-border hover:bg-muted/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/30 bg-muted/30">
        <div className="flex h-full w-full items-center justify-center p-4 text-muted-foreground/60">
          {preview}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted-foreground line-clamp-1">
          {description}
        </span>
      </div>
    </Link>
  )
}

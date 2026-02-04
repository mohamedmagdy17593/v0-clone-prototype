"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type ProjectStatus = "draft" | "live"

type ProjectCardProps = {
  id: string
  name: string
  status: ProjectStatus
  updatedAt: string
  preview?: React.ReactNode
}

export function ProjectCard({
  id,
  name,
  status,
  updatedAt,
  preview,
}: ProjectCardProps) {
  return (
    <Link
      href={`/create?project=${id}`}
      className={cn(
        "group flex flex-col gap-2 rounded-lg border border-border/50 bg-card p-3 transition-all",
        "hover:border-border hover:bg-muted/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md border border-border/30 bg-muted/30">
        <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
          {preview ?? (
            <svg
              className="size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium truncate">{name}</span>
        <div className="flex items-center gap-2">
          <Badge
            variant={status === "live" ? "default" : "outline"}
            className={cn(
              "h-4 px-1.5 text-[0.6rem]",
              status === "live" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            )}
          >
            {status === "live" ? "✓ Live" : "● Draft"}
          </Badge>
          <span className="text-xs text-muted-foreground">{updatedAt}</span>
        </div>
      </div>
    </Link>
  )
}

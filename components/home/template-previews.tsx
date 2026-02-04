// ASCII-style template preview components for CodeWords workflow templates

export function BlankPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[8px]">
      <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-current opacity-40">
        <span className="text-sm opacity-60">+</span>
      </div>
      <span className="opacity-40">Empty</span>
    </div>
  )
}

export function WorkflowFormPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-2 text-[8px]">
      {/* Form inputs */}
      <div className="flex flex-col gap-1">
        <div className="h-2.5 w-full rounded border border-current opacity-30" />
        <div className="h-4 w-full rounded border border-current opacity-30" />
      </div>
      {/* Submit button with workflow indicator */}
      <div className="flex items-center gap-1">
        <div className="h-2.5 flex-1 rounded bg-current opacity-40" />
        <div className="size-2.5 rounded bg-primary/60" />
      </div>
      {/* Result area */}
      <div className="mt-auto flex flex-col gap-0.5 rounded bg-current opacity-15 p-1">
        <div className="h-0.5 w-8 rounded-full bg-current opacity-50" />
        <div className="h-0.5 w-12 rounded-full bg-current opacity-30" />
      </div>
    </div>
  )
}

export function UploadProcessPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-2 text-[8px]">
      {/* Upload zone */}
      <div className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-current opacity-30 p-2">
        <div className="mb-1 text-[10px] opacity-50">↑</div>
        <div className="h-0.5 w-8 rounded-full bg-current opacity-40" />
      </div>
      {/* Processing indicator */}
      <div className="flex items-center gap-1 rounded bg-current opacity-15 p-1">
        <div className="size-2 rounded-full border border-current opacity-50" />
        <div className="h-0.5 flex-1 rounded-full bg-current opacity-40" />
      </div>
    </div>
  )
}

export function MultiStepPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-2 text-[8px]">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-1">
        <div className="size-2 rounded-full bg-primary opacity-80" />
        <div className="h-0.5 w-3 rounded-full bg-current opacity-30" />
        <div className="size-2 rounded-full border border-current opacity-40" />
        <div className="h-0.5 w-3 rounded-full bg-current opacity-30" />
        <div className="size-2 rounded-full border border-current opacity-40" />
      </div>
      {/* Step content */}
      <div className="flex flex-1 flex-col gap-1 rounded bg-current opacity-15 p-1.5">
        <div className="h-0.5 w-10 rounded-full bg-current opacity-50" />
        <div className="h-2.5 w-full rounded border border-current opacity-30" />
        <div className="h-2.5 w-full rounded border border-current opacity-30" />
      </div>
      {/* Navigation */}
      <div className="flex justify-between">
        <div className="h-2 w-6 rounded bg-current opacity-20" />
        <div className="h-2 w-6 rounded bg-current opacity-40" />
      </div>
    </div>
  )
}

export function ResultsViewPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-1.5 text-[8px]">
      {/* Score/metric */}
      <div className="flex items-center gap-1.5 rounded bg-current opacity-15 p-1.5">
        <div className="flex size-5 items-center justify-center rounded-full bg-primary/50">
          <span className="text-[6px] font-bold">92</span>
        </div>
        <div className="flex-1">
          <div className="h-0.5 w-8 rounded-full bg-current opacity-60" />
          <div className="mt-0.5 h-0.5 w-12 rounded-full bg-current opacity-30" />
        </div>
      </div>
      {/* Details list */}
      <div className="flex flex-1 flex-col gap-0.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1 rounded bg-current opacity-10 p-1">
            <div className="size-1.5 rounded-full bg-primary/60" />
            <div className="h-0.5 flex-1 rounded-full bg-current opacity-40" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ComparisonPreview() {
  return (
    <div className="flex h-full w-full gap-1 p-1.5 text-[8px]">
      {/* Item A */}
      <div className="flex flex-1 flex-col gap-1 rounded bg-current opacity-15 p-1">
        <div className="flex items-center justify-between">
          <div className="h-0.5 w-4 rounded-full bg-current opacity-60" />
          <div className="text-[6px] font-bold text-primary">85</div>
        </div>
        <div className="h-0.5 w-full rounded-full bg-current opacity-30" />
        <div className="h-0.5 w-8 rounded-full bg-current opacity-30" />
      </div>
      {/* Item B */}
      <div className="flex flex-1 flex-col gap-1 rounded bg-current opacity-15 p-1">
        <div className="flex items-center justify-between">
          <div className="h-0.5 w-4 rounded-full bg-current opacity-60" />
          <div className="text-[6px] font-bold text-primary">72</div>
        </div>
        <div className="h-0.5 w-full rounded-full bg-current opacity-30" />
        <div className="h-0.5 w-6 rounded-full bg-current opacity-30" />
      </div>
    </div>
  )
}

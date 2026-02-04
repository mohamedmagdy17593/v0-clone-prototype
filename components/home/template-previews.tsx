// ASCII-style template preview components

export function LandingPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 text-[8px] leading-tight">
      <div className="flex flex-col items-center gap-1 rounded bg-muted/50 p-2">
        <div className="h-1 w-12 rounded-full bg-current opacity-60" />
        <div className="h-0.5 w-16 rounded-full bg-current opacity-40" />
        <div className="mt-1 h-3 w-8 rounded bg-current opacity-50" />
      </div>
      <div className="flex justify-center gap-2 px-2">
        <div className="h-6 w-6 rounded bg-current opacity-30" />
        <div className="h-6 w-6 rounded bg-current opacity-30" />
        <div className="h-6 w-6 rounded bg-current opacity-30" />
      </div>
    </div>
  )
}

export function DashboardPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-1 text-[8px]">
      <div className="flex gap-1">
        <div className="flex flex-1 flex-col rounded bg-current opacity-20 p-1">
          <span className="text-[6px] font-bold opacity-80">123</span>
          <span className="text-[5px] opacity-50">↑ 5%</span>
        </div>
        <div className="flex flex-1 flex-col rounded bg-current opacity-20 p-1">
          <span className="text-[6px] font-bold opacity-80">89%</span>
          <span className="text-[5px] opacity-50">↓ 2%</span>
        </div>
      </div>
      <div className="flex flex-1 gap-1">
        <div className="flex flex-1 items-end gap-0.5 rounded bg-current opacity-15 p-1">
          <div className="h-3 w-1.5 rounded-t bg-current opacity-60" />
          <div className="h-5 w-1.5 rounded-t bg-current opacity-60" />
          <div className="h-2 w-1.5 rounded-t bg-current opacity-60" />
          <div className="h-4 w-1.5 rounded-t bg-current opacity-60" />
        </div>
        <div className="flex w-8 flex-col gap-0.5 rounded bg-current opacity-15 p-1">
          <div className="h-1 w-full rounded-full bg-current opacity-40" />
          <div className="h-1 w-full rounded-full bg-current opacity-40" />
          <div className="h-1 w-full rounded-full bg-current opacity-40" />
        </div>
      </div>
    </div>
  )
}

export function FormPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-2 text-[8px]">
      <div className="flex flex-col gap-0.5">
        <div className="h-0.5 w-6 rounded-full bg-current opacity-50" />
        <div className="h-3 w-full rounded border border-current opacity-30" />
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="h-0.5 w-8 rounded-full bg-current opacity-50" />
        <div className="h-3 w-full rounded border border-current opacity-30" />
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="h-0.5 w-10 rounded-full bg-current opacity-50" />
        <div className="h-5 w-full rounded border border-current opacity-30" />
      </div>
      <div className="mt-auto h-3 w-full rounded bg-current opacity-40" />
    </div>
  )
}

export function ListPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-1 p-1.5 text-[8px]">
      <div className="h-2.5 w-full rounded border border-current opacity-30" />
      <div className="flex flex-col gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-1 rounded bg-current opacity-15 p-1"
          >
            <div className="size-2 rounded border border-current opacity-50" />
            <div className="flex-1">
              <div className="h-0.5 w-8 rounded-full bg-current opacity-60" />
              <div className="mt-0.5 h-0.5 w-12 rounded-full bg-current opacity-30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardsPreview() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-1 p-1.5 text-[8px]">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col rounded bg-current opacity-15 p-1">
          <div className="aspect-video w-full rounded bg-current opacity-30" />
          <div className="mt-1 h-0.5 w-6 rounded-full bg-current opacity-60" />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-current opacity-30" />
        </div>
      ))}
    </div>
  )
}

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

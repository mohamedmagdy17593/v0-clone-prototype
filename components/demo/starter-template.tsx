"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StarterTemplate() {
  return (
    <div className="h-full overflow-auto bg-background p-6">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">New App Canvas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Start from a blank starter and describe what you want to build.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md border border-dashed border-border p-3">
                <p className="text-xs text-muted-foreground">Header</p>
                <div className="mt-2 h-2.5 w-28 rounded bg-muted" />
              </div>
              <div className="rounded-md border border-dashed border-border p-3">
                <p className="text-xs text-muted-foreground">Primary Action</p>
                <div className="mt-2 h-8 w-24 rounded bg-muted" />
              </div>
            </div>
            <div className="rounded-md border border-dashed border-border p-3">
              <p className="text-xs text-muted-foreground">Content Area</p>
              <div className="mt-3 space-y-2">
                <div className="h-2.5 w-full rounded bg-muted" />
                <div className="h-2.5 w-4/5 rounded bg-muted" />
                <div className="h-2.5 w-3/5 rounded bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { BuilderLayout } from "@/components/builder/builder-layout";
import { useSearchParams } from "next/navigation";

export default function CreatePageContent() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt") || undefined;
  const template = searchParams.get("template") || undefined;

  return (
    <BuilderLayout
      key={`${template ?? ""}::${prompt ?? ""}`}
      initialPrompt={prompt}
      template={template}
    />
  );
}

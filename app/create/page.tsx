"use client";

import dynamic from "next/dynamic";

const CreatePageContent = dynamic(
  () => import("@/components/builder/create-page-content"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">Loading...</div>
    ),
  }
);

export default function CreatePage() {
  return (
    <div className="h-screen w-full">
      <CreatePageContent />
    </div>
  );
}

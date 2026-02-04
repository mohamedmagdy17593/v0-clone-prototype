"use client";

import {
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ai-elements/file-tree";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import Editor from "@monaco-editor/react";
import { FileCode2Icon, FolderTreeIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

type ProjectNode = ProjectFolder | ProjectFile;

interface ProjectFolder {
  type: "folder";
  path: string;
  name: string;
  children: ProjectNode[];
}

interface ProjectFile {
  type: "file";
  path: string;
  name: string;
  language: string;
  content: string;
}

const CV_FORM_PATH = "components/demo/cv-review-form.tsx";
const DEFAULT_SELECTED_PATH = "app/page.tsx";
const DEFAULT_EXPANDED = new Set(["app", "components", "components/demo", "lib"]);

const CV_FORM_FALLBACK_CONTENT = `'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export function CVReviewForm() {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!jobDescription.trim()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>CV Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste job description..."
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          rows={5}
        />
        <Button disabled={!jobDescription.trim() || isLoading} onClick={handleSubmit}>
          {isLoading ? 'Analyzing...' : 'Review CV'}
        </Button>
      </CardContent>
    </Card>
  );
}
`;

function createProjectTree(cvFormContent: string): ProjectNode[] {
  return [
    {
      type: "folder",
      path: "app",
      name: "app",
      children: [
        {
          type: "file",
          path: "app/layout.tsx",
          name: "layout.tsx",
          language: "typescript",
          content: `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Reviewer",
  description: "A fake CV review workspace generated from prompt.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
        },
        {
          type: "file",
          path: "app/page.tsx",
          name: "page.tsx",
          language: "typescript",
          content: `import { CVReviewForm } from "@/components/demo/cv-review-form";

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-6">
      <CVReviewForm />
    </main>
  );
}
`,
        },
      ],
    },
    {
      type: "folder",
      path: "components",
      name: "components",
      children: [
        {
          type: "folder",
          path: "components/demo",
          name: "demo",
          children: [
            {
              type: "file",
              path: CV_FORM_PATH,
              name: "cv-review-form.tsx",
              language: "typescript",
              content: cvFormContent,
            },
          ],
        },
      ],
    },
    {
      type: "folder",
      path: "lib",
      name: "lib",
      children: [
        {
          type: "file",
          path: "lib/utils.ts",
          name: "utils.ts",
          language: "typescript",
          content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
        },
      ],
    },
    {
      type: "file",
      path: "README.md",
      name: "README.md",
      language: "markdown",
      content: `# CV Reviewer Prototype

This is a fake project tree rendered in the code editor panel.

- No backend is connected
- File content is in-memory only
- Designed to mirror the generated demo workflow
`,
    },
    {
      type: "file",
      path: "package.json",
      name: "package.json",
      language: "json",
      content: `{
  "name": "cv-reviewer-prototype",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}
`,
    },
  ];
}

function flattenFiles(nodes: ProjectNode[], target: Record<string, ProjectFile>) {
  for (const node of nodes) {
    if (node.type === "file") {
      target[node.path] = node;
      continue;
    }
    flattenFiles(node.children, target);
  }
}

function renderTree(nodes: ProjectNode[]) {
  return nodes.map((node) => {
    if (node.type === "file") {
      return (
        <FileTreeFile key={node.path} name={node.name} path={node.path}>
          <span className="size-4" />
          <FileCode2Icon className="size-4 text-muted-foreground" />
          <span className="truncate">{node.name}</span>
        </FileTreeFile>
      );
    }

    return (
      <FileTreeFolder key={node.path} name={node.name} path={node.path}>
        {renderTree(node.children)}
      </FileTreeFolder>
    );
  });
}

function defineMonacoThemes(monaco: {
  editor: {
    defineTheme: (
      name: string,
      theme: {
        base: "vs" | "vs-dark";
        inherit: boolean;
        rules: Array<{ token: string; foreground?: string }>;
        colors: Record<string, string>;
      },
    ) => void;
  };
}) {
  monaco.editor.defineTheme("v0-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6B7280" },
      { token: "keyword", foreground: "0F766E" },
      { token: "string", foreground: "0C7C59" },
      { token: "number", foreground: "B54708" },
      { token: "type", foreground: "124DD6" },
    ],
    colors: {
      "editor.background": "#FCFCFD",
      "editor.foreground": "#16181D",
      "editor.lineHighlightBackground": "#F3F4F6",
      "editor.selectionBackground": "#DCEFFF",
      "editor.inactiveSelectionBackground": "#E7EAF0",
      "editorLineNumber.foreground": "#8A94A6",
      "editorLineNumber.activeForeground": "#3A4252",
      "editorGutter.background": "#FCFCFD",
    },
  });

  monaco.editor.defineTheme("v0-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "7C8598" },
      { token: "keyword", foreground: "4FD1C5" },
      { token: "string", foreground: "5DE28D" },
      { token: "number", foreground: "F9A94C" },
      { token: "type", foreground: "78A9FF" },
    ],
    colors: {
      "editor.background": "#181B21",
      "editor.foreground": "#E8ECF3",
      "editor.lineHighlightBackground": "#222834",
      "editor.selectionBackground": "#2B4268",
      "editor.inactiveSelectionBackground": "#2A3344",
      "editorLineNumber.foreground": "#6E778A",
      "editorLineNumber.activeForeground": "#D2D9E6",
      "editorGutter.background": "#181B21",
    },
  });
}

interface CodeEditorPaneProps {
  currentCode?: string;
}

export function CodeEditorPane({ currentCode = "" }: CodeEditorPaneProps) {
  const { resolvedTheme } = useTheme();
  const [showMobileFiles, setShowMobileFiles] = useState(true);
  const [expandedPaths, setExpandedPaths] = useState(DEFAULT_EXPANDED);
  const [selectedPath, setSelectedPath] = useState(DEFAULT_SELECTED_PATH);
  const editorMonacoRef = useRef<{
    editor: { setTheme: (theme: string) => void };
  } | null>(null);

  const projectNodes = createProjectTree(currentCode || CV_FORM_FALLBACK_CONTENT);
  const fileMap: Record<string, ProjectFile> = {};
  flattenFiles(projectNodes, fileMap);

  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  const activePath = fileMap[selectedPath] ? selectedPath : DEFAULT_SELECTED_PATH;
  const selectedFile = fileMap[activePath];
  const selectedValue =
    fileContents[activePath] ?? selectedFile?.content ?? "// No file selected";

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      setFileContents((prev) => ({
        ...prev,
        [activePath]: value ?? "",
      }));
    },
    [activePath],
  );

  const handleEditorMount = useCallback(
    (
      _editor: unknown,
      monaco: { editor: { setTheme: (theme: string) => void } },
    ) => {
      editorMonacoRef.current = monaco;
      monaco.editor.setTheme(resolvedTheme === "dark" ? "v0-dark" : "v0-light");
    },
    [resolvedTheme],
  );

  useEffect(() => {
    editorMonacoRef.current?.editor.setTheme(
      resolvedTheme === "dark" ? "v0-dark" : "v0-light",
    );
  }, [resolvedTheme]);

  return (
    <div className="min-h-0 flex-1">
      <div className="grid h-full min-h-0 grid-rows-[auto_1fr] md:hidden">
        <div
          className={cn(
            "border-b border-border bg-muted/20",
            !showMobileFiles && "hidden",
          )}
        >
          <div className="max-h-52 overflow-auto">
            <FileTree
              className="h-full rounded-none border-0 bg-transparent p-1 text-xs"
              defaultExpanded={DEFAULT_EXPANDED}
              expanded={expandedPaths}
              onExpandedChange={setExpandedPaths}
              onSelect={(path) => {
                if (fileMap[path]?.type === "file") {
                  setSelectedPath(path);
                  setShowMobileFiles(false);
                }
              }}
              selectedPath={activePath}
            >
              {renderTree(projectNodes)}
            </FileTree>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <CodeBlockHeader className="shrink-0 border-b border-border bg-transparent py-1.5">
            <CodeBlockTitle className="min-w-0">
              <Button
                className="mr-1 h-7 px-2 text-xs md:hidden"
                onClick={() => setShowMobileFiles((prev) => !prev)}
                size="sm"
                variant="ghost"
              >
                <FolderTreeIcon className="size-3.5" />
                Files
              </Button>
              <CodeBlockFilename className="truncate text-xs text-muted-foreground">
                {activePath}
              </CodeBlockFilename>
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton
                className="size-7 sm:size-6"
                code={selectedValue}
              />
            </CodeBlockActions>
          </CodeBlockHeader>

          <div className="min-h-0 flex-1">
            <Editor
              beforeMount={defineMonacoThemes}
              language={selectedFile?.language ?? "plaintext"}
              onChange={handleEditorChange}
              onMount={handleEditorMount}
              options={{
                automaticLayout: true,
                fontSize: 13,
                lineNumbersMinChars: 3,
                minimap: { enabled: false },
                padding: { top: 12 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                wordWrap:
                  selectedFile?.language === "markdown" ||
                  selectedFile?.language === "json"
                    ? "on"
                    : "off",
              }}
              path={activePath}
              theme={resolvedTheme === "dark" ? "v0-dark" : "v0-light"}
              value={selectedValue}
            />
          </div>
        </div>
      </div>

      <ResizablePanelGroup
        className="hidden h-full md:flex"
        orientation="horizontal"
      >
        <ResizablePanel defaultSize="25" minSize="20" maxSize="50">
          <div className="h-full border-r border-border bg-muted/20">
            <div className="h-full overflow-auto">
              <FileTree
                className="h-full rounded-none border-0 bg-transparent p-1 text-xs"
                defaultExpanded={DEFAULT_EXPANDED}
                expanded={expandedPaths}
                onExpandedChange={setExpandedPaths}
                onSelect={(path) => {
                  if (fileMap[path]?.type === "file") {
                    setSelectedPath(path);
                  }
                }}
                selectedPath={activePath}
              >
                {renderTree(projectNodes)}
              </FileTree>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-transparent" />

        <ResizablePanel className="!overflow-hidden">
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <CodeBlockHeader className="shrink-0 border-b border-border bg-transparent py-1.5">
              <CodeBlockTitle className="min-w-0">
                <CodeBlockFilename className="truncate text-xs text-muted-foreground">
                  {activePath}
                </CodeBlockFilename>
              </CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton
                  className="size-7 sm:size-6"
                  code={selectedValue}
                />
              </CodeBlockActions>
            </CodeBlockHeader>

            <div className="min-h-0 flex-1">
              <Editor
                beforeMount={defineMonacoThemes}
                language={selectedFile?.language ?? "plaintext"}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                options={{
                  automaticLayout: true,
                  fontSize: 13,
                  lineNumbersMinChars: 3,
                  minimap: { enabled: false },
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  wordWrap:
                    selectedFile?.language === "markdown" ||
                    selectedFile?.language === "json"
                      ? "on"
                      : "off",
                }}
                path={activePath}
                theme={resolvedTheme === "dark" ? "v0-dark" : "v0-light"}
                value={selectedValue}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

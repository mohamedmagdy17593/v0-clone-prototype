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

type MonacoThemeData = {
  base: "vs" | "vs-dark";
  inherit: boolean;
  rules: Array<{ token: string; foreground?: string }>;
  colors: Record<string, string>;
};

type MonacoAPI = {
  editor: {
    defineTheme: (name: string, theme: MonacoThemeData) => void;
    setTheme: (theme: string) => void;
  };
  languages: {
    typescript: {
      typescriptDefaults: {
        setDiagnosticsOptions: (options: {
          noSemanticValidation?: boolean;
          noSyntaxValidation?: boolean;
        }) => void;
      };
      javascriptDefaults: {
        setDiagnosticsOptions: (options: {
          noSemanticValidation?: boolean;
          noSyntaxValidation?: boolean;
        }) => void;
      };
    };
  };
};

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

function toHexColor(input: string, fallback: string) {
  if (typeof document === "undefined") return fallback;

  const probe = document.createElement("span");
  probe.style.color = input;
  probe.style.position = "fixed";
  probe.style.pointerEvents = "none";
  probe.style.opacity = "0";
  document.body.appendChild(probe);

  const normalized = getComputedStyle(probe).color;
  probe.remove();

  const rgbMatch = normalized.match(
    /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([\d.]+))?\)/,
  );
  if (!rgbMatch) return fallback;

  const [, r, g, b] = rgbMatch;
  const toHex = (value: string) =>
    Math.max(0, Math.min(255, Number(value)))
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function withAlpha(hexColor: string, alpha: number) {
  const normalized = hexColor.replace("#", "");
  if (normalized.length !== 6) return hexColor;
  const a = Math.max(0, Math.min(255, Math.round(alpha * 255)))
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
  return `#${normalized}${a}`;
}

function resolveThemeColor(
  cssVar: string,
  fallback: string,
  rootStyles: CSSStyleDeclaration | null,
) {
  const raw = rootStyles?.getPropertyValue(cssVar)?.trim();
  if (!raw) return fallback;
  return toHexColor(raw, fallback);
}

function defineMonacoTheme(monaco: MonacoAPI, isDark: boolean) {
  const rootStyles =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement)
      : null;

  const background = resolveThemeColor(
    "--background",
    isDark ? "#17171B" : "#FFFFFF",
    rootStyles,
  );
  const foreground = resolveThemeColor(
    "--foreground",
    isDark ? "#FAFAFA" : "#111827",
    rootStyles,
  );
  const mutedForeground = resolveThemeColor(
    "--muted-foreground",
    isDark ? "#A1A1AA" : "#6B7280",
    rootStyles,
  );
  const accent = resolveThemeColor(
    "--accent",
    isDark ? "#27272A" : "#F4F4F5",
    rootStyles,
  );
  const primary = resolveThemeColor(
    "--primary",
    isDark ? "#A3E635" : "#65A30D",
    rootStyles,
  );
  const chart1 = resolveThemeColor(
    "--chart-1",
    isDark ? "#4ADE80" : "#22C55E",
    rootStyles,
  );
  const chart2 = resolveThemeColor(
    "--chart-2",
    isDark ? "#22C55E" : "#16A34A",
    rootStyles,
  );
  const chart3 = resolveThemeColor(
    "--chart-3",
    isDark ? "#84CC16" : "#65A30D",
    rootStyles,
  );
  const chart4 = resolveThemeColor(
    "--chart-4",
    isDark ? "#A3E635" : "#84CC16",
    rootStyles,
  );

  monaco.editor.defineTheme("v0-app", {
    base: isDark ? "vs-dark" : "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: mutedForeground.replace("#", "") },
      { token: "keyword", foreground: primary.replace("#", "") },
      { token: "string", foreground: chart2.replace("#", "") },
      { token: "number", foreground: chart4.replace("#", "") },
      { token: "type", foreground: chart3.replace("#", "") },
      { token: "function", foreground: chart1.replace("#", "") },
    ],
    colors: {
      "editor.background": background,
      "editor.foreground": foreground,
      "editor.lineHighlightBackground": withAlpha(accent, isDark ? 0.5 : 0.85),
      "editor.selectionBackground": withAlpha(primary, isDark ? 0.3 : 0.25),
      "editor.inactiveSelectionBackground": withAlpha(
        mutedForeground,
        isDark ? 0.2 : 0.18,
      ),
      "editorLineNumber.foreground": mutedForeground,
      "editorLineNumber.activeForeground": foreground,
      "editorGutter.background": background,
    },
  });
}

function disableMonacoDiagnostics(monaco: MonacoAPI) {
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
  });
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
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
  const editorMonacoRef = useRef<MonacoAPI | null>(null);

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
    (_editor: unknown, monaco: MonacoAPI) => {
      editorMonacoRef.current = monaco;
      defineMonacoTheme(monaco, resolvedTheme === "dark");
      monaco.editor.setTheme("v0-app");
    },
    [resolvedTheme],
  );

  const handleBeforeMount = useCallback(
    (monaco: MonacoAPI) => {
      disableMonacoDiagnostics(monaco);
      defineMonacoTheme(monaco, resolvedTheme === "dark");
    },
    [resolvedTheme],
  );

  useEffect(() => {
    if (!editorMonacoRef.current) return;
    defineMonacoTheme(editorMonacoRef.current, resolvedTheme === "dark");
    editorMonacoRef.current.editor.setTheme("v0-app");
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
              beforeMount={handleBeforeMount}
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
              theme="v0-app"
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
                beforeMount={handleBeforeMount}
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
                theme="v0-app"
                value={selectedValue}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

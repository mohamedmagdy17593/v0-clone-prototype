"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface CodeBlockContextType {
  code: string;
}

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: "",
});

export const CodeBlockContainer = ({
  className,
  language,
  style,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { language: string }) => (
  <CodeBlockContext.Provider value={{ code: "" }}>
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-md border bg-background text-foreground",
        className,
      )}
      data-language={language}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 200px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  </CodeBlockContext.Provider>
);

export const CodeBlockHeader = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-between border-b bg-muted/80 px-3 py-2 text-muted-foreground text-xs",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const CodeBlockTitle = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>
    {children}
  </div>
);

export const CodeBlockFilename = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("font-mono", className)} {...props}>
    {children}
  </span>
);

export const CodeBlockActions = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("-my-1 -me-1 flex items-center gap-2", className)}
    {...props}
  >
    {children}
  </div>
);

const LINE_NUMBER_CLASSES = cn(
  "block",
  "before:content-[counter(line)]",
  "before:inline-block",
  "before:[counter-increment:line]",
  "before:w-8",
  "before:mr-4",
  "before:text-right",
  "before:text-muted-foreground/50",
  "before:font-mono",
  "before:select-none",
);

export const CodeBlockContent = ({
  code,
  language,
  showLineNumbers = false,
  className,
}: {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  className?: string;
}) => {
  const lines = code.split("\n");

  return (
    <CodeBlockContext.Provider value={{ code }}>
      <div className={cn("relative overflow-auto", className)}>
        <pre className="m-0 p-4 text-sm bg-muted/30">
          <code
            className={cn(
              "font-mono text-sm",
              showLineNumbers && "[counter-increment:line_0] [counter-reset:line]",
            )}
          >
            {lines.map((line, index) => (
              <span
                key={index}
                className={showLineNumbers ? LINE_NUMBER_CLASSES : "block"}
              >
                {line || "\n"}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </CodeBlockContext.Provider>
  );
};

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  code?: string;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton = ({
  code: codeProp,
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number>(0);
  const { code: contextCode } = useContext(CodeBlockContext);
  const code = codeProp ?? contextCode;

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      if (!isCopied) {
        await navigator.clipboard.writeText(code);
        setIsCopied(true);
        onCopy?.();
        timeoutRef.current = window.setTimeout(
          () => setIsCopied(false),
          timeout,
        );
      }
    } catch (error) {
      onError?.(error as Error);
    }
  };

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn("shrink-0", className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon size={14} />}
    </Button>
  );
};

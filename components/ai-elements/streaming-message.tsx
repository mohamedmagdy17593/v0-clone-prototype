'use client'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { memo, useMemo } from 'react'
import {
  CodeBlockContainer,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockFilename,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
} from './code-block'
import { MessageResponse } from './message'

interface StreamingMessageProps {
  content: string
  isStreaming?: boolean
  className?: string
}

interface ParsedSegment {
  type: 'text' | 'code'
  content: string
  language?: string
  filename?: string
}

function parseContent(content: string): ParsedSegment[] {
  const segments: ParsedSegment[] = []
  const codeBlockRegex = /```(\w+)?(?:\s+([^\n]+))?\n([\s\S]*?)```/g

  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index).trim()
      if (textContent) {
        segments.push({ type: 'text', content: textContent })
      }
    }

    // Add code block
    segments.push({
      type: 'code',
      language: match[1] || 'plaintext',
      filename: match[2]?.trim(),
      content: match[3] || '',
    })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const textContent = content.slice(lastIndex).trim()
    if (textContent) {
      segments.push({ type: 'text', content: textContent })
    }
  }

  return segments
}

function renderMarkdown(text: string): string {
  // Simple markdown rendering for bold and inline code
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/\n/g, '<br />')
}

export const StreamingMessage = memo(
  ({ content, isStreaming = false, className }: StreamingMessageProps) => {
    const segments = useMemo(() => parseContent(content), [content])

    return (
      <div className={cn('space-y-4', className)}>
        {segments.map((segment, index) => {
          if (segment.type === 'code') {
            return (
              <CodeBlockContainer
                key={index}
                language={segment.language || 'plaintext'}
              >
                <CodeBlockHeader>
                  <CodeBlockTitle>
                    {segment.filename && (
                      <CodeBlockFilename>{segment.filename}</CodeBlockFilename>
                    )}
                    {!segment.filename && segment.language && (
                      <span className="text-muted-foreground">
                        {segment.language}
                      </span>
                    )}
                  </CodeBlockTitle>
                  <CodeBlockActions>
                    <CodeBlockCopyButton code={segment.content} />
                  </CodeBlockActions>
                </CodeBlockHeader>
                <CodeBlockContent
                  code={segment.content}
                  language={segment.language || 'plaintext'}
                  showLineNumbers
                />
              </CodeBlockContainer>
            )
          }

          return (
            <MessageResponse key={index}>
              <div
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(segment.content),
                }}
              />
            </MessageResponse>
          )
        })}

        {/* Cursor */}
        {isStreaming && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block w-2 h-4 bg-foreground/60 ml-0.5"
          />
        )}
      </div>
    )
  }
)

StreamingMessage.displayName = 'StreamingMessage'

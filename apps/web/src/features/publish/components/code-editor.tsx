"use client"

import { useRef, useCallback } from "react"
import Editor from "react-simple-code-editor"
import Prism from "prismjs"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-css"
import "prismjs/components/prism-json"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-bash"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: "markdown" | "typescript" | "javascript" | "css" | "markup" | "json" | "yaml" | "bash"
  placeholder?: string
  padding?: number
}

export function CodeEditor({
  value,
  onChange,
  language = "markup",
  placeholder,
  padding = 16
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const selectionRef = useRef({ start: 0, end: 0 })

  const highlight = (code: string) => {
    const lang = Prism.languages[language] || Prism.languages.markup
    return Prism.highlight(code, lang, language)
  }

  // Track selection changes
  const handleSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement
    selectionRef.current = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    }
  }, [])

  // Track selection on key events too (for Ctrl+A)
  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement
    selectionRef.current = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    }
  }, [])

  // Handle paste explicitly to properly replace selected text
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    if (!pastedText) return

    const textarea = textareaRef.current
    if (!textarea) {
      // Fallback: replace entire content
      onChange(pastedText)
      return
    }

    // Use the tracked selection (more reliable than reading during paste)
    const { start, end } = selectionRef.current

    // Insert pasted text, replacing selected content
    const newValue = value.substring(0, start) + pastedText + value.substring(end)
    onChange(newValue)

    // Restore cursor position after paste
    const newCursorPos = start + pastedText.length
    setTimeout(() => {
      textarea.selectionStart = newCursorPos
      textarea.selectionEnd = newCursorPos
      selectionRef.current = { start: newCursorPos, end: newCursorPos }
    }, 0)
  }, [value, onChange])

  return (
    <div className="font-mono text-sm w-full max-w-full overflow-hidden">
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={highlight}
        padding={padding}
        className="min-h-full w-full max-w-full [&_pre]:!whitespace-pre-wrap [&_pre]:!break-all [&_pre]:!overflow-wrap-anywhere [&_pre]:!max-w-full [&_pre]:!w-full [&_pre]:!overflow-x-hidden [&_textarea]:!whitespace-pre-wrap [&_textarea]:!break-all [&_textarea]:!overflow-wrap-anywhere [&_textarea]:!max-w-full [&_textarea]:!w-full [&_textarea]:!overflow-x-hidden"
        textareaClassName="focus:outline-none !whitespace-pre-wrap !break-all !overflow-wrap-anywhere !max-w-full !w-full !overflow-x-hidden"
        placeholder={placeholder}
        textareaRef={(ref) => {
          textareaRef.current = ref as HTMLTextAreaElement | null
        }}
        onKeyUp={handleKeyUp}
        onSelect={handleSelect}
        onPaste={handlePaste}
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.6',
          maxWidth: '100%',
          overflowX: 'hidden',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          overflowWrap: 'anywhere',
        }}
      />
    </div>
  )
}

// Auto-detect language from file extension
export function getLanguageFromFilename(filename: string): CodeEditorProps["language"] {
  if (filename.endsWith('.md') || filename.endsWith('.mdx')) return 'markdown'
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript'
  if (filename.endsWith('.js') || filename.endsWith('.jsx') || filename.endsWith('.mjs')) return 'javascript'
  if (filename.endsWith('.css') || filename.endsWith('.scss') || filename.endsWith('.sass')) return 'css'
  if (filename.endsWith('.json')) return 'json'
  if (filename.endsWith('.yml') || filename.endsWith('.yaml')) return 'yaml'
  if (filename.endsWith('.sh') || filename.endsWith('.bash')) return 'bash'
  return 'markup'
}

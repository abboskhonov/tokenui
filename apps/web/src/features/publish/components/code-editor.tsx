"use client"

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
  const highlight = (code: string) => {
    const lang = Prism.languages[language] || Prism.languages.markup
    return Prism.highlight(code, lang, language)
  }

  return (
    <div className="font-mono text-sm">
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={highlight}
        padding={padding}
        className="min-h-full"
        textareaClassName="focus:outline-none"
        placeholder={placeholder}
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.6',
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

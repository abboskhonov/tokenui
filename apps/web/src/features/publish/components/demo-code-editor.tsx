"use client"

import { CodeEditor } from "./code-editor"

interface DemoCodeEditorProps {
  demoCode: string
  setDemoCode: (code: string) => void
}

export function DemoCodeEditor({
  demoCode,
  setDemoCode,
}: DemoCodeEditorProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-auto">
        <CodeEditor
          value={demoCode}
          onChange={setDemoCode}
          language="markup"
          placeholder={`<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-8">
  <!-- Your demo here -->
</body>
</html>`}
        />
      </div>
    </div>
  )
}

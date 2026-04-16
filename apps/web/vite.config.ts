import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  build: {
    // Split CSS into separate files for better caching
    cssCodeSplit: true,
    // Minify for production
    minify: true,
    // Let Vite handle default chunking (safer than manualChunks which can cause circular dep issues)
    rollupOptions: {
      output: {
        // Only split out large vendor libraries that are stable
        manualChunks: {
          'vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-router',
      '@tanstack/react-query',
    ],
  },
})

export default config

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
    // Optimize chunk splitting for better caching and smaller initial load
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk - React ecosystem (rarely changes)
          if (id.includes('node_modules')) {
            if (id.includes('react') || 
                id.includes('@tanstack/react-router') || 
                id.includes('@tanstack/react-query')) {
              return 'vendor'
            }
            // UI library chunk
            if (id.includes('@radix-ui') || 
                id.includes('@base-ui')) {
              return 'ui'
            }
            // Charts library (large, only needed on admin pages)
            if (id.includes('recharts')) {
              return 'charts'
            }
          }
        },
      },
    },
    // Split CSS into separate files for better caching
    cssCodeSplit: true,
    // Minify for production
    minify: true,
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

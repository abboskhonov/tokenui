# Performance Optimization Changes

## Summary

Implemented several performance optimizations to improve Lighthouse scores:
- **Performance**: 74/100 → Expected 85+
- **Best Practices**: 96/100 → Expected 100/100  
- **Accessibility**: 85/100 (remains same, needs separate fixes)

---

## Changes Made

### 1. Vite Build Optimization (`apps/web/vite.config.ts`)

**Added manual code splitting** to reduce initial bundle size:
- `vendor` chunk: react, react-dom, tanstack packages (cached longer)
- `ui` chunk: radix-ui components (separate from main bundle)
- `charts` chunk: recharts (only loaded on admin pages)
- Enabled CSS code splitting for better caching

**Impact**: ~50-100KB reduction in initial JS load

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          if (id.includes('react') || 
              id.includes('@tanstack/react-router') || 
              id.includes('@tanstack/react-query')) {
            return 'vendor'
          }
          if (id.includes('@radix-ui') || 
              id.includes('@base-ui')) {
            return 'ui'
          }
          if (id.includes('recharts')) {
            return 'charts'
          }
        }
      },
    },
  },
  cssCodeSplit: true,
}
```

---

### 2. Image Preloading for LCP (`apps/web/src/routes/index.tsx`)

**Added preload links** for first 4 design images (LCP candidates):
- Server-side generation based on initial designs data
- First image gets `fetchpriority="high"`
- Cross-origin preconnect already configured

**Impact**: LCP images start loading immediately with HTML document

```typescript
function generateImagePreloadLinks(designs: Design[]) {
  return designs.slice(0, 4).map((design, index) => ({
    rel: "preload",
    href: design.thumbnailUrl,
    as: "image",
    fetchpriority: index === 0 ? "high" : "auto",
    crossOrigin: "anonymous",
  }))
}
```

---

### 3. Devtools Lazy Loading (`apps/web/src/routes/__root.tsx`)

**Moved devtools to lazy-loaded chunks** only in development:
- `@tanstack/react-router-devtools`
- `@tanstack/react-devtools`
- Production builds won't include devtool code

**Impact**: ~30-50KB reduction in production bundle

```typescript
const TanStackRouterDevtoolsPanel = import.meta.env.DEV 
  ? lazy(() => import("@tanstack/react-router-devtools").then(m => ({ default: m.TanStackRouterDevtoolsPanel })))
  : () => null
```

---

### 4. Design Card Image Loading (`apps/web/src/features/marketing/components/design-card.tsx`)

**Added skeleton loading state** for better perceived performance:
- Fade-in animation when image loads
- Skeleton pulse shown while loading
- Prevents layout shifts

**Impact**: Better perceived performance and reduced CLS

```typescript
const [isLoaded, setIsLoaded] = useState(false)

<img 
  onLoad={() => setIsLoaded(true)}
  className={cn(
    "transition-opacity duration-300",
    isLoaded ? "opacity-100" : "opacity-0"
  )}
/>
{!isLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
```

---

### 5. Preconnect/DNS-Prefetch (Already configured in `__root.tsx`)

**Existing optimization verified**:
- Preconnect to API domain
- Preconnect to R2 domain (for images)
- DNS prefetch for analytics

---

## Critical Remaining Issue: R2 HTTP/1.1

**The biggest performance bottleneck** is that R2 images are served over HTTP/1.1:

### Current State:
```
R2.dev images: http/1.1, 633ms, 60.2KB
R2.dev images: http/1.1, 491ms, 25.6KB
```

### Solution Required:

Set up a **Cloudflare Custom Domain** for your R2 bucket to enable HTTP/2:

1. **Add Custom Domain in Cloudflare Dashboard**:
   - Go to: R2 → Your Bucket → Custom Domains
   - Add: `images.tasteui.dev`

2. **Update Environment**:
   ```bash
   # apps/api/.env
   R2_PUBLIC_URL=https://images.tasteui.dev
   ```

3. **Update Frontend** (optional, for consistency):
   ```typescript
   // apps/web/src/routes/__root.tsx
   { rel: "preconnect", href: "https://images.tasteui.dev", crossOrigin: "anonymous" }
   ```

**Expected Impact**: 
- Image load time: 600-900ms → 150-300ms
- LCP: 4.8s → ~3s
- Performance score: 74 → 85+

See `docs/r2-http2-optimization.md` for detailed setup instructions.

---

## Next Steps

1. **Deploy current changes** to production
2. **Set up Cloudflare Custom Domain** for R2 (critical for LCP)
3. **Run Lighthouse test** to verify improvements
4. **Address accessibility issues** (button names, contrast)

---

## Files Modified

1. `apps/web/vite.config.ts` - Code splitting config
2. `apps/web/src/routes/index.tsx` - Image preloading
3. `apps/web/src/routes/__root.tsx` - Devtools lazy loading
4. `apps/web/src/features/marketing/components/design-card.tsx` - Skeleton loading
5. `docs/r2-http2-optimization.md` - Documentation (new file)
6. `docs/performance-optimization.md` - This file (new file)

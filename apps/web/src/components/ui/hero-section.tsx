"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { motion } from "framer-motion";

export const blocksDesign = [
  {
    id: "minimal",
    name: "Minimal",
    url: "#",
    des: "Clean and minimal design system",
    imgSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "glass",
    name: "Glass",
    url: "#",
    des: "Frosted glass morphism aesthetics",
    imgSrc: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "neo",
    name: "Neo",
    url: "#",
    des: "Bold neo-brutalist components",
    imgSrc: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "cyber",
    name: "Cyber",
    url: "#",
    des: "Cyberpunk futuristic interface",
    imgSrc: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "organic",
    name: "Organic",
    url: "#",
    des: "Soft organic shapes and gradients",
    imgSrc: "https://images.unsplash.com/photo-1614851099518-94c8c7f1fa00?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "mono",
    name: "Mono",
    url: "#",
    des: "Monochromatic professional system",
    imgSrc: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1000&auto=format&fit=crop",
  },
];

function TimelineContent({
  children,
  animationNum = 0,
  className,
}: {
  children: React.ReactNode;
  animationNum?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        delay: animationNum * 0.15,
        duration: 0.5,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main ref={containerRef} className="relative">
      {/* Content */}
      <div className="pt-20 pb-10 max-w-7xl mx-auto min-h-screen px-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full mb-12 flex justify-between items-center"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center font-bold">
              T
            </div>
            <span className="font-semibold text-lg">TasteUI</span>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noreferrer"
              className="bg-muted border border-border w-10 rounded-md h-10 flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <svg viewBox="0 0 256 199" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z" fill="currentColor"/>
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="bg-muted border border-border w-10 rounded-md h-10 flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </motion.header>

        {/* Hero Content */}
        <article className="w-fit mx-auto max-w-3xl text-center space-y-6 mb-16">
          <TimelineContent animationNum={1}>
            <div className="flex w-fit mx-auto items-center gap-1 rounded-full bg-primary border border-primary/20 py-0.5 pl-0.5 pr-3 text-xs">
              <div className="rounded-full bg-background px-2 py-1 text-xs text-foreground font-medium">
                New
              </div>
              <p className="text-primary-foreground sm:text-base text-xs inline-block">
                ✨ Design Components for AI
              </p>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-primary-foreground">
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
              </svg>
            </div>
          </TimelineContent>
          
          <TimelineContent animationNum={2}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl leading-[100%] font-bold">
              Build with{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Beautiful
              </span>{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Designs
              </span>
            </h1>
          </TimelineContent>
          
          <TimelineContent animationNum={3}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
              Install stunning UI components with one command. Built for developers who ship fast.
            </p>
          </TimelineContent>
        </article>

        {/* Design Grid */}
        <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
          {blocksDesign.map((component, index) => (
            <TimelineContent key={component.id} animationNum={index + 4}>
              <a
                href={component.url}
                target="_blank"
                rel="noreferrer"
                className="transition-all aspect-video rounded-lg overflow-hidden relative block group"
              >
                <figure className="relative h-full w-full">
                  <img
                    src={component.imgSrc}
                    alt={component.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                </figure>
                <ProgressiveBlur
                  className="pointer-events-none absolute bottom-0 left-0 h-[40%] w-full"
                  blurIntensity={0.5}
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-medium text-white">
                    {component.name}
                  </h3>
                  <p className="text-xs text-white/70">{component.des}</p>
                </div>
              </a>
            </TimelineContent>
          ))}
        </div>
      </div>
    </main>
  );
}

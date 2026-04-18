import { HugeiconsIcon } from "@hugeicons/react"
import { Video01Icon } from "@hugeicons/core-free-icons"

interface VideoEmbedProps {
  videoUrl?: string
  title?: string
  className?: string
}

export function VideoEmbed({ 
  videoUrl, 
  title = "Video placeholder",
  className 
}: VideoEmbedProps) {
  if (videoUrl) {
    // Check if it's a direct video file (mp4, webm, etc.)
    const isDirectVideo = videoUrl.match(/\.(mp4|webm|mov|ogv)(\?.*)?$/i)
    
    if (isDirectVideo) {
      return (
        <div className={`relative aspect-video w-full rounded-lg overflow-hidden bg-muted border border-border ${className}`}>
          <video
            src={videoUrl}
            title={title}
            className="absolute inset-0 w-full h-full object-cover"
            controls
            playsInline
          />
        </div>
      )
    }
    
    // For embed URLs (YouTube, Vimeo, etc.)
    return (
      <div className={`relative aspect-video w-full rounded-lg overflow-hidden bg-muted border border-border ${className}`}>
        <iframe
          src={videoUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  // Placeholder state when no video URL is provided
  return (
    <div className={`relative aspect-video w-full rounded-lg overflow-hidden bg-muted border border-border border-dashed flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <HugeiconsIcon icon={Video01Icon} strokeWidth={1.5} className="h-10 w-10" />
        <span className="text-sm font-medium">Video coming soon</span>
      </div>
    </div>
  )
}

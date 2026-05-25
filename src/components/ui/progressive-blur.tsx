import React from 'react'
import { cn } from '@/lib/utils'

const GRADIENT_DIR = {
  left: 'to right',
  right: 'to left',
  top: 'to bottom',
  bottom: 'to top',
}

export function ProgressiveBlur({
  className,
  direction = 'left',
  blurIntensity = 8,
  style,
}: {
  className?: string
  direction?: 'left' | 'right' | 'top' | 'bottom'
  blurIntensity?: number
  style?: React.CSSProperties
}) {
  const gradientDir = GRADIENT_DIR[direction]
  const layers = 6

  return (
    <div className={cn('pointer-events-none absolute', className)} style={style}>
      {Array.from({ length: layers }).map((_, i) => {
        const blur = (blurIntensity * (i + 1)) / layers
        const start = (i / layers) * 100
        const end = ((i + 1) / layers) * 100
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: `linear-gradient(${gradientDir}, black ${start}%, transparent ${end}%)`,
              WebkitMaskImage: `linear-gradient(${gradientDir}, black ${start}%, transparent ${end}%)`,
            }}
          />
        )
      })}
    </div>
  )
}

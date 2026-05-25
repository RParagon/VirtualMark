import React, { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

type CSSWithVars = React.CSSProperties & { [key: string]: string | number | undefined }

let cssMounted = false
function mountCSS() {
  if (cssMounted || typeof document === 'undefined') return
  cssMounted = true
  const el = document.createElement('style')
  el.textContent = `
    [data-vm-glow]::before,
    [data-vm-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: -1px;
      border: 1px solid transparent;
      border-radius: inherit;
      background-attachment: fixed;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }
    [data-vm-glow]::before {
      background-image: radial-gradient(
        240px 240px at calc(var(--gx, -9999) * 1px) calc(var(--gy, -9999) * 1px),
        hsl(var(--hue, 0) 100% 55% / 0.9), transparent 100%
      );
      filter: brightness(2);
    }
    [data-vm-glow]::after {
      background-image: radial-gradient(
        140px 140px at calc(var(--gx, -9999) * 1px) calc(var(--gy, -9999) * 1px),
        hsl(0 100% 100% / 0.45), transparent 100%
      );
    }
  `
  document.head.appendChild(el)
}

let trackerMounted = false
function mountTracker() {
  if (trackerMounted || typeof document === 'undefined') return
  trackerMounted = true
  document.addEventListener('pointermove', (e: PointerEvent) => {
    document.querySelectorAll<HTMLElement>('[data-vm-glow]').forEach((el) => {
      el.style.setProperty('--gx', String(e.clientX))
      el.style.setProperty('--gy', String(e.clientY))
    })
  })
}

const HUE: Record<string, number> = { red: 0, blue: 220, green: 120, purple: 280, orange: 30 }

export function GlowCard({
  children,
  glowColor = 'red',
  className,
}: {
  children: React.ReactNode
  glowColor?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mountCSS()
    mountTracker()
  }, [])

  return (
    <div
      ref={ref}
      data-vm-glow
      className={cn('relative rounded-2xl border border-gray-800', className)}
      style={{ '--hue': HUE[glowColor] ?? 0 } as CSSWithVars}
    >
      {children}
    </div>
  )
}

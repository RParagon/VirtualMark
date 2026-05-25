import React, { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

type CSSWithVars = React.CSSProperties & { [key: string]: string | number | undefined }

let glowStyleMounted = false

function mountGlowCSS() {
  if (glowStyleMounted || typeof document === 'undefined') return
  glowStyleMounted = true
  const el = document.createElement('style')
  el.textContent = `
    .vm-glow-card { position: relative; --ptr-x: 50%; --ptr-y: 50%; }
    .vm-glow-card::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      background: radial-gradient(
        280px circle at var(--ptr-x) var(--ptr-y),
        var(--glow-clr, rgba(239,68,68,.45)),
        transparent 65%
      );
      z-index: 0;
      pointer-events: none;
    }
    .vm-glow-inner { position: relative; z-index: 1; height: 100%; }
  `
  document.head.appendChild(el)
}

const GLOW: Record<string, string> = {
  red: 'rgba(239,68,68,.45)',
  blue: 'rgba(99,102,241,.45)',
  green: 'rgba(34,197,94,.45)',
  purple: 'rgba(168,85,247,.45)',
}

export function GlowCard({
  children,
  glowColor = 'blue',
  className,
}: {
  children: React.ReactNode
  glowColor?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { mountGlowCSS() }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--ptr-x', `${e.clientX - r.left}px`)
      el.style.setProperty('--ptr-y', `${e.clientY - r.top}px`)
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  const color = GLOW[glowColor] ?? glowColor

  return (
    <div
      ref={ref}
      className={cn('vm-glow-card rounded-2xl border border-gray-800 overflow-hidden', className)}
      style={{ '--glow-clr': color } as CSSWithVars}
    >
      <div className="vm-glow-inner">{children}</div>
    </div>
  )
}

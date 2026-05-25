import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

let shinyMounted = false

function mountShinyCSS() {
  if (shinyMounted || typeof document === 'undefined') return
  shinyMounted = true
  const el = document.createElement('style')
  el.textContent = `
    @property --gradient-angle {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
    @property --gradient-angle-offset {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
    @property --gradient-percent {
      syntax: "<percentage>";
      initial-value: 5%;
      inherits: false;
    }
    @property --gradient-shine {
      syntax: "<color>";
      initial-value: white;
      inherits: false;
    }
    .vm-shiny-btn {
      --shiny-bg: #0d0a0a;
      --shiny-bg-subtle: #200505;
      --shiny-fg: #ffffff;
      --shiny-hi: #ef4444;
      --shiny-hi-soft: #fca5a5;
      --animation: gradient-angle linear infinite;
      --duration: 3s;
      --shadow-size: 2px;
      --easing: 800ms cubic-bezier(0.25, 1, 0.5, 1);
      isolation: isolate;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      outline-offset: 4px;
      padding: 1rem 2.5rem;
      font-family: inherit;
      font-size: 1.05rem;
      line-height: 1.2;
      font-weight: 700;
      letter-spacing: 0.01em;
      border: 1px solid transparent;
      border-radius: 360px;
      color: var(--shiny-fg);
      background:
        linear-gradient(var(--shiny-bg), var(--shiny-bg)) padding-box,
        conic-gradient(
          from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
          transparent,
          var(--shiny-hi) var(--gradient-percent),
          var(--gradient-shine) calc(var(--gradient-percent) * 2),
          var(--shiny-hi) calc(var(--gradient-percent) * 3),
          transparent calc(var(--gradient-percent) * 4)
        ) border-box;
      box-shadow: inset 0 0 0 1px var(--shiny-bg-subtle);
      transition: var(--easing);
      transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
    .vm-shiny-btn::before,
    .vm-shiny-btn::after,
    .vm-shiny-btn > span::before {
      content: "";
      pointer-events: none;
      position: absolute;
      inset-inline-start: 50%;
      inset-block-start: 50%;
      translate: -50% -50%;
      z-index: -1;
    }
    .vm-shiny-btn:active { translate: 0 1px; }
    .vm-shiny-btn::before {
      --size: calc(100% - var(--shadow-size) * 3);
      --pos: 2px;
      --space: calc(var(--pos) * 2);
      width: var(--size);
      height: var(--size);
      background: radial-gradient(
        circle at var(--pos) var(--pos),
        white calc(var(--pos) / 4),
        transparent 0
      ) padding-box;
      background-size: var(--space) var(--space);
      background-repeat: space;
      mask-image: conic-gradient(
        from calc(var(--gradient-angle) + 45deg),
        black,
        transparent 10% 90%,
        black
      );
      border-radius: inherit;
      opacity: 0.4;
      z-index: -1;
    }
    .vm-shiny-btn::after {
      --animation: shimmer-vm linear infinite;
      width: 100%;
      aspect-ratio: 1;
      background: linear-gradient(-50deg, transparent, var(--shiny-hi), transparent);
      mask-image: radial-gradient(circle at bottom, transparent 40%, black);
      opacity: 0.6;
    }
    .vm-shiny-btn > span { z-index: 1; position: relative; }
    .vm-shiny-btn > span::before {
      --size: calc(100% + 1rem);
      width: var(--size);
      height: var(--size);
      box-shadow: inset 0 -1ex 2rem 4px var(--shiny-hi);
      opacity: 0;
      transition: opacity var(--easing);
      animation: calc(var(--duration) * 1.5) breathe-vm linear infinite;
    }
    .vm-shiny-btn,
    .vm-shiny-btn::before,
    .vm-shiny-btn::after {
      animation:
        var(--animation) var(--duration),
        var(--animation) calc(var(--duration) / 0.4) reverse paused;
      animation-composition: add;
    }
    .vm-shiny-btn:is(:hover, :focus-visible) {
      --gradient-percent: 20%;
      --gradient-angle-offset: 95deg;
      --gradient-shine: var(--shiny-hi-soft);
    }
    .vm-shiny-btn:is(:hover, :focus-visible),
    .vm-shiny-btn:is(:hover, :focus-visible)::before,
    .vm-shiny-btn:is(:hover, :focus-visible)::after {
      animation-play-state: running;
    }
    .vm-shiny-btn:is(:hover, :focus-visible) > span::before { opacity: 1; }
    @keyframes gradient-angle {
      to { --gradient-angle: 360deg; }
    }
    @keyframes shimmer-vm {
      to { rotate: 360deg; }
    }
    @keyframes breathe-vm {
      from, to { scale: 1; }
      50% { scale: 1.2; }
    }
  `
  document.head.appendChild(el)
}

interface ShinyButtonProps {
  children: ReactNode
  onClick?: () => void
  to?: string
  className?: string
}

export function ShinyButton({ children, onClick, to, className = '' }: ShinyButtonProps) {
  useEffect(() => { mountShinyCSS() }, [])

  const cls = `vm-shiny-btn ${className}`.trim()
  const inner = <span>{children}</span>

  if (to) return <Link to={to} className={cls}>{inner}</Link>
  return <button type="button" className={cls} onClick={onClick}>{inner}</button>
}

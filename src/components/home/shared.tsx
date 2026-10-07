import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export const WA_NUMBER = '5511992794634'

export const waLink = (message: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`

/** Exponential ease-out, a mesma curva em toda a home. */
export const EASE = [0.16, 1, 0.3, 1] as const

/** Entrada simples: sobe de leve e aparece. Já visível sem JS (SSR/prerender). */
export const Reveal = ({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}) => {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

export const ArrowRight = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/** Moldura de navegador escura, igual à do deck. `fit` controla o corte do print. */
export const BrowserFrame = ({
  src,
  alt,
  fit = 'cover',
  ratio = '1280 / 800',
  className = '',
  eager = false,
}: {
  src: string
  alt: string
  fit?: 'cover' | 'contain'
  ratio?: string
  className?: string
  eager?: boolean
}) => (
  <div className={`overflow-hidden rounded-2xl border border-white/10 bg-[#121010] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ${className}`}>
    <div className="flex gap-2 border-b border-white/10 px-4 py-3" aria-hidden>
      <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
      <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
      <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
    </div>
    <img
      src={src}
      alt={alt}
      width={1280}
      height={800}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={{ aspectRatio: ratio }}
      className={`w-full bg-[#0a0a0a] object-top ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
    />
  </div>
)

/** Fundo de estilhaços com arestas vermelhas (o mesmo do deck). */
export const Shards = ({ className = '' }: { className?: string }) => (
  <img
    src="/home/shards.webp"
    alt=""
    aria-hidden
    loading="lazy"
    decoding="async"
    className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${className}`}
  />
)

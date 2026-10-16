import { motion, useInView, useReducedMotion, animate } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { markInner, type MarkEstado } from './mark'

export const WA_NUMBER = '5511992794634'
export const waLink = (msg: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Mark v3 animado. Só anima quando está na tela; com "reduzir movimento" fica parado. */
export const Mark = ({ estado = 'parado', size = 200, className = '', label }: { estado?: MarkEstado; size?: number; className?: string; label?: string }) => {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { rootMargin: '80px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce || !visivel) {
      el.innerHTML = markInner(0.8, estado)
      return
    }
    let raf = 0
    let last = 0
    const t0 = performance.now()
    const loop = (now: number) => {
      // ~30 quadros por segundo bastam para um personagem plano
      if (now - last > 33) {
        last = now
        el.innerHTML = markInner(Math.max(0, now - t0) / 1000, estado)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [estado, reduce, visivel])

  return (
    <svg
      ref={ref}
      viewBox="-170 -170 340 340"
      width={size}
      height={size}
      className={className}
      style={{ overflow: 'visible' }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: markInner(0.8, estado) }}
    />
  )
}

/** Logo oficial "vm." em vetor (redesenhado do public/vm-logo.png). */
export const LogoVM = ({ className = 'h-8 w-auto' }: { className?: string }) => (
  <svg viewBox="6 13 707 222" className={className} role="img" aria-label="Virtual Mark">
    <g fill="none" strokeWidth="74.5" strokeLinecap="round">
      <path d="M107.5 192.5L172 49.5" stroke="#FF1339" />
      <path d="M43.5 50.5L107.5 192.5" stroke="#FF2E4E" />
      <path d="M452 49L516 192.5" stroke="#F40026" />
      <path d="M387.5 193.5L452 49" stroke="#F50E32" />
      <path d="M322 49.5L387.5 193.5" stroke="#FF0B31" />
      <path d="M258 192.5L322 49.5" stroke="#F92647" />
    </g>
    <circle cx="656.5" cy="178.5" r="56.5" fill="#F40026" />
  </svg>
)

export const Seta = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type BotaoProps = { tipo?: 'primario' | 'contorno' | 'texto'; href?: string; onClick?: () => void; children: ReactNode; icone?: boolean; className?: string; type?: 'button' | 'submit'; disabled?: boolean }

export const Botao = ({ tipo = 'primario', href, onClick, children, icone = true, className = '', type = 'button', disabled }: BotaoProps) => {
  const base = 'group inline-flex items-center justify-center gap-2.5 rounded-full font-manrope text-base font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vm-verm disabled:opacity-60'
  const estilo = {
    primario: 'bg-vm-verm px-6 py-4 text-white shadow-[0_10px_30px_-10px_rgba(220,38,38,0.7)] hover:-translate-y-0.5 hover:bg-[#e83434] hover:shadow-[0_16px_36px_-10px_rgba(220,38,38,0.8)]',
    contorno: 'border border-vm-borda px-6 py-4 text-vm-texto hover:border-vm-texto/40 hover:bg-vm-sup2',
    texto: 'py-4 text-vm-texto hover:text-vm-vermt',
  }[tipo]
  const seta = icone ? <Seta className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${tipo === 'texto' ? 'text-vm-vermt' : ''}`} /> : null
  const cls = `${base} ${estilo} ${className}`
  if (href) {
    const externo = href.startsWith('http')
    return (
      <a href={href} className={cls} {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
        {seta}
      </a>
    )
  }
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
      {seta}
    </button>
  )
}

export const Etiqueta = ({ estado = 'padrao', children, onClick }: { estado?: 'padrao' | 'ativo' | 'destaque'; children: ReactNode; onClick?: () => void }) => {
  const estilo = {
    padrao: 'border border-vm-borda bg-vm-sup2 text-vm-suave',
    ativo: 'bg-vm-verm text-white',
    destaque: 'bg-vm-verms text-vm-vermt',
  }[estado]
  const cls = `inline-flex items-center rounded-full px-3.5 py-2 font-manrope text-[13px] font-medium ${estilo}`
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={`${cls} transition-colors hover:border-vm-vermt/60 hover:text-vm-texto`}>
        {children}
      </button>
    )
  return <span className={cls}>{children}</span>
}

export const Sobrelinha = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <p className={`flex items-center gap-2.5 font-vmmono text-xs font-medium uppercase tracking-[0.12em] text-vm-suave ${className}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-vm-verm" aria-hidden />
    {children}
  </p>
)

export const Mono = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`font-vmmono text-[11px] font-medium uppercase tracking-[0.1em] text-vm-apagado ${className}`}>{children}</span>
)

/** Entrada leve: sobe 24px e aparece quando chega na tela. */
export const Surge = ({ children, delay = 0, className = '', as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' }) => {
  const reduce = useReducedMotion()
  const M = as === 'li' ? motion.li : motion.div
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

/** Número que conta até o valor quando entra na tela. */
export const Contador = ({ para, casas = 0, className = '' }: { para: number; casas?: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const emTela = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!emTela) {
      // começa do zero só no navegador; o HTML pré-renderizado já traz o valor final
      if (!reduce) el.textContent = fmt(0)
      return
    }
    if (reduce) {
      el.textContent = fmt(para)
      return
    }
    const c = animate(0, para, { duration: 1.6, ease: EASE, onUpdate: (v) => (el.textContent = fmt(v)) })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emTela, para, reduce])
  return (
    <span ref={ref} className={className}>
      {fmt(para)}
    </span>
  )
}

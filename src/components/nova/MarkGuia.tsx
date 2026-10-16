import { useReducedMotion } from 'framer-motion'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { markInner, type MarkEstado } from './mark'
import { tocar, type Som } from './som'

/*
 * Um só Mark na página. Cada seção marca um lugar para ele com <Ancora>; o Mark
 * voa até a âncora mais perto do centro da tela, segue o cursor com os olhos,
 * reage a botões, descansa ou "gere anúncios" quando a pessoa fica parada e
 * comemora quando alguém envia o formulário. No celular ele só aparece nas
 * âncoras marcadas para celular; fora delas fica num cantinho da tela.
 */

type Guia = {
  /** muda o estado de uma seção (ex.: a escolha no cartão da abertura) */
  definirBase: (ancora: string, estado: MarkEstado) => void
  /** reação curta por cima de tudo */
  reagir: (estado: MarkEstado, ms?: number) => void
  comemorar: () => void
}

const Ctx = createContext<Guia>({ definirBase: () => {}, reagir: () => {}, comemorar: () => {} })
export const useMarkGuia = () => useContext(Ctx)

/** Lugar reservado para o Mark dentro de uma seção. O tamanho do Mark é a largura desta caixa. */
export const Ancora = ({ id, estado, className = '', celular = false }: { id: string; estado: MarkEstado; className?: string; celular?: boolean }) => (
  <div data-mark-ancora={id} data-estado={estado} data-celular={celular ? '1' : undefined} className={`pointer-events-none aspect-square ${className}`} aria-hidden />
)

const OCIOSO_MS = 9000
const TRANSICAO_MS = 280

/** O que o Mark faz ao ver o mouse em cima de algo, conforme para onde aquilo leva. */
function reacaoDoDestino(alvo: Element): MarkEstado {
  const explicita = (alvo.closest('[data-mark-reacao]') as HTMLElement | null)?.dataset.markReacao
  if (explicita) return explicita as MarkEstado
  const tag = alvo.tagName
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return 'procurando'
  if (alvo.getAttribute('role') === 'radio') return 'analisando'
  const href = alvo.getAttribute('href') || ''
  const rotulo = `${alvo.getAttribute('aria-label') || ''} ${alvo.textContent || ''}`.toLowerCase()
  if (href.includes('wa.me') || href.startsWith('tel:')) return 'atendendo'
  if (alvo.getAttribute('type') === 'submit' || href === '#contato' || rotulo.includes('avaliação')) return 'pronto'
  if (href.includes('cases')) return 'surpreso'
  if (href.includes('quiz') || href === '#diagnostico' || rotulo.includes('diagnóstico')) return 'analisando'
  if (href === '#como-trabalhamos') return 'trabalhando'
  if (href.includes('instagram') || href.includes('youtube')) return 'falando'
  if (rotulo.includes('tema')) return 'piscando'
  if (rotulo.includes('sons')) return 'falando'
  if (href.includes('privacy')) return 'analisando'
  return 'olhando'
}

/** A cada clique uma reação diferente, cada uma com a sua voz. */
const CLIQUES: [MarkEstado, Som, number][] = [
  ['pronto', 'pulo', 1100],
  ['surpreso', 'oh', 900],
  ['piscando', 'pisca', 1000],
  ['falando', 'fala', 1100],
  ['comemorando', 'festa', 1500],
]

export const MarkGuiaProvider = ({ children }: { children: ReactNode }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const bases = useRef<Record<string, MarkEstado>>({})
  const reacao = useRef<{ estado: MarkEstado; ate: number } | null>(null)
  const whats = useRef<HTMLElement | null>(null)

  const definirBase = useCallback((ancora: string, estado: MarkEstado) => {
    bases.current[ancora] = estado
  }, [])
  const reagir = useCallback((estado: MarkEstado, ms = 900) => {
    reacao.current = { estado, ate: performance.now() + ms }
  }, [])
  const comemorar = useCallback(() => {
    reacao.current = { estado: 'comemorando', ate: performance.now() + 3600 }
    tocar('festa')
  }, [])
  const api = useMemo(() => ({ definirBase, reagir, comemorar }), [definirBase, reagir, comemorar])

  useEffect(() => {
    const box = boxRef.current
    const svg = svgRef.current
    if (!box || !svg) return
    const mq = window.matchMedia('(min-width: 1024px)')
    let raf = 0
    let ultimoQuadro = 0
    let ultimoDesenho = 0
    let ultimaAtividade = performance.now()
    const t0 = performance.now()
    const cursor = { x: -1, y: -1 }
    const pos = { x: -200, y: window.innerHeight * 0.4, s: 160, pronto: false }
    let atual: Element | null = null
    // preso: chegou na âncora e passa a acompanhá-la exatamente (sem atraso na rolagem)
    let preso = false
    let flutua = 1
    let eraWhats = false
    let ultimoMovimento = 0
    let ultimaDigitacao = -1e9
    let hover: MarkEstado | null = null
    let nCliques = 0
    let estadoAtual: MarkEstado = 'olhando'
    let estadoDe: MarkEstado = 'olhando'
    let trocaEm = 0
    let dormia = false
    let ultimaRolagem = 0
    let visivel = 0

    const atividade = () => (ultimaAtividade = performance.now())
    const rolar = () => {
      ultimaRolagem = performance.now()
      atividade()
    }
    const mover = (e: PointerEvent) => {
      ultimoMovimento = performance.now()
      cursor.x = e.clientX
      cursor.y = e.clientY
      atividade()
    }
    const sobre = (e: PointerEvent) => {
      const el = e.target as Element | null
      if (!el || !el.closest) return
      const w = el.closest('[data-mark-whats]') as HTMLElement | null
      whats.current = w
      if (w) return
      const alvo = el.closest('a, button, [role="radio"], select, input')
      if (!alvo) return
      // na rolagem o conteúdo passa sob o cursor parado; isso não é a pessoa apontando
      if (performance.now() - ultimoMovimento > 150) return
      // em silêncio: só muda a cara enquanto o mouse estiver em cima
      hover = reacaoDoDestino(alvo)
    }
    const sair = (e: PointerEvent) => {
      const el = e.target as Element | null
      if (el?.closest?.('[data-mark-whats]')) whats.current = null
      const para = e.relatedTarget as Element | null
      if (!para?.closest?.('a, button, [role="radio"], select, input')) hover = null
    }
    const clique = (e: PointerEvent) => {
      atividade()
      if (!(e.target as Element | null)?.closest?.('a, button, [role="radio"]')) return
      const [estado, som, ms] = CLIQUES[nCliques++ % CLIQUES.length]
      reagir(estado, ms)
      tocar(som)
    }
    const digitar = (e: Event) => {
      const el = e.target as Element | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) ultimaDigitacao = performance.now()
      atividade()
    }

    window.addEventListener('pointermove', mover, { passive: true })
    window.addEventListener('scroll', rolar, { passive: true })
    window.addEventListener('keydown', atividade)
    document.addEventListener('pointerover', sobre)
    document.addEventListener('pointerout', sair)
    document.addEventListener('pointerdown', clique)
    document.addEventListener('input', digitar)

    const loop = (agora: number) => {
      raf = requestAnimationFrame(loop)
      const vh = window.innerHeight
      const vw = window.innerWidth
      const desktop = mq.matches

      // 1. para onde ir
      let alvo: { x: number; y: number; s: number } | null = null
      let estadoBase: MarkEstado = 'parado'
      const w = whats.current
      if (!!(w && desktop) !== eraWhats) {
        eraWhats = !!(w && desktop)
        preso = false
      }
      if (w && desktop) {
        const r = w.getBoundingClientRect()
        alvo = { x: r.left - 64, y: r.top + r.height / 2 - 30, s: 110 }
        estadoBase = 'atendendo'
      } else {
        let melhor: Element | null = null
        let dist = Infinity
        let distAtual = Infinity
        document.querySelectorAll('[data-mark-ancora]').forEach((a) => {
          if (!desktop && !(a as HTMLElement).dataset.celular) return
          const r = a.getBoundingClientRect()
          if (r.width === 0) return
          const cy = r.top + r.height / 2
          if (!desktop && (cy < 0 || cy > vh)) return
          const d = Math.abs(cy - vh * 0.5)
          if (a === atual) distAtual = d
          if (d < dist) {
            dist = d
            melhor = a
          }
        })
        // histerese: só troca de âncora quando a nova está bem mais perto
        if (melhor && melhor !== atual && (atual === null || dist < distAtual - 80 || distAtual === Infinity)) {
          if (atual && pos.pronto) tocar('voo')
          atual = melhor
          preso = false
        }
        if (!melhor) atual = null
        if (atual) {
          const r = atual.getBoundingClientRect()
          alvo = { x: r.left + r.width / 2, y: r.top + r.height / 2, s: r.width }
          const id = (atual as HTMLElement).dataset.markAncora || ''
          estadoBase = bases.current[id] || ((atual as HTMLElement).dataset.estado as MarkEstado) || 'parado'
        } else if (!desktop) {
          // celular fora das âncoras: cantinho inferior esquerdo
          alvo = { x: 16 + 32, y: vh - 16 - 34, s: 64 }
        }
      }

      // 2. voa até lá (mola simples, independente da taxa de quadros)
      const dt = Math.min(0.05, (agora - (ultimoQuadro || agora)) / 1000)
      if (alvo) {
        if (!preso && Math.hypot(alvo.x - pos.x, alvo.y - pos.y) < 1.5 && Math.abs(alvo.s - pos.s) < 1.5) preso = true
        const k = reduce || !pos.pronto || preso ? 1 : 1 - Math.exp(-dt * 7)
        pos.x += (alvo.x - pos.x) * k
        pos.y += (alvo.y - pos.y) * k
        pos.s += (alvo.s - pos.s) * k
        pos.pronto = true
      }
      const alvoVisivel = alvo ? 1 : 0
      visivel += (alvoVisivel - visivel) * (reduce ? 1 : 1 - Math.exp(-dt * 8))
      const t = (agora - t0) / 1000
      // flutua de leve só com a página parada
      const parado = agora - ultimaRolagem > 400
      flutua += ((parado ? 1 : 0) - flutua) * (1 - Math.exp(-dt * 3))
      const bob = reduce ? 0 : Math.sin(t * 1.6) * 2.5 * flutua
      box.style.transform = `translate3d(${(pos.x - pos.s / 2).toFixed(1)}px, ${(pos.y - pos.s / 2 + bob).toFixed(1)}px, 0)`
      box.style.width = box.style.height = `${pos.s.toFixed(1)}px`
      box.style.opacity = visivel.toFixed(3)

      // 3. estado: clique/festa > digitação > mouse em cima > ócio > base da seção
      let estado = estadoBase
      const ocioso = agora - ultimaAtividade > OCIOSO_MS
      if (ocioso && !w) estado = Math.floor((agora - ultimaAtividade - OCIOSO_MS) / 8000) % 2 === 0 ? 'gerindo' : 'dormindo'
      if (estado === 'dormindo' && !dormia) tocar('sono')
      dormia = estado === 'dormindo'
      if (hover && !w) estado = hover
      if (agora - ultimaDigitacao < 1300) estado = 'lendo'
      if (reacao.current && reacao.current.ate > agora) estado = reacao.current.estado
      else reacao.current = null
      if (estado !== estadoAtual) {
        // começa a nova transição de onde a anterior estava
        estadoDe = agora - trocaEm < TRANSICAO_MS ? estadoDe : estadoAtual
        estadoAtual = estado
        trocaEm = agora
      }
      const k = reduce ? 1 : Math.min(1, (agora - trocaEm) / TRANSICAO_MS)

      // 4. olhos no cursor
      let look: [number, number] | undefined
      if (cursor.x >= 0 && desktop) {
        const dx = (cursor.x - pos.x) / Math.max(240, vw * 0.25)
        const dy = (cursor.y - pos.y) / Math.max(240, vh * 0.3)
        look = [Math.max(-1, Math.min(1, dx)), Math.max(-1, Math.min(1, dy))]
      }

      if (agora - ultimoDesenho > 33) {
        ultimoDesenho = agora
        svg.innerHTML = markInner(reduce ? 0.8 : t, estadoAtual, { look, de: estadoDe, k })
      }
      ultimoQuadro = agora
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('scroll', rolar)
      window.removeEventListener('keydown', atividade)
      document.removeEventListener('pointerover', sobre)
      document.removeEventListener('pointerout', sair)
      document.removeEventListener('pointerdown', clique)
      document.removeEventListener('input', digitar)
    }
  }, [reduce, reagir])

  return (
    <Ctx.Provider value={api}>
      {children}
      <div ref={boxRef} className="pointer-events-none fixed left-0 top-0 z-30 will-change-transform" style={{ width: 160, height: 160, opacity: 0 }} aria-hidden>
        <svg ref={svgRef} viewBox="-170 -170 340 340" width="100%" height="100%" style={{ overflow: 'visible' }} />
      </div>
    </Ctx.Provider>
  )
}

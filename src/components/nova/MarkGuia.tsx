import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { acessorioDo, markInner, type Acessorio, type MarkEstado } from './mark'
import { tocar, type Som } from './som'

/*
 * Um só Mark na página. Cada seção marca um lugar para ele com <Ancora>; o Mark
 * voa até a âncora mais perto do centro da tela, segue o cursor com os olhos,
 * reage a botões, descansa ou "gere anúncios" quando a pessoa fica parada e
 * comemora quando alguém envia o formulário. Clicar nele traz uma curiosidade.
 * No celular ele se apresenta nas âncoras marcadas para celular e depois fica
 * ao lado do botão do WhatsApp, mudando de cara conforme a seção da tela.
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

/** O que o Mark conta quando alguém clica nele. Só coisas que estão no site. */
const FATOS = [
  'Oi! Eu sou o Mark, o mascote da Virtual Mark. Clica de novo que eu conto mais.',
  'Uma loja de lingerie teve 23,5x de retorno em anúncio, cinco meses seguidos.',
  'Foram 34 mil vendas para uma loja de games em 12 meses, com o custo por venda estável.',
  'Uma clínica recebeu 1.714 contatos de pacientes em 13 meses seguidos.',
  'Anúncio, site e criativo no mesmo time. Assim ninguém joga a culpa no outro.',
  'Cada lead leva a origem do anúncio. Você sabe de qual campanha veio cada venda.',
  'Todo mês você vê o retorno em reais, não em curtidas.',
  'A avaliação é gratuita: 30 minutos com a equipe olhando a sua conta e o seu site.',
  'O X da questão é vender mais. É o nosso lema, e o meu também.',
  'Se eu estiver barulhento demais, é só apertar o botão de som lá em cima.',
]

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
  if (alvo.getAttribute('type') === 'submit' || href.endsWith('#contato') || rotulo.includes('avaliação')) return 'pronto'
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
  const [fala, setFala] = useState<{ texto: string; lado: 'esq' | 'dir'; acima: boolean } | null>(null)
  const nFato = useRef(0)
  const timerFala = useRef<number>()
  const posRef = useRef({ x: 0, y: 0 })

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
  const contar = () => {
    const texto = FATOS[nFato.current++ % FATOS.length]
    const { x, y } = posRef.current
    setFala({ texto, lado: x > window.innerWidth / 2 ? 'esq' : 'dir', acima: y > 220 })
    window.clearTimeout(timerFala.current)
    timerFala.current = window.setTimeout(() => setFala(null), 5200)
  }
  useEffect(() => () => window.clearTimeout(timerFala.current), [])
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
    let ultimoVoo = -1e9
    let ultimaDir = 1
    let accAtual: Acessorio | null = null
    let accDe: Acessorio | null = null
    let accTrocaEm = 0
    // voo direto até a seção clicada no menu, sem pousar nas seções do meio
    let voo: { ancora: Element; x0: number; y0: number; s0: number; x1: number; y1: number; s1: number; inicio: number; dur: number; arco: number; dir: number } | null = null
    let ultimaRolagem = 0
    let visivel = 0
    // acessório que fica enquanto a pessoa está numa seção (ex.: óculos no diagnóstico)
    let fixo: { acc: Acessorio; secao: Element } | null = null
    // no celular o Mark só aparece depois de se apresentar numa âncora de celular
    let apresentou = false

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
      const f = el.closest('[data-mark-acessorio]') as HTMLElement | null
      if (f) fixo = { acc: f.dataset.markAcessorio as Acessorio, secao: f.closest('section') || f }
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
      if (fixo && !(para && fixo.secao.contains(para))) fixo = null
      if (!para?.closest?.('a, button, [role="radio"], select, input')) hover = null
    }
    const clique = (e: PointerEvent) => {
      atividade()
      if (!(e.target as Element | null)?.closest?.('a, button, [role="radio"]')) return
      const [estado, som, ms] = CLIQUES[nCliques++ % CLIQUES.length]
      reagir(estado, ms)
      tocar(som)
    }
    const navegar = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!link || reduce || !mq.matches) return
      let destino: Element | null = null
      try {
        destino = document.querySelector(link.getAttribute('href') || '')
      } catch {
        return // "#/rota" da prévia não é um seletor
      }
      const ancora = destino?.querySelector('[data-mark-ancora]')
      if (!destino || !ancora || ancora === atual) return
      const rd = destino.getBoundingClientRect()
      const ra = ancora.getBoundingClientRect()
      const margem = parseFloat(getComputedStyle(destino).scrollMarginTop) || 0
      // onde a âncora vai estar na tela quando a rolagem terminar
      const x1 = ra.left + ra.width / 2
      const y1 = ra.top - rd.top + margem + ra.height / 2
      const dist = Math.hypot(x1 - pos.x, y1 - pos.y)
      voo = {
        ancora,
        x0: pos.x,
        y0: pos.y,
        s0: pos.s,
        x1,
        y1,
        s1: ra.width,
        inicio: performance.now(),
        dur: Math.min(1500, Math.max(800, dist * 1.4 + Math.abs(rd.top) * 0.08)),
        arco: Math.min(180, 60 + dist * 0.25),
        dir: x1 >= pos.x ? 1 : -1,
      }
      tocar('voo')
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
    document.addEventListener('click', navegar)

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
      if (voo) {
        estadoBase = 'voando'
      } else if (w && desktop) {
        const r = w.getBoundingClientRect()
        alvo = { x: r.left - 64, y: r.top + r.height / 2 - 30, s: 110 }
        estadoBase = 'atendendo'
      } else {
        let secao: Element | null = null
        let distSecao = Infinity
        let melhor: Element | null = null
        let dist = Infinity
        let distAtual = Infinity
        document.querySelectorAll('[data-mark-ancora]').forEach((a) => {
          const r0 = a.getBoundingClientRect()
          if (!desktop && r0.width > 0) {
            // no celular toda seção conta para a reação, mesmo sem lugar para o Mark
            const ds = Math.abs(r0.top + r0.height / 2 - vh * 0.5)
            if (ds < distSecao) {
              distSecao = ds
              secao = a
            }
          }
          if (!desktop && !(a as HTMLElement).dataset.celular) return
          const r = r0
          if (r.width === 0) return
          const cy = r.top + r.height / 2
          if (!desktop && cy > 0 && cy < vh) apresentou = true
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
          if (atual && pos.pronto && agora - ultimoVoo > 1200 && desktop) tocar('voo')
          atual = melhor
          preso = false
        }
        if (!melhor) atual = null
        if (atual) {
          const r = atual.getBoundingClientRect()
          alvo = { x: r.left + r.width / 2, y: r.top + r.height / 2, s: r.width }
          const id = (atual as HTMLElement).dataset.markAncora || ''
          estadoBase = bases.current[id] || ((atual as HTMLElement).dataset.estado as MarkEstado) || 'parado'
        } else if (!desktop && apresentou) {
          // celular fora das âncoras: fica ao lado do botão do WhatsApp, reagindo à seção da tela
          const bw = document.querySelector('[data-mark-whats]')?.getBoundingClientRect()
          const dir = bw && bw.width > 0 ? bw.left - 8 : vw - 20 - 56 - 8
          alvo = { x: dir - 30, y: (bw && bw.width > 0 ? bw.top + bw.height / 2 : vh - 20 - 26) - 4, s: 64 }
          if (secao) {
            const id = (secao as HTMLElement).dataset.markAncora || ''
            estadoBase = bases.current[id] || ((secao as HTMLElement).dataset.estado as MarkEstado) || 'parado'
          }
        }
      }

      // 2. voa até lá (mola simples, independente da taxa de quadros)
      const dt = Math.min(0.05, (agora - (ultimoQuadro || agora)) / 1000)
      if (voo) {
        ultimaDir = voo.dir
        const p = Math.min(1, (agora - voo.inicio) / voo.dur)
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
        // na segunda metade o destino passa a ser a âncora de verdade (seções fixas mudam no caminho)
        const ra = voo.ancora.getBoundingClientRect()
        const b = p < 0.5 ? 0 : Math.min(1, (p - 0.5) / 0.5)
        const m = b * b * (3 - 2 * b)
        const x1 = voo.x1 + (ra.left + ra.width / 2 - voo.x1) * m
        const y1 = voo.y1 + (Math.max(-200, Math.min(vh + 200, ra.top + ra.height / 2)) - voo.y1) * m
        pos.x = voo.x0 + (x1 - voo.x0) * e
        pos.y = voo.y0 + (y1 - voo.y0) * e - Math.sin(Math.PI * e) * voo.arco
        pos.s = voo.s0 + (voo.s1 - voo.s0) * e
        // pousa quando o voo acabou e a página parou de rolar
        if (p >= 1 && agora - ultimaRolagem > 140) {
          atual = voo.ancora
          preso = false
          ultimoVoo = agora
          voo = null
        }
      } else if (alvo) {
        if (!preso && Math.hypot(alvo.x - pos.x, alvo.y - pos.y) < 1.5 && Math.abs(alvo.s - pos.s) < 1.5) preso = true
        const k = reduce || !pos.pronto || preso ? 1 : 1 - Math.exp(-dt * 7)
        pos.x += (alvo.x - pos.x) * k
        pos.y += (alvo.y - pos.y) * k
        pos.s += (alvo.s - pos.s) * k
        pos.pronto = true
      }
      const alvoVisivel = alvo || voo ? 1 : 0
      visivel += (alvoVisivel - visivel) * (reduce ? 1 : 1 - Math.exp(-dt * 8))
      const t = (agora - t0) / 1000
      // flutua de leve só com a página parada
      const parado = agora - ultimaRolagem > 400
      flutua += ((parado ? 1 : 0) - flutua) * (1 - Math.exp(-dt * 3))
      const bob = reduce ? 0 : Math.sin(t * 1.6) * 2.5 * flutua
      box.style.transform = `translate3d(${(pos.x - pos.s / 2).toFixed(1)}px, ${(pos.y - pos.s / 2 + bob).toFixed(1)}px, 0)`
      box.style.width = box.style.height = `${pos.s.toFixed(1)}px`
      box.style.opacity = visivel.toFixed(3)
      box.style.pointerEvents = visivel > 0.5 ? 'auto' : 'none'
      posRef.current = { x: pos.x, y: pos.y }

      // 3. estado: clique/festa > digitação > mouse em cima > ócio > base da seção
      let estado = estadoBase
      const ocioso = agora - ultimaAtividade > OCIOSO_MS
      if (ocioso && !w) estado = Math.floor((agora - ultimaAtividade - OCIOSO_MS) / 8000) % 2 === 0 ? 'gerindo' : 'dormindo'
      if (estado === 'dormindo' && !dormia) tocar('sono')
      dormia = estado === 'dormindo'
      // o "persona" (óculos, fone) fica enquanto só os efeitos mudam por cima
      const persona = estado
      if (hover && !w && !voo) estado = hover
      if (agora - ultimaDigitacao < 1300 && !voo) estado = 'lendo'
      if (reacao.current && reacao.current.ate > agora && !voo) estado = reacao.current.estado
      else if (!reacao.current || reacao.current.ate <= agora) reacao.current = null
      if (fixo && atual && !fixo.secao.contains(atual)) fixo = null
      const acc = estado === 'voando' ? accAtual : fixo ? fixo.acc : acessorioDo(estado) ?? acessorioDo(persona)
      if (acc !== accAtual) {
        accDe = accAtual
        accAtual = acc
        accTrocaEm = agora
      }
      const accK = reduce ? 1 : Math.min(1, (agora - accTrocaEm) / 320)
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
        svg.innerHTML = markInner(reduce ? 0.8 : t, estadoAtual, { look, de: estadoDe, k, acessorio: accAtual, accDe, accK, dir: voo?.dir ?? ultimaDir })
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
      document.removeEventListener('click', navegar)
    }
  }, [reduce, reagir])

  return (
    <Ctx.Provider value={api}>
      {children}
      <div ref={boxRef} className="pointer-events-none fixed left-0 top-0 z-30 will-change-transform" style={{ width: 160, height: 160, opacity: 0 }}>
        <button type="button" onClick={contar} data-mark-reacao="piscando" className="block h-full w-full cursor-pointer rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-vm-verm" aria-label="Mark, o mascote da Virtual Mark: toque para ouvir uma curiosidade">
          <svg ref={svgRef} viewBox="-170 -170 340 340" width="100%" height="100%" style={{ overflow: 'visible' }} aria-hidden />
        </button>
        <AnimatePresence>
          {fala && (
            <motion.p
              key={fala.texto}
              role="status"
              initial={{ opacity: 0, y: fala.acima ? 8 : -8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-none absolute w-[min(260px,calc(100vw-40px))] rounded-[18px] border border-vm-borda bg-vm-sup px-4 py-3 font-manrope text-sm font-medium leading-snug text-vm-texto shadow-xl shadow-black/30 ${
                fala.acima ? 'bottom-[92%]' : 'top-[92%]'
              } ${fala.lado === 'esq' ? `right-[40%] ${fala.acima ? 'rounded-br-md' : 'rounded-tr-md'}` : `left-[40%] ${fala.acima ? 'rounded-bl-md' : 'rounded-tl-md'}`}`}
            >
              {fala.texto}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}

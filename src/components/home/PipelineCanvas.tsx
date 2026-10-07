import { useEffect, useRef, useState } from 'react'
import { GATES } from './pipeline/constants'
import type { Pipeline, createPipeline as CreatePipeline } from './pipeline/scene'

/**
 * Camada 3D fixa atrás da página. É o diagrama do serviço (Atrair, Converter, Medir, Reter):
 *  - no hero mostra a visão geral, com o X como portão da conversão;
 *  - na seção "Quatro frentes" a câmera percorre os portões conforme a rolagem;
 *  - fora dessas duas áreas ela some e para de renderizar.
 * A rolagem manda: nada aqui anima por conta própria além do fluxo de pontos.
 */

const NAMES = ['Atrair', 'Converter', 'Medir', 'Reter'] as const
/** altura do topo de cada anel, para ancorar a legenda logo acima */
const LABEL_Y = [3.0, 2.25, 1.6, 1.35]
/** raio do anel de cada portão, para posicionar o balão ao lado dele */
const RING_R = [2.7, 1.95, 1.3, 1.05]

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const smooth = (t: number) => t * t * (3 - 2 * t)

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!c.getContext('webgl2')
  } catch {
    return false
  }
}

const Tag = () => <span className="ml-auto rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-white/50">exemplo</span>

const callouts = [
  // 1 · Atrair
  <div key="a" className="space-y-2">
    <div className="flex items-center gap-2 text-[11px] text-white/60">
      <span className="rounded bg-white px-1.5 py-0.5 font-bold text-black">Patrocinado</span>
      seudominio.com.br
      <Tag />
    </div>
    <p className="text-[15px] font-semibold leading-snug text-white">Eletricista em São Paulo | Orçamento em minutos</p>
    <p className="text-xs leading-snug text-white/60">A pessoa está procurando exatamente o que você faz.</p>
  </div>,
  // 2 · Converter
  <div key="b" className="space-y-2">
    <div className="flex items-center text-[11px] text-white/60">
      Quiz antes do WhatsApp
      <Tag />
    </div>
    <p className="font-display text-[15px] font-bold leading-snug text-white">Qual é o seu objetivo agora?</p>
    {['Ser encontrado na internet', 'Vender mais com anúncios', 'Organizar e escalar'].map((o, i) => (
      <div
        key={o}
        className={`rounded-lg border px-3 py-1.5 text-xs ${i === 1 ? 'border-primary-500 bg-primary-600/20 text-white' : 'border-white/10 text-white/70'}`}
      >
        {o}
      </div>
    ))}
  </div>,
  // 3 · Medir
  <div key="c" className="space-y-2">
    <div className="flex items-center text-[11px] text-white/60">
      gclid=<span className="text-primary-400">Cj0KCQjw…</span>&nbsp;em cada lead
      <Tag />
    </div>
    {[
      ['Google · pesquisa', 'eletricista residencial', 'Orçamento'],
      ['Google · pesquisa', 'instalação de tomadas', 'Venda'],
      ['Meta · feed', 'campanha de marca', '—'],
    ].map((r) => (
      <div key={r[1]} className="grid grid-cols-[1.1fr_1.3fr_0.8fr] gap-2 border-t border-white/10 pt-1.5 text-[11px] text-white/80">
        <span>{r[0]}</span>
        <span className="truncate">{r[1]}</span>
        <span className={r[2] === 'Venda' ? 'font-semibold text-primary-400' : 'text-white/55'}>{r[2]}</span>
      </div>
    ))}
  </div>,
  // 4 · Reter
  <div key="d" className="space-y-2">
    <div className="flex items-center text-[11px] text-white/60">
      Valor acumulado de um cliente (LTV)
      <Tag />
    </div>
    <div className="flex h-16 items-end gap-2 border-b border-white/15">
      {[34, 62, 100].map((h, i) => (
        <div key={h} className="flex h-full flex-1 items-end">
          <div className={`w-full rounded-t ${i === 2 ? 'bg-primary-500' : 'bg-white/20'}`} style={{ height: `${h}%` }} />
        </div>
      ))}
    </div>
    <p className="text-xs leading-snug text-white/60">Públicos da sua base trazem o cliente de volta.</p>
  </div>,
]

const PipelineCanvas = () => {
  const wrap = useRef<HTMLDivElement>(null)
  const stageHost = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])
  const calloutRef = useRef<HTMLDivElement>(null)
  const [callout, setCallout] = useState(0) // 0 = nenhum, 1..4 = estágio

  useEffect(() => {
    const el = wrap.current
    const host = stageHost.current
    if (!el || !host || !hasWebGL()) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let pipe: Pipeline | null = null
    let raf = 0
    let running = false

    const state = { opacity: 0, target: 0, stage: 0, wide: true, mx: 0, my: 0, px: 0, py: 0, callout: 0, shiftX: 0, shiftY: 0, appliedX: -1, appliedY: -1 }

    /** ler a rolagem e decidir: quanto aparece e para qual estágio a câmera vai */
    const readScroll = () => {
      const vh = window.innerHeight
      const y = window.scrollY
      const hero = document.getElementById('hero')
      const th = document.getElementById('processo')
      if (!hero) {
        state.opacity = 0
        return
      }
      const heroFade = 1 - clamp((y - 0.25 * vh) / (0.75 * vh), 0, 1)
      if (!state.wide || !th) {
        // celular e tablet: só o hero; a cena fica na faixa reservada entre o título e o texto
        state.opacity = heroFade * 0.95
        state.target = 0
        const slot = document.getElementById('hero-scene')
        if (slot) {
          const r = slot.getBoundingClientRect()
          state.shiftY = (r.top + r.height / 2) / vh - 0.5
        }
        return
      }
      const tTop = y + th.getBoundingClientRect().top
      const tH = th.offsetHeight
      const pEnd = tTop + tH - vh
      const fadeIn = clamp((y - (tTop - vh)) / (0.9 * vh), 0, 1)
      const fadeOut = 1 - clamp((y - pEnd) / (0.7 * vh), 0, 1)
      state.opacity = Math.max(heroFade, smooth(fadeIn) * fadeOut)
      if (y < tTop) state.target = fadeIn
      else {
        const p = clamp((y - tTop) / Math.max(1, tH - vh), 0, 1)
        state.target = clamp(0.5 + 4 * p, 1, 4)
      }
    }

    const layout = () => {
      const w = el.clientWidth || window.innerWidth
      const h = el.clientHeight || window.innerHeight
      state.wide = w >= 1024
      const budget = Math.sqrt(2.8e6 / (w * h))
      const dpr = clamp(Math.min(window.devicePixelRatio || 1, 1.75, budget), 1, 1.75)
      // empurra o cenário para a direita, onde não há texto; em telas menores, para baixo
      const shiftX = state.wide ? (w >= 1500 ? 0.2 : w >= 1200 ? 0.18 : 0.24) : 0
      const shiftY = 0
      state.shiftX = shiftX
      state.shiftY = shiftY
      state.appliedX = shiftX
      pipe?.setLayout({ w, h, shiftX, shiftY, dpr })
    }

    const setup = (createPipeline: typeof CreatePipeline) => {
      const w = window.innerWidth
      const count = w < 1024 ? 2400 : w * window.innerHeight > 2.4e6 ? 6000 : 7000
      pipe = createPipeline({ host, count, frozen: reduce })
      layout()
      readScroll()
      state.stage = state.target
    }

    const placeLabels = () => {
      if (!pipe) return
      const w = el.clientWidth
      const h = el.clientHeight
      const show = state.wide && state.opacity > 0.05
      const hero = state.stage < 0.6
      for (let i = 0; i < 4; i++) {
        const node = labelRefs.current[i]
        if (!node) continue
        const a = clamp(1 - Math.abs(state.stage - (i + 1)), 0, 1)
        const p = pipe.project(GATES[i], LABEL_Y[i] + 0.25, 0)
        const visible = show && !p.behind && p.x > w * 0.42 && p.x < w - 20 && p.y > 80 && p.y < h - 20
        node.style.opacity = visible ? String(hero ? 0.85 : 0.35 + 0.65 * a) : '0'
        node.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -100%)`
        node.dataset.on = a > 0.5 ? '1' : '0'
      }
      // balão de exemplo do estágio atual
      const st = Math.round(state.stage)
      const want = show && state.stage >= 0.85 && st >= 1 && st <= 4 && Math.abs(state.stage - st) < 0.35 ? st : 0
      if (want !== state.callout) {
        state.callout = want
        setCallout(want)
      }
      const c = calloutRef.current
      if (c && want) {
        const gx = want === 4 ? -1.5 : GATES[want - 1]
        const gy = want === 4 ? 2.4 : 0
        const p = pipe.project(gx, gy, 0)
        const rim = want === 4 ? { y: p.y } : pipe.project(gx, RING_R[want - 1], 0)
        const rpx = want === 4 ? 0 : Math.abs(rim.y - p.y)
        const cw = c.offsetWidth
        const ch = c.offsetHeight
        let left = clamp(p.x + rpx * 0.85 + 28, w * 0.46, w - cw - 28)
        let top = clamp(p.y - ch / 2, 92, h - ch - 28)
        // funil e loop ocupam o centro: o balão vai para o canto inferior direito
        if (want === 1 || want === 4) {
          left = w - cw - 32
          top = h - ch - 44
        }
        c.style.transform = `translate3d(${left}px, ${top}px, 0)`
      }
    }

    const draw = (time: number, dt: number) => {
      if (!pipe) return
      state.px += (state.mx - state.px) * Math.min(1, dt * 3)
      state.py += (state.my - state.py) * Math.min(1, dt * 3)
      const k = reduce ? 1 : 1 - Math.exp(-dt * 4.5)
      state.stage += (state.target - state.stage) * k
      // no estágio "Reter" o cenário volta ao centro para o loop caber inteiro
      const kr = clamp(state.stage - 3, 0, 1)
      const sx = state.shiftX + (0.04 - state.shiftX) * smooth(kr)
      if (Math.abs(sx - state.appliedX) > 0.002 || Math.abs(state.shiftY - state.appliedY) > 0.002) {
        state.appliedX = sx
        state.appliedY = state.shiftY
        pipe.setShift(sx, state.shiftY)
      }
      pipe.render({ stage: state.stage, time, px: reduce ? 0 : state.px, py: reduce ? 0 : state.py })
      placeLabels()
    }

    let last = performance.now()
    const t0 = last
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const on = state.opacity > 0.01 && !document.hidden
      el.style.visibility = on ? 'visible' : 'hidden'
      if (!on) return
      el.style.opacity = String(state.opacity)
      draw((now - t0) / 1000, dt)
    }

    const startLoop = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    /** reduced motion: sem loop; desenha só quando a rolagem muda */
    let queued = false
    const drawOnce = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        const on = state.opacity > 0.01
        el.style.visibility = on ? 'visible' : 'hidden'
        if (!on) return
        el.style.opacity = String(state.opacity)
        draw(7, 1)
      })
    }

    const onScroll = () => {
      readScroll()
      if (reduce) drawOnce()
    }
    const onResize = () => {
      layout()
      readScroll()
      if (reduce) drawOnce()
    }
    const onMove = (e: PointerEvent) => {
      state.mx = (e.clientX / window.innerWidth - 0.5) * 2
      state.my = (e.clientY / window.innerHeight - 0.5) * 2
    }

    let cancelled = false
    // o three.js só é baixado quando a página precisa dele
    import('./pipeline/scene').then((mod) => {
      if (cancelled) return
      setup(mod.createPipeline)
      if (reduce) drawOnce()
      else startLoop()
    })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    if (!reduce) window.addEventListener('pointermove', onMove, { passive: true })
    // o layout muda depois que fontes e imagens carregam
    const late = window.setTimeout(onResize, 800)

    return () => {
      cancelled = true
      window.clearTimeout(late)
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      pipe?.dispose()
    }
  }, [])

  return (
    <div ref={wrap} className="pointer-events-none fixed inset-0 z-0" style={{ opacity: 0, visibility: 'hidden' }} aria-hidden>
      <div ref={stageHost} className="absolute inset-0" />

      {/* legendas dos quatro portões, coladas na cena */}
      {NAMES.map((n, i) => (
        <div
          key={n}
          ref={(node) => {
            labelRefs.current[i] = node
          }}
          className="group absolute left-0 top-0 hidden opacity-0 will-change-transform lg:block"
        >
          <span className="flex items-center gap-2 font-display text-sm font-bold tracking-wide text-white/80 transition-colors duration-500 group-data-[on='1']:text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white/50 transition-colors duration-500 group-data-[on='1']:bg-primary-500" />
            {n}
          </span>
        </div>
      ))}

      {/* balão de exemplo ancorado no portão ativo */}
      <div ref={calloutRef} className="absolute left-0 top-0 hidden will-change-transform lg:block" style={{ opacity: callout ? 1 : 0, transition: 'opacity 0.5s' }}>
        <div className="w-[19rem] rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">{callout ? callouts[callout - 1] : null}</div>
      </div>
    </div>
  )
}

export default PipelineCanvas

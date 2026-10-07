import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from 'framer-motion'
import { EASE } from './shared'

/* ───────── Quatro frentes, um sistema ───────── */

type Stage = { name: string; line: string; visual: () => JSX.Element }

const Tag = () => (
  <span className="absolute right-4 top-4 rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/55">
    Exemplo ilustrativo
  </span>
)

const VisualAtrair = () => (
  <div className="relative flex h-full w-full flex-col justify-center p-6 sm:p-9">
    <Tag />
    <div className="rounded-2xl bg-white p-5 text-left text-black shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 text-[11px] text-neutral-500">
        <span className="rounded bg-neutral-900 px-1.5 py-0.5 font-bold text-white">Patrocinado</span>
        seudominio.com.br
      </div>
      <p className="mt-2 text-lg font-semibold leading-snug text-[#1a0dab]">
        Eletricista em São Paulo | Orçamento em minutos
      </p>
      <p className="mt-1 text-sm leading-snug text-neutral-600">
        Atendimento residencial e comercial. Peça seu orçamento agora pelo WhatsApp.
      </p>
    </div>
    <div className="mt-4 rounded-2xl bg-white/[0.06] p-5">
      <div className="h-2 w-2/3 rounded bg-white/25" />
      <div className="mt-2 h-2 w-1/2 rounded bg-white/15" />
    </div>
    <p className="mt-5 text-sm text-white/55">A pessoa está procurando exatamente o que você faz.</p>
  </div>
)

const VisualConverter = () => (
  <div className="relative grid h-full w-full place-items-center p-6 sm:p-9">
    <Tag />
    <div className="w-full max-w-[19rem] rounded-[2rem] border border-white/15 bg-[#0e0e0e] p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
      <p className="font-display text-lg font-bold leading-tight text-white">Qual é o seu objetivo agora?</p>
      <div className="mt-4 space-y-2.5">
        {['Ser encontrado na internet', 'Vender mais com anúncios', 'Organizar e escalar'].map((o, i) => (
          <div
            key={o}
            className={`rounded-xl border px-4 py-3 text-sm ${i === 1 ? 'border-primary-500 bg-primary-600/15 text-white' : 'border-white/10 text-white/70'}`}
          >
            {o}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-full bg-primary-600 py-3 text-center text-sm font-semibold text-white">Continuar</div>
    </div>
  </div>
)

const VisualMedir = () => {
  const rows = [
    ['Google · pesquisa', 'eletricista residencial', 'Conversou', 'Orçamento'],
    ['Google · pesquisa', 'instalação de tomadas', 'Conversou', 'Venda'],
    ['Meta · feed', 'campanha de marca', 'Clicou', '—'],
    ['Google · pesquisa', 'quadro de distribuição', 'Conversou', 'Venda'],
  ]
  return (
    <div className="relative flex h-full w-full flex-col justify-center p-6 sm:p-9">
      <Tag />
      <p className="text-xs text-white/50">
        gclid=<span className="text-primary-400">Cj0KCQjw…</span> guardado em cada lead
      </p>
      <div className="mt-3 overflow-hidden rounded-xl border border-white/10 text-[13px]">
        <div className="grid grid-cols-[1.2fr_1.4fr_0.9fr_0.9fr] gap-2 bg-white/[0.05] px-4 py-2.5 font-semibold text-white/60">
          <span>Origem</span><span>Busca</span><span>Lead</span><span>Resultado</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1.2fr_1.4fr_0.9fr_0.9fr] gap-2 border-t border-white/10 px-4 py-3 text-white/85">
            <span>{r[0]}</span><span className="truncate">{r[1]}</span><span>{r[2]}</span>
            <span className={r[3] === 'Venda' ? 'font-semibold text-primary-400' : 'text-white/55'}>{r[3]}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-white/55">Você sabe qual anúncio gerou qual venda.</p>
    </div>
  )
}

const VisualReter = () => {
  const bars = [
    { label: '1ª compra', h: 34, hot: false },
    { label: '2ª compra', h: 62, hot: false },
    { label: '3ª compra', h: 100, hot: true },
  ]
  return (
    <div className="relative flex h-full w-full flex-col justify-center p-6 sm:p-9">
      <Tag />
      <p className="text-sm text-white/55">Valor acumulado de um cliente (LTV)</p>
      <div className="mt-4 flex h-44 items-end gap-4 border-b border-white/15 pb-0">
        {bars.map((b) => (
          <div key={b.label} className="flex h-full flex-1 flex-col items-center justify-end">
            <div
              className={`w-full rounded-t-lg ${b.hot ? 'bg-primary-500' : 'bg-white/20'}`}
              style={{ height: `${b.h}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4 text-xs text-white/60">
        {bars.map((b) => (
          <span key={b.label} className="flex-1 text-center">{b.label}</span>
        ))}
      </div>
      <p className="mt-6 text-sm text-white/55">Quem já comprou vale mais. Públicos da sua base trazem o cliente de volta.</p>
    </div>
  )
}

const stages: Stage[] = [
  { name: 'Atrair', line: 'Anúncios no Google e na Meta que chegam em quem já está procurando o que você faz.', visual: VisualAtrair },
  { name: 'Converter', line: 'Página, quiz e WhatsApp pensados para transformar o clique em conversa de verdade.', visual: VisualConverter },
  { name: 'Medir', line: 'Rastreio com gclid: cada lead leva a origem junto, do anúncio até a venda.', visual: VisualMedir },
  { name: 'Reter', line: 'Públicos da sua base de clientes e acompanhamento do LTV para o cliente voltar a comprar.', visual: VisualReter },
]

const Thesis = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(Math.min(stages.length - 1, Math.floor(p * stages.length)))
  })
  const Visual = stages[active].visual

  return (
    <section id="processo" className="relative">
      {/* Desktop: palco fixo que troca conforme o scroll */}
      <div ref={ref} className="hidden h-[360vh] lg:block">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-[88rem] grid-cols-12 items-center gap-12 px-8">
            <div className="col-span-5">
              <h2
                className="font-display font-bold text-white"
                style={{ fontSize: 'clamp(2.2rem, 4.4vw, 4rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
              >
                Quatro frentes. Um sistema só.
              </h2>
              <ul className="mt-12 space-y-1">
                {stages.map((s, i) => (
                  <li key={s.name}>
                    <button
                      onClick={() => {
                        const el = ref.current
                        if (!el) return
                        const top = el.offsetTop + ((el.offsetHeight - window.innerHeight) * (i + 0.5)) / stages.length
                        window.scrollTo({ top, behavior: 'smooth' })
                      }}
                      className="group block w-full py-3 text-left"
                      aria-current={active === i}
                    >
                      <span
                        className={`block font-display text-3xl font-bold tracking-tight transition-colors duration-500 ${
                          active === i ? 'text-white' : 'text-white/25 group-hover:text-white/50'
                        }`}
                      >
                        {s.name}
                      </span>
                      <span
                        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out ${
                          active === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="mt-2 block max-w-[38ch] text-base leading-relaxed text-white/70">{s.line}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-7">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(80%_70%_at_70%_0%,rgba(220,38,38,0.16),transparent_70%),#0d0d0d]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    className="absolute inset-0"
                    initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <Visual />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-5 flex gap-2" aria-hidden>
                {stages.map((_, i) => (
                  <span key={i} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-primary-500' : 'bg-white/15'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: blocos empilhados */}
      <div className="px-5 py-20 sm:px-8 lg:hidden">
        <h2
          className="font-display font-bold text-white"
          style={{ fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
        >
          Quatro frentes. Um sistema só.
        </h2>
        <div className="mt-12 space-y-16">
          {stages.map((s) => (
            <div key={s.name}>
              <h3 className="font-display text-3xl font-bold tracking-tight text-white">{s.name}</h3>
              <p className="mt-2 max-w-[40ch] text-base leading-relaxed text-white/70">{s.line}</p>
              <div className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d0d0d]">
                <s.visual />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Thesis

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'
import { ArrowRight, EASE, Reveal, Shards, waLink } from './shared'
import { plans } from './portfolioData'

const Plans = () => {
  const [id, setId] = useState(plans[0].id)
  const group = plans.find((p) => p.id === id) ?? plans[0]

  return (
    <section id="planos" className="relative isolate overflow-hidden px-5 py-24 sm:px-8 sm:py-36 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-[clamp(4rem,10vh,8rem)]">
      <Shards className="-z-10 opacity-70" />
      <div className="w-full mx-auto max-w-[88rem]">
        <Reveal>
          <h2
            className="max-w-[20ch] font-display font-bold text-white"
            style={{ fontSize: 'clamp(2.2rem, min(5vw, 9vh), 4.4rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
          >
            Planos para cada momento do negócio.
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-white/70">
            O investimento é definido em uma consultoria, depois que a gente entende o seu momento e o que o seu negócio já tem pronto.
          </p>
        </Reveal>

        <div role="tablist" aria-label="Tipo de plano" className="mt-12 inline-flex rounded-full border border-white/15 p-1">
          {plans.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={p.id === id}
              onClick={() => setId(p.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 sm:px-7 sm:text-base ${
                p.id === id ? 'bg-primary-600 text-white' : 'text-white/65 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={group.id}
            role="tabpanel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <p className="mt-8 max-w-[60ch] text-base text-white/60">{group.intro}</p>

            {/* Um único painel com colunas separadas por linhas finas, não três cartões soltos */}
            <div className="mt-8 grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40 lg:grid-cols-3">
              {group.tiers.map((t, i) => (
                <div
                  key={t.name}
                  className={`group flex flex-col p-7 transition-colors duration-500 hover:bg-white/[0.03] sm:p-9 ${
                    i > 0 ? 'border-t border-white/10 lg:border-l lg:border-t-0' : ''
                  }`}
                >
                  <h3 className="font-display text-3xl font-bold tracking-tight text-white">{t.name}</h3>
                  {t.forWho && <p className="mt-2 min-h-[3.5rem] text-base italic leading-snug text-white/55">{t.forWho}</p>}
                  <ul className={`space-y-3 ${t.forWho ? 'mt-5' : 'mt-6'}`}>
                    {t.items.map((it) => (
                      <li key={it} className="flex gap-3 text-base leading-snug text-white/80">
                        <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" aria-hidden />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex-1" />
                  <a
                    href={waLink(`Oi! Vim pelo site da VirtualMark. Tenho interesse em ${group.label.toLowerCase()}: ${t.name}. Podemos conversar?`)}
                    className="mt-8 inline-flex items-center gap-2 self-start text-base font-semibold text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-primary-500"
                  >
                    Conversar sobre {t.name} <ArrowRight />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Plans

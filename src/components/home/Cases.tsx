import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { BrowserFrame, EASE, Shards } from './shared'
import { flagship } from './portfolioData'

const src = (img: string) => `/home/cases/${img}.webp`

const Bullets = ({ items }: { items: (typeof flagship)[number]['bullets'] }) => (
  <ul className="space-y-3 text-lg leading-snug text-white/70">
    {items.map((b) => (
      <li key={b.lead}>
        <span className="font-semibold text-white">{b.lead}</span> {b.rest}
      </li>
    ))}
  </ul>
)

const Cases = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(Math.min(flagship.length - 1, Math.floor(p * flagship.length)))
  })
  const c = flagship[active]

  return (
    <section id="cases" className="relative">
      {/* Desktop: palco fixo, uma cena por case */}
      <div ref={ref} className="hidden lg:block" style={{ height: `${flagship.length * 90 + 60}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <Shards className="-z-10 opacity-90" />
          <div className="mx-auto grid w-full max-w-[88rem] grid-cols-12 items-center gap-12 px-8">
            <div className="col-span-5">
              <h2
                className="font-display font-bold text-white"
                style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.8rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
              >
                O que a gente fez, caso a caso.
              </h2>
              <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-1">
                {flagship.map((f, i) => (
                  <li key={f.slug}>
                    <button
                      onClick={() => {
                        const el = ref.current
                        if (!el) return
                        const top = el.offsetTop + ((el.offsetHeight - window.innerHeight) * (i + 0.5)) / flagship.length
                        window.scrollTo({ top, behavior: 'smooth' })
                      }}
                      className={`font-display text-lg font-bold tracking-tight transition-colors duration-500 ${
                        active === i ? 'text-white' : 'text-white/30 hover:text-white/60'
                      }`}
                      aria-current={active === i}
                    >
                      {f.name}
                    </button>
                  </li>
                ))}
              </ul>
              <AnimatePresence mode="wait">
                <motion.div
                  key={c.slug}
                  className="mt-8"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <h3 className="font-display text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">{c.title}</h3>
                  <div className="mt-6 max-w-[44ch]">
                    <Bullets items={c.bullets} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <BrowserFrame src={src(c.img)} alt={`Site ${c.name}`} ratio={c.ratio} eager />
                  {c.domain && <p className="mt-4 text-sm text-white/50">{c.domain}</p>}
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 flex gap-2" aria-hidden>
                {flagship.map((_, i) => (
                  <span key={i} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-primary-500' : 'bg-white/15'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: um bloco por case */}
      <div className="relative px-5 py-20 sm:px-8 lg:hidden">
        <h2
          className="font-display font-bold text-white"
          style={{ fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
        >
          O que a gente fez, caso a caso.
        </h2>
        <div className="mt-12 space-y-16">
          {flagship.map((f) => (
            <div key={f.slug}>
              <p className="text-sm text-white/50">{f.name}</p>
              <h3 className="mt-1 font-display text-3xl font-bold leading-tight tracking-tight text-white">{f.title}</h3>
              <div className="mt-5">
                <Bullets items={f.bullets} />
              </div>
              <BrowserFrame className="mt-6" src={src(f.img)} alt={`Site ${f.name}`} ratio={f.ratio} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Cases

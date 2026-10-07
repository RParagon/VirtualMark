import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BrowserFrame, EASE, Reveal } from './shared'
import { works, type Client } from './portfolioData'

const all: Client[] = works.flatMap((g) => g.items)
const withImg = all.filter((c) => c.img)

const Row = ({ c, active, onEnter }: { c: Client; active: boolean; onEnter: () => void }) => {
  const inner = (
    <>
      <span
        className={`font-display text-[clamp(1.5rem,3vw,2.6rem)] font-bold leading-none tracking-[-0.03em] transition-[color,transform] duration-500 ease-out ${
          active ? 'translate-x-2 text-primary-400' : 'text-white'
        }`}
      >
        {c.name}
      </span>
      <span className="text-sm text-white/55 sm:text-right sm:text-base">{c.what}</span>
    </>
  )
  const cls = 'flex flex-col gap-2 border-t border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-6'
  return c.href ? (
    <a href={c.href} onMouseEnter={onEnter} onFocus={onEnter} className={cls}>{inner}</a>
  ) : (
    <div onMouseEnter={onEnter} className={cls}>{inner}</div>
  )
}

const Works = () => {
  const [slug, setSlug] = useState(withImg[0].slug)
  const current = withImg.find((c) => c.slug === slug) ?? withImg[0]

  return (
    <section id="casos" className="relative px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[88rem]">
        <Reveal>
          <h2
            className="max-w-[18ch] font-display font-bold text-white"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.4rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
          >
            O que a gente já colocou no ar.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {works.map((g) => (
              <div key={g.group} className="mb-12 last:mb-0">
                <h3 className="mb-2 text-sm text-white/45">{g.group}</h3>
                <div className="border-b border-white/10">
                  {g.items.map((c) => (
                    <Row key={c.slug} c={c} active={c.slug === slug} onEnter={() => c.img && setSlug(c.slug)} />
                  ))}
                </div>
              </div>
            ))}
            <Link
              to="/cases"
              className="mt-2 inline-flex items-center gap-2 text-base font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-primary-500"
            >
              Ver todos os cases <ArrowRight />
            </Link>
          </div>

          {/* Prévia: acompanha o item sob o mouse (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <BrowserFrame src={`/home/cases/${current.img}.webp`} alt={`Site ${current.name}`} ratio={current.ratio} />
                  <p className="mt-4 text-sm text-white/50">{current.domain ?? current.name}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Works

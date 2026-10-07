import { useRef } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { EASE } from './shared'

const steps = [
  { t: 'Conversa', d: 'Entendemos o negócio, o público e o objetivo.' },
  { t: 'Estrutura', d: 'Site, páginas, Google Meu Negócio e rastreio no lugar.' },
  { t: 'Campanha', d: 'Configuração e criação de campanhas.' },
  { t: 'Evolução', d: 'Acompanhamos os dados e ajustamos o que traz contato de qualidade.' },
]

const Process = () => {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.6'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <section id="comecar" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-[clamp(4rem,10vh,8rem)]">
      <div className="w-full mx-auto max-w-[88rem]">
        <h2
          className="max-w-[16ch] font-display font-bold text-white"
          style={{ fontSize: 'clamp(2.4rem, min(6vw, 10vh), 5.2rem)', lineHeight: 1, letterSpacing: '-0.035em', textWrap: 'balance' }}
        >
          Como a gente começa com você.
        </h2>

        <div className="relative mt-16">
          {/* trilho: horizontal no desktop, vertical no mobile */}
          <div className="absolute left-0 top-0 hidden h-[3px] w-full bg-white/15 lg:block" aria-hidden />
          <motion.div
            className="absolute left-0 top-0 hidden h-[3px] w-full origin-left bg-primary-500 lg:block"
            style={{ scaleX: fill }}
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-white/15 lg:hidden" aria-hidden />
          <motion.div className="absolute bottom-0 left-0 top-0 w-[3px] origin-top bg-primary-500 lg:hidden" style={{ scaleY: fill }} aria-hidden />

          <ol ref={ref} className="grid gap-12 pl-8 lg:grid-cols-4 lg:gap-10 lg:pl-0 lg:pt-10">
            {steps.map((s, i) => (
              <motion.li
                key={s.t}
                initial={reduce ? false : { opacity: 0.25, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: '-20% 0px -20% 0px', once: true }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
              >
                <h3 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{s.t}</h3>
                <p className="mt-3 max-w-[30ch] text-lg leading-relaxed text-white/70">{s.d}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default Process

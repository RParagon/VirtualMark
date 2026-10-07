import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, EASE, waLink } from './shared'

const Line = ({ children, delay }: { children: React.ReactNode; delay: number }) => {
  const reduce = useReducedMotion()
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

const recent = ['WB Soluções Elétricas', 'CAIG', 'Quiro', 'Maré e Sabor', 'Ópticas Miyagui']

const HomeHero = () => {
  const reduce = useReducedMotion()
  const fade = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay } }

  return (
    <section id="hero" className="relative isolate min-h-[100svh] overflow-hidden px-5 sm:px-8">
      {/* luz: o vermelho é fonte de luz, não preenchimento */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(55% 55% at 76% 42%, rgba(220,38,38,0.16) 0%, rgba(220,38,38,0.04) 45%, transparent 70%)',
        }}
      />

      <div className="absolute inset-y-0 left-0 -z-10 hidden w-[58%] bg-gradient-to-r from-background/85 via-background/45 to-transparent lg:block" aria-hidden />

      <div className="mx-auto flex min-h-[100svh] max-w-[88rem] flex-col justify-center pb-24 pt-28">
        <h1
          className="font-display font-bold text-white"
          style={{
            fontSize: 'clamp(2.7rem, 6.4vw, 6rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.035em',
            textWrap: 'balance',
          }}
        >
          <Line delay={0.1}>Você chega</Line>
          <Line delay={0.16}>com uma ideia.</Line>
          <Line delay={0.28}>Sai com o</Line>
          <Line delay={0.34}>
            negócio <span className="text-primary-500">no ar.</span>
          </Line>
        </h1>

        {/* faixa reservada para a cena 3D no celular e no tablet em pé */}
        <div id="hero-scene" className="my-1 h-[30svh] lg:hidden" aria-hidden />

        <motion.p
          {...fade(0.55)}
          className="mt-7 max-w-[40ch] text-lg leading-relaxed text-white/75 sm:text-xl"
        >
          Marca, site, criativos, tráfego pago e rastreio do clique até a venda. Tudo com a mesma
          equipe.
        </motion.p>

        <motion.div {...fade(0.7)} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href="#caminhos"
            className="group inline-flex items-center gap-3 rounded-full bg-primary-600 py-3.5 pl-7 pr-3.5 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(220,38,38,0.7)] transition-colors hover:bg-primary-500"
          >
            Quero minha consultoria
            <span className="grid h-9 w-9 place-items-center rounded-full bg-black/25 transition-transform group-hover:translate-x-1">
              <ArrowRight />
            </span>
          </a>
          <a
            href={waLink('Oi! Vim pelo site da VirtualMark e quero conversar sobre o meu negócio.')}
            className="text-base font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-primary-500"
          >
            Prefiro falar no WhatsApp
          </a>
        </motion.div>

        <motion.div {...fade(0.9)} className="mt-14 max-w-3xl">
          <p className="text-sm text-white/55">No ar recentemente</p>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-display text-base font-semibold text-white/85">
            {recent.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 -z-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

export default HomeHero

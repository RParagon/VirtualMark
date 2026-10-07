import { useRef } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { BrowserFrame, EASE } from './shared'

const steps = [
  { t: 'A necessidade', d: 'Um engenheiro de energia e eletricista queria prestar serviços e alcançar mais gente. Não tinha site, logo nem presença online.' },
  { t: 'Branding do zero', d: 'Sem logo, criamos a identidade antes de qualquer tela e montamos o moodboard para planejar o site.' },
  { t: 'Aprovação', d: 'Logo e moodboard aprovados pelo cliente. Rápido, com o time interno.' },
  { t: 'Site e Google Meu Negócio', d: 'Desenvolvimento do site e criação do perfil no Google Meu Negócio, em paralelo.' },
  { t: 'Revisão', d: 'O cliente revisou, pedimos os ajustes e fechamos tudo.' },
  { t: 'Primeira campanha', d: 'Rede de pesquisa do Google levando para uma página de conversão e dali para o WhatsApp, atrás de quem busca o serviço na hora.' },
  { t: 'Rastreio com gclid', d: 'Cada lead guarda de qual anúncio e de qual busca veio, para entender o resultado a longo prazo.' },
]

const Step = ({ s }: { s: (typeof steps)[number] }) => {
  const reduce = useReducedMotion()
  return (
    <motion.li
      className="relative pb-14 pl-10 last:pb-0 sm:pl-14"
      initial={reduce ? false : { opacity: 0.25, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: '-35% 0px -35% 0px', once: false }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <span className="absolute left-0 top-[0.55rem] h-3 w-3 -translate-x-[calc(50%-0.5px)] rounded-full bg-primary-500 shadow-[0_0_0_6px_rgba(10,10,10,1),0_0_24px_4px_rgba(239,68,68,0.55)]" />
      <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{s.t}</h3>
      <p className="mt-2 max-w-[48ch] text-base leading-relaxed text-white/70 sm:text-lg">{s.d}</p>
    </motion.li>
  )
}

const CaseWB = () => {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.6'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <section id="caso-wb" className="relative px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-[88rem] gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2
              className="font-display font-bold text-white"
              style={{ fontSize: 'clamp(2.2rem, 4.8vw, 4.2rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
            >
              Do zero ao ar: o caso da WB Soluções Elétricas.
            </h2>
            <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-white/70">
              O cliente chegou sem nada e recebeu a estrutura completa, de ponta a ponta, sem precisar
              se envolver em cada etapa.
            </p>
            <BrowserFrame className="mt-8 max-w-[34rem]" src="/home/cases/wb.webp" alt="Site da WB Soluções Elétricas" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative">
            <div className="absolute bottom-2 left-0 top-3 w-px bg-white/15" aria-hidden />
            <motion.div
              className="absolute left-0 top-3 w-px origin-top bg-primary-500"
              style={{ scaleY: fill, bottom: '0.5rem' }}
              aria-hidden
            />
            <ol ref={ref} className="relative">
              {steps.map((s) => (
                <Step key={s.t} s={s} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CaseWB

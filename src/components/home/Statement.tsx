import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'

type W = { t: string; hot?: boolean }

const words: W[] = [
  { t: 'Clientes' }, { t: 'que' }, { t: 'faturaram' }, { t: 'mais' }, { t: 'de' },
  { t: 'R$ 10 milhões', hot: true }, { t: 'com' }, { t: 'R$ 1,5 milhão', hot: true },
  { t: 'investidos' }, { t: 'em' }, { t: 'mais' }, { t: 'de' }, { t: '5 mil anúncios', hot: true },
  { t: 'no' }, { t: 'Google' }, { t: 'e' }, { t: 'na' }, { t: 'Meta.' },
]

const Word = ({ w, i, n, p, reduce }: { w: W; i: number; n: number; p: MotionValue<number>; reduce: boolean }) => {
  const start = (i / n) * 0.8
  const end = start + 0.14
  const opacity = useTransform(p, [start, end], [0.16, 1])
  return (
    <motion.span style={reduce ? undefined : { opacity }} className={w.hot ? 'text-primary-500' : 'text-white'}>
      {w.t}{' '}
    </motion.span>
  )
}

const Statement = () => {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = !!useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })

  return (
    <section className="relative px-5 py-28 sm:px-8 sm:py-40">
      <div className="mx-auto max-w-[88rem]">
        <p
          ref={ref}
          className="max-w-[24ch] font-display font-bold sm:max-w-[26ch]"
          style={{ fontSize: 'clamp(2rem, 5.2vw, 4.6rem)', lineHeight: 1.04, letterSpacing: '-0.03em', textWrap: 'balance' }}
        >
          {words.map((w, i) => (
            <Word key={i} w={w} i={i} n={words.length} p={scrollYProgress} reduce={reduce} />
          ))}
        </p>
        <p className="mt-10 max-w-[52ch] text-lg leading-relaxed text-white/65">
          E cada clique rastreado até virar conversa, orçamento e venda. É por isso que a gente
          enxerga o que funciona e corta o que não funciona.
        </p>
        <p className="mt-3 text-sm text-white/45">Acumulado dos projetos da VirtualMark.</p>
      </div>
    </section>
  )
}

export default Statement

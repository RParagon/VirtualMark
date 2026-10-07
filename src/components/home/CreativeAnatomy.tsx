import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import wave from './miyagui-wave.json'
import { EASE } from './shared'

/* Quadros e áudio vêm do próprio vídeo (public/home/frames, miyagui-wave.json). */

const frames = [0, 1, 2, 3, 4, 5].map((i) => `/home/frames/f${i}.jpg`)

const steps = [
  { t: 'Foto do produto e do modelo', d: 'Tudo começa com o que o cliente vende e quem vai mostrar isso.' },
  { t: 'Storyboard no ChatGPT', d: 'A foto e o modelo viram um storyboard: cena a cena, antes de gerar qualquer vídeo.' },
  { t: 'Vídeo no Google Flow', d: 'Prompt mais storyboard geram as cenas em vídeo com IA.' },
  { t: 'Narração e trilha', d: 'A voz e o som fecham o criativo, com edição e acabamento feitos por nós.' },
]

/* ───────── vídeo no celular ───────── */

const Phone = () => {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => undefined)
        else v.pause()
      },
      { threshold: 0.25 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-[17rem] rounded-[2.4rem] border border-white/15 bg-black p-2 shadow-[0_40px_80px_-30px_rgba(220,38,38,0.45)]">
      <video
        ref={ref}
        className="aspect-[9/16] w-full rounded-[1.9rem] bg-neutral-900 object-cover"
        poster="/home/miyagui-poster.jpg"
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label="Criativo em vídeo feito com IA para Ópticas Miyagui"
      >
        <source src="/home/miyagui.webm" type="video/webm" />
        <source src="/home/miyagui.mp4" type="video/mp4" />
      </video>
      <button
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-5 right-5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-primary-600"
      >
        {muted ? 'Ativar som' : 'Silenciar'}
      </button>
    </div>
  )
}

/* ───────── camadas ───────── */

const Layer0 = () => (
  <div className="flex h-full items-center justify-center gap-4 p-6 sm:gap-6 sm:p-10">
    {[
      { src: frames[2], label: 'Produto' },
      { src: frames[0], label: 'Modelo' },
    ].map((f, i) => (
      <div key={f.label} className="flex items-center gap-4 sm:gap-6">
        {i === 1 && <span className="font-display text-4xl font-bold text-primary-500">+</span>}
        <figure className="w-[8.5rem] sm:w-[11rem]">
          <img src={f.src} alt={f.label} loading="lazy" className="aspect-[9/16] w-full rounded-2xl object-cover" />
          <figcaption className="mt-2 text-sm text-white/60">{f.label}</figcaption>
        </figure>
      </div>
    ))}
  </div>
)

const Layer1 = () => (
  <div className="grid h-full grid-cols-3 content-center gap-3 p-6 sm:gap-4 sm:p-10">
    {frames.map((f, i) => (
      <motion.figure
        key={f}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
      >
        <img src={f} alt={`Cena ${i + 1} do storyboard`} loading="lazy" className="aspect-[9/16] w-full rounded-xl object-cover" />
        <figcaption className="mt-1.5 text-xs text-white/55">Cena {i + 1}</figcaption>
      </motion.figure>
    ))}
    <p className="col-span-3 mt-2 text-sm text-white/50">Cenas do vídeo final.</p>
  </div>
)

const Layer2 = () => (
  <div className="flex h-full flex-col justify-center gap-6 p-6 sm:p-10">
    <div className="flex items-center gap-3 overflow-hidden">
      {frames.slice(0, 4).map((f) => (
        <img key={f} src={f} alt="" loading="lazy" className="aspect-[9/16] w-[22%] rounded-lg object-cover opacity-80" />
      ))}
    </div>
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-white/20" />
      <span className="rounded-full border border-primary-500/60 bg-primary-600/15 px-4 py-1.5 text-sm font-semibold text-white">
        prompt + storyboard
      </span>
      <span className="h-px flex-1 bg-white/20" />
    </div>
    <p className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
      Vídeo de 11 segundos, pronto para anunciar.
    </p>
  </div>
)

const Layer3 = () => (
  <div className="flex h-full flex-col justify-center p-6 sm:p-10">
    <div className="flex h-40 items-center gap-[3px] sm:h-48" role="img" aria-label="Forma de onda do áudio do criativo">
      {(wave as number[]).map((v, i) => (
        <motion.span
          key={i}
          className="w-full rounded-full bg-primary-500"
          initial={{ height: '4%' }}
          animate={{ height: `${Math.max(6, v * 100)}%` }}
          transition={{ duration: 0.7, ease: EASE, delay: i * 0.012 }}
        />
      ))}
    </div>
    <p className="mt-6 text-sm text-white/55">Áudio real do criativo da Miyagui.</p>
  </div>
)

const layers = [Layer0, Layer1, Layer2, Layer3]

/* ───────── seção ───────── */

const CreativeAnatomy = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(Math.min(steps.length - 1, Math.floor(p * steps.length))))
  const tilt = useTransform(scrollYProgress, [0, 1], [-10, 6])
  const Layer = layers[active]

  return (
    <section id="criativos" className="relative">
      {/* Desktop */}
      <div ref={ref} className="hidden h-[340vh] lg:block">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-[88rem] grid-cols-12 items-center gap-10 px-8">
            <div className="col-span-4">
              <h2
                className="font-display font-bold text-white"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
              >
                Um criativo em vídeo, desmontado.
              </h2>
              <ol className="mt-10 space-y-1">
                {steps.map((s, i) => (
                  <li key={s.t} className="py-2">
                    <p className={`font-display text-xl font-bold tracking-tight transition-colors duration-500 ${active === i ? 'text-white' : 'text-white/25'}`}>
                      {s.t}
                    </p>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out ${active === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <p className="overflow-hidden text-base leading-relaxed text-white/70">
                        <span className="mt-1 block max-w-[34ch]">{s.d}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <motion.div className="col-span-3" style={{ rotateY: tilt, transformPerspective: 1200 }}>
              <Phone />
              <p className="mt-4 text-center text-sm text-white/50">Criativo feito para Ópticas Miyagui</p>
            </motion.div>

            <div className="col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(80%_60%_at_80%_0%,rgba(220,38,38,0.14),transparent_70%),#0d0d0d]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <Layer />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet */}
      <div className="px-5 py-20 sm:px-8 lg:hidden">
        <h2
          className="font-display font-bold text-white"
          style={{ fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
        >
          Um criativo em vídeo, desmontado.
        </h2>
        <div className="mt-10">
          <Phone />
          <p className="mt-4 text-center text-sm text-white/50">Criativo feito para Ópticas Miyagui</p>
        </div>
        <div className="mt-14 space-y-14">
          {steps.map((s, i) => {
            const L = layers[i]
            return (
              <div key={s.t}>
                <h3 className="font-display text-2xl font-bold tracking-tight text-white">{s.t}</h3>
                <p className="mt-2 max-w-[40ch] text-base leading-relaxed text-white/70">{s.d}</p>
                <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d0d0d]">
                  <L />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CreativeAnatomy

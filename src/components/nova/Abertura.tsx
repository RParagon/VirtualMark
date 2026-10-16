import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { MarkEstado } from './mark'
import { Botao, EASE, Etiqueta, Mark, Mono, Sobrelinha, waLink } from './ui'

type Opcao = { rotulo: string; estado: MarkEstado; fala: string; acao: string; href: string }

const OPCOES: Opcao[] = [
  {
    rotulo: 'E-commerce',
    estado: 'analisando',
    fala: 'Boa. Em loja online eu olho custo por venda e retorno do anúncio. Tenho um diagnóstico de três perguntas pra isso.',
    acao: 'Fazer o diagnóstico',
    href: '/quiz-ecommerce',
  },
  {
    rotulo: 'Loja ou serviço local',
    estado: 'atendendo',
    fala: 'Negócio local vende pelo WhatsApp. Me conta a cidade e o que você vende, que a equipe te responde por lá.',
    acao: 'Chamar no WhatsApp',
    href: waLink('Oi! Tenho um negócio local e quero vender mais com anúncios.'),
  },
  {
    rotulo: 'Clínica e saúde',
    estado: 'falando',
    fala: 'Clínica vive de agenda cheia. Já geramos 1.714 contatos para uma clínica. Quer ver como isso fica no seu caso?',
    acao: 'Quero ver no meu caso',
    href: waLink('Oi! Tenho uma clínica e quero mais pacientes vindos de anúncio.'),
  },
  {
    rotulo: 'Ainda não anuncio',
    estado: 'pronto',
    fala: 'Melhor ainda: dá pra começar do jeito certo. A avaliação gratuita mostra verba, público e criativo do primeiro mês.',
    acao: 'Quero minha avaliação',
    href: '#contato',
  },
]

const PROVAS = [
  ['23,5x', 'de retorno numa loja de lingerie'],
  ['34 mil', 'vendas para uma loja de games'],
  ['1.714', 'contatos para uma clínica'],
]

const CartaoMark = () => {
  const [escolha, setEscolha] = useState<Opcao | null>(null)
  const [pensando, setPensando] = useState(false)
  const timer = useRef<number>()
  const reduce = useReducedMotion()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const escolher = (o: Opcao) => {
    window.clearTimeout(timer.current)
    setEscolha(o)
    setPensando(true)
    timer.current = window.setTimeout(() => setPensando(false), reduce ? 0 : 900)
  }

  const estado: MarkEstado = pensando ? 'pensando' : escolha ? escolha.estado : 'olhando'

  return (
    <div className="relative w-full rounded-[32px] border border-vm-borda bg-vm-sup p-6 sm:p-8 lg:w-[520px] lg:shrink-0">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-vm-verde opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-vm-verde" />
          </span>
          <Mono className="!text-xs !text-vm-suave">Mark · online</Mono>
        </span>
        <Mono className="!text-xs">diagnóstico grátis</Mono>
      </div>

      <div className="mt-5 min-h-[132px] rounded-[20px] rounded-tl-md bg-vm-sup2 px-5 py-[18px]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {pensando ? (
            <motion.div key="digitando" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-[96px] items-center gap-1.5" aria-label="Mark está digitando">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="h-2 w-2 rounded-full bg-vm-suave" animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </motion.div>
          ) : (
            <motion.div key={escolha?.rotulo ?? 'inicio'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease: EASE }}>
              <p className="font-manrope text-lg font-semibold leading-snug text-vm-texto">
                {escolha ? escolha.fala : 'Oi, eu sou o Mark. Que tipo de negócio você quer fazer vender mais?'}
              </p>
              {escolha ? (
                <a href={escolha.href} {...(escolha.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group mt-3 inline-flex items-center gap-2 font-manrope text-sm font-semibold text-vm-vermt">
                  {escolha.acao}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              ) : (
                <p className="mt-1.5 font-manrope text-sm text-vm-suave">Escolha uma opção e eu monto um diagnóstico do seu caso.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5" role="group" aria-label="Tipo de negócio">
        {OPCOES.map((o) => (
          <Etiqueta key={o.rotulo} estado={escolha?.rotulo === o.rotulo ? 'ativo' : 'padrao'} onClick={() => escolher(o)}>
            {o.rotulo}
          </Etiqueta>
        ))}
      </div>

      <div className="relative mt-5 h-[230px] sm:h-[250px]">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(220,38,38,0.28), rgba(220,38,38,0))' }} aria-hidden />
        <div className="absolute left-1/2 top-8 -translate-x-1/2 sm:top-2">
          <Mark estado={estado} size={220} className="h-[170px] w-[170px] sm:h-[220px] sm:w-[220px]" label="Mark, o assistente da Virtual Mark" />
        </div>
        <div className="absolute -left-1 top-0 origin-top-left -rotate-3 scale-[0.85] sm:left-0 sm:top-10 sm:scale-100 animate-[vmflutua_6s_ease-in-out_infinite] rounded-2xl border border-vm-borda bg-vm-fundo px-3.5 py-3 shadow-xl shadow-black/20 motion-reduce:animate-none">
          <Mono className="!text-[10px]">Retorno do mês</Mono>
          <p className="font-manrope text-2xl font-bold tracking-tight text-vm-verde">23,7x</p>
          <p className="font-manrope text-[11px] text-vm-suave">loja de lingerie · set</p>
        </div>
        <div className="absolute -right-1 bottom-0 origin-bottom-right rotate-2 scale-[0.85] sm:bottom-6 sm:right-0 sm:scale-100 animate-[vmflutua_7s_ease-in-out_1.5s_infinite] rounded-2xl border border-vm-borda bg-vm-fundo px-3.5 py-3 shadow-xl shadow-black/20 motion-reduce:animate-none">
          <Mono className="!text-[10px]">Custo por venda</Mono>
          <p className="font-manrope text-2xl font-bold tracking-tight text-vm-texto">R$ 11,31</p>
          <p className="font-manrope text-[11px] text-vm-suave">loja de games · 12 meses</p>
        </div>
      </div>
    </div>
  )
}

export const Abertura = () => {
  const reduce = useReducedMotion()
  const item = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay: 0.08 + i * 0.09 },
  })

  return (
    <section className="mx-auto flex max-w-[90rem] flex-col items-center gap-14 px-5 pb-20 pt-12 sm:px-8 lg:flex-row lg:gap-16 lg:px-20 lg:pb-24 lg:pt-[88px]">
      <div className="w-full min-w-0 flex-1">
        <motion.div {...item(0)}>
          <Sobrelinha>Tráfego pago · Criativos · Site</Sobrelinha>
        </motion.div>
        <motion.h1 {...item(1)} className="mt-7 font-manrope text-[clamp(2.9rem,6.4vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-vm-texto" style={{ textWrap: 'balance' }}>
          O X da questão é <span className="text-vm-vermt">vender mais.</span>
        </motion.h1>
        <motion.p {...item(2)} className="mt-7 max-w-[34rem] font-manrope text-lg leading-relaxed text-vm-suave sm:text-xl">
          Tráfego pago, criativos e site em um só time. E todo mês você vê o retorno em reais, não em curtidas.
        </motion.p>
        <motion.div {...item(3)} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Botao href="#contato">Quero minha avaliação gratuita</Botao>
          <Botao tipo="texto" href="#cases">Ver os cases</Botao>
        </motion.div>
        <motion.dl {...item(4)} className="mt-10 grid grid-cols-3 gap-4 border-t border-vm-borda pt-5 sm:gap-5">
          {PROVAS.map(([n, d]) => (
            <div key={n}>
              <dt className="font-manrope text-lg font-bold tracking-tight text-vm-texto sm:text-[22px]">{n}</dt>
              <dd className="mt-0.5 font-manrope text-xs leading-snug text-vm-apagado sm:text-[13px]">{d}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 36, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
        className="w-full lg:w-auto"
      >
        <CartaoMark />
      </motion.div>
    </section>
  )
}

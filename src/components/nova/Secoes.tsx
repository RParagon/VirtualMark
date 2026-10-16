import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Ancora, useMarkGuia } from './MarkGuia'
import { Botao, Contador, EASE, Etiqueta, Mono, Sobrelinha, Surge } from './ui'

const caixa = 'mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-20'
/** No desktop cada seção ocupa uma tela e centraliza o conteúdo. */
const tela = 'lg:flex lg:min-h-[calc(100svh-93px)] lg:flex-col lg:justify-center lg:py-[clamp(24px,5vh,112px)]'

const Titulo = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h2 className={`font-manrope text-[clamp(2.25rem,min(4.4vw,6.4vh),3.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-vm-texto ${className}`} style={{ textWrap: 'balance' }}>
    {children}
  </h2>
)

const Cabecalho = ({ sobre, titulo, texto, ancora }: { sobre: string; titulo: ReactNode; texto?: string; ancora?: ReactNode }) => (
  <Surge className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-16">
    <div className="flex-1">
      <Sobrelinha>{sobre}</Sobrelinha>
      <Titulo className="mt-5">{titulo}</Titulo>
    </div>
    {ancora}
    {texto && <p className="max-w-[440px] font-manrope text-lg leading-relaxed text-vm-suave">{texto}</p>}
  </Surge>
)

/* ───────── Quem já vende com a gente ───────── */
const Segmentos = () => (
  <div className="py-10" aria-label="Quem já vende com a gente">
    <div className={`${caixa} flex flex-col items-center gap-5`}>
      <Mono className="!text-xs !tracking-[0.12em]">Quem já vende com a gente</Mono>
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-9">
        {['Loja de games', 'Loja de lingerie', 'Clínica', 'Energia solar', 'Ótica'].map((s, i) => (
          <li key={s} className="flex items-center gap-6 sm:gap-9">
            {i > 0 && <span className="h-[5px] w-[5px] rounded-full bg-vm-verm" aria-hidden />}
            <span className="font-manrope text-xl font-bold tracking-[-0.015em] text-vm-apagado transition-colors duration-300 hover:text-vm-texto sm:text-2xl">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

/* ───────── Números (centralizados) ───────── */
const NUMEROS: { antes?: string; valor: number; casas?: number; depois: string; texto: string }[] = [
  { antes: 'R$ ', valor: 10, depois: ' mi', texto: 'faturados para clientes com anúncios' },
  { antes: 'R$ ', valor: 1.5, casas: 1, depois: ' mi', texto: 'investidos em mídia sob nossa gestão' },
  { valor: 5, depois: ' mil', texto: 'anúncios criados' },
]

const Numeros = () => (
  <div className="py-12 lg:py-10" aria-label="Números da Virtual Mark">
    <dl className={`${caixa} grid grid-cols-1 divide-y divide-vm-borda sm:grid-cols-3 sm:divide-x sm:divide-y-0`}>
      {NUMEROS.map((n, i) => (
        <Surge key={n.texto} delay={i * 0.08} className="flex flex-col items-center px-6 py-8 text-center sm:py-2 lg:px-10">
          <dt className="order-2 mt-3 max-w-[22ch] font-manrope text-base leading-snug text-vm-suave">{n.texto}</dt>
          <dd className="order-1 flex items-baseline justify-center whitespace-nowrap font-manrope font-extrabold leading-none tracking-[-0.045em] text-vm-texto">
            <span className="mr-1 text-[clamp(2.25rem,3.6vw,3.5rem)] text-vm-vermt">+</span>
            <span className="text-[clamp(3rem,5vw,4.5rem)]">
              {n.antes}
              <Contador para={n.valor} casas={n.casas} />
              {n.depois}
            </span>
          </dd>
        </Surge>
      ))}
    </dl>
  </div>
)

/* Tela de prova: quem já vende + números, com o Mark olhando */
export const Prova = () => (
  <section className={`border-y border-vm-borda ${tela}`}>
    <div className="hidden justify-center lg:flex">
      <Ancora id="prova" estado="olhando" className="w-[120px] baixo:w-[96px]" />
    </div>
    <Segmentos />
    <div className={caixa}>
      <div className="h-px w-full bg-vm-borda" />
    </div>
    <Numeros />
  </section>
)

/* ───────── O que a gente faz ───────── */
const VENDAS = [['out', 1178], ['fev', 1865], ['mai', 3678], ['jul', 4469], ['set', 4494]] as const

const Icone = ({ d }: { d: ReactNode }) => (
  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-vm-verms text-vm-vermt">
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {d}
    </svg>
  </span>
)

const APOIO = [
  { n: '02', t: 'Sites e landing pages', d: 'Página rápida, feita para o anúncio: uma oferta, um botão, WhatsApp à mão.', ind: 'Taxa de conversão da página', ic: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></> },
  { n: '03', t: 'Criativos estáticos e em vídeo', d: 'Peças com obra, produto e gente de verdade. Banco de imagem só quando não tem outro jeito.', ind: 'Custo por clique e retenção do vídeo', ic: <><rect x="3" y="5" width="13" height="14" rx="2" /><path d="M16 10l5-3v10l-5-3" /></> },
  { n: '04', t: 'Rastreio e painel de resultado', d: 'Cada lead leva a origem do anúncio (GCLID). Você vê de qual campanha veio cada venda.', ind: 'Venda por campanha, no painel do mês', ic: <path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6" /> },
]

export const Servicos = () => {
  const reduce = useReducedMotion()
  return (
    <section id="servicos" className={`scroll-mt-24 py-24 ${tela}`}>
      <div className={caixa}>
        <Cabecalho
          sobre="O que a gente faz"
          titulo={<>Anúncio, página e medição. <span className="text-vm-vermt">Um só time.</span></>}
          texto="Anúncio bom levando para site ruim não vende. Site bom sem anúncio não é visto. Por isso a gente cuida dos três juntos."
          ancora={<Ancora id="servicos" estado="analisando" className="hidden w-[120px] shrink-0 lg:block baixo:w-[92px]" />}
        />
        <div className="mt-14 grid gap-5 baixo:mt-8 lg:grid-cols-2">
          <Surge className="flex flex-col gap-7 rounded-[28px] border border-vm-borda bg-vm-sup p-7 sm:p-10 lg:gap-6 baixo:gap-4 baixo:p-7">
            <div className="flex items-center justify-between">
              <Etiqueta estado="destaque">Carro-chefe</Etiqueta>
              <Mono className="!text-[13px]">01</Mono>
            </div>
            <h3 className="font-manrope text-[clamp(1.9rem,min(3vw,4.4vh),2.5rem)] font-extrabold leading-[1.04] tracking-[-0.025em] text-vm-texto">Tráfego pago no Google e no Meta</h3>
            <p className="font-manrope text-[17px] leading-relaxed text-vm-suave baixo:text-[15px]">Campanhas montadas pelo custo por venda, não pelo clique. Verba vai para onde o retorno se mantém.</p>
            <div className="rounded-[20px] border border-vm-borda bg-vm-fundo p-6 baixo:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Mono>Vendas por mês · loja de games</Mono>
                <span className="font-manrope text-xs font-semibold text-vm-verde">custo por venda: R$ 14 a R$ 17</span>
              </div>
              <div className="mt-4 flex h-[140px] items-end gap-2.5 baixo:mt-3 baixo:h-[clamp(64px,11vh,96px)]">
                {VENDAS.map(([m, v], i) => (
                  <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <motion.div
                      className={`w-full origin-bottom rounded-t-md ${i === VENDAS.length - 1 ? 'bg-vm-verm' : 'bg-vm-sup2'}`}
                      style={{ height: `${Math.round((78 * v) / 4494)}%` }}
                      initial={reduce ? false : { scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.08 }}
                      title={`${v.toLocaleString('pt-BR')} vendas`}
                    />
                    <Mono>{m}</Mono>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-3 [@media(min-width:1024px)_and_(max-height:800px)]:hidden">
              {[['Dor', 'Anúncio gastando e a venda não aparece'], ['Indicador', 'Custo por venda e retorno em reais']].map(([k, v]) => (
                <div key={k} className="border-t border-vm-borda pt-4">
                  <Mono>{k}</Mono>
                  <p className="mt-1 font-manrope text-[15px] font-semibold leading-snug text-vm-texto">{v}</p>
                </div>
              ))}
            </div>
          </Surge>
          <div className="flex flex-col gap-5 baixo:gap-3">
            {APOIO.map((a, i) => (
              <Surge key={a.n} delay={0.08 * (i + 1)} className="group flex flex-1 gap-5 rounded-3xl border border-vm-borda bg-vm-sup p-6 transition-colors duration-300 hover:border-vm-vermt/40 sm:p-7 baixo:gap-4 baixo:p-4">
                <Icone d={a.ic} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-manrope text-xl font-bold tracking-[-0.01em] text-vm-texto">{a.t}</h3>
                    <Mono className="!text-xs">{a.n}</Mono>
                  </div>
                  <p className="mt-2 font-manrope text-[15px] leading-relaxed text-vm-suave baixo:mt-1 baixo:text-sm">{a.d}</p>
                  <p className="mt-3 flex items-center gap-2 font-manrope text-[13px] font-medium text-vm-texto baixo:mt-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-vm-verm" aria-hidden />
                    Indicador: {a.ind}
                  </p>
                </div>
              </Surge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────── Como trabalhamos: a pista anda com a rolagem ───────── */
const PASSOS = [
  ['01', 'Diagnóstico', 'Olhamos conta, site e números antes de prometer qualquer coisa.'],
  ['02', 'Plano', 'Público, verba e criativo definidos pelo objetivo de venda.'],
  ['03', 'Execução', 'Anúncio, página e rastreio entram no ar juntos.'],
  ['04', 'Relatório mensal', 'Todo mês, o resultado em reais e o próximo passo.'],
]

export const Pista = () => {
  const ref = useRef<HTMLElement>(null)
  const lista = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { definirBase } = useMarkGuia()
  // no desktop a seção trava na tela e a rolagem vertical anda com os passos para o lado
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const [ativo, setAtivo] = useState(reduce ? 3 : 0)
  const [desloc, setDesloc] = useState(0)

  useEffect(() => {
    const medir = () => {
      const l = lista.current
      if (!l) return
      // largura dos cartões + margem esquerda (80px) menos a largura da tela
      setDesloc(Math.max(0, l.offsetWidth + 80 - window.innerWidth))
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return
    const i = Math.min(3, Math.floor(v * 4.4))
    setAtivo(i)
  })
  useEffect(() => definirBase('pista', ativo === 3 ? 'pronto' : 'trabalhando'), [ativo, definirBase])

  const x = useTransform(p, (v) => -(reduce ? 0 : v) * desloc)
  const larg = useTransform(p, (v) => (reduce ? 1 : v))
  const montaria = useTransform(p, (v) => `calc(${(reduce ? 1 : v) * 100}% - ${(reduce ? 1 : v) * 110}px)`)

  return (
    <section id="como-trabalhamos" ref={ref} className="relative scroll-mt-24 bg-vm-sup lg:h-[320vh]">
      <div className="py-24 lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden lg:py-0 lg:pt-[93px]">
        <div className={caixa}>
          <Cabecalho
            sobre="Como trabalhamos"
            titulo="Do diagnóstico ao relatório, em quatro passos."
            texto="A pista é a mesma para todo cliente. O que muda é o que a gente encontra no diagnóstico."
          />
        </div>

        {/* celular: lista vertical com linha que enche */}
        <div className={`${caixa} relative mt-14 lg:hidden`}>
          <div className="absolute bottom-0 left-[39px] top-0 w-0.5 bg-vm-borda sm:left-[51px]" aria-hidden />
          <ol className="relative grid gap-10">
            {PASSOS.map(([n, t, d]) => (
              <Surge as="li" key={n} className="relative flex gap-5">
                <span className="z-10 grid h-8 w-10 shrink-0 place-items-center rounded-full border border-vm-verm bg-vm-verm font-vmmono text-[13px] font-medium text-white">{n}</span>
                <div>
                  <h3 className="font-manrope text-2xl font-bold tracking-[-0.01em] text-vm-texto">{t}</h3>
                  <p className="mt-2 font-manrope text-[15px] leading-relaxed text-vm-suave">{d}</p>
                </div>
              </Surge>
            ))}
          </ol>
        </div>

        {/* desktop: pista horizontal travada */}
        <div className="mt-[clamp(24px,6vh,64px)] hidden lg:block">
          <div className={`${caixa} relative`}>
            <div className="relative h-[clamp(96px,14vh,130px)]">
              <motion.div className="absolute bottom-0" style={{ left: montaria }}>
                <Ancora id="pista" estado="trabalhando" className="w-[clamp(84px,12vh,110px)]" />
              </motion.div>
            </div>
            <div className="relative h-0.5 w-full rounded-full bg-vm-borda">
              <motion.div className="absolute inset-0 origin-left rounded-full bg-vm-verm" style={{ scaleX: larg }} />
            </div>
          </div>
          <div className="mt-8 pl-20 [overflow-x:clip] [mask-image:linear-gradient(to_right,transparent,black_64px,black_calc(100%-64px),transparent)]">
            <motion.ol ref={lista} className="flex w-max gap-6 pr-20" style={{ x }}>
              {PASSOS.map(([n, t, d], i) => (
                <li
                  key={n}
                  className={`flex w-[min(460px,34vw)] flex-col gap-4 rounded-[28px] border p-8 transition-colors duration-500 baixo:p-6 ${
                    i <= ativo ? 'border-vm-verm/60 bg-vm-fundo' : 'border-vm-borda bg-vm-sup2/40'
                  }`}
                >
                  <span className={`font-manrope text-[clamp(48px,8vh,72px)] font-extrabold leading-none tracking-[-0.04em] transition-colors duration-500 ${i <= ativo ? 'text-vm-vermt' : 'text-vm-apagado/50'}`}>{n}</span>
                  <h3 className={`font-manrope text-[28px] font-bold tracking-[-0.015em] transition-colors duration-500 ${i <= ativo ? 'text-vm-texto' : 'text-vm-apagado'}`}>{t}</h3>
                  <p className="font-manrope text-base leading-relaxed text-vm-suave">{d}</p>
                </li>
              ))}
            </motion.ol>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────── Cases ───────── */
const Dupla = ({ a, b }: { a: [string, string]; b: [string, string] }) => (
  <div className="grid grid-cols-2">
    {[a, b].map(([n, d], i) => (
      <div key={d} className={`border-t border-vm-borda pt-4 curto:pt-2 ${i ? 'border-l pl-5' : ''}`}>
        <p className="font-manrope text-xl font-bold tracking-[-0.01em] text-vm-texto">{n}</p>
        <p className="font-manrope text-[13px] text-vm-suave">{d}</p>
      </div>
    ))}
  </div>
)

const Rodape = ({ tags }: { tags: string[] }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <Etiqueta key={t}>{t}</Etiqueta>
      ))}
    </div>
    <span className="shrink-0 font-manrope text-sm font-semibold text-vm-vermt transition-transform duration-300 group-hover:translate-x-1">Ver case →</span>
  </div>
)

const cartao = 'group relative flex h-full flex-col rounded-[28px] border border-vm-borda bg-vm-sup transition-all duration-500 hover:-translate-y-1.5 hover:border-vm-verm hover:bg-vm-sup2'

export const Cases = () => {
  const reduce = useReducedMotion()
  const carrossel = useRef<HTMLDivElement>(null)
  const [atual, setAtual] = useState(0)
  const aoRolar = () => {
    const c = carrossel.current
    if (!c) return
    const cartao = c.firstElementChild as HTMLElement | null
    if (!cartao) return
    setAtual(Math.round(c.scrollLeft / (cartao.offsetWidth + 16)))
  }
  return (
    <section id="cases" className={`scroll-mt-24 py-24 ${tela}`}>
      <div className={caixa}>
        <Surge className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Sobrelinha>Cases com número</Sobrelinha>
            <Titulo className="mt-5">
              Resultado em reais,
              <br />
              <span className="text-vm-vermt">não em curtidas.</span>
            </Titulo>
          </div>
          <div className="flex items-end gap-6">
            <Ancora id="cases" estado="olhando" className="hidden w-[110px] lg:block baixo:w-[84px]" />
            <Botao tipo="contorno" href="/cases">Ver todos os cases</Botao>
          </div>
        </Surge>

        {/* celular: carrossel horizontal com encaixe; tablet e desktop: grade */}
        <div
          ref={carrossel}
          onScroll={aoRolar}
          className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:mt-16 md:grid md:snap-none md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3 baixo:mt-8 curto:mt-5 [&::-webkit-scrollbar]:hidden"
          aria-label="Cases"
        >
          <Surge className="h-full w-[86%] shrink-0 snap-center md:w-auto">
            <a href="/cases" data-mark-reacao="pronto" className={`${cartao} gap-5 p-8 baixo:gap-3 baixo:p-6 curto:gap-2.5 curto:py-5`}>
              <Mono>Loja online de lingerie</Mono>
              <p className="flex items-baseline font-manrope font-extrabold leading-none tracking-[-0.05em] text-vm-vermt">
                <span className="text-[96px] baixo:text-[72px] curto:text-[56px]"><Contador para={23.5} casas={1} /></span>
                <span className="text-5xl curto:text-3xl">x</span>
              </p>
              <p className="font-manrope text-[17px] leading-relaxed text-vm-suave baixo:text-[15px]">de retorno em anúncio, cinco meses seguidos.</p>
              <div className="mt-auto flex h-24 items-end gap-2 pt-4 baixo:h-[clamp(56px,9vh,96px)] baixo:pt-2" aria-label="Retorno por mês, de maio a setembro">
                {[['mai', 23.9], ['jun', 21.0], ['jul', 24.3], ['ago', 25.1], ['set', 23.7]].map(([m, v], i) => (
                  <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    <Mono className="!text-[10px] !tracking-normal">{String(v).replace('.', ',')}x</Mono>
                    <motion.div
                      className="w-full origin-bottom rounded bg-vm-verm"
                      style={{ height: `${Math.round((60 * (v as number)) / 25.1)}px`, opacity: 0.3 + (0.7 * ((v as number) - 20)) / 5.1 }}
                      initial={reduce ? false : { scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.07 }}
                    />
                  </div>
                ))}
              </div>
              <Dupla a={['R$ 20,5 mil', 'investidos']} b={['R$ 482 mil', 'em vendas']} />
              <Rodape tags={['Google Ads', 'Meta Ads']} />
            </a>
          </Surge>

          <Surge delay={0.08} className="h-full w-[86%] shrink-0 snap-center md:w-auto">
            <a href="/cases" data-mark-reacao="surpreso" className={`${cartao} gap-5 p-8 baixo:gap-3 baixo:p-6 curto:gap-2.5 curto:py-5`}>
              <Mono>Loja de games online</Mono>
              <p className="flex items-baseline font-manrope font-extrabold leading-none tracking-[-0.05em] text-vm-texto">
                <span className="text-[96px] baixo:text-[72px] curto:text-[56px]"><Contador para={3.8} casas={1} /></span>
                <span className="text-5xl curto:text-3xl">x</span>
              </p>
              <p className="font-manrope text-[17px] leading-relaxed text-vm-suave baixo:text-[15px]">mais vendas em 12 meses, com o mesmo custo por venda.</p>
              <div className="mt-auto pt-4 baixo:pt-1">
                <svg viewBox="0 0 320 80" className="h-auto w-full baixo:max-h-[clamp(48px,8vh,80px)]" preserveAspectRatio="none" fill="none" aria-label="Vendas sobem e o custo por venda fica estável">
                  <motion.path d="M2 46 L80 44 L160 45 L240 47 L318 43" className="stroke-vm-apagado" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
                  <motion.path
                    d="M2 72 L80 60 L160 34 L240 12 L318 10"
                    className="stroke-vm-vermt"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduce ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
                  />
                </svg>
                <div className="mt-2 flex gap-4">
                  <span className="flex items-center gap-1.5 font-manrope text-xs text-vm-suave"><span className="h-[3px] w-3 bg-vm-vermt" />vendas por mês</span>
                  <span className="flex items-center gap-1.5 font-manrope text-xs text-vm-suave"><span className="h-[3px] w-3 bg-vm-apagado" />custo por venda</span>
                </div>
              </div>
              <Dupla a={['34.369', 'vendas']} b={['R$ 1,22 mi', 'em receita']} />
              <Rodape tags={['Google Ads']} />
            </a>
          </Surge>

          <Surge delay={0.16} className="h-full w-[86%] shrink-0 snap-center md:col-span-2 md:w-auto xl:col-span-1">
            <a href="/cases" data-mark-reacao="analisando" className={`${cartao} overflow-hidden`}>
              <div className="h-[250px] overflow-hidden baixo:h-[clamp(110px,18vh,170px)]">
                <img src="/home/cases/energia-solar-obra.webp" alt="Instalação de inversor solar feita pelo cliente" loading="lazy" width={960} height={931} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col gap-[18px] px-8 pb-8 pt-7 baixo:gap-3 baixo:px-6 baixo:pb-6 baixo:pt-5">
                <div className="flex items-center gap-2.5">
                  <Etiqueta estado="destaque">Projeto completo</Etiqueta>
                  <Mono>Energia solar</Mono>
                </div>
                <p className="font-manrope text-2xl font-bold leading-tight tracking-[-0.01em] text-vm-texto curto:text-xl">Do zero ao primeiro lead qualificado em dez dias de anúncio.</p>
                <div className="mt-auto flex flex-col gap-[18px]">
                  <Dupla a={['R$ 76', 'por lead']} b={['3 leads', '1 qualificado']} />
                  <Rodape tags={['Marca', 'Site', 'Rastreio']} />
                </div>
              </div>
            </a>
          </Surge>
        </div>
        <div className="mt-5 flex justify-center gap-2 md:hidden" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === atual ? 'w-6 bg-vm-verm' : 'w-1.5 bg-vm-borda'}`} />
          ))}
        </div>
        <p className="mt-6 font-manrope text-[13px] text-vm-apagado baixo:mt-4 curto:mt-3">Números das plataformas de anúncio de cada conta, sem arredondar para cima. Os clientes aparecem pelo segmento.</p>
      </div>
    </section>
  )
}

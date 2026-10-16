import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef, useState, type ReactNode } from 'react'
import { Botao, Contador, EASE, Etiqueta, Mark, Mono, Sobrelinha, Surge } from './ui'

const caixa = 'mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-20'

const Titulo = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h2 className={`font-manrope text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-vm-texto ${className}`} style={{ textWrap: 'balance' }}>
    {children}
  </h2>
)

const Cabecalho = ({ sobre, titulo, texto }: { sobre: string; titulo: ReactNode; texto?: string }) => (
  <Surge className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-16">
    <div className="flex-1">
      <Sobrelinha>{sobre}</Sobrelinha>
      <Titulo className="mt-5">{titulo}</Titulo>
    </div>
    {texto && <p className="max-w-[440px] font-manrope text-lg leading-relaxed text-vm-suave">{texto}</p>}
  </Surge>
)

/* ───────── Quem já vende com a gente ───────── */
export const Segmentos = () => (
  <section className="border-y border-vm-borda py-10" aria-label="Quem já vende com a gente">
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
  </section>
)

/* ───────── Números (centralizados) ───────── */
const NUMEROS: { antes?: string; valor: number; casas?: number; depois: string; texto: string }[] = [
  { antes: 'R$ ', valor: 10, depois: ' mi', texto: 'faturados para clientes com anúncios' },
  { antes: 'R$ ', valor: 1.5, casas: 1, depois: ' mi', texto: 'investidos em mídia sob nossa gestão' },
  { valor: 5, depois: ' mil', texto: 'anúncios criados' },
]

export const Numeros = () => (
  <section className="py-20 lg:py-24" aria-label="Números da Virtual Mark">
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
    <section id="servicos" className="scroll-mt-24 py-24 lg:py-[120px]">
      <div className={caixa}>
        <Cabecalho
          sobre="O que a gente faz"
          titulo={<>Anúncio, página e medição. <span className="text-vm-vermt">Um só time.</span></>}
          texto="Anúncio bom levando para site ruim não vende. Site bom sem anúncio não é visto. Por isso a gente cuida dos três juntos."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <Surge className="flex flex-col gap-7 rounded-[28px] border border-vm-borda bg-vm-sup p-7 sm:p-10">
            <div className="flex items-center justify-between">
              <Etiqueta estado="destaque">Carro-chefe</Etiqueta>
              <Mono className="!text-[13px]">01</Mono>
            </div>
            <h3 className="font-manrope text-[clamp(1.9rem,3vw,2.5rem)] font-extrabold leading-[1.04] tracking-[-0.025em] text-vm-texto">Tráfego pago no Google e no Meta</h3>
            <p className="font-manrope text-[17px] leading-relaxed text-vm-suave">Campanhas montadas pelo custo por venda, não pelo clique. Verba vai para onde o retorno se mantém.</p>
            <div className="rounded-[20px] border border-vm-borda bg-vm-fundo p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Mono>Vendas por mês · loja de games</Mono>
                <span className="font-manrope text-xs font-semibold text-vm-verde">custo por venda: R$ 14 a R$ 17</span>
              </div>
              <div className="mt-4 flex h-[140px] items-end gap-2.5">
                {VENDAS.map(([m, v], i) => (
                  <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <motion.div
                      className={`w-full origin-bottom rounded-t-md ${i === VENDAS.length - 1 ? 'bg-vm-verm' : 'bg-vm-sup2'}`}
                      style={{ height: `${Math.round((110 * v) / 4494)}px` }}
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
            <div className="mt-auto grid grid-cols-2 gap-3">
              {[['Dor', 'Anúncio gastando e a venda não aparece'], ['Indicador', 'Custo por venda e retorno em reais']].map(([k, v]) => (
                <div key={k} className="border-t border-vm-borda pt-4">
                  <Mono>{k}</Mono>
                  <p className="mt-1 font-manrope text-[15px] font-semibold leading-snug text-vm-texto">{v}</p>
                </div>
              ))}
            </div>
          </Surge>
          <div className="flex flex-col gap-5">
            {APOIO.map((a, i) => (
              <Surge key={a.n} delay={0.08 * (i + 1)} className="group flex flex-1 gap-5 rounded-3xl border border-vm-borda bg-vm-sup p-6 transition-colors duration-300 hover:border-vm-vermt/40 sm:p-7">
                <Icone d={a.ic} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-manrope text-xl font-bold tracking-[-0.01em] text-vm-texto">{a.t}</h3>
                    <Mono className="!text-xs">{a.n}</Mono>
                  </div>
                  <p className="mt-2 font-manrope text-[15px] leading-relaxed text-vm-suave">{a.d}</p>
                  <p className="mt-3 flex items-center gap-2 font-manrope text-[13px] font-medium text-vm-texto">
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
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.55'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const [ativo, setAtivo] = useState(reduce ? 3 : 0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduce) setAtivo(Math.min(3, Math.floor(v * 4.2)))
  })
  const esquerda = useTransform(p, (v) => `calc(${(reduce ? 1 : v) * 100}% - ${(reduce ? 1 : v) * 120}px)`)
  const larg = useTransform(p, (v) => (reduce ? 1 : v))

  return (
    <section id="como-trabalhamos" className="scroll-mt-24 bg-vm-sup py-24 lg:py-[120px]">
      <div className={caixa}>
        <Cabecalho
          sobre="Como trabalhamos"
          titulo="Do diagnóstico ao relatório, em quatro passos."
          texto="A pista é a mesma para todo cliente. O que muda é o que a gente encontra no diagnóstico."
        />
        <div ref={ref} className="relative mt-16">
          {/* desktop: pista horizontal com o Mark andando */}
          <div className="relative hidden h-[124px] lg:block" aria-hidden>
            <motion.div className="absolute bottom-0" style={{ left: esquerda }}>
              <Mark estado={ativo === 3 ? 'pronto' : 'trabalhando'} size={120} />
            </motion.div>
          </div>
          <div className="relative">
            <div className="absolute left-[19px] top-0 h-full w-0.5 bg-vm-borda lg:left-0 lg:top-[15px] lg:h-0.5 lg:w-full" aria-hidden />
            <motion.div className="absolute left-[19px] top-0 h-full w-0.5 origin-top bg-vm-verm lg:hidden" style={{ scaleY: larg }} aria-hidden />
            <motion.div className="absolute left-0 top-[15px] hidden h-0.5 w-full origin-left bg-vm-verm lg:block" style={{ scaleX: larg }} aria-hidden />
            <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
              {PASSOS.map(([n, t, d], i) => (
                <li key={n} className="flex gap-5 lg:flex-col lg:gap-3.5">
                  <span
                    className={`z-10 grid h-8 w-10 shrink-0 place-items-center rounded-full border font-vmmono text-[13px] font-medium transition-colors duration-500 ${
                      i <= ativo ? 'border-vm-verm bg-vm-verm text-white' : 'border-vm-borda bg-vm-fundo text-vm-suave'
                    }`}
                  >
                    {n}
                  </span>
                  <div>
                    <h3 className={`font-manrope text-2xl font-bold tracking-[-0.01em] transition-colors duration-500 ${i <= ativo ? 'text-vm-texto' : 'text-vm-apagado'}`}>{t}</h3>
                    <p className="mt-2 max-w-[30ch] font-manrope text-[15px] leading-relaxed text-vm-suave">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
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
      <div key={d} className={`border-t border-vm-borda pt-4 ${i ? 'border-l pl-5' : ''}`}>
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
  return (
    <section id="cases" className="scroll-mt-24 py-24 lg:py-[120px]">
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
          <Botao tipo="contorno" href="/cases">Ver todos os cases</Botao>
        </Surge>

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Surge className="h-full">
            <a href="/cases" className={`${cartao} gap-5 p-8`}>
              <Mono>Loja online de lingerie</Mono>
              <p className="flex items-baseline font-manrope font-extrabold leading-none tracking-[-0.05em] text-vm-vermt">
                <span className="text-[96px]"><Contador para={23.5} casas={1} /></span>
                <span className="text-5xl">x</span>
              </p>
              <p className="font-manrope text-[17px] leading-relaxed text-vm-suave">de retorno em anúncio, cinco meses seguidos.</p>
              <div className="mt-auto flex h-24 items-end gap-2 pt-4" aria-label="Retorno por mês, de maio a setembro">
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

          <Surge delay={0.08} className="h-full">
            <a href="/cases" className={`${cartao} gap-5 p-8`}>
              <div className="pointer-events-none absolute -top-16 right-6 translate-y-10 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none" aria-hidden>
                <Mark estado="surpreso" size={100} />
              </div>
              <Mono>Loja de games online</Mono>
              <p className="flex items-baseline font-manrope font-extrabold leading-none tracking-[-0.05em] text-vm-texto">
                <span className="text-[96px]"><Contador para={3.8} casas={1} /></span>
                <span className="text-5xl">x</span>
              </p>
              <p className="font-manrope text-[17px] leading-relaxed text-vm-suave">mais vendas em 12 meses, com o mesmo custo por venda.</p>
              <div className="mt-auto pt-4">
                <svg viewBox="0 0 320 80" className="h-auto w-full" fill="none" aria-label="Vendas sobem e o custo por venda fica estável">
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

          <Surge delay={0.16} className="h-full md:col-span-2 xl:col-span-1">
            <a href="/cases" className={`${cartao} overflow-hidden`}>
              <div className="h-[250px] overflow-hidden">
                <img src="/home/cases/energia-solar-obra.webp" alt="Instalação de inversor solar feita pelo cliente" loading="lazy" width={960} height={931} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col gap-[18px] px-8 pb-8 pt-7">
                <div className="flex items-center gap-2.5">
                  <Etiqueta estado="destaque">Projeto completo</Etiqueta>
                  <Mono>Energia solar</Mono>
                </div>
                <p className="font-manrope text-2xl font-bold leading-tight tracking-[-0.01em] text-vm-texto">Do zero ao primeiro lead qualificado em dez dias de anúncio.</p>
                <div className="mt-auto flex flex-col gap-[18px]">
                  <Dupla a={['R$ 76', 'por lead']} b={['3 leads', '1 qualificado']} />
                  <Rodape tags={['Marca', 'Site', 'Rastreio']} />
                </div>
              </div>
            </a>
          </Surge>
        </div>
        <p className="mt-6 font-manrope text-[13px] text-vm-apagado">Números das plataformas de anúncio de cada conta, sem arredondar para cima. Os clientes aparecem pelo segmento.</p>
      </div>
    </section>
  )
}

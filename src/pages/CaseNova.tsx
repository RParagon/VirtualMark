import { motion, useReducedMotion } from 'framer-motion'
import { veioPreRenderizada } from '../components/HtmlEstatico'
import type { ReactNode } from 'react'
import Seo from '../components/Seo'
import { CASOS, type Caso } from '../components/nova/casos'
import { Chamada } from '../components/nova/Final'
import { Ancora } from '../components/nova/MarkGuia'
import type { MarkEstado } from '../components/nova/mark'
import { PaginaVM } from '../components/nova/Pagina'
import { Titulo, caixa } from '../components/nova/Secoes'
import { EASE, Etiqueta, Mono, Sobrelinha, Surge, caminho } from '../components/nova/ui'
import { MockSite } from './CasesNova'

const comRealce = (texto: string, realce: string) => {
  const i = texto.indexOf(realce)
  if (i < 0) return texto
  return (
    <>
      {texto.slice(0, i)}
      <span className="text-vm-vermt">{realce}</span>
      {texto.slice(i + realce.length)}
    </>
  )
}

const Cabecalho = ({ sobre, titulo, texto }: { sobre: string; titulo: string; texto: string }) => (
  <Surge className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-16">
    <div className="flex-1">
      <Sobrelinha>{sobre}</Sobrelinha>
      <Titulo className="mt-5">{titulo}</Titulo>
    </div>
    <p className="max-w-[460px] font-manrope text-[17px] leading-relaxed text-vm-suave">{texto}</p>
  </Surge>
)

/* ───────── Gráfico mês a mês (cases de resultado) ───────── */
const Grafico = ({ g }: { g: NonNullable<Caso['grafico']> }) => {
  const reduce = useReducedMotion()
  const max = Math.max(...g.meses.map(([, v]) => v))
  const min = Math.min(...g.meses.map(([, v]) => v))
  return (
    <div className="flex h-full flex-col p-7 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Mono>{g.titulo}</Mono>
          <p className="mt-1 font-manrope text-sm text-vm-suave">{g.legenda}</p>
        </div>
      </div>
      <div className="mt-auto flex h-[260px] items-end gap-3 pt-10 sm:gap-4" role="img" aria-label={`${g.titulo}: ${g.meses.map(([m, v]) => `${m} ${g.formato(v)}`).join(', ')}`}>
        {g.meses.map(([m, v], i) => (
          <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="font-vmmono text-xs font-medium text-vm-texto">{g.formato(v)}</span>
            <motion.div
              className="w-full origin-bottom rounded-lg bg-vm-verm"
              style={{ height: `${Math.round((100 * v) / max) * 0.8}%`, opacity: 0.35 + (0.65 * (v - min)) / Math.max(1, max - min) }}
              initial={reduce ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.08 }}
            />
            <Mono className="!tracking-normal">{m}</Mono>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────── Abertura do case ───────── */
const Topo = ({ c }: { c: Caso }) => {
  const reduce = useReducedMotion()
  const pre = veioPreRenderizada()
  const item = (i: number) => ({
    initial: reduce || pre ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay: 0.08 + i * 0.09 },
  })
  const estado: MarkEstado = c.tipo === 'Resultado' ? 'comemorando' : 'pronto'
  return (
    <section className={`${caixa} flex flex-col gap-12 pb-16 pt-10 lg:flex-row lg:items-center lg:gap-14 lg:pb-20 lg:pt-16`}>
      <div className="min-w-0 flex-1">
        <motion.nav {...item(0)} aria-label="Você está em" className="flex items-center gap-2 font-manrope text-[13px] font-medium text-vm-apagado">
          <a href={caminho('/cases')} className="transition-colors hover:text-vm-texto">Cases</a>
          <span aria-hidden>/</span>
          <span>{c.tipo}</span>
        </motion.nav>
        <motion.div {...item(1)} className="mt-6">
          <Sobrelinha>Case real · {c.segmento}</Sobrelinha>
        </motion.div>
        <motion.h1 {...item(2)} className="mt-6 font-manrope text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.035em] text-vm-texto" style={{ textWrap: 'balance' }}>
          {comRealce(c.titulo, c.realce)}
        </motion.h1>
        <motion.p {...item(3)} className="mt-6 max-w-[38rem] font-manrope text-lg leading-relaxed text-vm-suave">
          {c.abertura}
        </motion.p>
        <motion.div {...item(4)} className="mt-7 flex flex-wrap gap-2">
          {c.tags.map((t) => (
            <Etiqueta key={t} estado="destaque">{t}</Etiqueta>
          ))}
        </motion.div>
      </div>
      <motion.div
        initial={reduce || veioPreRenderizada() ? false : { opacity: 0, y: 36, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
        className="relative w-full lg:w-[520px] lg:shrink-0"
      >
        <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-vm-borda bg-vm-sup sm:h-[480px] lg:h-[540px]">
          {c.foto ? (
            <>
              <img src={c.foto} alt={`Trabalho do cliente de ${c.segmento.toLowerCase()}`} className="h-full w-full object-cover" />
              <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-vm-fundo/85 px-3.5 py-2 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-vm-verm" />
                <Mono className="!text-vm-texto">Obra real do cliente</Mono>
              </span>
            </>
          ) : c.grafico ? (
            <Grafico g={c.grafico} />
          ) : c.grande ? (
            <div className="flex h-full flex-col justify-center p-8">
              <Mono>{c.segmento}</Mono>
              <p className="mt-4 font-manrope text-[120px] font-extrabold leading-none tracking-[-0.05em] text-vm-vermt">
                {c.grande.valor.toLocaleString('pt-BR')}
                {c.grande.sufixo}
              </p>
              <p className="mt-3 max-w-[22ch] font-manrope text-lg text-vm-suave">{c.resumo}</p>
            </div>
          ) : (
            <MockSite className="h-full" />
          )}
        </div>
        <div className="absolute -bottom-10 -left-6 sm:-left-10">
          <Ancora id="case-topo" estado={estado} celular className="w-[110px] sm:w-[140px]" />
        </div>
      </motion.div>
    </section>
  )
}

/* ───────── Faixa de números ───────── */
const Numeros = ({ c }: { c: Caso }) => (
  <section className={`${caixa} pb-24`} aria-label="Números do case">
    <Surge>
      <dl className={`grid overflow-hidden rounded-[24px] border border-vm-borda bg-vm-sup sm:grid-cols-2 ${c.numeros.length >= 5 ? 'lg:grid-cols-5' : c.numeros.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {c.numeros.map(([n, d], i) => (
          <div key={d} className={`flex flex-col gap-1.5 border-vm-borda p-7 ${i ? 'border-t sm:border-t-0' : ''} ${i % 2 ? 'sm:border-l' : ''} ${i >= 2 ? 'sm:border-t lg:border-t-0' : ''} ${i ? 'lg:border-l' : ''}`}>
            <dt className={`order-1 font-manrope text-[clamp(2rem,3vw,2.75rem)] font-extrabold leading-none tracking-[-0.04em] ${i === c.numeroDestaque ? 'text-vm-vermt' : 'text-vm-texto'}`}>{n}</dt>
            <dd className="order-2 font-manrope text-sm text-vm-suave">{d}</dd>
          </div>
        ))}
      </dl>
    </Surge>
    <p className="mt-5 font-manrope text-[13px] text-vm-apagado">{c.fonte}</p>
  </section>
)

/* ───────── O que fizemos: quatro portões ───────── */
const REACAO_PORTAO: Record<string, MarkEstado> = { Atrair: 'falando', Converter: 'pronto', Medir: 'analisando', Reter: 'pensando' }

const Portoes = ({ c }: { c: Caso }) => (
  <section className="bg-vm-sup py-24 lg:py-28">
    <div className={caixa}>
      <Cabecalho sobre="O que fizemos" titulo={c.pistaTitulo} texto={c.pistaTexto} />
      <div className="relative mt-14 lg:mt-24">
        <div className="pointer-events-none absolute -top-[92px] left-[75%] hidden -translate-x-1/2 lg:block">
          <Ancora id="case-pista" estado="trabalhando" className="w-[104px]" />
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.portoes.map((p, i) => (
            <Surge as="li" key={p.t} delay={i * 0.07} className="h-full">
              <div data-mark-reacao={REACAO_PORTAO[p.t]} className={`flex h-full flex-col gap-4 rounded-[24px] bg-vm-fundo p-7 ${p.feito ? 'border border-vm-borda' : 'border border-dashed border-vm-borda'}`}>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 font-vmmono text-xs font-medium ${p.feito ? 'bg-vm-verm text-white' : 'bg-vm-sup2 text-vm-apagado'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <Mono className={p.feito ? '!text-vm-verde' : ''}>{p.feito ? 'feito' : 'próximo'}</Mono>
                </div>
                <p className="font-manrope text-[28px] font-extrabold tracking-[-0.03em] text-vm-texto">{p.t}</p>
                <ul className="flex flex-col gap-2.5">
                  {p.itens.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 font-manrope text-[15px] leading-snug text-vm-suave">
                      <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${p.feito ? 'bg-vm-verm' : 'bg-vm-apagado'}`} />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Surge>
          ))}
        </ol>
      </div>
    </div>
  </section>
)

/* ───────── Medir: do clique à venda (GCLID) ───────── */
const FLUXO: [string, string, ReactNode?][] = [
  ['Clique no anúncio', 'O site guarda a origem da visita por 90 dias.'],
  ['WhatsApp', 'A mensagem sai com um código curto que liga a conversa ao anúncio.', 'VM-7K2PM'],
  ['Qualificado', 'A equipe marca quem tem perfil de cliente.'],
  ['Fechamento', 'O contrato entra com o valor da venda.'],
  ['Volta ao Google', 'Lead e venda viram conversão e guiam os lances.'],
]

const Medir = () => (
  <section className="py-24 lg:py-28">
    <div className={caixa}>
      <Cabecalho
        sobre="Medir"
        titulo="De qual anúncio veio cada cliente."
        texto="O clique no WhatsApp mostra interesse, não venda. Cada lead leva um código curto que liga a conversa ao anúncio, e o Google passa a buscar quem fecha."
      />
      <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {FLUXO.map(([t, d, codigo], i) => (
          <Surge as="li" key={t} delay={i * 0.06} className="h-full">
            <div className={`flex h-full flex-col gap-3 rounded-[20px] border bg-vm-sup p-6 ${codigo ? 'border-vm-verm' : 'border-vm-borda'}`}>
              <span className="w-fit rounded-full bg-vm-verms px-2.5 py-1 font-vmmono text-xs font-medium text-vm-vermt">{i + 1}</span>
              <p className="font-manrope text-[19px] font-bold tracking-[-0.01em] text-vm-texto">{t}</p>
              <p className="font-manrope text-sm leading-relaxed text-vm-suave">{d}</p>
              {codigo && <span className="mt-auto w-fit rounded-[10px] bg-vm-sup2 px-3 py-2 font-vmmono text-sm text-vm-texto">{codigo}</span>}
            </div>
          </Surge>
        ))}
      </ol>
    </div>
  </section>
)

/* ───────── Fecho e próximo case ───────── */
const Fecho = ({ c }: { c: Caso }) => {
  const i = CASOS.findIndex((x) => x.slug === c.slug)
  const prox = CASOS[(i + 1) % CASOS.length]
  return (
    <>
      <section className={`${caixa} flex flex-col items-start gap-8 py-24 sm:flex-row sm:items-center sm:gap-12 lg:py-32`}>
        <Ancora id="case-fecho" estado="pronto" className="w-[110px] shrink-0 sm:w-[150px]" />
        <Surge>
          <blockquote className="font-manrope text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.18] tracking-[-0.025em] text-vm-texto" style={{ textWrap: 'balance' }}>
            {comRealce(c.fecho, c.fechoRealce)}
          </blockquote>
        </Surge>
      </section>
      <nav className={`${caixa} flex flex-col gap-6 border-t border-vm-borda py-10 sm:flex-row sm:items-center sm:justify-between`} aria-label="Outros cases">
        <a href={caminho('/cases')} className="font-manrope text-base font-semibold text-vm-suave transition-colors hover:text-vm-texto">
          ← Todos os cases
        </a>
        <a href={caminho(`/cases/${prox.slug}`)} data-mark-reacao={prox.reacao} className="group flex flex-col gap-1 sm:items-end">
          <Mono>Próximo case</Mono>
          <span className="font-manrope text-[22px] font-bold tracking-[-0.01em] text-vm-texto transition-colors group-hover:text-vm-vermt">
            {prox.segmento}: {prox.resumo.replace(/\.$/, '')} →
          </span>
        </a>
      </nav>
    </>
  )
}

const CaseNova = ({ caso }: { caso: Caso }) => (
  <PaginaVM>
    <Seo
      title={`${caso.realce[0].toUpperCase()}${caso.realce.slice(1)} | ${caso.segmento} | VirtualMark`}
      description={caso.abertura}
      path={`/cases/${caso.slug}`}
      type="article"
      image={caso.foto ? `https://virtualmark.com.br${caso.foto}` : undefined}
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: caso.titulo,
          description: caso.abertura,
          inLanguage: 'pt-BR',
          about: caso.segmento,
          keywords: caso.tags.join(', '),
          ...(caso.foto ? { image: `https://virtualmark.com.br${caso.foto}` } : {}),
          author: { '@id': 'https://virtualmark.com.br/#organization' },
          publisher: { '@id': 'https://virtualmark.com.br/#organization' },
          mainEntityOfPage: `https://virtualmark.com.br/cases/${caso.slug}`,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://virtualmark.com.br/' },
            { '@type': 'ListItem', position: 2, name: 'Cases', item: 'https://virtualmark.com.br/cases' },
            { '@type': 'ListItem', position: 3, name: caso.segmento, item: `https://virtualmark.com.br/cases/${caso.slug}` },
          ],
        },
      ]}
    />
    <Topo c={caso} />
    <Numeros c={caso} />
    <Portoes c={caso} />
    {caso.gclid && <Medir />}
    <Fecho c={caso} />
    <div className="border-t border-vm-borda bg-vm-sup">
      <Chamada />
    </div>
  </PaginaVM>
)

export default CaseNova

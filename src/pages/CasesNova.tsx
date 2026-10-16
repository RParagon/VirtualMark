import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { veioPreRenderizada } from '../components/HtmlEstatico'
import { useState } from 'react'
import Seo from '../components/Seo'
import { CASOS, FILTROS, type Caso, type Filtro } from '../components/nova/casos'
import { Chamada } from '../components/nova/Final'
import { Ancora, useMarkGuia } from '../components/nova/MarkGuia'
import { PaginaVM } from '../components/nova/Pagina'
import { RodapeCartao, Dupla, caixa, cartao } from '../components/nova/Secoes'
import { Contador, EASE, Etiqueta, Mono, Sobrelinha, caminho } from '../components/nova/ui'

/** Desenho no lugar do print, para o case de site não expor a marca do cliente. */
export const MockSite = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 bg-vm-sup2 ${className}`} aria-hidden>
    {[0, 1].map((k) => (
      <div key={k} className={`flex w-[42%] max-w-[190px] flex-col overflow-hidden rounded-xl border border-vm-borda ${k ? 'bg-vm-fundo' : 'bg-vm-sup'}`}>
        <div className="flex items-center gap-1 border-b border-vm-borda px-2.5 py-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-vm-borda" />
          ))}
        </div>
        <div className="flex flex-col gap-1.5 p-3">
          <Mono className={`!text-[9px] ${k ? '!text-vm-vermt' : ''}`}>{k ? 'depois' : 'antes'}</Mono>
          <span className={`h-2 rounded-full ${k ? 'w-4/5 bg-vm-texto/80' : 'w-3/5 bg-vm-apagado/60'}`} />
          <span className={`h-1.5 rounded-full ${k ? 'w-3/5 bg-vm-suave/50' : 'w-4/5 bg-vm-apagado/40'}`} />
          <div className={`mt-1 h-10 rounded-md ${k ? 'bg-gradient-to-br from-vm-verm/50 to-vm-sup2' : 'bg-vm-borda/60'}`} />
          <span className={`mt-1 h-3 w-1/2 rounded-full ${k ? 'bg-vm-verm' : 'bg-vm-apagado/50'}`} />
        </div>
      </div>
    ))}
  </div>
)

/** Desenho pequeno no cartão, com os mesmos números do case. */
const MiniCaso = ({ c }: { c: Caso }) => {
  const reduce = useReducedMotion()
  const anima = (i: number) => ({
    initial: reduce ? false : { scaleY: 0 },
    whileInView: { scaleY: 1 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: EASE, delay: 0.2 + i * 0.07 },
  })
  if (c.grafico) {
    const max = Math.max(...c.grafico.meses.map(([, v]) => v))
    return (
      <div className="flex h-20 items-end gap-2 pt-2" aria-label={c.grafico.titulo}>
        {c.grafico.meses.map(([m, v], i) => (
          <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <motion.div {...anima(i)} className="w-full origin-bottom rounded bg-vm-verm" style={{ height: `${Math.round((v / max) * 70)}%`, opacity: 0.35 + 0.65 * (v / max) }} />
            <Mono className="!text-[10px] !tracking-normal">{m}</Mono>
          </div>
        ))}
      </div>
    )
  }
  if (c.mini?.tipo === 'comparar') {
    const max = Math.max(...c.mini.itens.map(([, v]) => v))
    return (
      <div className="flex flex-col gap-2.5 pt-2">
        {c.mini.itens.map(([r, v, txt], i) => (
          <div key={r} className="flex items-center gap-3">
            <span className="w-24 shrink-0 font-manrope text-xs text-vm-suave">{r}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-vm-sup2">
              <motion.div initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.1 }} className="h-full origin-left rounded-full bg-vm-verm" style={{ width: `${(v / max) * 100}%`, opacity: i ? 0.5 : 1 }} />
            </div>
            <span className="w-10 text-right font-vmmono text-xs text-vm-texto">{txt}</span>
          </div>
        ))}
      </div>
    )
  }
  if (c.mini?.tipo === 'meses') {
    const n = c.mini.n
    return (
      <div className="pt-2" aria-label={c.mini.rotulo}>
        <div className="flex gap-1.5">
          {Array.from({ length: c.mini.n }, (_, i) => (
            <motion.span key={i} initial={reduce ? false : { opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }} className="h-6 flex-1 rounded-md bg-vm-verm" style={{ opacity: 0.4 + (0.6 * i) / (n - 1) }} />
          ))}
        </div>
        <p className="mt-2 font-manrope text-xs text-vm-apagado">{c.mini.rotulo}</p>
      </div>
    )
  }
  return null
}

const CartaoCaso = ({ c }: { c: Caso }) => (
  <a href={caminho(`/cases/${c.slug}`)} data-mark-reacao={c.reacao} className={`${cartao} overflow-hidden`}>
    {c.foto && (
      <div className="h-[220px] overflow-hidden">
        <img src={c.foto} alt={`Trabalho do cliente de ${c.segmento.toLowerCase()}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
    )}
    {!c.foto && !c.grande && <MockSite className="h-[220px]" />}
    <div className="flex flex-1 flex-col gap-5 p-7 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <Mono>{c.segmento}</Mono>
        <Etiqueta estado={c.tipo === 'Resultado' ? 'padrao' : 'destaque'}>{c.tipo}</Etiqueta>
      </div>
      {c.grande ? (
        <>
          <p className={`flex items-baseline font-manrope font-extrabold leading-none tracking-[-0.05em] ${c.grande.destaque ? 'text-vm-vermt' : 'text-vm-texto'}`}>
            <span className="text-[72px]">
              <Contador para={c.grande.valor} casas={c.grande.casas} />
            </span>
            {c.grande.sufixo && <span className="text-4xl">{c.grande.sufixo}</span>}
          </p>
          <p className="font-manrope text-base leading-relaxed text-vm-suave">{c.resumo}</p>
          <MiniCaso c={c} />
        </>
      ) : (
        <p className="font-manrope text-[22px] font-bold leading-tight tracking-[-0.01em] text-vm-texto">{c.resumo}</p>
      )}
      <div className="mt-auto flex flex-col gap-5">
        <Dupla a={c.dupla[0]} b={c.dupla[1]} />
        <RodapeCartao tags={c.tags.slice(0, 3)} />
      </div>
    </div>
  </a>
)

const Lista = () => {
  const [filtro, setFiltro] = useState<Filtro | null>(null)
  const reduce = useReducedMotion()
  const { reagir } = useMarkGuia()
  const lista = filtro ? CASOS.filter((c) => c.filtros.includes(filtro)) : CASOS

  const escolher = (f: Filtro | null) => {
    setFiltro(f)
    reagir('procurando', 900)
  }

  return (
    <>
      <div className={`${caixa} flex flex-wrap gap-2.5 pb-10`} role="group" aria-label="Filtrar cases" data-mark-reacao="procurando">
        <Etiqueta estado={filtro === null ? 'ativo' : 'padrao'} onClick={() => escolher(null)}>
          Todos · {CASOS.length}
        </Etiqueta>
        {FILTROS.map((f) => (
          <Etiqueta key={f} estado={filtro === f ? 'ativo' : 'padrao'} onClick={() => escolher(f)}>
            {f} · {CASOS.filter((c) => c.filtros.includes(f)).length}
          </Etiqueta>
        ))}
      </div>
      <div className={`${caixa} pb-24`}>
        <motion.ul layout={!reduce} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {lista.map((c, i) => (
              <motion.li
                key={c.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 5) * 0.05 }}
                className="h-full"
              >
                <CartaoCaso c={c} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        <p className="mt-6 font-manrope text-[13px] text-vm-apagado">
          Retorno é a receita registrada pela plataforma dividida pelo investimento em mídia. Não é lucro e não inclui a taxa da agência. Os clientes aparecem pelo segmento.
        </p>
      </div>
    </>
  )
}

const CasesNova = () => {
  const reduce = useReducedMotion()
  const pre = veioPreRenderizada()
  const item = (i: number) => ({
    initial: reduce || pre ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay: 0.08 + i * 0.09 },
  })
  return (
    <PaginaVM>
      <Seo
        title="Cases | VirtualMark"
        description="Cases com número da plataforma de anúncio: 23,5x de retorno numa loja de lingerie, 34 mil vendas para uma loja de games, 1.714 contatos para uma clínica e projetos completos de marca, site e rastreio."
        path="/cases"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Cases da VirtualMark',
          url: 'https://virtualmark.com.br/cases',
          inLanguage: 'pt-BR',
          isPartOf: { '@id': 'https://virtualmark.com.br/#website' },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: CASOS.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://virtualmark.com.br/cases/${c.slug}`, name: `${c.segmento}: ${c.titulo}` })),
          },
        }}
      />
      <section className={`${caixa} flex flex-col gap-10 pb-12 pt-14 lg:flex-row lg:items-end lg:gap-12 lg:pb-16 lg:pt-24`}>
        <div className="flex-1">
          <motion.div {...item(0)}>
            <Sobrelinha>Cases</Sobrelinha>
          </motion.div>
          <motion.h1 {...item(1)} className="mt-6 font-manrope text-[clamp(2.75rem,6vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-vm-texto" style={{ textWrap: 'balance' }}>
            O que a gente já fez <span className="text-vm-vermt">vender.</span>
          </motion.h1>
          <motion.p {...item(2)} className="mt-6 max-w-[40rem] font-manrope text-lg leading-relaxed text-vm-suave sm:text-[19px]">
            Dois tipos de case: os de resultado, com o número da plataforma de anúncio, e os de projeto completo, com marca, site e vídeo feitos do zero.
          </motion.p>
        </div>
        <motion.div {...item(3)} className="flex items-end gap-3.5 self-end lg:self-auto">
          <p className="max-w-[260px] rounded-[20px] rounded-br-md border border-vm-borda bg-vm-sup px-[18px] py-4 font-manrope text-sm leading-snug text-vm-texto">
            Todo número aqui saiu do painel da plataforma. Clique num case para ver mês a mês.
          </p>
          <Ancora id="cases-topo" estado="analisando" celular className="w-[96px] shrink-0 lg:w-[130px]" />
        </motion.div>
      </section>
      <Lista />
      <Chamada />
    </PaginaVM>
  )
}

export default CasesNova

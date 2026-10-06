import { Link } from 'react-router-dom'
import { ArrowRight, Reveal } from './shared'

type Work = { name: string; what: string; href: string; internal?: boolean }

const works: Work[] = [
  { name: 'WB Soluções Elétricas', what: 'Branding · Site · Google Ads', href: '#caso-wb' },
  { name: 'Ópticas Miyagui', what: 'Criativos em vídeo com IA', href: '#criativos' },
  { name: 'CAIG', what: 'Site', href: '/cases', internal: true },
  { name: 'Quiro', what: 'Site', href: '/cases', internal: true },
  { name: 'Maré e Sabor', what: 'Site (em desenvolvimento)', href: '/cases', internal: true },
  { name: 'Showhome', what: 'Imobiliária · Site e geração de leads', href: '/cases', internal: true },
  { name: 'Colonial Guararema', what: 'Imobiliária · Site e geração de leads', href: '/cases', internal: true },
  { name: 'Game Safari', what: 'Marketing digital', href: '/cases', internal: true },
]

const Row = ({ w }: { w: Work }) => {
  const inner = (
    <>
      <span className="font-display text-[clamp(1.7rem,4.2vw,3.6rem)] font-bold leading-none tracking-[-0.03em] text-white transition-transform duration-500 ease-out group-hover:translate-x-3 group-hover:text-primary-400">
        {w.name}
      </span>
      <span className="flex items-center gap-4 text-sm text-white/55 sm:text-base">
        <span className="text-right sm:text-left">{w.what}</span>
        <ArrowRight className="h-5 w-5 shrink-0 -translate-x-2 text-primary-500 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
      </span>
    </>
  )
  const cls = 'group flex flex-col gap-3 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-8'
  return w.internal ? (
    <Link to={w.href} className={cls}>{inner}</Link>
  ) : (
    <a href={w.href} className={cls}>{inner}</a>
  )
}

const Works = () => (
  <section id="casos" className="relative px-5 py-24 sm:px-8 sm:py-36">
    <div className="mx-auto max-w-[88rem]">
      <Reveal>
        <h2
          className="max-w-[18ch] font-display font-bold text-white"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 4.4rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
        >
          O que a gente já colocou no ar.
        </h2>
      </Reveal>
      <div className="mt-14 border-b border-white/10">
        {works.map((w) => (
          <Row key={w.name} w={w} />
        ))}
      </div>
      <Link
        to="/cases"
        className="mt-10 inline-flex items-center gap-2 text-base font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-primary-500"
      >
        Ver todos os cases <ArrowRight />
      </Link>
    </div>
  </section>
)

export default Works

import { Link } from 'react-router-dom'
import { ArrowRight, Reveal } from './shared'

const tools = [
  { name: 'Simulador de cenários', what: 'Mostra para imobiliárias o que muda no resultado ao mexer em investimento, conversão e ticket.', href: '/simulador-imoveis' },
  { name: 'Quiz de diagnóstico por perfil', what: 'Qualifica o lead antes do WhatsApp. Versões para imobiliárias e e-commerce.', href: '/quiz-imoveis' },
  { name: 'Páginas por segmento', what: 'Landing pages feitas para o jeito de comprar de cada mercado.', href: '/imobiliarias' },
  { name: 'Painel de leads com origem', what: 'Cada lead chega com fonte, campanha e busca. Você vê o que gera venda.', href: '' },
]

const Lab = () => (
  <section className="relative px-5 py-24 sm:px-8 sm:py-36 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-[clamp(4rem,10vh,8rem)]">
    <div className="w-full mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Reveal>
          <h2
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(2.2rem, min(4.6vw, 8.2vh), 4rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
          >
            Ferramentas que a gente mesmo construiu.
          </h2>
          <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-white/70">
            Agência que só opera anúncio depende de ferramenta dos outros. Aqui, o que a gente precisa, a gente faz.
          </p>
        </Reveal>
      </div>
      <div className="lg:col-span-7">
        <ul className="border-b border-white/10">
          {tools.map((t) => {
            const body = (
              <>
                <span className="flex items-start justify-between gap-6">
                  <span className="font-display text-2xl font-bold tracking-tight text-white transition-colors duration-500 group-hover:text-primary-400 sm:text-3xl">
                    {t.name}
                  </span>
                  {t.href && <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-primary-500 opacity-60 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100" />}
                </span>
                <span className="mt-2 block max-w-[52ch] text-base leading-relaxed text-white/65">{t.what}</span>
              </>
            )
            return (
              <li key={t.name}>
                {t.href ? (
                  <Link to={t.href} className="group block border-t border-white/10 py-7">{body}</Link>
                ) : (
                  <div className="block border-t border-white/10 py-7">{body}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  </section>
)

export default Lab

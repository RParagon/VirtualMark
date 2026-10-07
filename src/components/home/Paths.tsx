import { ArrowRight, Reveal, waLink } from './shared'

const paths = [
  {
    name: 'Quero ser encontrado',
    what: 'Marca, site rápido, Google Meu Negócio e presença nas redes. Para quem está começando ou ainda não aparece.',
    msg: 'Oi! Vim pelo site da VirtualMark. Quero ser encontrado na internet (marca, site e Google Meu Negócio). Podemos conversar?',
  },
  {
    name: 'Quero vender mais',
    what: 'Campanhas no Google e na Meta, página de conversão e criativos em vídeo com IA, com a configuração e a criação das campanhas por nossa conta.',
    msg: 'Oi! Vim pelo site da VirtualMark. Quero vender mais com anúncios e página de conversão. Podemos conversar?',
  },
  {
    name: 'Quero escalar com dados',
    what: 'Rastreio do clique à venda (gclid), painel de leads e otimização contínua sobre o que realmente fecha.',
    msg: 'Oi! Vim pelo site da VirtualMark. Quero escalar com rastreio e dados. Podemos conversar?',
  },
]

const Paths = () => (
  <section id="caminhos" className="relative bg-primary-600 px-5 py-24 text-black sm:px-8 sm:py-36 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-[clamp(4rem,10vh,8rem)]">
    <div className="w-full mx-auto max-w-[88rem]">
      <Reveal>
        <h2
          className="max-w-[16ch] font-display font-bold"
          style={{ fontSize: 'clamp(2.4rem, min(6vw, 10.5vh), 5.4rem)', lineHeight: 1, letterSpacing: '-0.035em', textWrap: 'balance' }}
        >
          Onde o seu negócio está agora?
        </h2>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-black/80 sm:text-xl">
          Escolha o ponto de partida. A gente conversa sobre o seu caso e define o investimento na consultoria.
        </p>
      </Reveal>

      <div className="mt-14 border-b border-black/25">
        {paths.map((p) => (
          <a
            key={p.name}
            href={waLink(p.msg)}
            className="group grid gap-4 border-t border-black/25 py-8 transition-colors duration-500 hover:bg-black hover:text-white sm:-mx-6 sm:grid-cols-12 sm:items-center sm:gap-8 sm:px-6 sm:py-10"
          >
            <span className="font-display text-[clamp(1.8rem,4vw,3.4rem)] font-bold leading-none tracking-[-0.03em] sm:col-span-6">
              {p.name}
            </span>
            <span className="text-base leading-relaxed text-black/80 transition-colors duration-500 group-hover:text-white/75 sm:col-span-5 sm:text-lg">
              {p.what}
            </span>
            <span className="hidden justify-end sm:col-span-1 sm:flex">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-black text-white transition-colors duration-500 group-hover:bg-primary-600">
                <ArrowRight className="h-5 w-5" />
              </span>
            </span>
            <span className="inline-flex items-center gap-2 text-base font-semibold sm:hidden">
              Conversar no WhatsApp <ArrowRight />
            </span>
          </a>
        ))}
      </div>

      <p className="mt-10 max-w-[56ch] text-base text-black/80">
        Não sabe por onde começar?{' '}
        <a href="/contact" className="font-semibold underline decoration-black/40 underline-offset-4 hover:decoration-black">
          Responda algumas perguntas rápidas
        </a>{' '}
        e a gente indica o melhor caminho.
      </p>
    </div>
  </section>
)

export default Paths

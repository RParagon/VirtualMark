import { ArrowRight, Reveal, waLink } from './shared'

const FinalCta = () => (
  <section className="relative overflow-hidden px-5 py-28 sm:px-8 sm:py-44 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-[clamp(4rem,10vh,8rem)]">
    <div
      className="absolute inset-0 -z-10"
      style={{ background: 'radial-gradient(55% 70% at 50% 110%, rgba(220,38,38,0.35), transparent 70%)' }}
    />
    <div className="w-full mx-auto max-w-[88rem]">
      <Reveal>
        <h2
          className="max-w-[14ch] font-display font-bold text-white"
          style={{ fontSize: 'clamp(2.8rem, min(8.2vw, 13vh), 6rem)', lineHeight: 0.98, letterSpacing: '-0.04em', textWrap: 'balance' }}
        >
          Agora o <span className="text-primary-500">X</span> é com você.
        </h2>
        <p className="mt-7 max-w-[44ch] text-lg leading-relaxed text-white/70 sm:text-xl">
          Conte sobre o seu negócio. Em uma conversa a gente mostra por onde começar.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={waLink('Oi! Vim pelo site da VirtualMark e quero marcar uma consultoria.')}
            className="group inline-flex items-center gap-3 rounded-full bg-primary-600 py-3.5 pl-7 pr-3.5 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(220,38,38,0.7)] transition-colors hover:bg-primary-500"
          >
            Marcar consultoria no WhatsApp
            <span className="grid h-9 w-9 place-items-center rounded-full bg-black/25 transition-transform group-hover:translate-x-1">
              <ArrowRight />
            </span>
          </a>
          <a href="/contact" className="text-base font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-primary-500">
            Prefiro preencher um formulário
          </a>
        </div>
      </Reveal>
    </div>
  </section>
)

export default FinalCta

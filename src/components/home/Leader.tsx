import { ArrowRight, Reveal, waLink } from './shared'

const Leader = () => (
  <section className="relative px-5 py-24 sm:px-8 sm:py-36">
    <div className="mx-auto grid max-w-[88rem] items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
          <img
            src="/home/jose.webp"
            srcSet="/home/jose-sm.webp 560w, /home/jose.webp 1122w"
            sizes="(min-width: 1024px) 40vw, 90vw"
            alt="José Roberto, CEO e gestor de tráfego da VirtualMark"
            width={1122}
            height={1402}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </Reveal>
      <Reveal delay={0.1} className="lg:col-span-7">
        <h2
          className="font-display font-bold text-white"
          style={{ fontSize: 'clamp(2.2rem, 4.8vw, 4.2rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
        >
          Quem está por trás.
        </h2>
        <p className="mt-8 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">José Roberto</p>
        <p className="mt-1 text-base text-primary-400">CEO e gestor de tráfego</p>
        <div className="mt-6 max-w-[54ch] space-y-4 text-lg leading-relaxed text-white/70">
          <p>
            Cursa Engenharia da Computação em uma universidade federal e leva essa cabeça para o
            marketing: dados, rastreio e sistemas próprios, em vez de achismo.
          </p>
          <p>
            Cuida da estratégia e do tráfego de cada cliente, junto de um time que faz marca, site e
            criativos. Quem chega aqui fala com quem decide.
          </p>
        </div>
        <a
          href={waLink('Oi José! Vim pelo site da VirtualMark e quero conversar.')}
          className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/25 py-3 pl-6 pr-3 text-base font-semibold text-white transition-colors hover:border-primary-500 hover:bg-primary-600"
        >
          Falar direto com o José
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1">
            <ArrowRight />
          </span>
        </a>
      </Reveal>
    </div>
  </section>
)

export default Leader

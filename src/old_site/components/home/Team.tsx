import { ChartBarIcon, CodeBracketIcon, LightBulbIcon, PlayIcon } from '@heroicons/react/24/outline'
import { ArrowRight, Reveal, Shards, waLink } from './shared'

const fronts = [
  { Icon: ChartBarIcon, t: 'Estratégia e tráfego', d: 'Google Ads e Meta Ads, rastreio dos contatos e relatórios claros.' },
  { Icon: CodeBracketIcon, t: 'Sites e sistemas', d: 'Sites, páginas de conversão, painéis e banco de dados.' },
  { Icon: PlayIcon, t: 'Criativos e conteúdo', d: 'Vídeos com IA, edição e conteúdo para as redes.' },
  { Icon: LightBulbIcon, t: 'Marca', d: 'Logo, identidade e moodboard para quem começa do zero.' },
]

const Team = () => (
  <section className="relative isolate overflow-hidden px-5 py-24 sm:px-8 sm:py-36 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-[clamp(4rem,10vh,8rem)]">
    <Shards className="-z-10 opacity-80" />
    <div className="w-full mx-auto grid max-w-[88rem] items-center gap-14 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <img
          src="/vm-logo.png"
          alt="VirtualMark"
          width={720}
          height={244}
          loading="lazy"
          className="h-16 w-auto sm:h-20"
        />
        <h2
          className="mt-8 font-display font-bold text-white"
          style={{ fontSize: 'clamp(2.2rem, min(4.6vw, 8.2vh), 4rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
        >
          Quem cuida do seu projeto: a VirtualMark inteira.
        </h2>
        <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-white/70">
          Da marca e do site aos criativos, às campanhas e aos dados. Cada frente tem quem entende dela, e todas conversam entre si.
        </p>
        <a
          href={waLink('Oi! Vim pelo site da VirtualMark e quero conversar com a equipe.')}
          className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/25 py-3 pl-6 pr-3 text-base font-semibold text-white transition-colors hover:border-primary-500 hover:bg-primary-600"
        >
          Falar com a equipe
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1">
            <ArrowRight />
          </span>
        </a>
      </Reveal>

      <Reveal delay={0.1} className="lg:col-span-7">
        <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
          {fronts.map(({ Icon, t, d }) => (
            <div key={t} className="border-t-[3px] border-primary-500 pt-7">
              <Icon className="h-9 w-9 text-primary-500" aria-hidden />
              <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{t}</h3>
              <p className="mt-3 max-w-[34ch] text-lg leading-relaxed text-white/70">{d}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
)

export default Team

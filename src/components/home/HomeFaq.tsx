import { Reveal } from './shared'

export const faqs = [
  {
    q: 'Quanto custa?',
    a: 'Depende do que o seu negócio precisa: só site, só campanha ou a estrutura completa. Por isso o valor é definido em uma consultoria, depois que a gente entende o seu momento. Não existe tabela fixa.',
  },
  {
    q: 'Como funciona o começo do projeto?',
    a: 'Primeiro uma conversa para entender o negócio, o público e o objetivo. Depois a gente monta a estrutura (site, páginas, Google Meu Negócio e rastreio) e faz a configuração e a criação das campanhas. O prazo depende do que o seu negócio já tem pronto.',
  },
  {
    q: 'Eu ainda não tenho logo nem site. Vocês atendem?',
    a: 'Sim. A gente começa pela marca, cria o site, o perfil no Google Meu Negócio e só então lança a primeira campanha. Foi exatamente assim no caso da WB Soluções Elétricas.',
  },
  {
    q: 'O que é o rastreio com gclid?',
    a: 'O gclid é o identificador que o Google Ads gera para cada clique. A gente guarda esse código junto de cada lead, então você descobre qual anúncio e qual busca geraram a conversa e a venda, e não só o clique.',
  },
  {
    q: 'Vocês só fazem tráfego pago?',
    a: 'Não. Fazemos marca, site, criativos (inclusive vídeos com IA), gestão de tráfego no Google e na Meta, rastreio e conteúdo. O tráfego é uma das etapas do sistema.',
  },
  {
    q: 'Como são feitos os criativos em vídeo com IA?',
    a: 'A gente parte da foto do produto e de um modelo, gera um storyboard no ChatGPT e produz o vídeo no Google Flow com prompt e storyboard. Depois cuidamos da narração, da trilha e da edição.',
  },
]

const HomeFaq = () => (
  <section className="relative px-5 py-24 sm:px-8 sm:py-36">
    <div className="mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <Reveal>
          <h2
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.6rem)', lineHeight: 1.02, letterSpacing: '-0.03em', textWrap: 'balance' }}
          >
            Perguntas diretas, respostas diretas.
          </h2>
        </Reveal>
      </div>
      <div className="lg:col-span-8">
        <div className="border-b border-white/10">
          {faqs.map((f) => (
            <details key={f.q} className="group border-t border-white/10 py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-bold tracking-tight text-white sm:text-2xl [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="relative h-5 w-5 shrink-0 text-primary-500" aria-hidden>
                  <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-5 w-0.5 -translate-x-1/2 bg-current transition-transform duration-500 group-open:rotate-90" />
                </span>
              </summary>
              <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-white/70 sm:text-lg">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default HomeFaq

import Seo from '../components/Seo'
import Footer from '../components/home/HomeFooter'
import HomeNav from '../components/home/HomeNav'
import HomeHero from '../components/home/HomeHero'
import Statement from '../components/home/Statement'
import Thesis from '../components/home/Thesis'
import CaseWB from '../components/home/CaseWB'
import CreativeAnatomy from '../components/home/CreativeAnatomy'
import Works from '../components/home/Works'
import Lab from '../components/home/Lab'
import Leader from '../components/home/Leader'
import HomeFaq, { faqs } from '../components/home/HomeFaq'
import Paths from '../components/home/Paths'
import FinalCta from '../components/home/FinalCta'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

/**
 * THESIS: a home é a máquina que descreve: o X é o ponto onde atenção vira venda. Recusa a home de agência (hero, 3 números, cards de serviço).
 * OWN-WORLD: preto #0a0a0a com vermelho como fonte de luz (rim, brilho) e uma seção drenched em vermelho; Bricolage Grotesque grande, linhas finas, sem cards cinza.
 * STORY: entende que não é só tráfego, vê o sistema e provas reais (caso WB, vídeo Miyagui), escolhe o ponto de partida e pede consultoria.
 * FIRST VIEWPORT: título gigante à esquerda, X 3D em obsidiana com partículas atravessando à direita, CTA vermelho abaixo do texto.
 * FORM: palco editorial com seções de scroll fixo (pinned), seed: ajuste direto do briefing (direction pinned pelo usuário).
 */
const HomePage = () => (
  <main className="relative bg-background text-white">
    <Seo
      title="VirtualMark | Você chega com uma ideia. Sai com o negócio no ar."
      description="Marca, site, criativos em vídeo com IA, tráfego pago e rastreio do clique à venda. Estrutura completa no ar em poucos dias. Peça sua consultoria."
      path="/"
      jsonLd={faqSchema}
    />
    <HomeNav />
    <HomeHero />
    <Statement />
    <Thesis />
    <CaseWB />
    <CreativeAnatomy />
    <Works />
    <Lab />
    <Leader />
    <HomeFaq />
    <Paths />
    <FinalCta />
    <Footer />
  </main>
)

export default HomePage

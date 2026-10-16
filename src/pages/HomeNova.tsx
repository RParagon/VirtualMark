import Seo from '../components/Seo'
import { Abertura } from '../components/nova/Abertura'
import { Cases, Pista, Prova, Servicos } from '../components/nova/Secoes'
import { Chamada, Quiz } from '../components/nova/Final'
import { PaginaVM } from '../components/nova/Pagina'

/** Nova home (Figma "Virtual Mark — Nova home e cases"). O tema segue o sistema da pessoa. */
const HomeNova = () => (
  <PaginaVM home>
    <Seo
      title="VirtualMark | Tráfego pago, criativos e site que vendem"
      description="Tráfego pago no Google e no Meta, criativos e site em um só time. Cases com número: 23,5x de retorno numa loja de lingerie e 34 mil vendas para uma loja de games. Avaliação gratuita."
      path="/"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': 'https://virtualmark.com.br/#servico',
        name: 'VirtualMark',
        url: 'https://virtualmark.com.br/',
        image: 'https://virtualmark.com.br/vm-logo.png',
        telephone: '+5511992794634',
        slogan: 'O X da questão é vender mais.',
        description: 'Tráfego pago no Google e no Meta, criativos e site em um só time, com o retorno em reais todo mês.',
        areaServed: { '@type': 'Country', name: 'Brasil' },
        address: { '@type': 'PostalAddress', addressLocality: 'São Paulo', addressRegion: 'SP', addressCountry: 'BR' },
        parentOrganization: { '@id': 'https://virtualmark.com.br/#organization' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Serviços',
          itemListElement: ['Tráfego pago no Google e no Meta', 'Sites e landing pages', 'Criativos estáticos e em vídeo', 'Rastreio e painel de resultado'].map((n) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: n },
          })),
        },
      }}
    />
    <Abertura />
    <Prova />
    <Servicos />
    <Pista />
    <Cases />
    <Quiz />
    <Chamada />
  </PaginaVM>
)

export default HomeNova

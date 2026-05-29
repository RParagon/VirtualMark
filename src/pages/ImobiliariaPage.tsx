import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Globe, BarChart2, TrendingUp, Zap, MessageCircle, Mail, Search, Layers, RefreshCw, Users, MousePointer2, MessageSquare, Pen } from 'lucide-react'
import { Helmet } from 'react-helmet'
import { HeroGeometric } from '@/components/ui/shape-landing-hero'
import { BentoGrid } from '@/components/ui/bento-grid'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { GlowCard } from '@/components/ui/spotlight-card'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ShinyButton } from '@/components/ui/shiny-button'
import { TestimonialsSection } from '@/components/ui/testimonial-columns'
import { Radar, IconContainer } from '@/components/ui/radar-effect'
import type { BentoItem } from '@/components/ui/bento-grid'
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

// ─── SEO / GEO Structured Data ───────────────────────────────────────────────

const SITE_URL = 'https://virtualmark.com.br'
const PAGE_URL = `${SITE_URL}/imobiliarias`
const OG_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'

const seoSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'VirtualMark',
      description: 'Agência de marketing digital especializada em geração de leads qualificados para imobiliárias e corretores de imóveis no Brasil.',
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: 'Marketing Digital para Imobiliárias | Leads Qualificados | VirtualMark',
      description: 'Agência especializada em geração de leads qualificados para imobiliárias e corretores. Campanhas Google Ads e Meta Ads com landing pages otimizadas. Diagnóstico gratuito.',
      inLanguage: 'pt-BR',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'h2', '.speakable-content'],
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Marketing para Imobiliárias', item: PAGE_URL },
      ],
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'VirtualMark',
      url: SITE_URL,
      email: 'contato@virtualmark.com.br',
      telephone: '+5511992794634',
      description: 'Agência de marketing digital especializada em geração de leads qualificados para imobiliárias e corretores de imóveis no Brasil via Google Ads e Meta Ads.',
      foundingDate: '2019',
      areaServed: { '@type': 'Country', name: 'Brasil' },
      knowsAbout: [
        'Marketing Digital para Imobiliárias',
        'Google Ads',
        'Meta Ads',
        'Geração de Leads Qualificados',
        'Landing Pages de Alta Conversão',
        'Gestão de Tráfego Pago',
        'CRM Imobiliário',
        'Mercado Imobiliário Brasileiro',
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
        addressRegion: 'SP',
        addressLocality: 'São Paulo',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+5511992794634',
        contactType: 'sales',
        availableLanguage: 'Portuguese',
        areaServed: 'BR',
      },
    },
    {
      '@type': ['LocalBusiness', 'ProfessionalService'],
      '@id': `${PAGE_URL}#business`,
      name: 'VirtualMark — Marketing Digital para Imobiliárias',
      description: 'Especialistas em geração de leads para imobiliárias e corretores. Campanhas Google Ads e Meta Ads com segmentação por perfil de comprador, landing pages de alta conversão e relatórios de CPL em tempo real.',
      url: PAGE_URL,
      telephone: '+5511992794634',
      email: 'contato@virtualmark.com.br',
      priceRange: '$$',
      currenciesAccepted: 'BRL',
      paymentAccepted: 'PIX, Cartão de Crédito, Boleto',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
        addressRegion: 'SP',
        addressLocality: 'São Paulo',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -23.5505,
        longitude: -46.6333,
      },
      areaServed: [
        { '@type': 'Country', name: 'Brasil' },
        { '@type': 'AdministrativeArea', name: 'São Paulo' },
        { '@type': 'AdministrativeArea', name: 'Rio de Janeiro' },
        { '@type': 'AdministrativeArea', name: 'Minas Gerais' },
        { '@type': 'AdministrativeArea', name: 'Paraná' },
        { '@type': 'AdministrativeArea', name: 'Santa Catarina' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Serviços de Marketing Digital para Imobiliárias',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Campanha Segmentada Google Ads & Meta Ads para Imobiliárias',
              description: 'Anúncios otimizados que impactam compradores de imóveis por região, faixa de renda e comportamento de busca.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Landing Pages de Alta Conversão para Imobiliárias',
              description: 'Páginas dedicadas com formulário e WhatsApp integrados para transformar visitantes em leads qualificados.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Dashboard de CPL e ROI em Tempo Real',
              description: 'Relatórios semanais com custo por lead, taxa de conversão e retorno sobre investimento por campanha.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Otimização Contínua de Campanhas Imobiliárias',
              description: 'Ajuste diário das campanhas para reduzir custo por lead e elevar a qualidade dos contatos gerados.',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Qual o investimento mínimo para começar com marketing digital para imobiliárias?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A VirtualMark recomenda um investimento inicial de R$1.500 a R$3.000 por mês em mídia (Google Ads e Meta Ads) para validar o canal. O fee de gestão é separado. Antes de qualquer contrato, fazemos uma simulação personalizada com base na faixa de preço dos imóveis e na região de atuação.',
          },
        },
        {
          '@type': 'Question',
          name: 'Em quanto tempo uma imobiliária vê os primeiros leads com Google Ads e Meta Ads?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Com estrutura correta de campanha, os primeiros leads qualificados chegam entre 7 e 15 dias após o lançamento. Em 30 dias já existem dados reais de CPL (custo por lead) para otimizar a estratégia com segurança.',
          },
        },
        {
          '@type': 'Question',
          name: 'Marketing digital para imobiliárias é melhor do que anunciar em portais imobiliários?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Não são estratégias excludentes. Em portais imobiliários, o mesmo lead é disputado por até 30 corretores simultaneamente. Com captação própria via Google Ads e Meta Ads, o lead chega exclusivamente para a imobiliária. Em 90 dias há dados para decidir a melhor alocação de verba entre os canais.',
          },
        },
        {
          '@type': 'Question',
          name: 'O marketing digital para imobiliárias funciona em qualquer cidade do Brasil?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim. A segmentação geográfica permite impactar compradores que pesquisam imóveis especificamente na área de atuação da imobiliária — cidade, bairro ou condomínio, de Norte a Sul do Brasil.',
          },
        },
        {
          '@type': 'Question',
          name: 'Preciso ter site próprio para gerar leads com marketing digital?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Não. A VirtualMark cria landing pages dedicadas para cada campanha — sem necessidade de site completo. A landing page tem um único objetivo: converter o visitante em lead qualificado para a imobiliária.',
          },
        },
        {
          '@type': 'Question',
          name: 'Há fidelidade ou multa para cancelar a gestão de tráfego?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Não. A VirtualMark trabalha com contratos mensais renováveis, sem fidelidade mínima. Se em 60 dias não houver evolução mensurável, a estratégia é revisada sem custo adicional.',
          },
        },
      ],
    },
    {
      '@type': 'Review',
      '@id': `${PAGE_URL}#review-1`,
      author: { '@type': 'Person', name: 'Fernando' },
      reviewBody: 'Completando 5 meses de parceria, foi feito um ótimo trabalho ao otimizar nossas campanhas e melhorar nossa presença online. A equipe foi proativa e ajudou a aumentar nossas vendas nesse curto período.',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      itemReviewed: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'CaseStudy',
      '@id': `${PAGE_URL}#case-showhome`,
      name: 'Case Showhome — ROI 4.3x com Meta Ads',
      description: 'A Showhome investiu R$3.000 em Meta Ads com a VirtualMark e gerou 330 contatos qualificados no WhatsApp, 25 visitas agendadas e 1 venda realizada — resultando em R$13.000 de comissão e ROI de 4.3x.',
      about: { '@id': `${SITE_URL}/#organization` },
      result: 'ROI de 4.3x: R$3.000 investidos em Meta Ads resultaram em R$13.000 de comissão gerada para a imobiliária Showhome.',
    },
  ],
}

// ─── Page Data ───────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

const painPoints = [
  {
    tag: 'Corretor Tradicional',
    title: '"Meu negócio é olho no olho — não preciso de internet."',
    reality:
      'Enquanto você fecha 3 negócios com indicação, seu concorrente fecha 10 porque aparece primeiro no Google quando o comprador pesquisa.',
  },
  {
    tag: 'Dependente de Portais',
    title: '"Já gasto com portal, não quero mais uma despesa."',
    reality:
      'Você paga caro por leads que chegam para outros 30 corretores ao mesmo tempo. Em 2 anos o custo subiu +40% e a qualidade caiu.',
  },
  {
    tag: 'Tentou e Parou',
    title: '"Já tentei anúncios e joguei dinheiro fora."',
    reality:
      'Você não falhou — a estratégia estava errada. Impulsionar post não é gestão de tráfego. São coisas completamente diferentes.',
  },
]

const services = [
  { name: 'Tráfego Pago', Icon: MousePointer2 },
  { name: 'Google Ads', Icon: Search },
  { name: 'Meta Ads', Icon: Globe },
  { name: 'Social Media', Icon: MessageSquare },
  { name: 'Landing Pages', Icon: Layers },
  { name: 'Automações', Icon: Zap },
  { name: 'WhatsApp Marketing', Icon: MessageCircle },
  { name: 'Email Marketing', Icon: Mail },
  { name: 'Analytics', Icon: BarChart2 },
  { name: 'Criativos', Icon: Pen },
  { name: 'Remarketing', Icon: RefreshCw },
  { name: 'CRM', Icon: Users },
]

const marketStats = [
  {
    value: '78%',
    description: 'dos compradores de imóveis pesquisam online antes de contatar qualquer corretor',
  },
  {
    value: '30',
    description: 'corretores disputando o mesmo lead que você recebe de um portal imobiliário',
  },
  {
    value: '+40%',
    description: 'de aumento no custo dos portais nos últimos 2 anos, com qualidade caindo',
  },
]

const vmBentoItems: BentoItem[] = [
  {
    title: 'Campanha Segmentada',
    description:
      'Anúncios que aparecem para quem já busca imóveis na sua faixa de preço e região — não para qualquer pessoa. Segmentação cirúrgica no Google e Meta.',
    icon: <Target className="w-5 h-5 text-primary-500" />,
    status: 'Google & Meta',
    tags: ['leads', 'segmentação'],
    cta: 'Saber mais →',
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: 'Landing Pages que Convertem',
    description:
      'Páginas dedicadas com formulário e WhatsApp integrados — criadas para transformar visitantes em leads qualificados com um único CTA.',
    icon: <Globe className="w-5 h-5 text-primary-500" />,
    status: 'Alta conversão',
    tags: ['conversão'],
    cta: 'Ver exemplo →',
  },
  {
    title: 'Dashboard em Tempo Real',
    description:
      'Acompanhe CPL, taxa de conversão e ROI por campanha. Dados claros, relatório semanal e zero enrolação.',
    icon: <BarChart2 className="w-5 h-5 text-primary-500" />,
    status: 'Tempo real',
    tags: ['dados', 'roi'],
    cta: 'Ver demo →',
  },
  {
    title: 'Otimização Contínua',
    description:
      'Nossa equipe ajusta campanhas diariamente para reduzir custo por lead e aumentar a qualidade dos contatos. Sem set-and-forget.',
    icon: <TrendingUp className="w-5 h-5 text-primary-500" />,
    status: 'Diário',
    tags: ['escala', 'otimização', 'cpl'],
    cta: 'Começar →',
    colSpan: 2,
  },
]

const processSteps = [
  {
    number: '01',
    title: 'Diagnóstico',
    desc: 'Entendemos seu mercado, região, faixa de preço e perfil de comprador. Estratégia definida antes de investir R$1.',
  },
  {
    number: '02',
    title: 'Estrutura',
    desc: 'Montamos landing page, pixel de rastreamento, CRM e processo de follow-up para nenhum lead ser perdido.',
  },
  {
    number: '03',
    title: 'Campanhas',
    desc: 'Lançamos no Google e Meta com segmentação cirúrgica: localização, renda, comportamento de busca e interesse.',
  },
  {
    number: '04',
    title: 'Escala com Dados',
    desc: 'Com dados reais de CPL e conversão, escalamos o que funciona e eliminamos o que drena orçamento.',
  },
]

const caseMetrics = [
  { v: 'R$3K', l: 'Investimento em Meta Ads' },
  { v: '330', l: 'Contatos gerados no WhatsApp' },
  { v: '25', l: 'Visitas agendadas' },
  { v: '1', l: 'Venda realizada' },
]

const caseChecklist = [
  'Campanhas Meta Ads segmentadas por perfil de comprador de alto padrão',
  'Landing pages com CTA direto para WhatsApp Business',
  '330 contatos qualificados gerados diretamente no WhatsApp',
  'R$13.000 de comissão gerada com R$3.000 investidos em mídia',
]


const faqs = [
  {
    q: 'Qual o investimento mínimo para começar?',
    a: 'Recomendamos um investimento inicial de R$1.500 a R$3.000/mês em mídia para validar o canal. Nosso fee de gestão é separado. Fazemos uma simulação personalizada baseada na sua faixa de imóveis e região antes de qualquer contrato.',
  },
  {
    q: 'Em quanto tempo vejo os primeiros resultados?',
    a: 'Com uma campanha bem estruturada, os primeiros leads qualificados chegam em 7 a 15 dias. Em 30 dias você já tem dados reais de CPL e pode tomar decisões com informação — não no escuro.',
  },
  {
    q: 'É melhor que investir em portal imobiliário?',
    a: 'Não é ou/ou — é estratégia. Em portais você disputa o mesmo lead com 30 corretores. Com captação própria, o lead chegou exclusivamente para você. Em 90 dias você tem dados para decidir o que faz mais sentido para o seu negócio.',
  },
  {
    q: 'Funciona para minha região específica?',
    a: 'Sim. A segmentação geográfica é uma das nossas principais ferramentas. Conseguimos atingir pessoas que pesquisam imóveis especificamente na sua área de atuação, bairro por bairro se necessário.',
  },
  {
    q: 'Preciso de site ou posso começar sem?',
    a: 'Criamos landing pages dedicadas para as campanhas — você não precisa de site completo para começar. A landing page tem um único objetivo: transformar o visitante em lead qualificado.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Trabalhamos com contratos mensais renováveis. Não amarramos ninguém — acreditamos que os resultados criam a fidelidade. Se em 60 dias não houver evolução clara, revisamos a estratégia juntos sem custo.',
  },
]

// ─── Sub-component: Showhome browser frame inside ContainerScroll ─────────────

function ShowhomeBrowserFrame() {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="flex-none flex items-center gap-2 px-4 py-3 bg-[#2a2a2a] border-b border-white/10">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-[#3a3a3a] rounded-md px-4 py-1 flex items-center gap-2 text-xs text-gray-400 max-w-xs w-full">
            <svg className="w-3 h-3 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0v20M2 12h20M4.93 4.93c3.12 3.12 3.12 11.02 0 14.14M19.07 4.93c-3.12 3.12-3.12 11.02 0 14.14" />
            </svg>
            showhomenow.com.br
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          src="https://showhomenow.com.br"
          title="Site Showhome"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  )
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ImobiliariaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">

      {/* ── SEO / GEO HEAD ── */}
      <Helmet>
        {/* Primary */}
        <html lang="pt-BR" />
        <title>Marketing Digital para Imobiliárias | Leads Qualificados | VirtualMark</title>
        <meta name="title" content="Marketing Digital para Imobiliárias | Leads Qualificados | VirtualMark" />
        <meta name="description" content="Agência especializada em geração de leads qualificados para imobiliárias e corretores. Campanhas Google Ads e Meta Ads com landing pages de alta conversão. Diagnóstico gratuito em 3 minutos." />
        <meta name="keywords" content="marketing digital para imobiliárias, leads para corretor de imóveis, google ads imobiliária, meta ads imóveis, gestão de tráfego imobiliária, captação de leads imóveis, agência marketing imobiliário, leads qualificados imóveis, anúncios imobiliários brasil, marketing digital corretor" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="VirtualMark" />
        <meta name="rating" content="general" />
        <meta httpEquiv="content-language" content="pt-BR" />
        <link rel="canonical" href={PAGE_URL} />

        {/* Geo */}
        <meta name="geo.region" content="BR-SP" />
        <meta name="geo.placename" content="São Paulo, Brasil" />
        <meta name="geo.position" content="-23.5505;-46.6333" />
        <meta name="ICBM" content="-23.5505, -46.6333" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content="Marketing Digital para Imobiliárias | VirtualMark" />
        <meta property="og:description" content="Especialistas em geração de leads para imobiliárias. +400% de crescimento em leads qualificados para nossos clientes. Diagnóstico gratuito em 3 minutos." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Imóvel de alto padrão — VirtualMark Marketing Digital para Imobiliárias" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="VirtualMark" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Marketing Digital para Imobiliárias | VirtualMark" />
        <meta name="twitter:description" content="Geração de leads qualificados para imobiliárias. +400% de crescimento. Diagnóstico gratuito." />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(seoSchema)}</script>
      </Helmet>

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-16 bg-background/80 backdrop-blur-sm border-b border-white/[0.04]">
        <span className="text-white font-bold text-lg tracking-wide">VirtualMark</span>
      </header>

      {/* ── HERO ── */}
      <HeroGeometric
        badge="Marketing Imobiliário"
        title1="Sua Imobiliária Está"
        title2="Perdendo Clientes Para a Concorrência"
        subtitle="78% dos compradores pesquisam online antes de contatar qualquer corretor. Se você não aparece quando eles buscam, seu concorrente aparece — e fecha o negócio."
      >
        <div className="flex justify-center">
          <ShinyButton to="/quiz-imoveis">Fazer Diagnóstico Gratuito →</ShinyButton>
        </div>
        <p className="text-sm text-white/40 mt-5">
          ✓ Gratuito · ✓ Resultado em 3 minutos · ✓ Plano personalizado no resultado
        </p>
      </HeroGeometric>

      {/* ── SERVICES TICKER ── */}
      <section className="py-8 bg-background border-y border-white/[0.05] relative overflow-hidden">
        <p className="text-center text-xs font-semibold tracking-widest text-gray-600 uppercase mb-5">
          O que entregamos
        </p>
        <InfiniteSlider duration={35} className="py-1">
          {services.map((s, i) => (
            <div key={i} className="flex items-center gap-8 mx-4">
              <div className="flex items-center gap-2.5 text-gray-500 cursor-default">
                <s.Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">{s.name}</span>
              </div>
              <span className="text-gray-700 select-none">·</span>
            </div>
          ))}
        </InfiniteSlider>
        {/* Blur anchored to section edges, covers full height including label */}
        <ProgressiveBlur className="left-0 inset-y-0 w-28" direction="left" blurIntensity={6} />
        <ProgressiveBlur className="right-0 inset-y-0 w-28" direction="right" blurIntensity={6} />
      </section>

      {/* ── PAIN POINTS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-gray-900/30">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Você Se Identifica Com{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
                Alguma Dessas Situações?
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto speakable-content">
              Cada perfil tem uma solução diferente. Saber qual é o seu é o primeiro passo para
              mudar o jogo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map((p, i) => (
              <motion.div key={i} variants={itemVariants} className="h-full">
                <GlowCard glowColor="red" className="h-full bg-gray-900/70 p-7">
                  <span className="inline-block text-xs font-bold bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full mb-4 tracking-wide">
                    {p.tag}
                  </span>
                  <h3 className="text-base font-bold mb-3 text-gray-200 leading-snug italic">
                    {p.title}
                  </h3>
                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      <span className="text-primary-400 font-semibold not-italic">A realidade: </span>
                      {p.reality}
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── MARKET STATS — property background image ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/68" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-primary-500 bg-primary-500/10 px-4 py-2 rounded-full border border-primary-500/20 mb-5">
              A REALIDADE DO MERCADO IMOBILIÁRIO
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold speakable-content">
              Os Números Que Você Precisa Conhecer
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketStats.map((s, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="text-5xl font-black text-primary-500 mb-3">{s.value}</div>
                <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── SOLUTION — BENTO GRID ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/30 to-background">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              O Que a Virtual Mark Entrega Para{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
                Imobiliárias
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto speakable-content">
              Não é agência genérica. É operação especializada no mercado imobiliário com foco em
              um único resultado: leads qualificados chegando no seu WhatsApp.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <BentoGrid items={vmBentoItems} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Como Funciona na{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
                Prática
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((s, i) => (
              <motion.div key={i} variants={itemVariants} className="relative">
                <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 h-full hover:border-primary-500/30 transition-all duration-300">
                  <span className="text-5xl font-black text-primary-500/20 block mb-2 leading-none">
                    {s.number}
                  </span>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 z-10 text-gray-700 text-xl font-bold">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CASE HIGHLIGHT — SHOWHOME ── */}
      <section className="bg-gradient-to-b from-background to-gray-900/20 overflow-hidden pt-20">

        {/* Mobile: simple card layout, no iframe */}
        <div className="md:hidden px-4 pb-20 max-w-xl mx-auto">
          <div className="text-center mb-6">
            <span className="inline-block text-xs font-bold tracking-widest text-primary-500 bg-primary-500/10 px-4 py-2 rounded-full border border-primary-500/20">
              CASE DE SUCESSO
            </span>
          </div>
          <GlowCard glowColor="red" className="bg-gray-900/70 p-7">
            <span className="inline-block text-xs font-bold bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full mb-4 tracking-wide">
              SHOWHOME
            </span>
            <h2 className="text-xl font-bold text-white mb-3">
              R$3.000 investidos. R$13.000 de comissão. ROI de 4.3x.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Campanhas Meta Ads com landing pages otimizadas e WhatsApp Business como canal de
              conversão. 330 contatos gerados, 25 visitas e 1 venda fechada.
            </p>
            <div className="inline-flex items-center gap-3 bg-primary-500/10 border border-primary-500/20 rounded-xl px-4 py-2.5 mb-5">
              <span className="text-2xl font-black text-primary-500">ROI 4.3x</span>
              <div className="text-xs text-gray-400 leading-tight">
                <span className="block text-gray-300 font-semibold">R$3.000 investidos</span>
                <span className="block">→ R$13.000 de comissão</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {caseMetrics.map((m, i) => (
                <div key={i}>
                  <div className="text-xl font-black text-primary-500 leading-none mb-1">{m.v}</div>
                  <div className="text-xs text-gray-500">{m.l}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {caseChecklist.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Desktop: ContainerScroll with iframe */}
        <div className="hidden md:block">
          <ContainerScroll
            titleComponent={
              <div className="max-w-4xl mx-auto px-4 text-left">
                <div className="text-center mb-6">
                  <span className="inline-block text-xs font-bold tracking-widest text-primary-500 bg-primary-500/10 px-4 py-2 rounded-full border border-primary-500/20">
                    CASE DE SUCESSO
                  </span>
                </div>
                <span className="inline-block text-xs font-bold bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full mb-4 tracking-wide">
                  SHOWHOME
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  R$3.000 investidos. R$13.000 de comissão. ROI de 4.3x.
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
                  A Showhome, especialista em imóveis de alto padrão, precisava gerar leads
                  qualificados de forma previsível. A VM estruturou campanhas no Meta Ads com landing
                  pages otimizadas e WhatsApp Business como canal de conversão. Resultado: 330
                  contatos gerados, 25 visitas agendadas e 1 venda fechada — gerando R$13.000 de
                  comissão com apenas R$3.000 investidos em mídia.
                </p>
                <div className="inline-flex items-center gap-3 bg-primary-500/10 border border-primary-500/20 rounded-xl px-5 py-3 mb-6">
                  <span className="text-3xl font-black text-primary-500">ROI 4.3x</span>
                  <div className="text-xs text-gray-400 leading-tight">
                    <span className="block text-gray-300 font-semibold">R$3.000 investidos</span>
                    <span className="block">→ R$13.000 de comissão gerada</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 mb-6">
                  {caseMetrics.map((m, i) => (
                    <div key={i} className="text-left">
                      <div className="text-2xl font-black text-primary-500 leading-none mb-1">{m.v}</div>
                      <div className="text-xs text-gray-500">{m.l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {caseChecklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <ShowhomeBrowserFrame />
          </ContainerScroll>
        </div>

      </section>

      {/* ── RADAR / LEAD TRACKING ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/20 to-background overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <span className="inline-block text-xs font-bold tracking-widest text-primary-500 bg-primary-500/10 px-4 py-2 rounded-full border border-primary-500/20 mb-5">
              RASTREAMENTO EM TEMPO REAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Cada Lead Rastreado,{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
                Nenhum Negócio Perdido
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto speakable-content">
              Nossa tecnologia monitora cada clique, lead gerado e conversão — em tempo real,
              por campanha e por canal, para você saber exatamente onde está seu dinheiro.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative flex h-96 w-full max-w-3xl flex-col items-center justify-center space-y-4 overflow-hidden px-4 mx-auto">
              {/* Row 1 */}
              <div className="mx-auto w-full max-w-3xl">
                <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
                  <IconContainer
                    text="Google Ads"
                    delay={0.2}
                    icon={<Search className="h-6 w-6 text-primary-500/70" />}
                  />
                  <IconContainer
                    delay={0.4}
                    text="Meta Ads"
                    icon={<Globe className="h-6 w-6 text-primary-500/70" />}
                  />
                  <IconContainer
                    text="Tráfego Pago"
                    delay={0.3}
                    icon={<MousePointer2 className="h-6 w-6 text-primary-500/70" />}
                  />
                </div>
              </div>
              {/* Row 2 */}
              <div className="mx-auto w-full max-w-md">
                <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
                  <IconContainer
                    text="Leads"
                    delay={0.5}
                    icon={<Users className="h-6 w-6 text-primary-500/70" />}
                  />
                  <IconContainer
                    text="WhatsApp"
                    delay={0.8}
                    icon={<MessageCircle className="h-6 w-6 text-primary-500/70" />}
                  />
                </div>
              </div>
              {/* Row 3 */}
              <div className="mx-auto w-full max-w-3xl">
                <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
                  <IconContainer
                    delay={0.6}
                    text="Analytics"
                    icon={<BarChart2 className="h-6 w-6 text-primary-500/70" />}
                  />
                  <IconContainer
                    delay={0.7}
                    text="ROI"
                    icon={<TrendingUp className="h-6 w-6 text-primary-500/70" />}
                  />
                </div>
              </div>

              <Radar className="absolute -bottom-12" />
              <div className="absolute bottom-0 z-[41] h-px w-full bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── QUIZ CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl border border-primary-500/20 p-10 sm:p-14"
            style={{ background: 'linear-gradient(135deg, rgba(15,8,8,0.98), rgba(20,8,8,0.95))' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgba(239,68,68,0.11), transparent 60%)' }}
            />
            <div className="relative z-10">
              <span className="text-5xl mb-5 block">🎯</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Descubra Seu Perfil e Receba Um{' '}
                <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
                  Plano Personalizado
                </span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed speakable-content">
                Identificamos 6 perfis de imobiliárias. Em 3 minutos você descobre exatamente
                quais são os gargalos que travam seu crescimento — e recebe um plano de ação
                direto no WhatsApp.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-left max-w-md mx-auto">
                {['Gratuito', 'Resultado imediato', 'Sem compromisso', '8 perguntas', 'Diagnóstico cirúrgico', 'Plano de ação'].map(
                  (item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-primary-500 font-bold">✓</span> {item}
                    </div>
                  )
                )}
              </div>
              <ShinyButton to="/quiz-imoveis">Fazer Meu Diagnóstico Gratuito →</ShinyButton>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Perguntas{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
                Frequentes
              </span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-900/70 border border-gray-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-800/30 transition-colors"
                >
                  <span className="font-semibold text-white text-sm sm:text-base">{f.q}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/30 to-background">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pronto para Parar de Perder{' '}
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
              Negócios
            </span>{' '}
            Para a Concorrência?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Responda o diagnóstico gratuito. Em 3 minutos você recebe um plano de ação
            personalizado direto no WhatsApp.
          </p>
          <ShinyButton to="/quiz-imoveis">Começar Diagnóstico Gratuito →</ShinyButton>
          <p className="text-gray-600 text-sm mt-5">Gratuito · 3 minutos · Sem compromisso</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-8 px-4 text-center">
        <p className="text-gray-500 text-sm">© 2026 VirtualMark. Todos os direitos reservados.</p>
      </footer>

    </div>
  )
}

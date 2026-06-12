import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Globe, BarChart2, TrendingUp, Zap, Mail, Search, Layers, RefreshCw, MousePointer2, ShoppingCart, Pen, Tag, Repeat } from 'lucide-react'
import { Helmet } from 'react-helmet'
import { HeroGeometric } from '@/components/ui/shape-landing-hero'
import { BentoGrid } from '@/components/ui/bento-grid'
import { GlowCard } from '@/components/ui/spotlight-card'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ShinyButton } from '@/components/ui/shiny-button'
import { Radar, IconContainer } from '@/components/ui/radar-effect'
import type { BentoItem } from '@/components/ui/bento-grid'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

// ─── SEO / GEO Structured Data ───────────────────────────────────────────────

const SITE_URL = 'https://virtualmark.com.br'
const PAGE_URL = `${SITE_URL}/ecommerce`
const OG_IMAGE = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80'

const seoSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'VirtualMark',
      description: 'Agência de marketing digital orientada a performance: tráfego pago, CRO e growth para e-commerces e negócios no Brasil.',
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: 'Marketing Digital para E-commerce | Tráfego Pago e ROAS | VirtualMark',
      description: 'Agência especializada em crescimento de e-commerce: Google Ads, Meta Ads, CRO e recuperação de carrinho. Operação completa com ROAS e CAC claros. Diagnóstico gratuito.',
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
        { '@type': 'ListItem', position: 2, name: 'Marketing para E-commerce', item: PAGE_URL },
      ],
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'VirtualMark',
      url: SITE_URL,
      email: 'contato@virtualmark.com.br',
      telephone: '+5511992794634',
      description: 'Agência de marketing digital especializada em performance: geração de vendas para e-commerces via Google Ads, Meta Ads, CRO e automação de funil.',
      foundingDate: '2019',
      areaServed: { '@type': 'Country', name: 'Brasil' },
      knowsAbout: [
        'Marketing Digital para E-commerce',
        'Google Ads',
        'Google Shopping',
        'Meta Ads',
        'Gestão de Tráfego Pago',
        'CRO e Otimização de Conversão',
        'Recuperação de Carrinho Abandonado',
        'E-mail Marketing e CRM',
        'ROAS e Atribuição',
        'E-commerce Brasileiro',
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
      sameAs: [
        'https://www.instagram.com/virtualmarkgroup/',
        'https://br.linkedin.com/company/vmredot',
        'https://share.google/NTHC3oQU1wFCMkVh5',
      ],
    },
    {
      '@type': ['LocalBusiness', 'ProfessionalService'],
      '@id': `${PAGE_URL}#business`,
      name: 'VirtualMark: Marketing Digital para E-commerce',
      description: 'Especialistas em crescimento de lojas virtuais: campanhas Google Ads e Meta Ads com catálogo, CRO, remarketing, recuperação de carrinho e dashboard de ROAS em tempo real.',
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
        name: 'Serviços de Marketing Digital para E-commerce',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Campanhas Google Ads, Shopping e Meta Ads para E-commerce',
              description: 'Campanhas com catálogo conectado, segmentação por intenção de compra e remarketing dinâmico para quem abandonou o carrinho.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'CRO: Otimização de Conversão da Loja',
              description: 'Auditoria e otimização contínua de página de produto, checkout e jornada de compra para elevar a taxa de conversão.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Recuperação de Carrinho e Fluxos de E-mail/CRM',
              description: 'Automações de carrinho abandonado, boas-vindas, recompra e winback para transformar base de clientes em receita recorrente.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Dashboard de ROAS, CAC e Atribuição em Tempo Real',
              description: 'Relatórios com retorno sobre investimento, custo de aquisição e atribuição por canal e por campanha.',
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
          name: 'Qual o investimento mínimo para começar com tráfego pago no e-commerce?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A VirtualMark recomenda começar com R$1.500 a R$3.000 por mês em mídia (R$50 a R$100 por dia) para validar o canal com estrutura profissional. O fee de gestão é separado. Antes de qualquer contrato, fazemos uma simulação com base no ticket médio e na margem dos produtos.',
          },
        },
        {
          '@type': 'Question',
          name: 'Em quanto tempo um e-commerce vê as primeiras vendas com Google Ads e Meta Ads?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Com estrutura correta (pixel, catálogo, remarketing e loja otimizada), as primeiras vendas atribuídas chegam tipicamente entre 7 e 15 dias. Em 30 dias já existem dados confiáveis de ROAS e custo por venda para decidir a escala com segurança.',
          },
        },
        {
          '@type': 'Question',
          name: 'Vale mais a pena vender em marketplace ou ter loja própria?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Não são excludentes. Marketplaces dão volume, mas levam até 20% ou mais em comissões e tarifas, e o cliente fica com a plataforma. Com canal próprio, a margem é cheia e o cliente é da loja, permitindo remarketing e recompra. A estratégia comum é manter o marketplace como vitrine enquanto o canal próprio é construído.',
          },
        },
        {
          '@type': 'Question',
          name: 'Minha loja tem visitas mas não vende. Tráfego resolve?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Nem sempre. Se a taxa de conversão da loja está baixa, mais tráfego só amplifica o desperdício. Por isso a VirtualMark trabalha CRO (otimização de página de produto, checkout e jornada) junto com a mídia, e fluxos de recuperação para os cerca de 70% de carrinhos abandonados.',
          },
        },
        {
          '@type': 'Question',
          name: 'Funciona para qualquer nicho de e-commerce?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A metodologia funciona para a grande maioria dos nichos de varejo online: moda, beleza, casa, pet, suplementos, eletrônicos e outros. O que muda é a estratégia de canal e criativo, definida no diagnóstico a partir do ticket médio, margem e comportamento de busca do público.',
          },
        },
        {
          '@type': 'Question',
          name: 'Há fidelidade ou multa para cancelar a gestão?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Não. A VirtualMark trabalha com contratos mensais renováveis, sem fidelidade mínima. Se em 60 dias não houver evolução mensurável nos indicadores combinados, a estratégia é revisada sem custo adicional.',
          },
        },
      ],
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
    tag: 'Vende no 1 a 1',
    title: '"Minhas clientes compram comigo, pelo direct. Sempre funcionou."',
    reality:
      'Funciona até o limite do seu tempo. Cada venda passa pelas suas mãos, e você só alcança quem já te segue. Se você para, a loja para.',
  },
  {
    tag: 'Dependente de Marketplace',
    title: '"Já vendo no Mercado Livre, pra que loja própria?"',
    reality:
      'Você paga até 20%+ de comissão por cliente que não é seu: sem dados, sem remarketing, sem recompra. E disputa preço no mesmo anúncio que o concorrente.',
  },
  {
    tag: 'Tentou e Parou',
    title: '"Já tentei anúncios pra minha loja e não se pagou."',
    reality:
      'Você não falhou, a estrutura faltou. Anúncio sem pixel, catálogo, remarketing e loja que converte não tem como se pagar, para ninguém.',
  },
]

const services = [
  { name: 'Tráfego Pago', Icon: MousePointer2 },
  { name: 'Google Shopping', Icon: ShoppingCart },
  { name: 'Google Ads', Icon: Search },
  { name: 'Meta Ads', Icon: Globe },
  { name: 'CRO', Icon: Target },
  { name: 'Remarketing', Icon: RefreshCw },
  { name: 'E-mail & CRM', Icon: Mail },
  { name: 'Automações', Icon: Zap },
  { name: 'Catálogo', Icon: Tag },
  { name: 'Landing Pages', Icon: Layers },
  { name: 'Analytics', Icon: BarChart2 },
  { name: 'Criativos', Icon: Pen },
]

const marketStats = [
  {
    value: '87%',
    description: 'dos consumidores pesquisam online antes de comprar, se sua loja não aparece, a venda vai para o concorrente',
  },
  {
    value: '70%',
    description: 'dos carrinhos são abandonados, sem remarketing e fluxos de recuperação esse dinheiro evapora',
  },
  {
    value: '20%+',
    description: 'é o que marketplaces levam de comissão e tarifas por venda, de clientes que nem ficam com você',
  },
]

const vmBentoItems: BentoItem[] = [
  {
    title: 'Tráfego que Vende',
    description:
      'Google Ads, Shopping e Meta Ads com catálogo conectado e segmentação por intenção de compra. Anúncio na frente de quem JÁ procura o seu produto.',
    icon: <Target className="w-5 h-5 text-primary-500" />,
    status: 'Google & Meta',
    tags: ['vendas', 'segmentação'],
    cta: 'Saber mais →',
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: 'Loja que Converte',
    description:
      'CRO contínuo: página de produto, checkout e jornada otimizados para transformar visita em venda, antes de escalar a mídia.',
    icon: <ShoppingCart className="w-5 h-5 text-primary-500" />,
    status: 'CRO',
    tags: ['conversão'],
    cta: 'Ver como →',
  },
  {
    title: 'Recompra & LTV',
    description:
      'Fluxos de e-mail e CRM: carrinho abandonado, boas-vindas, recompra e winback. Sua base de clientes virando receita recorrente.',
    icon: <Repeat className="w-5 h-5 text-primary-500" />,
    status: 'Retenção',
    tags: ['ltv', 'e-mail'],
    cta: 'Ver fluxos →',
  },
  {
    title: 'Dashboard de ROAS em Tempo Real',
    description:
      'ROAS, CAC, taxa de conversão e receita por canal e por campanha. Otimização diária com base em dados, sem set-and-forget.',
    icon: <TrendingUp className="w-5 h-5 text-primary-500" />,
    status: 'Diário',
    tags: ['roas', 'atribuição', 'escala'],
    cta: 'Começar →',
    colSpan: 2,
  },
]

const processSteps = [
  {
    number: '01',
    title: 'Diagnóstico',
    desc: 'Entendemos seu produto, ticket médio, margem e concorrência. Estratégia definida antes de investir R$1.',
  },
  {
    number: '02',
    title: 'Estrutura',
    desc: 'Pixel, catálogo, fluxos de e-mail e loja revisada para conversão, montados ANTES de ligar a campanha.',
  },
  {
    number: '03',
    title: 'Campanhas',
    desc: 'Lançamos no Google, Shopping e Meta com segmentação por intenção de compra e remarketing dinâmico.',
  },
  {
    number: '04',
    title: 'Escala com Dados',
    desc: 'Com ROAS e CAC reais por campanha, escalamos o que dá margem e cortamos o que drena orçamento.',
  },
]

const faqs = [
  {
    q: 'Qual o investimento mínimo para começar?',
    a: 'Recomendamos começar com R$1.500 a R$3.000/mês em mídia (R$50 a R$100 por dia) para validar o canal com estrutura profissional. Nosso fee de gestão é separado. Fazemos uma simulação baseada no seu ticket médio e margem antes de qualquer contrato.',
  },
  {
    q: 'Em quanto tempo vejo as primeiras vendas?',
    a: 'Com estrutura correta (pixel, catálogo, remarketing e loja otimizada), as primeiras vendas atribuídas chegam tipicamente em 7 a 15 dias. Em 30 dias você tem dados reais de ROAS e custo por venda para decidir com informação, não no escuro.',
  },
  {
    q: 'Vale mais a pena marketplace ou loja própria?',
    a: 'Não é ou/ou, é estratégia. Marketplace dá volume, mas leva até 20%+ por venda e o cliente fica com a plataforma. No canal próprio a margem é cheia e o cliente é seu, com remarketing e recompra. O caminho comum: manter o marketplace como vitrine enquanto construímos seu canal próprio.',
  },
  {
    q: 'Minha loja tem visitas mas não vende. Tráfego resolve?',
    a: 'Nem sempre, e é por isso que não vendemos só mídia. Se a conversão da loja está baixa, mais tráfego amplifica o desperdício. Trabalhamos CRO (produto, checkout, jornada) junto com as campanhas, e fluxos de recuperação para os ~70% de carrinhos abandonados.',
  },
  {
    q: 'Funciona para o meu nicho?',
    a: 'A metodologia funciona para a grande maioria dos nichos de varejo online: moda, beleza, casa, pet, suplementos, eletrônicos e outros. O que muda é a estratégia de canal e criativo, definida no diagnóstico a partir do seu ticket, margem e público.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Trabalhamos com contratos mensais renováveis. Não amarramos ninguém, acreditamos que os resultados criam a fidelidade. Se em 60 dias não houver evolução clara nos indicadores combinados, revisamos a estratégia juntos sem custo.',
  },
]

// ─── Page Component ───────────────────────────────────────────────────────────

export default function EcommercePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">

      {/* ── SEO / GEO HEAD ── */}
      <Helmet>
        {/* Primary */}
        <html lang="pt-BR" />
        <title>Marketing Digital para E-commerce | Tráfego Pago e ROAS | VirtualMark</title>
        <meta name="title" content="Marketing Digital para E-commerce | Tráfego Pago e ROAS | VirtualMark" />
        <meta name="description" content="Agência especializada em crescimento de e-commerce: Google Ads, Shopping e Meta Ads com CRO, recuperação de carrinho e dashboard de ROAS. Diagnóstico gratuito em 3 minutos." />
        <meta name="keywords" content="marketing digital para e-commerce, tráfego pago loja virtual, google ads e-commerce, google shopping, meta ads loja online, agência de e-commerce, aumentar vendas loja virtual, roas, cro e-commerce, carrinho abandonado, sair do marketplace, gestão de tráfego e-commerce" />
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
        <meta property="og:title" content="Marketing Digital para E-commerce | VirtualMark" />
        <meta property="og:description" content="Crescimento de e-commerce com tráfego pago, CRO e recuperação de carrinho. Operação completa com ROAS e CAC claros. Diagnóstico gratuito em 3 minutos." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="E-commerce em crescimento | VirtualMark Marketing Digital para E-commerce" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="VirtualMark" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Marketing Digital para E-commerce | VirtualMark" />
        <meta name="twitter:description" content="Tráfego pago, CRO e recuperação de carrinho para lojas virtuais. Diagnóstico gratuito." />
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
        badge="Growth para E-commerce"
        title1="Sua Loja Está"
        title2="Vendendo Menos do que Deveria"
        subtitle="87% dos consumidores pesquisam online antes de comprar. Se sua loja não aparece, ou aparece e não converte, a venda vai para o concorrente. Todos os dias."
      >
        <div className="flex justify-center">
          <ShinyButton to="/quiz-ecommerce">Fazer Diagnóstico Gratuito →</ShinyButton>
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
              Cada perfil de loja tem um gargalo diferente. Saber qual é o seu é o primeiro passo
              para mudar o jogo.
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

      {/* ── MARKET STATS, e-commerce background image ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=80"
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
              A REALIDADE DO E-COMMERCE BRASILEIRO
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

      {/* ── SOLUTION, BENTO GRID ── */}
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
                E-commerces
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto speakable-content">
              Não é agência genérica que só roda mídia. É operação de growth completa: tráfego,
              conversão e recompra trabalhando juntos com um único objetivo, vendas com margem.
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

      {/* ── RADAR / FUNIL RASTREADO ── */}
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
              Cada Venda Atribuída,{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
                Nenhum Real Desperdiçado
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto speakable-content">
              Nossa tecnologia monitora cada clique, carrinho e venda, em tempo real, por campanha
              e por canal, para você saber exatamente de onde vem cada real de receita.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative flex h-96 w-full max-w-3xl flex-col items-center justify-center space-y-4 overflow-hidden px-4 mx-auto">
              {/* Row 1, upper strip, full width */}
              <div className="mx-auto w-full max-w-3xl">
                <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
                  <IconContainer
                    text="Google Shopping"
                    hitTime={8.36}
                    icon={<Search className="h-6 w-6 text-red-500" />}
                  />
                  <IconContainer
                    text="Meta Ads"
                    hitTime={6.94}
                    icon={<Globe className="h-6 w-6 text-red-500" />}
                  />
                  <IconContainer
                    text="Tráfego Pago"
                    hitTime={5.53}
                    icon={<MousePointer2 className="h-6 w-6 text-red-500" />}
                  />
                </div>
              </div>
              {/* Row 2, mid strip, narrower */}
              <div className="mx-auto w-full max-w-md">
                <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
                  <IconContainer
                    text="Carrinho"
                    hitTime={8.19}
                    icon={<ShoppingCart className="h-6 w-6 text-red-500" />}
                  />
                  <IconContainer
                    text="E-mail & CRM"
                    hitTime={5.69}
                    icon={<Mail className="h-6 w-6 text-red-500" />}
                  />
                </div>
              </div>
              {/* Row 3, lower strip, full width */}
              <div className="mx-auto w-full max-w-3xl">
                <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
                  <IconContainer
                    text="Analytics"
                    hitTime={8.94}
                    icon={<BarChart2 className="h-6 w-6 text-red-500" />}
                  />
                  <IconContainer
                    text="ROAS"
                    hitTime={4.94}
                    icon={<TrendingUp className="h-6 w-6 text-red-500" />}
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
                Identificamos 6 perfis de loja online. Em 3 minutos você descobre exatamente
                quais são os gargalos que travam suas vendas, e recebe um plano de ação
                direto no WhatsApp.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-left max-w-md mx-auto">
                {['Gratuito', 'Resultado imediato', 'Sem compromisso', '3 minutos', 'Diagnóstico cirúrgico', 'Plano de ação'].map(
                  (item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-primary-500 font-bold">✓</span> {item}
                    </div>
                  )
                )}
              </div>
              <ShinyButton to="/quiz-ecommerce">Fazer Meu Diagnóstico Gratuito →</ShinyButton>
            </div>
          </motion.div>
        </motion.div>
      </section>

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
              Vendas
            </span>{' '}
            Para a Concorrência?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Responda o diagnóstico gratuito. Em 3 minutos você recebe um plano de ação
            personalizado direto no WhatsApp.
          </p>
          <ShinyButton to="/quiz-ecommerce">Começar Diagnóstico Gratuito →</ShinyButton>
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

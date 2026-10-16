/** Fonte única dos cases e dos planos da LP /portfolio (espelha o deck de apresentação). */

export type Client = {
  slug: string
  name: string
  what: string
  domain?: string
  /** arquivo em /home/cases/<img>.webp */
  img?: string
  /** proporção do print, para a moldura não cortar as laterais */
  ratio?: string
  href?: string
}

export const works: { group: string; items: Client[] }[] = [
  {
    group: 'Sites e marcas',
    items: [
      { slug: 'wb', name: 'WB Soluções Elétricas', what: 'Marca · Site · Rastreio · Ads', domain: 'wbsolucoeseletricas.com.br', img: 'wb', href: '#caso-wb' },
      { slug: 'quiropraxia', name: 'Quiropraxia Fernandes', what: 'Site · Tráfego · Rastreio', domain: 'quiropraxiafernandes.com.br', img: 'quiropraxia', ratio: '1280 / 729', href: '#cases' },
      { slug: 'showhome', name: 'Showhome', what: 'Marca · Site com painel · Ads', img: 'showhome', ratio: '1280 / 561', href: '#cases' },
      { slug: 'caig', name: 'CAIG', what: 'Site · Google Meu Negócio · Pesquisa', domain: 'caig.com.br', img: 'caig', href: '#cases' },
      { slug: 'miyagui', name: 'Ópticas Miyagui', what: 'Site · Rastreio · Vídeo com IA', domain: 'miyaguioptica.com.br', img: 'miyagui', href: '#criativos' },
      { slug: 'mare', name: 'Maré e Sabor', what: 'Site · em desenvolvimento' },
    ],
  },
  {
    group: 'E-commerces',
    items: [
      { slug: 'gamessafari', name: 'Games Safari', what: 'Gestão de tráfego', domain: 'gamessafari.com.br', img: 'gamessafari' },
      { slug: 'gamebox', name: 'Gamebox', what: 'Gestão de tráfego', domain: 'gameboxbrasil.com', img: 'gamebox' },
      { slug: 'gsl', name: 'GSL Games', what: 'Gestão de tráfego', domain: 'gamesgl.com', img: 'gsl' },
      { slug: 'dash', name: 'Dash Controles', what: 'Gestão de tráfego', domain: 'dashcontroles.com.br', img: 'dash' },
      { slug: 'fruit', name: 'Fruit de la Passion', what: 'Gestão de tráfego', domain: 'fruitdelapassion.com.br', img: 'fruit' },
      { slug: 'megatumii', name: 'Megatumii', what: 'Gestão de tráfego', domain: 'megatumii.com.br', img: 'megatumii' },
    ],
  },
]

export type FlagshipCase = {
  slug: string
  name: string
  title: string
  bullets: { lead: string; rest: string }[]
  img: string
  domain?: string
  ratio?: string
}

export const flagship: FlagshipCase[] = [
  {
    slug: 'quiropraxia',
    name: 'Quiropraxia Fernandes',
    title: 'Já anunciava. Faltava alguém fixo.',
    bullets: [
      { lead: 'Site novo,', rest: 'mais atual e moderno.' },
      { lead: 'Tráfego contínuo', rest: 'no Google Ads, levando ao WhatsApp.' },
      { lead: 'Leads mapeados:', rest: 'o rastreio com gclid liga cada contato do WhatsApp ao anúncio que o trouxe.' },
    ],
    img: 'quiropraxia',
    ratio: '1280 / 729',
    domain: 'quiropraxiafernandes.com.br',
  },
  {
    slug: 'showhome',
    name: 'Showhome',
    title: 'Um corretor, uma presença digital completa.',
    bullets: [
      { lead: 'Marca e site', rest: 'criados do zero, com painel para cadastrar e gerir os imóveis.' },
      { lead: 'Google Meu Negócio e Instagram,', rest: 'a rede mais visual do mercado imobiliário.' },
      { lead: 'Campanhas', rest: 'no Google e na Meta, medindo o clique de saída no botão do WhatsApp.' },
    ],
    img: 'showhome',
    ratio: '1280 / 561',
  },
  {
    slug: 'caig',
    name: 'CAIG',
    title: 'Atenção ao público certo.',
    bullets: [
      { lead: 'Site', rest: 'no briefing e na estética do cliente.' },
      { lead: 'Domínio e Google Meu Negócio', rest: 'configurados.' },
      { lead: 'Rastreio com gclid', rest: 'em todo o site.' },
      { lead: 'Campanha de pesquisa', rest: 'para SST, levando ao WhatsApp.' },
    ],
    img: 'caig',
    domain: 'caig.com.br',
  },
  {
    slug: 'miyagui',
    name: 'Ópticas Miyagui',
    title: 'Cliente recuperado: site novo e vídeo com IA.',
    bullets: [
      { lead: 'Parceria retomada', rest: 'com site novo, rastreio com gclid e banco de dados.' },
      { lead: 'Vídeo de apresentação', rest: 'da loja feito com IA.' },
    ],
    img: 'miyagui',
    domain: 'miyaguioptica.com.br',
  },
]

export type Tier = { name: string; forWho?: string; items: string[] }
export type PlanGroup = { id: string; label: string; intro: string; tierWord: string; tiers: Tier[] }

export const plans: PlanGroup[] = [
  {
    id: 'trafego',
    label: 'Tráfego',
    intro: 'Gestão de campanhas no Google e na Meta, com rastreio e acompanhamento.',
    tierWord: 'plano',
    tiers: [
      {
        name: 'Iniciante',
        forWho: 'Para quem quer começar a vender com tráfego da forma certa',
        items: [
          '1 plataforma: Google Ads ou Meta Ads',
          'Rastreamento completo: tags, GA4 e conversões',
          'Planejamento de campanha',
          'Suporte via WhatsApp',
          '2 reuniões mensais',
          'Relatório mensal',
          'Direcionamento de criativos baseado em dados',
        ],
      },
      {
        name: 'Profissional',
        forWho: 'Para quem já vende e quer escalar com lucro',
        items: [
          'Tudo do Iniciante, em Google e Meta Ads',
          'Otimização por valor de venda, e não só por lead (conversão offline com receita)',
          'Públicos a partir da base de clientes (lookalike e Customer Match)',
          'Análise de funil e recomendações de conversão do site ou landing page',
        ],
      },
      {
        name: 'Avançado',
        forWho: 'Para quem quer tratar marketing e vendas como um único sistema',
        items: [
          'Tudo do Profissional',
          'Dashboard de negócio com CAC, LTV e ROAS real (não só métricas de plataforma)',
          'Estratégia de expansão: novos canais e públicos',
          'Diagnóstico do atendimento comercial + treinamento do time de WhatsApp',
          'Reuniões semanais com o estrategista responsável',
        ],
      },
    ],
  },
  {
    id: 'conteudo',
    label: 'Conteúdo',
    intro: 'Marketing de conteúdo para as redes e para o blog, com calendário e relatório.',
    tierWord: 'plano',
    tiers: [
      {
        name: 'Iniciante',
        items: [
          'Pesquisa de persona e análise de concorrência',
          'Linha editorial por pilares de conteúdo + calendário mensal',
          'Design alinhado à identidade visual e copy das legendas',
          'Publicação e gestão do perfil',
          'Relatório mensal com análise do que performou',
          '8 posts · 8 stories · 4 reels/mês',
        ],
      },
      {
        name: 'Profissional',
        items: [
          'Análise de Persona por Data Science',
          'Benchmark de concorrência',
          'Calendário Editorial',
          '16 posts/mês',
          '16 stories/mês',
          '8 vídeos virais/mês',
          '4 blogs/mensais',
          'Gestão de mídias sociais',
          'Análise de KPIs orgânicos',
          'Relatório mensal',
        ],
      },
      {
        name: 'Avançado',
        items: [
          'Análise de Persona por Data Science',
          'Benchmark de concorrência',
          'Calendário Editorial',
          '30 posts/mês',
          '30 stories/mês',
          '16 vídeos virais/mês',
          '8 blogs/mensais',
          'Gestão de mídias sociais',
          'Análise de KPIs orgânicos',
          'Relatório mensal',
        ],
      },
    ],
  },
  {
    id: 'sites',
    label: 'Sites',
    intro: 'Três tipos de site, cada um pensado para um objetivo.',
    tierWord: 'site',
    tiers: [
      {
        name: 'Landing Page',
        items: [
          'Análise de persona orientada à conversão',
          'Benchmark de concorrentes diretos',
          'Arquitetura de página focada em conversão',
          'Design estratégico (UX/UI)',
          'Página 100% responsiva',
          'Otimização de velocidade (PageSpeed)',
          'Testes básicos de conversão',
        ],
      },
      {
        name: 'Institucional',
        items: [
          'Análise de persona e posicionamento da marca',
          'Design alinhado à identidade visual',
          'Site responsivo (desktop, tablet e mobile)',
          'Páginas: Home, Sobre, Serviços, Contato e extras',
          'SEO on-page básico',
          'Otimização de performance e carregamento',
        ],
      },
      {
        name: 'E-commerce',
        items: [
          'Cadastro e organização de produtos',
          'Integração com meios de pagamento',
          'Integração com frete e logística',
          'Site responsivo (desktop, tablet e mobile)',
          'SEO básico para produtos e categorias',
          'Otimização de velocidade',
          'Suporte técnico',
        ],
      },
    ],
  },
]

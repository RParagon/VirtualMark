import type { MarkEstado } from './mark'

/** Cases anônimos: o cliente aparece só pelo segmento. Todo número vem do painel da plataforma de anúncio. */

export type Filtro = 'Tráfego pago' | 'Site' | 'Branding' | 'Audiovisual' | 'Google Meu Negócio' | 'Rastreamento'
export const FILTROS: Filtro[] = ['Tráfego pago', 'Site', 'Branding', 'Audiovisual', 'Google Meu Negócio', 'Rastreamento']

export type Portao = { t: 'Atrair' | 'Converter' | 'Medir' | 'Reter'; itens: string[]; feito: boolean }

export type Caso = {
  slug: string
  segmento: string
  tipo: 'Resultado' | 'Projeto completo'
  filtros: Filtro[]
  tags: string[]
  /** Número grande do cartão (resultado). */
  grande?: { valor: number; casas: number; sufixo?: string; destaque: boolean }
  /** Frase do cartão. No case de resultado vem logo abaixo do número grande. */
  resumo: string
  dupla: [[string, string], [string, string]]
  foto?: string
  reacao: MarkEstado
  // página do case
  titulo: string
  /** Trecho do título pintado de vermelho. */
  realce: string
  abertura: string
  numeros: [string, string][]
  /** Índice do número que ganha destaque na faixa. */
  numeroDestaque?: number
  fonte: string
  /** Desenho pequeno do cartão quando não há gráfico mês a mês. */
  mini?: { tipo: 'comparar'; itens: [string, number, string][] } | { tipo: 'meses'; n: number; rotulo: string }
  grafico?: { titulo: string; legenda: string; meses: [string, number][]; formato: (v: number) => string }
  pistaTitulo: string
  pistaTexto: string
  portoes: Portao[]
  gclid?: boolean
  fecho: string
  fechoRealce: string
}

const x = (v: number) => `${v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}x`
const mil = (v: number) => v.toLocaleString('pt-BR')

export const CASOS: Caso[] = [
  {
    slug: 'loja-de-lingerie',
    segmento: 'Loja online de lingerie',
    tipo: 'Resultado',
    filtros: ['Tráfego pago'],
    tags: ['Google Ads', 'Meta Ads'],
    grande: { valor: 23.5, casas: 1, sufixo: 'x', destaque: true },
    resumo: 'de retorno, cinco meses seguidos, sem um mês abaixo de 21x.',
    dupla: [['R$ 20,5 mil', 'investidos'], ['R$ 482 mil', 'em vendas']],
    reacao: 'pronto',
    titulo: '23,5x de retorno em anúncio, cinco meses seguidos.',
    realce: '23,5x de retorno',
    abertura: 'Uma loja online de lingerie anunciando no Google e no Meta. A meta era vender mais sem deixar o retorno cair, e ele ficou acima de 21x em todos os meses.',
    numeros: [['R$ 20,5 mil', 'investidos em anúncio'], ['R$ 482 mil', 'em vendas'], ['23,5x', 'de retorno no período'], ['5 meses', 'acima de 21x']],
    numeroDestaque: 2,
    fonte: 'Fonte: Google Ads e Meta Ads da conta, maio a setembro. Retorno é a receita registrada pela plataforma dividida pelo investimento em mídia.',
    grafico: { titulo: 'Retorno por mês', legenda: 'receita ÷ investimento', meses: [['mai', 23.9], ['jun', 21.0], ['jul', 24.3], ['ago', 25.1], ['set', 23.7]], formato: x },
    pistaTitulo: 'Verba onde a venda acontece.',
    pistaTexto: 'Cada real foi para a campanha e o público que traziam venda. O que não vendia saía da conta no mês seguinte.',
    portoes: [
      { t: 'Atrair', itens: ['Campanhas no Google Ads', 'Campanhas no Meta Ads'], feito: true },
      { t: 'Converter', itens: ['Anúncio levando direto ao produto', 'Criativos revistos pelo resultado'], feito: true },
      { t: 'Medir', itens: ['Venda registrada nas duas plataformas', 'Retorno lido mês a mês'], feito: true },
      { t: 'Reter', itens: ['Próxima etapa: recompra de quem já comprou'], feito: false },
    ],
    fecho: 'Cinco meses, nenhum abaixo de 21x. O retorno alto ficou estável, não foi sorte de um mês.',
    fechoRealce: 'nenhum abaixo de 21x',
  },
  {
    slug: 'loja-de-games',
    segmento: 'Loja de games online',
    tipo: 'Resultado',
    filtros: ['Tráfego pago'],
    tags: ['Google Ads', 'Escala'],
    grande: { valor: 3.8, casas: 1, sufixo: 'x', destaque: false },
    resumo: 'mais vendas em 12 meses, com o custo por venda entre R$ 14 e R$ 17.',
    dupla: [['34.369', 'vendas'], ['R$ 1,22 mi', 'em receita']],
    reacao: 'surpreso',
    titulo: '3,8x mais vendas por mês, com o mesmo custo por venda.',
    realce: '3,8x mais vendas',
    abertura: 'Uma loja de games online queria escalar sem pagar mais caro por cada venda. Em 12 meses as vendas mensais quase quadruplicaram e o custo por venda ficou entre R$ 14 e R$ 17.',
    numeros: [['34.369', 'vendas em 12 meses'], ['R$ 1,22 mi', 'em receita'], ['R$ 516 mil', 'investidos'], ['R$ 14 a 17', 'por venda']],
    numeroDestaque: 0,
    fonte: 'Fonte: Google Ads da conta, 12 meses de outubro a setembro.',
    grafico: { titulo: 'Vendas por mês', legenda: 'pedidos registrados no Google Ads', meses: [['out', 1178], ['fev', 1865], ['mai', 3678], ['jul', 4469], ['set', 4494]], formato: mil },
    pistaTitulo: 'Escala sem perder a margem.',
    pistaTexto: 'Subir verba é fácil. Difícil é subir sem o custo por venda acompanhar. A conta cresceu em degraus, sempre olhando quanto custava cada pedido.',
    portoes: [
      { t: 'Atrair', itens: ['Campanhas no Google Ads', 'Verba subindo em degraus'], feito: true },
      { t: 'Converter', itens: ['Anúncio levando direto ao produto'], feito: true },
      { t: 'Medir', itens: ['Pedido registrado como conversão', 'Custo por venda lido toda semana'], feito: true },
      { t: 'Reter', itens: ['Próxima etapa: recompra e datas sazonais'], feito: false },
    ],
    fecho: 'De 1.178 para 4.494 vendas por mês, e o custo de cada venda continuou no mesmo lugar.',
    fechoRealce: 'continuou no mesmo lugar',
  },
  {
    slug: 'segunda-loja-de-games',
    segmento: 'Segunda loja de games',
    tipo: 'Resultado',
    filtros: ['Tráfego pago'],
    tags: ['Google Ads', 'Sazonal'],
    grande: { valor: 14, casas: 0, sufixo: 'x', destaque: true },
    resumo: 'de retorno na Black Friday. No ano, R$ 823 mil em vendas com R$ 198 mil em anúncio.',
    dupla: [['4,2x', 'retorno no ano'], ['R$ 11,31', 'por venda']],
    mini: { tipo: 'comparar', itens: [['Black Friday', 14, '14x'], ['Ano inteiro', 4.2, '4,2x']] },
    reacao: 'comemorando',
    titulo: '14x de retorno na Black Friday e 4,2x no ano inteiro.',
    realce: '14x de retorno',
    abertura: 'Outra loja de games, com a data mais disputada do varejo no meio do caminho. A conta chegou preparada na Black Friday e fechou o ano com R$ 823 mil em vendas.',
    numeros: [['14x', 'retorno na Black Friday'], ['4,2x', 'retorno no ano'], ['R$ 823 mil', 'em vendas'], ['R$ 198 mil', 'em anúncio'], ['R$ 11,31', 'por venda']],
    numeroDestaque: 0,
    fonte: 'Fonte: Google Ads da conta, 12 meses. Retorno é a receita registrada pela plataforma dividida pelo investimento em mídia.',
    pistaTitulo: 'A data grande pede preparo antes.',
    pistaTexto: 'Na Black Friday o clique fica mais caro para todo mundo. Quem chega com a conta aprendida e a verba planejada compra a atenção mais barato.',
    portoes: [
      { t: 'Atrair', itens: ['Campanhas no Google Ads', 'Verba planejada para a data'], feito: true },
      { t: 'Converter', itens: ['Oferta da data no anúncio'], feito: true },
      { t: 'Medir', itens: ['Venda registrada como conversão', 'Retorno lido no dia a dia da data'], feito: true },
      { t: 'Reter', itens: ['Próxima etapa: trazer de volta quem comprou na data'], feito: false },
    ],
    fecho: 'Na semana mais cara do ano, cada real em anúncio voltou 14 em vendas.',
    fechoRealce: 'voltou 14 em vendas',
  },
  {
    slug: 'clinica-em-sao-paulo',
    segmento: 'Clínica em São Paulo',
    tipo: 'Resultado',
    filtros: ['Tráfego pago'],
    tags: ['Google Ads', 'Negócio local'],
    grande: { valor: 1714, casas: 0, destaque: false },
    resumo: 'contatos de pacientes em 13 meses seguidos, quase todos pelo WhatsApp.',
    dupla: [['R$ 13,75', 'por contato'], ['13 meses', 'sem parar']],
    mini: { tipo: 'meses', n: 13, rotulo: '13 meses seguidos com contatos chegando' },
    reacao: 'atendendo',
    titulo: '1.714 contatos de pacientes em 13 meses seguidos.',
    realce: '1.714 contatos',
    abertura: 'Uma clínica em São Paulo precisava de agenda cheia o ano todo, não só em mês bom. Treze meses de anúncio trouxeram 1.714 contatos, quase todos chegando pelo WhatsApp.',
    numeros: [['1.714', 'contatos de pacientes'], ['R$ 13,75', 'por contato'], ['13 meses', 'seguidos']],
    numeroDestaque: 0,
    fonte: 'Fonte: Google Ads da conta, 13 meses seguidos.',
    pistaTitulo: 'Negócio local vende pelo WhatsApp.',
    pistaTexto: 'Paciente não preenche formulário longo. Ele clica, manda mensagem e quer resposta. A campanha foi feita para esse caminho.',
    portoes: [
      { t: 'Atrair', itens: ['Campanhas no Google Ads', 'Anúncio para quem busca perto'], feito: true },
      { t: 'Converter', itens: ['WhatsApp como destino do anúncio'], feito: true },
      { t: 'Medir', itens: ['Cada contato contado como conversão', 'Custo por contato lido todo mês'], feito: true },
      { t: 'Reter', itens: ['Próxima etapa: retorno de quem já foi paciente'], feito: false },
    ],
    fecho: 'Treze meses seguidos de agenda chegando pelo WhatsApp, por menos de R$ 14 cada contato.',
    fechoRealce: 'menos de R$ 14 cada contato',
  },
  {
    slug: 'energia-solar',
    segmento: 'Energia solar',
    tipo: 'Projeto completo',
    filtros: ['Tráfego pago', 'Site', 'Branding', 'Google Meu Negócio', 'Rastreamento'],
    tags: ['Branding', 'Site', 'Google Meu Negócio', 'Rastreamento', 'Google Ads'],
    resumo: 'Do zero ao primeiro lead qualificado em dez dias de anúncio.',
    dupla: [['R$ 76', 'por lead'], ['3 leads', '1 qualificado']],
    foto: '/home/cases/energia-solar-obra.webp',
    reacao: 'analisando',
    titulo: 'Do zero ao primeiro lead qualificado em dez dias de anúncio.',
    realce: 'primeiro lead qualificado',
    abertura: 'Uma empresa de energia solar e automação começou sem presença digital. Fizemos a marca, o site, o Google e o rastreio de cada lead, e só então ligamos o tráfego pago.',
    numeros: [['R$ 228', 'investidos em anúncio'], ['64', 'cliques'], ['3', 'leads em contato'], ['1', 'lead qualificado'], ['R$ 76', 'por lead']],
    numeroDestaque: 3,
    fonte: 'Fonte: Google Ads da conta, 5 a 14 de outubro de 2026, e controle de leads da Virtual Mark. Os números sobem para 90 dias quando o período fechar.',
    pistaTitulo: 'Site, marca e anúncio como uma coisa só.',
    pistaTexto: 'Anúncio sem site bom queima verba. Site sem rastreio não diz de onde veio o cliente. Por isso a empresa passou pelas quatro frentes antes do primeiro real em mídia.',
    portoes: [
      { t: 'Atrair', itens: ['Campanha no Google Ads', 'Google Meu Negócio', 'Posts e vídeos para Instagram e anúncios'], feito: true },
      { t: 'Converter', itens: ['Marca e identidade visual', 'Site novo com obras reais', 'WhatsApp em todas as páginas'], feito: true },
      { t: 'Medir', itens: ['GCLID guardado por 90 dias', 'Código em cada conversa', 'Lead qualificado marcado no painel'], feito: true },
      { t: 'Reter', itens: ['Próxima etapa: pós-venda e indicação'], feito: false },
    ],
    gclid: true,
    fecho: 'Criamos a empresa no digital do zero. Na primeira semana de anúncio, o primeiro lead qualificado já tinha chegado.',
    fechoRealce: 'o primeiro lead qualificado já tinha chegado',
  },
  {
    slug: 'otica',
    segmento: 'Ótica',
    tipo: 'Projeto completo',
    filtros: ['Site', 'Branding', 'Audiovisual', 'Rastreamento'],
    tags: ['Site', 'Design', 'Audiovisual', 'Rastreamento'],
    resumo: 'Marca mais elegante, site novo e vídeos de produto, prontos para anunciar.',
    dupla: [['Site', 'redesenhado'], ['GCLID', 'já medindo']],
    reacao: 'piscando',
    titulo: 'Marca mais elegante, site novo e vídeos de produto.',
    realce: 'site novo',
    abertura: 'Uma ótica queria que o digital tivesse o mesmo cuidado da loja. Redesenhamos a marca e o site, gravamos vídeos de produto e deixamos o rastreio pronto antes do primeiro anúncio.',
    numeros: [['Marca', 'redesenhada'], ['Site', 'novo, feito para anúncio'], ['Vídeos', 'de produto'], ['GCLID', 'já medindo']],
    fonte: 'Projeto em andamento. Os números de anúncio entram aqui quando o primeiro período fechar.',
    pistaTitulo: 'Primeiro a vitrine, depois o anúncio.',
    pistaTexto: 'Não adianta pagar clique para levar gente a um site que não passa a qualidade da loja. A ordem foi marca, site e vídeo, com a medição pronta desde o começo.',
    portoes: [
      { t: 'Atrair', itens: ['Vídeos de produto para anúncios e redes'], feito: true },
      { t: 'Converter', itens: ['Marca mais elegante', 'Site redesenhado', 'WhatsApp à mão em todas as páginas'], feito: true },
      { t: 'Medir', itens: ['GCLID guardado em cada visita', 'Origem de cada conversa no painel'], feito: true },
      { t: 'Reter', itens: ['Próxima etapa: campanhas e recompra'], feito: false },
    ],
    gclid: true,
    fecho: 'A vitrine digital ficou à altura da loja. Agora cada anúncio leva para um lugar que vende.',
    fechoRealce: 'um lugar que vende',
  },
]

export const casoPorSlug = (slug?: string) => CASOS.find((c) => c.slug === slug)

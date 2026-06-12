import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { trackQuiz, getAttribution } from '../lib/quizTracking'

const WPP_NUMBER = '5511992794634'

// ── Sistema de design (premium / sério, idêntico ao quiz imobiliário) ──
const FONT_DISPLAY = "'Fraunces', Georgia, 'Times New Roman', serif"
const FONT_BODY = "'Hanken Grotesk', 'Segoe UI', system-ui, sans-serif"

const T = {
  bg: '#0b0b0c',
  surface: 'rgba(255,255,255,0.025)',
  surfaceHover: 'rgba(255,255,255,0.05)',
  line: 'rgba(255,255,255,0.09)',
  ink: '#f4f1ea', // branco quente
  inkSoft: '#b9b3a7', // cinza quente
  inkMute: '#8a8276',
  inkFaint: '#5b554c',
  red: '#dc2626', // vermelho VM (ação)
  redSoft: '#f0857f',
  gold: '#c2a36b', // champagne, assinatura premium
  goldSoft: '#d8c094',
  green: '#1f9d57',
  rSm: 10,
  rMd: 14,
  rLg: 18,
} as const

// Ícones SVG de traço fino (visual sério/premium)
function Icon({ name, size = 22, color = 'currentColor', stroke = 1.6 }: { name: string; size?: number; color?: string; stroke?: number }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'bag':
      return (<svg {...c}><path d="M6 7h12l1.2 13a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>)
    case 'user':
      return (<svg {...c}><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></svg>)
    case 'target':
      return (<svg {...c}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.2" /></svg>)
    case 'lock':
      return (<svg {...c}><rect x="4" y="10.5" width="16" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></svg>)
    case 'chat':
      return (<svg {...c}><path d="M21 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-5.1A8 8 0 1 1 21 11.5Z" /></svg>)
    case 'arrow':
      return (<svg {...c}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>)
    default:
      return null
  }
}

type ICPKey = 'icp1' | 'icp2' | 'icp3' | 'icp4' | 'icp5' | 'icp6'
type Branch = 'A' | 'B' | 'C'
type NodeId = string
type NextTarget = NodeId // pode ser id de nó, `insight:icpX`, ou `open`

const ICP_KEYS: ICPKey[] = ['icp1', 'icp2', 'icp3', 'icp4', 'icp5', 'icp6']

type Weights = Partial<Record<ICPKey, number>>

interface Option {
  text: string
  weights: Weights
  next: NextTarget
  branch?: Branch // só na raiz
  forceICP?: ICPKey // regra dura (operação 4+ pessoas)
}

interface QNode {
  id: NodeId
  question: (firstName: string) => string
  subtitle?: string
  options: Option[]
}

interface Answer {
  questionId: string
  text: string
  weights: Weights
}

interface ProfileStat {
  value: string
  label: string
}

interface Profile {
  name: string
  tag: string
  icon: string
  color: string
  gradient: string
  headline: string
  description: string
  stats: ProfileStat[]
  actions: string[]
  cta: string
}

interface Insight {
  eyebrow: string
  title: string
  body: string
}

type Step = 'intro' | 'name_step' | 'question' | 'insight' | 'open' | 'capture' | 'result'

const TOTAL_QUESTIONS = 5 // raiz + discriminador + 2 contexto + confirmação

// Todos os eventos deste funil saem marcados com o vertical de e-commerce.
function track(payload: Parameters<typeof trackQuiz>[0]) {
  trackQuiz({ ...payload, vertical: 'ecommerce' })
}

// ════════════════════════════════════════════════════════════════
//  GRAFO DE PERGUNTAS (árvore profunda, 6 caminhos)
//  Spec: quiz/QUIZ-ARVORE-DE-DECISAO-ECOMMERCE.md
// ════════════════════════════════════════════════════════════════

const NODES: Record<NodeId, QNode> = {
  // ── RAIZ, segmenta por maturidade ──
  root: {
    id: 'root',
    question: (n) =>
      n ? `${n}, de onde vem a maior parte das suas vendas hoje?` : 'De onde vem a maior parte das suas vendas hoje?',
    subtitle: 'Essa é a pergunta que mais revela onde está sua maior oportunidade.',
    options: [
      { text: 'Instagram / WhatsApp, eu vendo no 1 a 1', branch: 'A', weights: { icp1: 5 }, next: 'a2' },
      { text: 'Marketplaces (Mercado Livre, Shopee, Amazon)', branch: 'A', weights: { icp2: 5 }, next: 'a2' },
      { text: 'Tenho loja virtual própria, mas vende pouco', branch: 'B', weights: { icp3: 2, icp4: 3 }, next: 'b2' },
      { text: 'Já faço anúncios pagos (Google ou Meta)', branch: 'C', weights: { icp5: 4, icp6: 2 }, next: 'c2' },
      { text: 'Não tenho um canal principal definido', branch: 'B', weights: { icp4: 3, icp3: 2 }, next: 'b2' },
    ],
  },

  // ── RAMO A, "Vende sem canal próprio" (icp1 ↔ icp2) ──
  a2: {
    id: 'a2',
    question: () => 'Quando você pensa em ter um canal de vendas próprio com anúncios, o que mais te representa?',
    options: [
      { text: '"Minhas vendas vêm da minha relação com os clientes, sempre foi assim"', weights: { icp1: 5 }, next: 'a3_icp1' },
      { text: '"Já pensei, mas parece caro e complicado"', weights: { icp1: 3, icp4: 1 }, next: 'a3_icp1' },
      { text: '"Acho que já invisto, pago comissão pro marketplace todo mês"', weights: { icp2: 5 }, next: 'a3_icp2' },
      { text: '"Pago marketplace, mas sei que não é a mesma coisa que ter canal próprio"', weights: { icp2: 4, icp5: 1 }, next: 'a3_icp2' },
    ],
  },
  a3_icp1: {
    id: 'a3_icp1',
    question: (n) => (n ? `${n}, como acontece uma venda típica sua hoje?` : 'Como acontece uma venda típica sua hoje?'),
    options: [
      { text: 'Cliente chama no direct/WhatsApp e eu fecho na conversa', weights: { icp1: 4 }, next: 'a4_icp1' },
      { text: 'Posto stories e espero alguém responder', weights: { icp1: 3 }, next: 'a4_icp1' },
      { text: 'Indicação de clientes antigos', weights: { icp1: 3 }, next: 'a4_icp1' },
      { text: 'Tenho link de pagamento/sacolinha, mas a maioria fecha no 1 a 1', weights: { icp1: 2, icp4: 1 }, next: 'a4_icp1' },
    ],
  },
  a4_icp1: {
    id: 'a4_icp1',
    question: () => 'O que mais te limita pra vender mais hoje?',
    options: [
      { text: 'Meu tempo, eu sou o gargalo de tudo', weights: { icp1: 3 }, next: 'insight:icp1' },
      { text: 'Alcance, só vendo pra quem já me segue', weights: { icp1: 3 }, next: 'insight:icp1' },
      { text: 'Instabilidade, tem mês bom e mês morto', weights: { icp1: 2, icp4: 1 }, next: 'insight:icp1' },
      { text: 'Não sei dizer, sinto que podia vender muito mais', weights: { icp1: 2 }, next: 'insight:icp1' },
    ],
  },
  a3_icp2: {
    id: 'a3_icp2',
    question: () => 'Quanto os marketplaces levam de você por mês, somando comissão e tarifas?',
    options: [
      { text: 'Até R$1.000', weights: { icp2: 3 }, next: 'a4_icp2' },
      { text: 'R$1.000 a R$5.000', weights: { icp2: 4 }, next: 'a4_icp2' },
      { text: 'R$5.000 a R$15.000', weights: { icp2: 4, icp6: 1 }, next: 'a4_icp2' },
      { text: 'Mais de R$15.000', weights: { icp2: 3, icp6: 2 }, next: 'a4_icp2' },
    ],
  },
  a4_icp2: {
    id: 'a4_icp2',
    question: () => 'O que mais te incomoda em vender por marketplace?',
    options: [
      { text: 'Guerra de preço, sempre tem alguém R$1 mais barato', weights: { icp2: 4 }, next: 'insight:icp2' },
      { text: 'O cliente é do marketplace, não meu, não consigo vender de novo pra ele', weights: { icp2: 4 }, next: 'insight:icp2' },
      { text: 'Comissões e tarifas comendo a margem', weights: { icp2: 3 }, next: 'insight:icp2' },
      { text: 'Viver refém de regras e algoritmo que mudam sem aviso', weights: { icp2: 3 }, next: 'insight:icp2' },
    ],
  },

  // ── RAMO B, "Loja própria sem tráfego" (icp3 ↔ icp4) · PRIORIDADE MÁXIMA ──
  b2: {
    id: 'b2',
    question: () => 'Você já tentou fazer anúncios pagos pra sua loja?',
    subtitle: 'Aqui mora a diferença entre quem tentou e quem ainda não começou.',
    options: [
      { text: 'Nunca, não sei por onde começar', weights: { icp4: 5 }, next: 'b3_icp4' },
      { text: 'Consumo muito conteúdo sobre, mas nunca rodei de verdade', weights: { icp4: 4 }, next: 'b3_icp4' },
      { text: 'Já impulsionei posts, mas não virou venda', weights: { icp3: 5 }, next: 'b3_icp3' },
      { text: 'Já rodei campanhas por 1–3 meses e parei, não se pagou', weights: { icp3: 5 }, next: 'b3_icp3' },
    ],
  },
  b3_icp3: {
    id: 'b3_icp3',
    question: () => 'O que exatamente você já fez?',
    options: [
      { text: 'Só impulsionei posts no Instagram', weights: { icp3: 4 }, next: 'b4_icp3' },
      { text: 'Rodei Google/Meta Ads por conta própria', weights: { icp3: 4 }, next: 'b4_icp3' },
      { text: 'Contratei agência ou freelancer', weights: { icp3: 2, icp5: 1 }, next: 'b4_icp3' },
      { text: 'Um pouco de cada', weights: { icp3: 3 }, next: 'b4_icp3' },
    ],
  },
  b4_icp3: {
    id: 'b4_icp3',
    question: () => 'Quanto você chegou a investir nessas tentativas?',
    options: [
      { text: 'Até R$1.000', weights: { icp3: 3 }, next: 'insight:icp3' },
      { text: 'R$1.000 a R$5.000', weights: { icp3: 4 }, next: 'insight:icp3' },
      { text: 'Mais de R$5.000', weights: { icp3: 3, icp5: 1 }, next: 'insight:icp3' },
      { text: 'Não lembro / foi pouco', weights: { icp3: 2 }, next: 'insight:icp3' },
    ],
  },
  b3_icp4: {
    id: 'b3_icp4',
    question: () => 'Quanto você teria disponível pra investir por mês em anúncios?',
    options: [
      { text: 'Ainda não sei', weights: { icp4: 3 }, next: 'b4_icp4' },
      { text: 'Até R$1.000', weights: { icp4: 3 }, next: 'b4_icp4' },
      { text: 'R$1.000 a R$3.000', weights: { icp4: 4 }, next: 'b4_icp4' },
      { text: 'Mais de R$3.000', weights: { icp4: 3, icp5: 1 }, next: 'b4_icp4' },
    ],
  },
  b4_icp4: {
    id: 'b4_icp4',
    question: () => 'O que você já tem montado da sua operação?',
    options: [
      { text: 'Só as redes sociais', weights: { icp4: 3 }, next: 'insight:icp4' },
      { text: 'Loja no ar (Nuvemshop, Shopify, Tray...), mas sem tráfego', weights: { icp4: 4 }, next: 'insight:icp4' },
      { text: 'Loja + pixel/catálogo configurados', weights: { icp4: 2, icp5: 1 }, next: 'insight:icp4' },
      { text: 'Loja + e-mail/CRM, só falta mídia', weights: { icp4: 2, icp5: 2 }, next: 'insight:icp4' },
    ],
  },

  // ── RAMO C, "Já investe" (icp5 ↔ icp6) ──
  c2: {
    id: 'c2',
    question: (n) => (n ? `${n}, como é a operação por trás da sua loja hoje?` : 'Como é a operação por trás da sua loja hoje?'),
    options: [
      { text: 'Sou eu sozinho(a)', weights: { icp5: 4 }, next: 'c3_icp5' },
      { text: 'Eu + 1–3 pessoas', weights: { icp5: 3, icp6: 1 }, next: 'c3_icp5' },
      { text: 'Equipe de 4–10 pessoas', weights: { icp6: 6 }, forceICP: 'icp6', next: 'c3_icp6' },
      { text: 'Operação com mais de 10 pessoas', weights: { icp6: 8 }, forceICP: 'icp6', next: 'c3_icp6' },
    ],
  },
  c3_icp5: {
    id: 'c3_icp5',
    question: () => 'Quanto você investe por mês em mídia hoje?',
    options: [
      { text: 'R$1.000 a R$5.000', weights: { icp5: 3 }, next: 'c4_icp5' },
      { text: 'R$5.000 a R$15.000', weights: { icp5: 4 }, next: 'c4_icp5' },
      { text: 'R$15.000 a R$50.000', weights: { icp5: 4, icp6: 1 }, next: 'c4_icp5' },
      { text: 'Mais de R$50.000', weights: { icp5: 3, icp6: 2 }, next: 'c4_icp5' },
    ],
  },
  c4_icp5: {
    id: 'c4_icp5',
    question: () => 'Qual frase descreve melhor seu ROAS hoje?',
    options: [
      { text: 'Sei de cabeça, mas está abaixo do que preciso', weights: { icp5: 4 }, next: 'insight:icp5' },
      { text: 'Varia demais, tem mês que paga, mês que não', weights: { icp5: 3 }, next: 'insight:icp5' },
      { text: 'Não consigo medir com confiança', weights: { icp5: 3 }, next: 'insight:icp5' },
      { text: 'Está bom, mas sei que dá pra extrair mais', weights: { icp5: 3, icp6: 1 }, next: 'insight:icp5' },
    ],
  },
  c3_icp6: {
    id: 'c3_icp6',
    question: () => 'Qual o maior desafio da sua operação hoje?',
    options: [
      { text: 'Escalar o investimento sem derreter o ROAS', weights: { icp6: 4 }, next: 'c4_icp6' },
      { text: 'CAC subindo e margem apertando', weights: { icp6: 4 }, next: 'c4_icp6' },
      { text: 'Dependência de um canal só de aquisição', weights: { icp6: 4 }, next: 'c4_icp6' },
      { text: 'Cliente não volta, recompra e LTV baixos', weights: { icp6: 3, icp5: 1 }, next: 'c4_icp6' },
    ],
  },
  c4_icp6: {
    id: 'c4_icp6',
    question: () => 'Você já trabalhou com agência de marketing antes?',
    options: [
      { text: 'Nunca', weights: { icp6: 3 }, next: 'insight:icp6' },
      { text: 'Sim, e foi uma experiência ruim', weights: { icp6: 4 }, next: 'insight:icp6' },
      { text: 'Sim, foi ok mas quero algo melhor', weights: { icp6: 3 }, next: 'insight:icp6' },
      { text: 'Trabalho com uma hoje, avaliando trocar', weights: { icp6: 3 }, next: 'insight:icp6' },
    ],
  },

  // ── CAUDA: confirmação (override) ──
  confirm: {
    id: 'confirm',
    question: (n) => (n ? `${n}, qual frase mais representa você hoje?` : 'Qual frase mais representa você hoje?'),
    subtitle: 'Seja honesto, isso personaliza 100% do seu diagnóstico.',
    options: [
      { text: '"Minhas vendas dependem de mim no 1 a 1. Se eu paro, a loja para."', weights: { icp1: 8 }, next: 'open' },
      { text: '"Já pago caro pro marketplace, não quero mais um custo que talvez não funcione."', weights: { icp2: 8 }, next: 'open' },
      { text: '"Já tentei anúncios e não se pagou. Preciso de prova que funciona."', weights: { icp3: 8 }, next: 'open' },
      { text: '"Sei que preciso de tráfego, mas tenho medo de queimar dinheiro começando errado."', weights: { icp4: 8 }, next: 'open' },
      { text: '"Já invisto em mídia, mas sei que não estou tirando o máximo."', weights: { icp5: 8 }, next: 'open' },
      { text: '"Preciso de uma operação de growth profissional, com números claros."', weights: { icp6: 8 }, next: 'open' },
    ],
  },
}

// ════════════════════════════════════════════════════════════════
//  INSIGHTS (1 por jornada, específico do ICP)
// ════════════════════════════════════════════════════════════════

const INSIGHTS: Record<ICPKey, Insight> = {
  icp1: {
    eyebrow: 'UMA VIRADA IMPORTANTE',
    title: 'Você não tem um e-commerce. Você tem um atendimento que vende.',
    body: 'Seu relacionamento com os clientes é o ativo mais difícil de construir, e você já construiu. Mas hoje cada venda passa pelas suas mãos: se você para, a loja para. Uma loja estruturada com tráfego vende 24/7 para quem ainda não te segue, e o seu atendimento 1 a 1 vira diferencial premium em vez de gargalo. O digital não substitui sua relação com o cliente: ele multiplica o alcance dela.',
  },
  icp2: {
    eyebrow: 'UMA VIRADA IMPORTANTE',
    title: 'Marketplace não é canal próprio, é aluguel de prateleira com guerra de preço.',
    body: 'Entre comissões e tarifas, o marketplace leva até 20% ou mais de cada venda sua, e o cliente continua sendo dele: você não tem os dados, não pode fazer remarketing, não constrói recompra. Cada real de comissão, redirecionado para aquisição própria, compra um cliente que é seu para sempre, com margem cheia e sem disputa de preço no mesmo anúncio.',
  },
  icp3: {
    eyebrow: 'A VERDADE QUE NINGUÉM TE CONTOU',
    title: 'Impulsionar post NÃO é tráfego pago. E tráfego sem estrutura não converte.',
    body: 'Impulsionar é colocar um cartaz na rua e torcer. Tráfego profissional para e-commerce é um sistema: pixel medindo tudo, catálogo conectado, público certo, remarketing para quem abandonou o carrinho e uma loja preparada para converter. Você não falhou, a estrutura é que faltou. Com o sistema completo, o mesmo investimento que "não se pagou" passa a ter como se pagar.',
  },
  icp4: {
    eyebrow: 'O QUE TE TRAVA NÃO É DINHEIRO',
    title: 'Você não precisa de R$10.000/mês pra validar sua loja.',
    body: 'Com R$50–100 por dia e a sequência certa, montada ANTES de ligar a campanha (pixel, catálogo, remarketing e uma loja que converte), você tem dados reais de custo por venda e ROAS em 30 dias. O que trava não é orçamento, é a ordem das coisas. Estrutura primeiro, anúncio depois, escala só com dado na mão.',
  },
  icp5: {
    eyebrow: 'ONDE ESTÁ O DINHEIRO NA MESA',
    title: 'Sem CRO, remarketing e e-mail, seu ROAS está 30–50% abaixo do possível.',
    body: 'Cerca de 70% dos carrinhos são abandonados, e sem fluxos estruturados de recuperação esse dinheiro simplesmente evapora. Remarketing dinâmico, otimização de conversão da loja e e-mail flows são o que separa performance boa de performance excepcional. E as horas que você passa dentro do gerenciador poderiam estar tocando a operação. Você não precisa de convencimento, precisa de tempo de volta.',
  },
  icp6: {
    eyebrow: 'PENSANDO COMO EMPRESÁRIO',
    title: 'Escala não vem de mais verba. Vem de margem, LTV e atribuição.',
    body: 'O CAC sobe para todo mundo, todos os anos. As operações que escalam são as que diversificam canais de aquisição, estruturam recompra para o LTV pagar o CAC, e atribuem cada venda ao canal certo para decidir com número, não com achismo. Jogar mais verba numa estrutura no limite só derrete o ROAS. A próxima fase do seu e-commerce é um sistema de crescimento, não um orçamento maior.',
  },
}

// ════════════════════════════════════════════════════════════════
//  PERFIS (nomes dignos voltados ao lead; conteúdo do Mapa de ICPs E-commerce)
// ════════════════════════════════════════════════════════════════

const profiles: Record<ICPKey, Profile> = {
  icp1: {
    name: 'A Marca de Relacionamento',
    tag: 'CANAL PRÓPRIO A CONSTRUIR',
    icon: 'I',
    color: '#c2a36b',
    gradient: 'linear-gradient(135deg, #8c734a, #c2a36b)',
    headline: 'Sua Marca Vende, Mas Só Quando Você Está Presente',
    description:
      'Você construiu o que a maioria das lojas não tem: audiência e confiança. Mas hoje cada venda depende do seu tempo no 1 a 1, e seu alcance está limitado a quem já te segue. O próximo passo não é mudar o que funciona, é montar a estrutura que vende quando você não está olhando.',
    stats: [
      { value: '87%', label: 'dos consumidores pesquisam online antes de comprar qualquer produto' },
      { value: '100%', label: 'das suas vendas hoje dependem do seu tempo e da sua presença' },
      { value: '24/7', label: 'é quanto uma loja estruturada com tráfego vende, mesmo sem você' },
    ],
    actions: [
      'Estruturar sua loja (ou landing de produto) para fechar vendas sem depender da conversa no direct',
      'Levar sua marca para além dos seguidores com campanhas segmentadas no público certo',
      'Manter o atendimento 1 a 1 como diferencial premium, não como gargalo da operação',
    ],
    cta: 'Agende uma conversa de 15 min. Vamos mostrar como transformar sua audiência em um canal de vendas que não depende do seu tempo.',
  },
  icp2: {
    name: 'O Estrategista de Marketplace',
    tag: 'CANAL PRÓPRIO A CONSTRUIR',
    icon: 'II',
    color: '#c2a36b',
    gradient: 'linear-gradient(135deg, #8c734a, #c2a36b)',
    headline: 'Você Está Pagando Caro Por Clientes Que Não São Seus',
    description:
      'Cada venda no marketplace deixa até 20% ou mais entre comissões e tarifas, e o cliente fica com eles: sem dados, sem remarketing, sem recompra. Você disputa preço no mesmo anúncio que o concorrente e vive refém de regras que mudam sem aviso. Isso não é canal próprio, é aluguel de prateleira.',
    stats: [
      { value: '20%+', label: 'de comissão e tarifas que o marketplace leva de cada venda sua' },
      { value: '0', label: 'dados do cliente ficam com você para vender de novo depois' },
      { value: '90 dias', label: 'para ter dados reais comparando marketplace vs. canal próprio' },
    ],
    actions: [
      'Comparar o custo real: comissões pagas por mês vs. custo de aquisição em canal próprio',
      'Lançar sua loja própria com tráfego mantendo o marketplace como vitrine, transição gradual',
      'Construir base de clientes sua: remarketing, e-mail e recompra com margem cheia',
    ],
    cta: 'Receba um comparativo personalizado: Comissão de Marketplace vs. Cliente Próprio. Os números vão falar por si.',
  },
  icp3: {
    name: 'O Explorador Digital',
    tag: 'ESTRUTURA EM DESENVOLVIMENTO',
    icon: 'III',
    color: '#c2a36b',
    gradient: 'linear-gradient(135deg, #8c734a, #c2a36b)',
    headline: 'Você Não Falhou, A Estrutura É Que Faltou',
    description:
      'O que você fez não foi tráfego profissional para e-commerce, foi tentativa sem sistema. Anúncio sem pixel bem configurado, sem catálogo conectado, sem remarketing e sem uma loja preparada para converter não tem como se pagar, para ninguém. A boa notícia: cada uma dessas peças tem conserto, e dá pra diagnosticar exatamente o que faltou na sua tentativa.',
    stats: [
      { value: '70%', label: 'dos carrinhos são abandonados, sem remarketing esse dinheiro evapora' },
      { value: '0', label: 'vendas é o resultado típico de impulsionamento sem estrutura por trás' },
      { value: '30 dias', label: 'para validar com campanha piloto e estrutura completa montada' },
    ],
    actions: [
      'Entender exatamente o que deu errado na sua tentativa anterior (explicamos sem compromisso)',
      'Montar a estrutura completa: pixel, catálogo, remarketing e loja otimizada para conversão',
      'Rodar um piloto de 30 dias com critérios claros de validação antes de qualquer compromisso longo',
    ],
    cta: 'Diagnóstico gratuito: nos mostre o que você fez antes e explicamos exatamente por que não se pagou.',
  },
  icp4: {
    name: 'O Ambicioso Digital',
    tag: 'ESTRUTURA EM DESENVOLVIMENTO',
    icon: 'IV',
    color: '#c2a36b',
    gradient: 'linear-gradient(135deg, #8c734a, #c2a36b)',
    headline: 'Você Tem a Mentalidade Certa, Só Falta o Plano',
    description:
      'Você já entende que tráfego pago é o caminho para tirar sua loja da invisibilidade. O que te trava não é falta de vontade, é medo de queimar dinheiro começando errado, e excesso de informação desencontrada. A solução é sequência: estrutura primeiro, verba controlada depois, escala só com dados.',
    stats: [
      { value: 'R$50', label: 'por dia bastam para validar o canal com estrutura profissional' },
      { value: '30 dias', label: 'para ter dados reais de custo por venda, ROAS e qualidade' },
      { value: '∞', label: 'é o custo de não começar: cada mês parado é mercado cedido ao concorrente' },
    ],
    actions: [
      'Montar a infraestrutura mínima: pixel, catálogo, e-mail de carrinho e loja revisada para conversão',
      'Começar com verba controlada (R$50–100/dia) focada no seu produto de maior margem',
      'Em 30 dias decidir com dados reais: custo por venda, ROAS e o que escalar',
    ],
    cta: 'Plano de lançamento personalizado: investimento mínimo, timeline de 30 dias, projeção honesta. Sem surpresas.',
  },
  icp5: {
    name: 'O Operador de Performance',
    tag: 'MATURIDADE DIGITAL',
    icon: 'V',
    color: '#c2a36b',
    gradient: 'linear-gradient(135deg, #8c734a, #c2a36b)',
    headline: 'Sua Operação Funciona, Mas Está Deixando Dinheiro na Mesa',
    description:
      'Você já investe, já vende, já sabe que funciona. O problema é que a mídia roda sem o sistema completo em volta: CRO na loja, remarketing dinâmico, fluxos de e-mail recuperando carrinho. E as horas que você passa dentro do gerenciador custam caro para a operação. Seu ROAS provavelmente está 30–50% abaixo do possível.',
    stats: [
      { value: '-30%', label: 'de CAC possível com CRO + remarketing + e-mail flows estruturados' },
      { value: '70%', label: 'dos carrinhos da sua loja provavelmente são abandonados hoje' },
      { value: '5-10h', label: 'por semana gastas gerenciando mídia em vez de tocar a operação' },
    ],
    actions: [
      'Auditoria completa: conta de anúncios, loja e e-mail, onde estão os gaps que você não vê',
      'Transição suave: assumimos a operação sem pausar campanhas, zero downtime',
      'Dashboard com ROAS, CAC, taxa de conversão e receita recuperada por fluxo',
    ],
    cta: 'Auditoria gratuita: identificamos os 3 maiores gaps da sua operação e quanto você está deixando na mesa.',
  },
  icp6: {
    name: 'O Empresário do E-commerce',
    tag: 'MATURIDADE DIGITAL',
    icon: 'VI',
    color: '#c2a36b',
    gradient: 'linear-gradient(135deg, #8c734a, #c2a36b)',
    headline: 'Sua Próxima Fase Não É Mais Verba, É Uma Máquina de Crescimento',
    description:
      'Você pensa como empresário: o desafio não é começar, é escalar sem derreter margem. CAC subindo, dependência de canal, recompra abaixo do potencial. A resposta é um sistema full-funnel: aquisição multi-canal, retenção estruturada para o LTV pagar o CAC, e atribuição confiável para decidir com número.',
    stats: [
      { value: '30%+', label: 'da receita de e-commerces maduros vem de recompra via CRM e e-mail' },
      { value: '100%', label: 'de rastreabilidade: cada venda atribuída ao canal e à campanha certa' },
      { value: '3+', label: 'canais de aquisição: quem depende de um só está sempre em risco' },
    ],
    actions: [
      'Operação full-funnel: aquisição multi-canal segmentada por margem e perfil de cliente',
      'Estruturar retenção e recompra: fluxos de CRM/e-mail para elevar LTV e payback',
      'Dashboard executivo com atribuição por canal: margem de contribuição, LTV:CAC e ROAS real',
    ],
    cta: 'Proposta executiva: como estruturamos operações de growth com atribuição e números claros, ponta a ponta.',
  },
}

// ════════════════════════════════════════════════════════════════
//  CLASSIFICAÇÃO
// ════════════════════════════════════════════════════════════════

function sumScores(answers: Answer[]): Record<ICPKey, number> {
  const totals = Object.fromEntries(ICP_KEYS.map((k) => [k, 0])) as Record<ICPKey, number>
  answers.forEach((a) => {
    ICP_KEYS.forEach((k) => {
      totals[k] += a.weights[k] ?? 0
    })
  })
  return totals
}

function classify(
  answers: Answer[],
  forcedICP: ICPKey | null,
  confirmICP: ICPKey | null
): { key: ICPKey; totals: Record<ICPKey, number>; max: number; adherence: number } {
  const totals = sumScores(answers)
  const total = ICP_KEYS.reduce((s, k) => s + totals[k], 0)

  let key: ICPKey
  if (forcedICP) {
    key = forcedICP
  } else {
    key = 'icp4'
    let max = -1
    ICP_KEYS.forEach((k) => {
      if (totals[k] > max) {
        max = totals[k]
        key = k
      }
    })
    if (confirmICP && totals[confirmICP] === max) key = confirmICP
  }

  const max = totals[key]
  const adherence = total > 0 ? Math.max(62, Math.min(96, Math.round((max / total) * 100))) : 75
  return { key, totals, max, adherence }
}

function buildWppMessage(profileKey: ICPKey, userName: string, openAnswer: string): string {
  const profile = profiles[profileKey]
  const challenge = openAnswer.trim() || 'aumentar as vendas da minha loja com previsibilidade'
  const firstName = userName.split(' ')[0]
  const base: Record<ICPKey, string> = {
    icp1: `Olá, Virtual Mark! 🤝\n\nMeu nome é ${firstName} e fiz o diagnóstico de e-commerce, meu perfil é *${profile.name}*.\n\nHoje vendo pelo Instagram/WhatsApp no 1 a 1 e percebi que preciso de uma estrutura que venda sem depender só do meu tempo.\n\nMeu maior desafio: ${challenge}\n\nGostaria de conversar com um especialista.`,
    icp2: `Olá, Virtual Mark! 🧭\n\nMeu nome é ${firstName} e fiz o diagnóstico de e-commerce, meu perfil é *${profile.name}*.\n\nHoje vendo por marketplaces e pago caro em comissões por clientes que não ficam comigo.\n\nMeu maior desafio: ${challenge}\n\nQuero entender como construir meu canal próprio de vendas.`,
    icp3: `Olá, Virtual Mark! 🧪\n\nMeu nome é ${firstName} e fiz o diagnóstico de e-commerce, meu perfil é *${profile.name}*.\n\nJá tentei anúncios pra minha loja e não se pagou.\n\nMeu maior desafio: ${challenge}\n\nQuero entender o que deu errado e como fazer tráfego com estrutura de verdade.`,
    icp4: `Olá, Virtual Mark! 🚀\n\nMeu nome é ${firstName} e fiz o diagnóstico de e-commerce, meu perfil é *${profile.name}*.\n\nSei que tráfego pago é o caminho pra minha loja, mas ainda não comecei porque tenho medo de errar.\n\nMeu maior desafio: ${challenge}\n\nQuero um plano de lançamento com investimento mínimo.`,
    icp5: `Olá, Virtual Mark! 📈\n\nMeu nome é ${firstName} e fiz o diagnóstico de e-commerce, meu perfil é *${profile.name}*.\n\nJá invisto em mídia e vendo, mas sei que minha operação está deixando dinheiro na mesa.\n\nMeu maior desafio: ${challenge}\n\nQuero uma auditoria gratuita da minha operação.`,
    icp6: `Olá, Virtual Mark! 🏢\n\nMeu nome é ${firstName} e fiz o diagnóstico de e-commerce, meu perfil é *${profile.name}*.\n\nTenho uma operação estruturada de e-commerce e preciso escalar com margem, LTV e atribuição claros.\n\nMeu maior desafio: ${challenge}\n\nGostaria de receber uma proposta executiva.`,
  }
  return encodeURIComponent(base[profileKey])
}

function StatBar({ label, value, maxVal, color, highlight = false }: { label: string; value: number; maxVal: number; color: string; highlight?: boolean }) {
  const pct = maxVal > 0 ? Math.min((value / maxVal) * 100, 100) : 0
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
        <span style={{ color: highlight ? T.ink : T.inkMute, fontWeight: highlight ? 600 : 400 }}>{label}</span>
        <span style={{ color: highlight ? color : T.inkFaint, fontWeight: 700, fontFamily: FONT_DISPLAY }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: color, width: `${pct}%`, transition: 'width 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  PÁGINA
// ════════════════════════════════════════════════════════════════

export default function QuizEcommerceTreePage() {
  const [step, setStep] = useState<Step>('intro')
  const [nameInput, setNameInput] = useState('')
  const [firstName, setFirstName] = useState('')

  const [nodeId, setNodeId] = useState<NodeId>('root')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [branch, setBranch] = useState<Branch | null>(null)
  const [forcedICP, setForcedICP] = useState<ICPKey | null>(null)
  const [confirmICP, setConfirmICP] = useState<ICPKey | null>(null)
  const [pendingInsight, setPendingInsight] = useState<ICPKey | null>(null)

  const [selected, setSelected] = useState<number | null>(null)
  const [fading, setFading] = useState(false)

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [openAnswer, setOpenAnswer] = useState('')
  const [result, setResult] = useState<ReturnType<typeof classify> | null>(null)
  const profile = result ? profiles[result.key] : null

  const currentQuestion = NODES[nodeId]
  const answeredCount = answers.length

  function handleNameSubmit() {
    if (!nameInput.trim()) return
    setFirstName(nameInput.trim().split(' ')[0])
    setStep('question')
    track({ event: 'quiz_name_submitted', has_name: true })
  }

  function go(next: NextTarget) {
    if (next.startsWith('insight:')) {
      const icp = next.split(':')[1] as ICPKey
      setPendingInsight(icp)
      track({ event: 'quiz_insight_viewed', branch: branch ?? '', icp })
      setStep('insight')
    } else if (next === 'open') {
      setStep('open')
    } else {
      setNodeId(next)
      setStep('question')
    }
  }

  function handleSelect(opt: Option, idx: number) {
    setSelected(idx)
    setTimeout(() => {
      setFading(true)
      setTimeout(() => {
        const q = NODES[nodeId]
        setAnswers((prev) => [...prev, { questionId: q.id, text: opt.text, weights: opt.weights }])
        if (opt.branch) {
          setBranch(opt.branch)
          track({ event: 'quiz_branch_entered', branch: opt.branch })
        }
        if (opt.forceICP) setForcedICP(opt.forceICP)
        if (q.id === 'confirm') {
          const picked = (Object.keys(opt.weights) as ICPKey[])[0] ?? null
          setConfirmICP(picked)
        }
        track({ event: 'quiz_question_answered', question_id: q.id, branch: branch ?? undefined })
        go(opt.next)
        setSelected(null)
        setFading(false)
      }, 280)
    }, 180)
  }

  function continueFromInsight() {
    setNodeId('confirm')
    setStep('question')
  }

  async function handleCapture() {
    if (!email.trim() || !phone.trim()) return
    const r = classify(answers, forcedICP, confirmICP)
    setResult(r)
    track({ event: 'quiz_lead_captured', icp: r.key, adherence: r.adherence })

    // Salva no Supabase, não bloqueia a exibição do resultado.
    try {
      const attribution = getAttribution()
      const lead = {
        name: firstName || nameInput.trim() || 'Visitante',
        email: email.trim(),
        phone: phone.trim(),
        icp: r.key,
        icp_name: profiles[r.key].name,
        branch,
        adherence: r.adherence,
        scores: r.totals,
        answers,
        open_answer: openAnswer.trim() || null,
        ...attribution,
      }
      const { error } = await supabase.from('quiz_leads').insert([{ ...lead, vertical: 'ecommerce' }])
      if (error) {
        // Coluna `vertical` pode não existir ainda (migração quiz_leads_vertical.sql
        // pendente) — não perde o lead por isso.
        await supabase.from('quiz_leads').insert([lead])
      }
    } catch (err) {
      console.error('Erro ao salvar quiz_lead:', err)
    }

    setStep('result')
    track({ event: 'quiz_result_viewed', icp: r.key, adherence: r.adherence })
  }

  // Progresso (cada caminho tem TOTAL_QUESTIONS perguntas + insight + aberta)
  const progress =
    step === 'question'
      ? (answeredCount / (TOTAL_QUESTIONS + 1)) * 100
      : step === 'insight'
      ? ((TOTAL_QUESTIONS - 0.5) / (TOTAL_QUESTIONS + 1)) * 100
      : step === 'open'
      ? (TOTAL_QUESTIONS / (TOTAL_QUESTIONS + 1)) * 100
      : step === 'capture'
      ? 96
      : 0

  const S: React.CSSProperties = {
    minHeight: '100vh',
    background: T.bg,
    fontFamily: FONT_BODY,
    color: T.ink,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 16px 40px',
  }

  return (
    <div style={S}>
      {/* Top branding */}
      <div style={{ width: '100%', maxWidth: 560, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <Link to="/ecommerce" style={{ textDecoration: 'none', fontSize: 21, fontWeight: 700, letterSpacing: '-0.01em', color: T.ink }}>
          <span style={{ color: T.red }}>Virtual</span>Mark
        </Link>
        {step !== 'intro' && step !== 'result' && step !== 'name_step' && (
          <span style={{ fontSize: 11, color: T.inkMute, fontWeight: 600, letterSpacing: '2px' }}>DIAGNÓSTICO ESTRATÉGICO</span>
        )}
      </div>

      {/* ── INTRO ── */}
      {step === 'intro' && (
        <div style={{ maxWidth: 540, width: '100%', textAlign: 'center', animation: 'fadeUp .6s ease-out' }}>
          <div style={{ width: 72, height: 72, borderRadius: T.rLg, background: T.surface, border: `1px solid ${T.gold}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', color: T.gold }}>
            <Icon name="bag" size={32} stroke={1.4} />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: T.gold, marginBottom: 22, letterSpacing: '2.5px' }}>
            <span style={{ width: 24, height: 1, background: T.gold, opacity: 0.5 }} />
            DIAGNÓSTICO ESTRATÉGICO · 3 MIN
            <span style={{ width: 24, height: 1, background: T.gold, opacity: 0.5 }} />
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(30px, 6vw, 40px)', fontWeight: 600, lineHeight: 1.12, letterSpacing: '-0.01em', margin: '0 0 18px', color: T.ink }}>
            Onde Sua Loja Está Perdendo Vendas Todos os Dias
          </h1>
          <p style={{ fontSize: 16, color: T.inkSoft, lineHeight: 1.7, margin: '0 auto 12px', maxWidth: 460 }}>
            Responda algumas perguntas e receba um <strong style={{ color: T.ink, fontWeight: 600 }}>diagnóstico personalizado</strong> do gargalo específico que está travando o crescimento do seu e-commerce.
          </p>
          <p style={{ fontSize: 14, color: T.inkMute, lineHeight: 1.6, margin: '0 auto 34px', maxWidth: 460 }}>
            Não é um quiz genérico. Mapeamos <strong style={{ color: T.inkSoft, fontWeight: 600 }}>6 perfis distintos</strong> de loja e entregamos recomendações cirúrgicas para cada um.
          </p>
          <button
            onClick={() => { setStep('name_step'); track({ event: 'quiz_start' }) }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', maxWidth: 360, padding: '17px 32px', border: 'none', borderRadius: T.rMd, fontFamily: FONT_BODY, fontSize: 16, fontWeight: 700, cursor: 'pointer', background: T.red, color: '#fff', boxShadow: '0 8px 30px rgba(220,38,38,0.28)', transition: 'transform .2s ease, box-shadow .2s ease' }}
            onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'translateY(-2px)'; b.style.boxShadow = '0 12px 38px rgba(220,38,38,0.36)' }}
            onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = ''; b.style.boxShadow = '0 8px 30px rgba(220,38,38,0.28)' }}
          >
            Fazer Meu Diagnóstico <Icon name="arrow" size={18} />
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 22px', marginTop: 22, fontSize: 13, color: T.inkMute }}>
            <span>Gratuito</span><span style={{ color: T.gold }}>·</span><span>Resultado imediato</span><span style={{ color: T.gold }}>·</span><span>Sem compromisso</span>
          </div>
        </div>
      )}

      {/* ── NAME STEP ── */}
      {step === 'name_step' && (
        <div style={{ maxWidth: 520, width: '100%', animation: 'fadeUp .5s ease-out' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 60, height: 60, borderRadius: T.rMd, background: T.surface, border: `1px solid ${T.gold}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: T.gold }}>
              <Icon name="user" size={26} stroke={1.4} />
            </div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 600, letterSpacing: '-0.01em', color: T.ink, margin: '0 0 10px', lineHeight: 1.2 }}>
              Antes de começar, como podemos te chamar?
            </h2>
            <p style={{ fontSize: 14, color: T.inkMute, margin: 0 }}>Vamos personalizar cada pergunta especialmente para você.</p>
          </div>
          <input
            type="text"
            placeholder="Seu primeiro nome"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleNameSubmit() }}
            style={{ width: '100%', padding: '16px 20px', border: nameInput.trim() ? `1px solid ${T.gold}` : `1px solid ${T.line}`, borderRadius: T.rMd, background: T.surface, color: T.ink, fontSize: 18, fontFamily: 'inherit', outline: 'none', textAlign: 'center', boxSizing: 'border-box', marginBottom: 12, transition: 'border-color .2s ease' }}
            autoFocus
          />
          <button
            onClick={handleNameSubmit}
            disabled={!nameInput.trim()}
            style={{ width: '100%', padding: '15px', border: 'none', borderRadius: T.rMd, fontSize: 16, fontWeight: 700, cursor: nameInput.trim() ? 'pointer' : 'not-allowed', background: nameInput.trim() ? T.red : 'rgba(255,255,255,0.06)', color: nameInput.trim() ? '#fff' : T.inkFaint, transition: 'all 0.2s', marginBottom: 10 }}
          >
            Continuar
          </button>
          <button
            onClick={() => { setFirstName(''); setStep('question'); track({ event: 'quiz_name_submitted', has_name: false }) }}
            style={{ width: '100%', padding: '10px', border: 'none', background: 'transparent', color: T.inkMute, fontSize: 13, cursor: 'pointer' }}
          >
            Pular e continuar sem nome
          </button>
        </div>
      )}

      {/* ── QUESTION / OPEN / CAPTURE ── */}
      {(step === 'question' || step === 'open' || step === 'capture') && (
        <div style={{ maxWidth: 560, width: '100%' }}>
          <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', marginBottom: 34, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 2, width: `${progress}%`, background: T.gold, transition: 'width 0.55s cubic-bezier(.4,0,.2,1)' }} />
          </div>

          {step === 'question' && currentQuestion && (
            <div key={currentQuestion.id} style={{ animation: fading ? 'fadeOut .28s ease' : 'fadeUp .4s ease-out' }}>
              <div style={{ fontSize: 11, color: T.gold, fontWeight: 700, marginBottom: 12, letterSpacing: '2.5px' }}>
                {firstName ? `${firstName.toUpperCase()} · ` : ''}PERGUNTA {Math.min(answeredCount + 1, TOTAL_QUESTIONS)} / {TOTAL_QUESTIONS}
              </div>
              <h2 style={{ fontSize: 'clamp(20px, 4.5vw, 24px)', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.3, letterSpacing: '-0.01em', color: T.ink }}>
                {currentQuestion.question(firstName)}
              </h2>
              {currentQuestion.subtitle ? (
                <p style={{ fontSize: 14, color: T.inkMute, margin: '0 0 22px', lineHeight: 1.5 }}>{currentQuestion.subtitle}</p>
              ) : (
                <div style={{ height: 18 }} />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {currentQuestion.options.map((opt, i) => {
                  const on = selected === i
                  return (
                  <button
                    key={i}
                    className="vm-opt"
                    style={{ animationDelay: `${i * 60}ms`, padding: '14px 16px', border: on ? `1px solid ${T.gold}` : `1px solid ${T.line}`, borderRadius: T.rMd, background: on ? 'rgba(194,163,107,0.10)' : T.surface, color: T.ink, fontSize: 14.5, textAlign: 'left', cursor: 'pointer', transition: 'background .18s ease, border-color .18s ease', display: 'flex', alignItems: 'center', gap: 14, lineHeight: 1.4 }}
                    onClick={() => handleSelect(opt, i)}
                    onMouseEnter={(e) => { if (!on) (e.currentTarget as HTMLButtonElement).style.background = T.surfaceHover }}
                    onMouseLeave={(e) => { if (!on) (e.currentTarget as HTMLButtonElement).style.background = T.surface }}
                  >
                    <span style={{ width: 28, height: 28, minWidth: 28, borderRadius: T.rSm, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? T.gold : 'rgba(255,255,255,0.05)', border: on ? 'none' : `1px solid ${T.line}`, fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 600, color: on ? '#1a1408' : T.inkMute, transition: 'all .18s ease' }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 'open' && (
            <div style={{ animation: 'fadeUp .4s ease-out' }}>
              <div style={{ fontSize: 11, color: T.gold, fontWeight: 700, marginBottom: 12, letterSpacing: '2.5px' }}>ÚLTIMA PERGUNTA</div>
              <h2 style={{ fontSize: 'clamp(20px, 4.5vw, 24px)', fontWeight: 600, margin: '0 0 8px', lineHeight: 1.3, letterSpacing: '-0.01em', color: T.ink }}>
                {firstName ? `${firstName}, se` : 'Se'} pudéssemos resolver um problema da sua loja, qual seria?
              </h2>
              <p style={{ fontSize: 14, color: T.inkMute, margin: '0 0 22px', lineHeight: 1.5 }}>
                Seja específico, isso personaliza seu plano de ação e a mensagem para nosso especialista.
              </p>
              <textarea
                value={openAnswer}
                onChange={(e) => setOpenAnswer(e.target.value)}
                placeholder="Ex: Tenho visitas na loja mas quase ninguém compra, e o carrinho abandonado está altíssimo..."
                style={{ width: '100%', minHeight: 120, padding: 16, border: `1px solid ${T.line}`, borderRadius: T.rMd, background: T.surface, color: T.ink, fontSize: 15, lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
              />
              <button
                onClick={() => { setStep('capture'); track({ event: 'quiz_open_answered', skipped: !openAnswer.trim() }) }}
                style={{ marginTop: 14, width: '100%', padding: '15px', border: 'none', borderRadius: T.rMd, fontSize: 16, fontWeight: 700, cursor: 'pointer', background: T.red, color: '#fff', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
              >
                Ver Meu Resultado
              </button>
              <button
                onClick={() => { setStep('capture'); track({ event: 'quiz_open_answered', skipped: true }) }}
                style={{ marginTop: 8, width: '100%', padding: '10px', border: 'none', borderRadius: T.rMd, fontSize: 13, cursor: 'pointer', background: 'transparent', color: T.inkMute }}
              >
                Pular pergunta
              </button>
            </div>
          )}

          {step === 'capture' && (
            <div style={{ animation: 'fadeUp .4s ease-out' }}>
              <div style={{ textAlign: 'center', padding: 28, borderRadius: T.rLg, marginBottom: 24, background: 'rgba(194,163,107,0.06)', border: `1px solid ${T.gold}33` }}>
                <div style={{ width: 56, height: 56, borderRadius: T.rMd, margin: '0 auto 14px', background: T.surface, border: `1px solid ${T.gold}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold }}>
                  <Icon name="target" size={26} stroke={1.4} />
                </div>
                <h3 style={{ margin: '0 0 8px', fontFamily: FONT_DISPLAY, fontSize: 21, color: T.ink, fontWeight: 600, letterSpacing: '-0.01em' }}>
                  {firstName ? `${firstName}, seu diagnóstico está pronto` : 'Seu diagnóstico está pronto'}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: T.inkSoft, lineHeight: 1.5 }}>Preencha seu e-mail e WhatsApp para revelar o resultado completo.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="email" placeholder="Seu melhor e-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '15px 16px', border: `1px solid ${T.line}`, borderRadius: T.rMd, background: T.surface, color: T.ink, fontSize: 15, fontFamily: 'inherit', outline: 'none' }} />
                <input type="tel" placeholder="WhatsApp (com DDD)" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ padding: '15px 16px', border: `1px solid ${T.line}`, borderRadius: T.rMd, background: T.surface, color: T.ink, fontSize: 15, fontFamily: 'inherit', outline: 'none' }} />
                <button
                  onClick={handleCapture}
                  disabled={!email.trim() || !phone.trim()}
                  style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '16px', border: 'none', borderRadius: T.rMd, fontSize: 16, fontWeight: 700, cursor: email.trim() && phone.trim() ? 'pointer' : 'not-allowed', background: email.trim() && phone.trim() ? T.red : 'rgba(255,255,255,0.06)', color: email.trim() && phone.trim() ? '#fff' : T.inkFaint, transition: 'all 0.2s' }}
                >
                  <Icon name="lock" size={17} /> Revelar Meu Diagnóstico
                </button>
                <p style={{ textAlign: 'center', fontSize: 11, color: T.inkFaint, margin: '4px 0 0' }}>
                  Seus dados são protegidos e nunca serão compartilhados com terceiros.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── INSIGHT (1 por jornada, específico do ICP) ── */}
      {step === 'insight' && pendingInsight && (
        <div style={{ maxWidth: 560, width: '100%' }}>
          <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', marginBottom: 34, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 2, width: `${progress}%`, background: T.gold, transition: 'width 0.55s cubic-bezier(.4,0,.2,1)' }} />
          </div>
          <div style={{ animation: 'fadeUp .5s ease-out', padding: '30px 30px 30px 32px', borderRadius: T.rLg, background: T.surface, border: `1px solid ${T.line}`, borderLeft: `2px solid ${T.red}` }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: T.redSoft, marginBottom: 16, letterSpacing: '2px' }}>
              <span style={{ width: 16, height: 1, background: T.redSoft, opacity: 0.6 }} />
              {INSIGHTS[pendingInsight].eyebrow}
            </div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(22px, 4.6vw, 26px)', fontWeight: 600, margin: '0 0 14px', lineHeight: 1.25, letterSpacing: '-0.01em', color: T.ink }}>{INSIGHTS[pendingInsight].title}</h2>
            <p style={{ fontSize: 15, color: T.inkSoft, lineHeight: 1.75, margin: 0 }}>{INSIGHTS[pendingInsight].body}</p>
          </div>
          <button
            onClick={continueFromInsight}
            style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, width: '100%', padding: '15px', border: 'none', borderRadius: T.rMd, fontSize: 16, fontWeight: 700, cursor: 'pointer', background: T.red, color: '#fff', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            Faz sentido, continuar <Icon name="arrow" size={18} />
          </button>
        </div>
      )}

      {/* ── RESULT ── */}
      {step === 'result' && profile && result && (
        <div style={{ maxWidth: 580, width: '100%', animation: 'fadeUp .6s ease-out' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(194,163,107,0.08)', border: `1px solid ${T.gold}55`, fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 600, color: T.gold, letterSpacing: '0.02em' }}>
              {profile.icon}
            </div>
            <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 999, border: `1px solid ${T.gold}55`, fontSize: 10.5, fontWeight: 700, color: T.gold, marginBottom: 14, letterSpacing: '2px' }}>
              {profile.tag}
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 500, fontStyle: 'italic', color: T.goldSoft, marginBottom: 14 }}>{profile.name}</div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 600, margin: '0 0 14px', color: T.ink, lineHeight: 1.2, letterSpacing: '-0.015em' }}>
              {firstName ? `${firstName}, ` : ''}{profile.headline}
            </h2>
            <p style={{ fontSize: 15, color: T.inkSoft, lineHeight: 1.7, margin: '0 auto', maxWidth: 500 }}>{profile.description}</p>
          </div>

          <div style={{ padding: 22, borderRadius: T.rLg, marginBottom: 16, background: T.surface, border: `1px solid ${T.line}` }}>
            <h3 style={{ margin: '0 0 18px', fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: '2px' }}>ANÁLISE DE PERFIL</h3>
            {ICP_KEYS.map((k) => (
              <StatBar key={k} label={profiles[k].name} value={result.totals[k]} maxVal={result.max} color={result.key === k ? profile.color : '#3a352f'} highlight={result.key === k} />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
            {profile.stats.map((s, i) => (
              <div key={i} style={{ padding: '18px 12px', borderRadius: T.rMd, textAlign: 'center', background: T.surface, border: `1px solid ${T.line}` }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 600, color: T.gold, marginBottom: 5, letterSpacing: '-0.01em' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: T.inkSoft, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: 24, borderRadius: T.rLg, marginBottom: 16, background: 'rgba(194,163,107,0.05)', border: `1px solid ${T.gold}2e` }}>
            <h3 style={{ margin: '0 0 18px', fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: '-0.01em' }}>Seus 3 Próximos Passos</h3>
            {profile.actions.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 13, alignItems: 'flex-start', marginBottom: i < 2 ? 14 : 0 }}>
                <span style={{ width: 26, height: 26, minWidth: 26, borderRadius: '50%', flexShrink: 0, background: 'rgba(194,163,107,0.12)', border: `1px solid ${T.gold}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 600, color: T.gold }}>
                  {i + 1}
                </span>
                <p style={{ margin: 0, fontSize: 14, color: T.inkSoft, lineHeight: 1.55 }}>{a}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: '30px 26px', borderRadius: T.rLg, background: '#0f0d0d', border: `1px solid ${T.line}` }}>
            <h3 style={{ margin: '0 0 10px', fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, color: T.ink, letterSpacing: '-0.01em', lineHeight: 1.25 }}>Quer transformar esse diagnóstico em vendas?</h3>
            <p style={{ margin: '0 auto 22px', fontSize: 13.5, color: T.inkSoft, lineHeight: 1.55, maxWidth: 440 }}>{profile.cta}</p>
            <a
              href={`https://wa.me/${WPP_NUMBER}?text=${buildWppMessage(result.key, firstName || 'Visitante', openAnswer)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track({ event: 'quiz_cta_whatsapp', icp: result.key })}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '15px 40px', border: 'none', borderRadius: T.rMd, fontSize: 16, fontWeight: 700, cursor: 'pointer', background: T.green, color: '#fff', boxShadow: '0 8px 28px rgba(31,157,87,0.28)', textDecoration: 'none', transition: 'transform 0.2s, box-shadow .2s' }}
              onMouseEnter={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.transform = 'translateY(-2px)'; a.style.boxShadow = '0 12px 36px rgba(31,157,87,0.36)' }}
              onMouseLeave={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.transform = ''; a.style.boxShadow = '0 8px 28px rgba(31,157,87,0.28)' }}
            >
              <Icon name="chat" size={19} /> Falar Com Especialista
            </a>
            <p style={{ margin: '16px 0 0', fontSize: 12, color: T.inkMute }}>Conversa gratuita de 15 min · Sem compromisso</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32, padding: '16px 0' }}>
            <Link to="/ecommerce" style={{ textDecoration: 'none', fontSize: 11, color: T.inkFaint, fontWeight: 600, letterSpacing: '2.5px' }}>
              VIRTUAL MARK · MKT DIGITAL
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px); } }
        @keyframes optIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .vm-opt { opacity: 0; animation: optIn .45s cubic-bezier(.4,0,.2,1) forwards; }
        input::placeholder, textarea::placeholder { color: #6b6253; }
        input:focus, textarea:focus { border-color: ${T.gold} !important; }
        ::selection { background: rgba(194,163,107,0.28); }
        @media (prefers-reduced-motion: reduce) {
          *, .vm-opt { animation: none !important; transition-duration: .01ms !important; }
          .vm-opt { opacity: 1 !important; }
        }
      `}</style>
    </div>
  )
}

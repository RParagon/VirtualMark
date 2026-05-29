import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { trackQuiz, getAttribution } from '../lib/quizTracking'

const WPP_NUMBER = '5511992794634'

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
  forceICP?: ICPKey // regra dura (equipe 4+)
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

// ════════════════════════════════════════════════════════════════
//  GRAFO DE PERGUNTAS (árvore profunda, 6 caminhos)
// ════════════════════════════════════════════════════════════════

const NODES: Record<NodeId, QNode> = {
  // ── RAIZ — segmenta por maturidade ──
  root: {
    id: 'root',
    question: (n) =>
      n ? `${n}, de onde vem a maioria dos seus clientes hoje?` : 'De onde vem a maioria dos seus clientes hoje?',
    subtitle: 'Essa é a pergunta que mais revela onde está sua maior oportunidade.',
    options: [
      { text: 'Indicações e networking presencial', branch: 'A', weights: { icp1: 5, icp3: 1 }, next: 'a2' },
      { text: 'Portais imobiliários (ZAP, OLX, VivaReal)', branch: 'A', weights: { icp2: 5 }, next: 'a2' },
      { text: 'Instagram / redes sociais orgânicas', branch: 'B', weights: { icp3: 2, icp4: 3 }, next: 'b2' },
      { text: 'Já faço anúncios pagos (Google ou Meta)', branch: 'C', weights: { icp5: 4, icp6: 2 }, next: 'c2' },
      { text: 'Não tenho uma fonte principal definida', branch: 'B', weights: { icp4: 3, icp3: 2 }, next: 'b2' },
    ],
  },

  // ── RAMO A — "Ainda não digital" (icp1 ↔ icp2) ──
  a2: {
    id: 'a2',
    question: () => 'Quando você pensa em anúncios online, o que mais te representa?',
    options: [
      { text: '"Nunca investi — meu negócio é relacionamento"', weights: { icp1: 5 }, next: 'a3_icp1' },
      { text: '"Já pensei, mas acho caro e complexo"', weights: { icp1: 3, icp4: 1 }, next: 'a3_icp1' },
      { text: '"Acho que já faço — pago o portal todo mês"', weights: { icp2: 5 }, next: 'a3_icp2' },
      { text: '"Pago portal, mas sei que não é a mesma coisa que anunciar"', weights: { icp2: 4, icp5: 1 }, next: 'a3_icp2' },
    ],
  },
  a3_icp1: {
    id: 'a3_icp1',
    question: (n) =>
      n ? `${n}, há quanto tempo você atua com imóveis de alto padrão?` : 'Há quanto tempo você atua com imóveis de alto padrão?',
    options: [
      { text: 'Mais de 20 anos — conheço todo mundo no mercado', weights: { icp1: 4 }, next: 'a4_icp1' },
      { text: '10 a 20 anos — mercado consolidado na minha região', weights: { icp1: 3 }, next: 'a4_icp1' },
      { text: '2 a 10 anos — tenho carteira, quero crescer', weights: { icp1: 1, icp5: 1 }, next: 'a4_icp1' },
      { text: 'Menos de 2 anos — começando ou migrando', weights: { icp4: 2 }, next: 'a4_icp1' },
    ],
  },
  a4_icp1: {
    id: 'a4_icp1',
    question: () => 'Quando alguém quer te indicar, onde a pessoa te encontra antes de ligar?',
    options: [
      { text: 'Em lugar nenhum — só por indicação direta', weights: { icp1: 3 }, next: 'insight:icp1' },
      { text: 'No meu Instagram pessoal, sem muita estratégia', weights: { icp1: 2 }, next: 'insight:icp1' },
      { text: 'Num site/perfil antigo que quase não atualizo', weights: { icp1: 2 }, next: 'insight:icp1' },
      { text: 'Ela me acha no Google', weights: { icp1: 1, icp5: 1 }, next: 'insight:icp1' },
    ],
  },
  a3_icp2: {
    id: 'a3_icp2',
    question: () => 'Quanto você investe por mês nos portais?',
    options: [
      { text: 'Até R$500', weights: { icp2: 3 }, next: 'a4_icp2' },
      { text: 'R$500 a R$1.500', weights: { icp2: 4 }, next: 'a4_icp2' },
      { text: 'R$1.500 a R$3.000', weights: { icp2: 4, icp6: 1 }, next: 'a4_icp2' },
      { text: 'Mais de R$3.000', weights: { icp2: 3, icp6: 2 }, next: 'a4_icp2' },
    ],
  },
  a4_icp2: {
    id: 'a4_icp2',
    question: () => 'O que mais te incomoda nos leads que vêm do portal?',
    options: [
      { text: 'Vêm disputados com muitos corretores', weights: { icp2: 4 }, next: 'insight:icp2' },
      { text: 'Qualidade baixa — muito curioso', weights: { icp2: 3 }, next: 'insight:icp2' },
      { text: 'O custo sobe todo ano', weights: { icp2: 3 }, next: 'insight:icp2' },
      { text: 'Não consigo medir se vale a pena', weights: { icp2: 2, icp5: 1 }, next: 'insight:icp2' },
    ],
  },

  // ── RAMO B — "Presença parcial" (icp3 ↔ icp4) · PRIORIDADE MÁXIMA ──
  b2: {
    id: 'b2',
    question: () => 'Você já tentou fazer anúncios pagos?',
    subtitle: 'Aqui mora a diferença entre quem tentou e quem ainda não começou.',
    options: [
      { text: 'Nunca — não sei por onde começar', weights: { icp4: 5 }, next: 'b3_icp4' },
      { text: 'Consumo muito conteúdo sobre, mas nunca operei de verdade', weights: { icp4: 4 }, next: 'b3_icp4' },
      { text: 'Já impulsionei posts, mas sem resultado claro', weights: { icp3: 5 }, next: 'b3_icp3' },
      { text: 'Já testei por 1–3 meses e parei porque não funcionou', weights: { icp3: 5 }, next: 'b3_icp3' },
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
    question: () => 'Quanto você chegou a gastar nessas tentativas?',
    options: [
      { text: 'Até R$500', weights: { icp3: 3 }, next: 'insight:icp3' },
      { text: 'R$500 a R$2.000', weights: { icp3: 4 }, next: 'insight:icp3' },
      { text: 'Mais de R$2.000', weights: { icp3: 3, icp5: 1 }, next: 'insight:icp3' },
      { text: 'Não lembro / foi pouco', weights: { icp3: 2 }, next: 'insight:icp3' },
    ],
  },
  b3_icp4: {
    id: 'b3_icp4',
    question: () => 'Quanto você teria disponível pra investir por mês em anúncios?',
    options: [
      { text: 'Ainda não sei', weights: { icp4: 3 }, next: 'b4_icp4' },
      { text: 'Até R$500', weights: { icp4: 3 }, next: 'b4_icp4' },
      { text: 'R$500 a R$1.500', weights: { icp4: 4 }, next: 'b4_icp4' },
      { text: 'Mais de R$1.500', weights: { icp4: 3, icp5: 1 }, next: 'b4_icp4' },
    ],
  },
  b4_icp4: {
    id: 'b4_icp4',
    question: () => 'O que você já tem montado da sua estrutura digital?',
    options: [
      { text: 'Nada ainda', weights: { icp4: 4 }, next: 'insight:icp4' },
      { text: 'Só o Instagram', weights: { icp4: 3 }, next: 'insight:icp4' },
      { text: 'Instagram + um site ou landing', weights: { icp4: 2, icp5: 1 }, next: 'insight:icp4' },
      { text: 'Tenho CRM/processo, mas não anuncio', weights: { icp4: 2, icp5: 2 }, next: 'insight:icp4' },
    ],
  },

  // ── RAMO C — "Já investe" (icp5 ↔ icp6) ──
  c2: {
    id: 'c2',
    question: (n) => (n ? `${n}, você trabalha solo ou gerencia equipe?` : 'Você trabalha solo ou gerencia equipe?'),
    options: [
      { text: 'Trabalho solo', weights: { icp5: 4 }, next: 'c3_icp5' },
      { text: 'Tenho 1–3 corretores comigo', weights: { icp5: 3, icp6: 1 }, next: 'c3_icp5' },
      { text: 'Gerencio equipe de 4–10 corretores', weights: { icp6: 6 }, forceICP: 'icp6', next: 'c3_icp6' },
      { text: 'Imobiliária com mais de 10 corretores', weights: { icp6: 8 }, forceICP: 'icp6', next: 'c3_icp6' },
    ],
  },
  c3_icp5: {
    id: 'c3_icp5',
    question: () => 'Quanto você investe por mês em mídia hoje?',
    options: [
      { text: 'R$1.000 a R$3.000', weights: { icp5: 3 }, next: 'c4_icp5' },
      { text: 'R$3.000 a R$5.000', weights: { icp5: 4 }, next: 'c4_icp5' },
      { text: 'R$5.000 a R$10.000', weights: { icp5: 4, icp6: 1 }, next: 'c4_icp5' },
      { text: 'Mais de R$10.000', weights: { icp5: 3, icp6: 2 }, next: 'c4_icp5' },
    ],
  },
  c4_icp5: {
    id: 'c4_icp5',
    question: () => 'Quem cuida das suas campanhas hoje?',
    options: [
      { text: 'Eu mesmo, no tempo que sobra', weights: { icp5: 4 }, next: 'insight:icp5' },
      { text: 'Um freelancer ou gestor', weights: { icp5: 3 }, next: 'insight:icp5' },
      { text: 'Uma agência, mas não estou satisfeito', weights: { icp5: 2, icp6: 1 }, next: 'insight:icp5' },
      { text: 'Ninguém fixo — vai e volta', weights: { icp5: 3 }, next: 'insight:icp5' },
    ],
  },
  c3_icp6: {
    id: 'c3_icp6',
    question: () => 'Qual o maior desafio de leads pra sua equipe hoje?',
    options: [
      { text: 'Volume previsível todo mês', weights: { icp6: 4 }, next: 'c4_icp6' },
      { text: 'Distribuir leads com critério entre corretores', weights: { icp6: 4 }, next: 'c4_icp6' },
      { text: 'Medir ROI e atribuir vendas às campanhas', weights: { icp6: 4 }, next: 'c4_icp6' },
      { text: 'Reduzir dependência dos portais premium', weights: { icp6: 3, icp2: 1 }, next: 'c4_icp6' },
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
    subtitle: 'Seja honesto — isso personaliza 100% do seu diagnóstico.',
    options: [
      { text: '"Meu negócio é olho no olho. Não preciso de internet pra vender."', weights: { icp1: 8 }, next: 'open' },
      { text: '"Já gasto com portal, não quero mais uma despesa que talvez não funcione."', weights: { icp2: 8 }, next: 'open' },
      { text: '"Já tentei anúncios e joguei dinheiro fora. Preciso de prova que funciona."', weights: { icp3: 8 }, next: 'open' },
      { text: '"Sei que preciso de tráfego pago, mas não sei por onde começar sem errar."', weights: { icp4: 8 }, next: 'open' },
      { text: '"Já faço tráfego, mas sei que não estou tirando o máximo."', weights: { icp5: 8 }, next: 'open' },
      { text: '"Preciso de uma operação profissional com números claros e ROI."', weights: { icp6: 8 }, next: 'open' },
    ],
  },
}

// ════════════════════════════════════════════════════════════════
//  INSIGHTS (1 por jornada, específico do ICP)
// ════════════════════════════════════════════════════════════════

const INSIGHTS: Record<ICPKey, Insight> = {
  icp1: {
    eyebrow: 'UMA VIRADA IMPORTANTE',
    title: '78% dos compradores de alto padrão pesquisam online antes de falar com um corretor.',
    body: 'Sua experiência e seus relacionamentos são o seu maior diferencial — mas hoje eles só funcionam se o cliente te encontra primeiro. Enquanto isso, corretores mais novos estão fechando negócios que cairiam no seu colo, só porque aparecem no Google antes de você. O digital não substitui sua autoridade: ele garante que ela seja encontrada.',
  },
  icp2: {
    eyebrow: 'UMA VIRADA IMPORTANTE',
    title: 'Portal não é marketing digital — é aluguel de vitrine compartilhada.',
    body: 'O custo dos portais subiu mais de 40% em 2 anos enquanto a qualidade caiu. Cada lead que você compra é disputado com 20–30 corretores ao mesmo tempo. Um lead exclusivo via Google custa 30–50% menos e converte até 3x mais — porque só liga pra você. A conta é matemática pura.',
  },
  icp3: {
    eyebrow: 'A VERDADE QUE NINGUÉM TE CONTOU',
    title: 'Impulsionar post NÃO é tráfego pago. São coisas completamente diferentes.',
    body: 'Impulsionar é colocar um cartaz na rua e torcer pra alguém parar. Gestão profissional coloca seu anúncio na frente de quem JÁ está procurando um imóvel na sua faixa, na sua região, agora. Você não falhou — a estratégia é que estava errada. Campanha bem estruturada reduz o custo por lead em 60–80% vs. impulsionamento.',
  },
  icp4: {
    eyebrow: 'O QUE TE TRAVA NÃO É DINHEIRO',
    title: 'Você não precisa de R$10.000/mês pra começar.',
    body: 'Corretores que começam com R$1.500/mês + estratégia certa geram 15–25 leads qualificados no primeiro mês. O que trava não é orçamento — é a ordem das coisas: landing page + pixel + CRM + follow-up, montados ANTES de ligar a campanha. Estrutura primeiro, anúncio depois.',
  },
  icp5: {
    eyebrow: 'ONDE ESTÁ O DINHEIRO NA MESA',
    title: 'Sem otimização avançada, seu CPL provavelmente está 30–50% acima do possível.',
    body: 'Remarketing, públicos lookalike e tracking de conversão offline são o que separam performance boa de performance excepcional. E as 5–10h por semana que você gasta gerenciando campanha poderiam virar 2–3 reuniões a mais com leads qualificados. Você não precisa de convencimento — precisa de tempo de volta.',
  },
  icp6: {
    eyebrow: 'PENSANDO COMO EMPRESÁRIO',
    title: 'Imobiliárias com captação estruturada têm 40% menos turnover de corretores.',
    body: 'Corretor bom fica onde tem lead. O custo de repor um corretor que sai equivale a 3–6 meses de mídia. Operação profissional com tracking permite atribuir cada venda à campanha certa — e decidir onde investir com números, não achismo. É previsibilidade pra sua operação inteira.',
  },
}

// ════════════════════════════════════════════════════════════════
//  PERFIS (nomes dignos voltados ao lead; conteúdo do Mapa de ICPs)
// ════════════════════════════════════════════════════════════════

const profiles: Record<ICPKey, Profile> = {
  icp1: {
    name: 'A Autoridade de Relacionamento',
    tag: 'PRESENÇA DIGITAL A CONSTRUIR',
    icon: '🤝',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #991b1b, #ef4444)',
    headline: 'Seu Maior Ativo Está Virando Seu Maior Risco',
    description:
      'Você construiu uma carreira sólida com relacionamento e confiança pessoal. Isso é raro e valioso. Mas o mercado mudou: corretores mais jovens estão fechando negócios na sua região porque aparecem primeiro quando o cliente pesquisa online.',
    stats: [
      { value: '78%', label: 'dos compradores pesquisam online antes de contatar um corretor' },
      { value: '3', label: 'negócios/mês perdidos em média por corretores sem presença digital' },
      { value: '21x', label: 'mais chance de fechar quando o cliente te encontra primeiro no Google' },
    ],
    actions: [
      'Criar sua vitrine digital — uma landing page que transmita sua autoridade e experiência de 15+ anos',
      'Garantir presença no Google para buscas como "corretor alto padrão [sua região]"',
      'Manter o relacionamento como base e adicionar o digital como amplificador — não substituto',
    ],
    cta: 'Agende uma conversa de 15 min. Vamos mostrar como proteger seu território digital sem mudar o que você faz de melhor.',
  },
  icp2: {
    name: 'O Estrategista de Portais',
    tag: 'PRESENÇA DIGITAL A CONSTRUIR',
    icon: '🧭',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #9a3412, #f97316)',
    headline: 'Você Está Pagando Caro Por Leads Que Não São Seus',
    description:
      'Cada lead que chega pelo portal é disputado por 20-30 corretores simultaneamente. Você precisa ligar em 2 minutos ou perde. E o pior: o portal fica mais caro todo ano enquanto a qualidade cai. Isso não é marketing digital — é aluguel de vitrine compartilhada.',
    stats: [
      { value: '+40%', label: 'de aumento no custo dos portais nos últimos 2 anos' },
      { value: '30', label: 'corretores disputando o mesmo lead que você recebe do portal' },
      { value: '-50%', label: 'custo por lead quando você migra para captação exclusiva' },
    ],
    actions: [
      'Comparar custo real: quanto paga por lead no portal vs. lead exclusivo que só chega pra você',
      'Iniciar campanha de captação própria mantendo o portal como backup — transição gradual',
      'Em 90 dias, ter dados reais para decidir: manter, reduzir ou eliminar portais',
    ],
    cta: 'Receba uma planilha comparativa personalizada: Portal vs. Lead Exclusivo. Os números vão falar por si.',
  },
  icp3: {
    name: 'O Explorador Digital',
    tag: 'PRESENÇA EM DESENVOLVIMENTO',
    icon: '🧪',
    color: '#eab308',
    gradient: 'linear-gradient(135deg, #92400e, #eab308)',
    headline: 'Você Não Falhou — A Estratégia É Que Estava Errada',
    description:
      'O que você fez não foi gestão de tráfego — foi impulsionamento. São coisas completamente diferentes. Impulsionar um post é como colocar um cartaz na rua e torcer pra alguém parar. Gestão profissional coloca seu anúncio na frente de quem JÁ está procurando um imóvel na sua faixa.',
    stats: [
      { value: '80%', label: 'de redução no CPL ao migrar de impulsionamento para gestão profissional' },
      { value: '0', label: 'leads qualificados é o resultado típico de impulsionamento sem estratégia' },
      { value: '30 dias', label: 'para ver os primeiros leads com uma campanha bem estruturada' },
    ],
    actions: [
      'Entender exatamente o que deu errado na sua tentativa anterior (explicamos sem compromisso)',
      'Testar uma campanha piloto de 30 dias com investimento mínimo e landing page dedicada',
      'Ver os primeiros leads qualificados chegando antes de assumir qualquer compromisso longo',
    ],
    cta: 'Diagnóstico gratuito: nos mostre o que você fez antes e explicamos exatamente por que não funcionou.',
  },
  icp4: {
    name: 'O Ambicioso Digital',
    tag: 'PRESENÇA EM DESENVOLVIMENTO',
    icon: '🚀',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #166534, #22c55e)',
    headline: 'Você Tem a Mentalidade Certa — Só Falta a Estrutura',
    description:
      'Você já entende que o digital é o caminho. O que te trava não é falta de vontade — é falta de estrutura e medo de errar com dinheiro que não pode perder. A boa notícia: você não precisa de orçamento alto pra começar. Precisa de estratégia certa.',
    stats: [
      { value: '15-25', label: 'leads qualificados no primeiro mês com apenas R$1.500 de investimento' },
      { value: 'R$50', label: 'por dia é o mínimo para validar o canal com estratégia profissional' },
      { value: '∞', label: 'é o custo de não começar — cada mês sem digital é market share cedido' },
    ],
    actions: [
      'Montar infraestrutura mínima: landing page + pixel + CRM gratuito + processo de follow-up',
      'Iniciar com R$50/dia em Meta Ads focado na sua região e faixa de preço',
      'Em 30 dias ter dados reais: quantos leads, qual custo, qual qualidade — decidir com informação',
    ],
    cta: 'Plano de lançamento personalizado: investimento mínimo, timeline de 30 dias, projeção de resultados. Sem surpresas.',
  },
  icp5: {
    name: 'O Investidor Estratégico',
    tag: 'MATURIDADE DIGITAL',
    icon: '📈',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    headline: 'Seus Resultados Estão Bons — Mas Você Está Deixando Dinheiro na Mesa',
    description:
      'Você já investe, já gera leads, já sabe que funciona. O problema é que gerencia tudo sozinho — e isso custa tempo que deveria estar vendendo. Sem otimização avançada, seu CPL provavelmente é 30-50% maior do que poderia ser.',
    stats: [
      { value: '-40%', label: 'redução média no CPL nos primeiros 60 dias com gestão especializada' },
      { value: '5-10h', label: 'por semana gastas gerenciando campanhas em vez de vendendo' },
      { value: '2-3', label: 'reuniões extras por semana se você delegar a operação para especialista' },
    ],
    actions: [
      'Auditoria completa da sua operação atual: onde estão os gaps que você não está vendo',
      'Transição suave: assumimos a operação sem pausar campanhas — zero downtime',
      'Dashboard personalizado com CPL, taxa de conversão e ROI por campanha',
    ],
    cta: 'Auditoria gratuita: identificamos os 3 maiores gaps de otimização e quanto você está deixando na mesa.',
  },
  icp6: {
    name: 'O Empreendedor Imobiliário',
    tag: 'MATURIDADE DIGITAL',
    icon: '🏢',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #4c1d95, #a855f7)',
    headline: 'Sua Equipe Precisa de Uma Máquina de Leads Previsível',
    description:
      'Você pensa como empresário. Precisa alimentar uma equipe inteira com leads qualificados todos os meses. Se a fonte seca, perde corretores bons para concorrentes. Precisa de operação especializada com ROI claro e dashboard profissional.',
    stats: [
      { value: '-40%', label: 'menos turnover de corretores em imobiliárias com captação digital estruturada' },
      { value: '3-6 meses', label: 'de mídia é o custo equivalente de repor um corretor bom que saiu' },
      { value: '100%', label: 'de rastreabilidade: atribuir vendas reais a campanhas específicas' },
    ],
    actions: [
      'Operação completa: campanhas segmentadas por perfil de comprador e faixa de preço',
      'Dashboard em tempo real com CPL, conversão e ROI por campanha e por corretor',
      'Distribuição inteligente de leads por perfil + tracking até o fechamento',
    ],
    cta: 'Proposta com case real: como uma imobiliária do mesmo porte estruturou captação digital com ROI mensurado.',
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
  const challenge = openAnswer.trim() || 'melhorar a geração de leads qualificados para imóveis'
  const firstName = userName.split(' ')[0]
  const base: Record<ICPKey, string> = {
    icp1: `Olá, Virtual Mark! 🤝\n\nMeu nome é ${firstName} e fiz o diagnóstico — meu perfil é *${profile.name}*.\n\nTenho anos de mercado imobiliário e trabalho com indicações e relacionamento presencial, mas percebi que preciso de presença digital para não perder território.\n\nMeu maior desafio: ${challenge}\n\nGostaria de conversar com um especialista.`,
    icp2: `Olá, Virtual Mark! 🧭\n\nMeu nome é ${firstName} e fiz o diagnóstico — meu perfil é *${profile.name}*.\n\nHoje invisto em portais imobiliários, mas pago caro por leads disputados com dezenas de outros corretores.\n\nMeu maior desafio: ${challenge}\n\nQuero entender como ter leads exclusivos com custo menor.`,
    icp3: `Olá, Virtual Mark! 🧪\n\nMeu nome é ${firstName} e fiz o diagnóstico — meu perfil é *${profile.name}*.\n\nJá tentei impulsionar posts e rodar anúncios, mas não vi resultado claro.\n\nMeu maior desafio: ${challenge}\n\nQuero entender o que deu errado e como fazer gestão de tráfego de verdade.`,
    icp4: `Olá, Virtual Mark! 🚀\n\nMeu nome é ${firstName} e fiz o diagnóstico — meu perfil é *${profile.name}*.\n\nSei que o marketing digital é o caminho, mas ainda não dei o primeiro passo porque não sei como começar.\n\nMeu maior desafio: ${challenge}\n\nQuero um plano de lançamento com investimento mínimo.`,
    icp5: `Olá, Virtual Mark! 📈\n\nMeu nome é ${firstName} e fiz o diagnóstico — meu perfil é *${profile.name}*.\n\nJá faço tráfego pago e gero leads, mas gerencio tudo sozinho e sei que poderia otimizar mais.\n\nMeu maior desafio: ${challenge}\n\nQuero uma auditoria gratuita das minhas campanhas.`,
    icp6: `Olá, Virtual Mark! 🏢\n\nMeu nome é ${firstName} e fiz o diagnóstico — meu perfil é *${profile.name}*.\n\nTenho equipe de corretores e preciso de leads qualificados mensalmente. Preciso de operação profissional.\n\nMeu maior desafio: ${challenge}\n\nGostaria de receber uma proposta personalizada.`,
  }
  return encodeURIComponent(base[profileKey])
}

function StatBar({ label, value, maxVal, color }: { label: string; value: number; maxVal: number; color: string }) {
  const pct = maxVal > 0 ? Math.min((value / maxVal) * 100, 100) : 0
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: '#94a3b8' }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', borderRadius: 3, background: color, width: `${pct}%`, transition: 'width 1.2s ease-out' }} />
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  PÁGINA
// ════════════════════════════════════════════════════════════════

export default function QuizImobiliariaTreePage() {
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
    trackQuiz({ event: 'quiz_name_submitted', has_name: true })
  }

  function go(next: NextTarget) {
    if (next.startsWith('insight:')) {
      const icp = next.split(':')[1] as ICPKey
      setPendingInsight(icp)
      trackQuiz({ event: 'quiz_insight_viewed', branch: branch ?? '', icp })
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
          trackQuiz({ event: 'quiz_branch_entered', branch: opt.branch })
        }
        if (opt.forceICP) setForcedICP(opt.forceICP)
        if (q.id === 'confirm') {
          const picked = (Object.keys(opt.weights) as ICPKey[])[0] ?? null
          setConfirmICP(picked)
        }
        trackQuiz({ event: 'quiz_question_answered', question_id: q.id, branch: branch ?? undefined })
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
    trackQuiz({ event: 'quiz_lead_captured', icp: r.key, adherence: r.adherence })

    // Salva no Supabase — não bloqueia a exibição do resultado.
    try {
      const attribution = getAttribution()
      await supabase.from('quiz_leads').insert([
        {
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
        },
      ])
    } catch (err) {
      console.error('Erro ao salvar quiz_lead:', err)
    }

    setStep('result')
    trackQuiz({ event: 'quiz_result_viewed', icp: r.key, adherence: r.adherence })
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
    background: '#0a0a0a',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    color: '#f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px',
  }

  return (
    <div style={S}>
      {/* Top branding */}
      <div style={{ width: '100%', maxWidth: 560, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <Link to="/imobiliarias" style={{ textDecoration: 'none', fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>
          <span style={{ color: '#ef4444' }}>Virtual</span>Mark
        </Link>
        {step !== 'intro' && step !== 'result' && step !== 'name_step' && (
          <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>DIAGNÓSTICO ESTRATÉGICO</span>
        )}
      </div>

      {/* ── INTRO ── */}
      {step === 'intro' && (
        <div style={{ maxWidth: 520, width: '100%', textAlign: 'center', animation: 'fadeUp .6s ease-out' }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, #dc2626, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 36, boxShadow: '0 12px 40px rgba(239,68,68,0.35)' }}>
            🏠
          </div>
          <div style={{ display: 'inline-block', padding: '6px 18px', borderRadius: 20, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', fontSize: 12, fontWeight: 700, color: '#f87171', marginBottom: 24, letterSpacing: '1px' }}>
            DIAGNÓSTICO ESTRATÉGICO • 3 MINUTOS
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, margin: '0 0 16px', color: '#f1f5f9' }}>
            Descubra Onde Sua Captação de Imóveis de Alto Padrão Está Perdendo Dinheiro
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 12px' }}>
            Responda algumas perguntas e receba um <strong style={{ color: '#e2e8f0' }}>diagnóstico personalizado</strong> para o seu perfil — com o gargalo específico que está travando seu crescimento.
          </p>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 32px' }}>
            Não é um quiz genérico. Identificamos <strong style={{ color: '#94a3b8' }}>6 perfis diferentes</strong> de corretores e entregamos recomendações cirúrgicas para cada um.
          </p>
          <button
            onClick={() => { setStep('name_step'); trackQuiz({ event: 'quiz_start' }) }}
            style={{ width: '100%', maxWidth: 380, padding: '18px 32px', border: 'none', borderRadius: 16, fontSize: 17, fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(135deg, #dc2626, #ef4444)', color: '#fff', boxShadow: '0 6px 28px rgba(239,68,68,0.4)', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            Fazer Meu Diagnóstico →
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20, fontSize: 13, color: '#64748b' }}>
            <span>✓ Gratuito</span><span>✓ Resultado imediato</span><span>✓ Sem compromisso</span>
          </div>
        </div>
      )}

      {/* ── NAME STEP ── */}
      {step === 'name_step' && (
        <div style={{ maxWidth: 520, width: '100%', animation: 'fadeUp .5s ease-out' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#e2e8f0', margin: '0 0 8px' }}>
              Antes de começar, como podemos te chamar?
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Vamos personalizar cada pergunta especialmente para você.</p>
          </div>
          <input
            type="text"
            placeholder="Seu primeiro nome..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleNameSubmit() }}
            style={{ width: '100%', padding: '16px 20px', border: nameInput.trim() ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.12)', borderRadius: 14, background: 'rgba(255,255,255,0.04)', color: '#f1f5f9', fontSize: 18, fontFamily: 'inherit', outline: 'none', textAlign: 'center', boxSizing: 'border-box', marginBottom: 12 }}
            autoFocus
          />
          <button
            onClick={handleNameSubmit}
            disabled={!nameInput.trim()}
            style={{ width: '100%', padding: '15px', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: nameInput.trim() ? 'pointer' : 'not-allowed', background: nameInput.trim() ? 'linear-gradient(135deg, #dc2626, #ef4444)' : 'rgba(255,255,255,0.08)', color: nameInput.trim() ? '#fff' : '#475569', transition: 'all 0.2s', marginBottom: 12 }}
          >
            Continuar →
          </button>
          <button
            onClick={() => { setFirstName(''); setStep('question'); trackQuiz({ event: 'quiz_name_submitted', has_name: false }) }}
            style={{ width: '100%', padding: '10px', border: 'none', background: 'transparent', color: '#475569', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Pular e continuar sem nome
          </button>
        </div>
      )}

      {/* ── QUESTION / OPEN / CAPTURE ── */}
      {(step === 'question' || step === 'open' || step === 'capture') && (
        <div style={{ maxWidth: 560, width: '100%' }}>
          <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', marginBottom: 36, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, width: `${progress}%`, background: 'linear-gradient(90deg, #dc2626, #ef4444)', transition: 'width 0.5s ease' }} />
          </div>

          {step === 'question' && currentQuestion && (
            <div key={currentQuestion.id} style={{ animation: fading ? 'fadeOut .28s ease' : 'fadeUp .4s ease-out' }}>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 10, letterSpacing: '1.5px' }}>
                {firstName ? `OLÁ, ${firstName.toUpperCase()}! • ` : ''}PERGUNTA {Math.min(answeredCount + 1, TOTAL_QUESTIONS)} DE {TOTAL_QUESTIONS}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', lineHeight: 1.35, color: '#e2e8f0' }}>
                {currentQuestion.question(firstName)}
              </h2>
              {currentQuestion.subtitle ? (
                <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px' }}>{currentQuestion.subtitle}</p>
              ) : (
                <div style={{ height: 16 }} />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt, i)}
                    style={{ padding: '13px 16px', border: selected === i ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.08)', borderRadius: 12, background: selected === i ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)', color: '#e2e8f0', fontSize: 14, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 12, lineHeight: 1.4 }}
                    onMouseEnter={(e) => { if (selected !== i) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)' }}
                    onMouseLeave={(e) => { if (selected !== i) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)' }}
                  >
                    <span style={{ width: 26, height: 26, minWidth: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected === i ? '#ef4444' : 'rgba(255,255,255,0.08)', fontSize: 12, fontWeight: 800, color: selected === i ? '#fff' : '#64748b' }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'open' && (
            <div style={{ animation: 'fadeUp .4s ease-out' }}>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 10, letterSpacing: '1.5px' }}>ÚLTIMA PERGUNTA</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', color: '#e2e8f0' }}>
                {firstName ? `${firstName}, se` : 'Se'} pudéssemos resolver UM problema do seu marketing, qual seria?
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>
                Seja específico — isso personaliza seu plano de ação e a mensagem para nosso especialista.
              </p>
              <textarea
                value={openAnswer}
                onChange={(e) => setOpenAnswer(e.target.value)}
                placeholder="Ex: Preciso gerar mais leads qualificados para imóveis acima de R$500 mil na zona sul..."
                style={{ width: '100%', minHeight: 110, padding: 16, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, background: 'rgba(255,255,255,0.04)', color: '#e2e8f0', fontSize: 14, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
              />
              <button
                onClick={() => { setStep('capture'); trackQuiz({ event: 'quiz_open_answered', skipped: !openAnswer.trim() }) }}
                style={{ marginTop: 14, width: '100%', padding: '15px', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: openAnswer.trim() ? 'pointer' : 'default', background: openAnswer.trim() ? 'linear-gradient(135deg, #dc2626, #ef4444)' : 'rgba(255,255,255,0.08)', color: openAnswer.trim() ? '#fff' : '#475569', transition: 'all 0.2s' }}
              >
                Ver Meu Resultado →
              </button>
              <button
                onClick={() => { setStep('capture'); trackQuiz({ event: 'quiz_open_answered', skipped: true }) }}
                style={{ marginTop: 8, width: '100%', padding: '10px', border: 'none', borderRadius: 12, fontSize: 13, cursor: 'pointer', background: 'transparent', color: '#475569', textDecoration: 'underline' }}
              >
                Pular pergunta
              </button>
            </div>
          )}

          {step === 'capture' && (
            <div style={{ animation: 'fadeUp .4s ease-out' }}>
              <div style={{ textAlign: 'center', padding: 24, borderRadius: 16, marginBottom: 28, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>🎯</div>
                <h3 style={{ margin: '0 0 6px', fontSize: 19, color: '#e2e8f0', fontWeight: 700 }}>
                  {firstName ? `${firstName}, seu diagnóstico está pronto!` : 'Seu diagnóstico está pronto!'}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>Preencha seu e-mail e WhatsApp para revelar o resultado completo.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="email" placeholder="Seu melhor e-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '14px 16px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, background: 'rgba(255,255,255,0.04)', color: '#e2e8f0', fontSize: 15, fontFamily: 'inherit', outline: 'none' }} />
                <input type="tel" placeholder="WhatsApp (com DDD)" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ padding: '14px 16px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, background: 'rgba(255,255,255,0.04)', color: '#e2e8f0', fontSize: 15, fontFamily: 'inherit', outline: 'none' }} />
                <button
                  onClick={handleCapture}
                  disabled={!email.trim() || !phone.trim()}
                  style={{ marginTop: 6, padding: '16px', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: email.trim() && phone.trim() ? 'pointer' : 'not-allowed', background: email.trim() && phone.trim() ? 'linear-gradient(135deg, #dc2626, #ef4444)' : 'rgba(255,255,255,0.08)', color: email.trim() && phone.trim() ? '#fff' : '#475569', transition: 'all 0.2s' }}
                >
                  Revelar Meu Diagnóstico 🔓
                </button>
                <p style={{ textAlign: 'center', fontSize: 11, color: '#334155', margin: 0 }}>
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
          <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', marginBottom: 36, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, width: `${progress}%`, background: 'linear-gradient(90deg, #dc2626, #ef4444)', transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ animation: 'fadeUp .5s ease-out', padding: 28, borderRadius: 18, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 16, background: 'rgba(239,68,68,0.14)', fontSize: 11, fontWeight: 800, color: '#f87171', marginBottom: 16, letterSpacing: '1px' }}>
              {INSIGHTS[pendingInsight].eyebrow}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 14px', lineHeight: 1.3, color: '#f1f5f9' }}>{INSIGHTS[pendingInsight].title}</h2>
            <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>{INSIGHTS[pendingInsight].body}</p>
          </div>
          <button
            onClick={continueFromInsight}
            style={{ marginTop: 18, width: '100%', padding: '15px', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(135deg, #dc2626, #ef4444)', color: '#fff', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
          >
            Faz sentido — continuar →
          </button>
        </div>
      )}

      {/* ── RESULT ── */}
      {step === 'result' && profile && result && (
        <div style={{ maxWidth: 580, width: '100%', animation: 'fadeUp .6s ease-out' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{profile.icon}</div>
            <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 16, background: profile.gradient, fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '1px' }}>
              {profile.tag}
            </div>
            <div style={{ display: 'block', padding: '4px 14px', fontSize: 14, fontWeight: 700, color: profile.color, marginBottom: 16 }}>{profile.name}</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px', color: '#e2e8f0', lineHeight: 1.3 }}>
              {firstName ? `${firstName}, ` : ''}{profile.headline}
            </h2>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{profile.description}</p>
          </div>

          <div style={{ padding: 20, borderRadius: 16, marginBottom: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>ANÁLISE DE PERFIL</h3>
            {ICP_KEYS.map((k) => (
              <StatBar key={k} label={profiles[k].name} value={result.totals[k]} maxVal={result.max} color={result.key === k ? profile.color : '#334155'} />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            {profile.stats.map((s, i) => (
              <div key={i} style={{ padding: '16px 12px', borderRadius: 14, textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: profile.color, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: 22, borderRadius: 16, marginBottom: 20, background: `${profile.color}11`, border: `1px solid ${profile.color}30` }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>🎯 Seus 3 Próximos Passos</h3>
            {profile.actions.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < 2 ? 12 : 0 }}>
                <span style={{ width: 24, height: 24, minWidth: 24, borderRadius: 7, flexShrink: 0, background: `${profile.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: profile.color }}>
                  {i + 1}
                </span>
                <p style={{ margin: 0, fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{a}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: 28, borderRadius: 16, background: 'rgba(15,8,8,0.95)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>Quer transformar esse diagnóstico em resultados?</h3>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{profile.cta}</p>
            <a
              href={`https://wa.me/${WPP_NUMBER}?text=${buildWppMessage(result.key, firstName || 'Visitante', openAnswer)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackQuiz({ event: 'quiz_cta_whatsapp', icp: result.key })}
              style={{ display: 'inline-block', padding: '15px 44px', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', boxShadow: '0 6px 28px rgba(34,197,94,0.3)', textDecoration: 'none', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = '' }}
            >
              💬 Falar Com Especialista no WhatsApp
            </a>
            <p style={{ margin: '14px 0 0', fontSize: 12, color: '#64748b' }}>Conversa gratuita de 15 min · Sem compromisso</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32, padding: '16px 0' }}>
            <Link to="/imobiliarias" style={{ textDecoration: 'none', fontSize: 13, color: '#334155', fontWeight: 600, letterSpacing: '2px' }}>
              VIRTUAL MARK • MKT DIGITAL
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px); } }
        input::placeholder, textarea::placeholder { color: #4b5563; }
        input:focus, textarea:focus { border-color: #ef4444 !important; }
      `}</style>
    </div>
  )
}

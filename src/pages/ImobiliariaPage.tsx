import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Target, Globe, BarChart2, TrendingUp } from 'lucide-react'
import { HeroGeometric } from '@/components/ui/shape-landing-hero'
import { BentoGrid } from '@/components/ui/bento-grid'
import type { BentoItem } from '@/components/ui/bento-grid'
import Footer from '../components/Footer'
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const WPP_BASE = 'https://wa.me/5511992794634'

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
  { v: '+400%', l: 'Crescimento em leads qualificados' },
  { v: '30%', l: 'Taxa de conversão em contatos' },
  { v: '+800', l: 'Mensagens no WhatsApp por mês' },
]

const testimonials = [
  {
    name: 'Fernando',
    role: 'CEO, Negócio Imobiliário',
    content:
      'Completando 5 meses de parceria, foi feito um ótimo trabalho ao otimizar nossas campanhas e melhorar nossa presença online. A equipe foi proativa e ajudou a aumentar nossas vendas nesse curto período. Super recomendo!',
    rating: 5,
  },
  {
    name: 'Thiago',
    role: 'Diretor Comercial, Imobiliária',
    content:
      'Parceria consolidada a mais de um ano. A Virtual Mark nos ajudou a melhorar nossa estratégia de Google Ads e Meta Ads, resultando em um aumento consistente nas vendas. A equipe foi eficiente em criar campanhas que realmente funcionaram.',
    rating: 5,
  },
  {
    name: 'Bruno',
    role: 'Corretor Independente',
    content:
      'Ótima empresa, desde 2019 me trazendo um CPA ótimo e novos criativos. Os leads chegam qualificados e o processo de atendimento é muito transparente. Recomendo a todos!',
    rating: 5,
  },
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

const wppMsg = encodeURIComponent(
  'Olá, Virtual Mark! Vim pela página de imobiliárias e quero entender como vocês podem me ajudar a gerar leads qualificados para a minha carteira de imóveis.'
)

export default function ImobiliariaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/quiz-imoveis"
            className="px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg transition-all duration-200 shadow-lg shadow-primary-600/30 hover:-translate-y-0.5"
          >
            Fazer Diagnóstico Gratuito →
          </Link>
          <a
            href={`${WPP_BASE}?text=${wppMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white font-bold text-lg transition-all duration-200"
          >
            💬 Falar com Especialista
          </a>
        </div>
        <p className="text-sm text-white/40 mt-5">
          ✓ Diagnóstico gratuito · ✓ Resultado em 3 minutos · ✓ Sem compromisso
        </p>
      </HeroGeometric>

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
            <p className="text-gray-400 max-w-2xl mx-auto">
              Cada perfil tem uma solução diferente. Saber qual é o seu é o primeiro passo para
              mudar o jogo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map((p, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-900/70 border border-gray-800 rounded-2xl p-7 hover:border-primary-500/30 transition-all duration-300"
              >
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
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── MARKET STATS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-primary-500 bg-primary-500/10 px-4 py-2 rounded-full border border-primary-500/20 mb-5">
              A REALIDADE DO MERCADO IMOBILIÁRIO
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Os Números Que Você Precisa Conhecer
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketStats.map((s, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-primary-500/30 transition-all duration-300"
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
            <p className="text-gray-400 max-w-2xl mx-auto">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-gray-900/30">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-primary-500 bg-primary-500/10 px-4 py-2 rounded-full border border-primary-500/20 mb-5">
              CASE DE SUCESSO
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Resultado Real de Quem{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
                Confiou na VM
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-10">
                <span className="inline-block text-xs font-bold bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full mb-4 tracking-wide">
                  SHOWHOME
                </span>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  De zero a +800 leads qualificados por mês
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  A Showhome, especialista em imóveis de alto padrão, precisava escalar a geração de
                  leads de forma previsível — sem depender de indicações. A VM implementou campanhas
                  segmentadas no Google e Meta com landing pages otimizadas para o perfil premium,
                  integrando WhatsApp Business como canal principal. Resultado em 90 dias: crescimento
                  explosivo com alta qualidade de contatos.
                </p>
                <div className="space-y-3">
                  {[
                    'Campanha Google + Meta segmentada por perfil de comprador premium',
                    'Landing pages com CTA direto para WhatsApp Business',
                    'Processo de nutrição de leads automatizado',
                    'Dashboard semanal com CPL e taxa de conversão',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircleIcon className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-950/50 p-8 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-800">
                <div className="grid grid-cols-1 gap-4">
                  {caseMetrics.map((m, i) => (
                    <div
                      key={i}
                      className="text-center p-5 bg-gray-900/70 rounded-xl border border-gray-800"
                    >
                      <div className="text-3xl font-black text-primary-500 mb-1">{m.v}</div>
                      <div className="text-sm text-gray-400">{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>
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
            style={{
              background: 'linear-gradient(135deg, rgba(15,8,8,0.98), rgba(20,8,8,0.95))',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 0%, rgba(239,68,68,0.11), transparent 60%)',
              }}
            />
            <div className="relative z-10">
              <span className="text-5xl mb-5 block">🎯</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Descubra Seu Perfil e Receba Um{' '}
                <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
                  Plano Personalizado
                </span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
                Identificamos 6 perfis de corretores e imobiliárias. Em 3 minutos você descobre
                exatamente quais são os gargalos que estão travando seu crescimento — e o que fazer
                sobre cada um.
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
              <Link
                to="/quiz-imoveis"
                className="inline-block px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-xl shadow-primary-600/30 hover:-translate-y-0.5"
              >
                Fazer Meu Diagnóstico Gratuito →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/30 to-background">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">
              O Que Nossos Clientes{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
                Dizem
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-900/70 border border-gray-800 rounded-2xl p-7 hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="flex mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-primary-500 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.content}"</p>
                <div className="border-t border-gray-800 pt-4">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
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
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pronto para Parar de Perder{' '}
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
              Negócios
            </span>{' '}
            Para a Concorrência?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Escolha o próximo passo — diagnóstico gratuito ou conversa direta com um especialista.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quiz-imoveis"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/30 hover:-translate-y-0.5"
            >
              Fazer Diagnóstico Gratuito
            </Link>
            <a
              href={`${WPP_BASE}?text=${wppMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg shadow-green-600/30 hover:-translate-y-0.5"
            >
              💬 Falar Agora no WhatsApp
            </a>
          </div>
          <p className="text-gray-600 text-sm mt-5">Conversa gratuita de 15 min · Sem compromisso</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

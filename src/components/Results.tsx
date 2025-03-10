import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

const Results = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [activeCase, setActiveCase] = useState(0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  // Novos Cases
  const cases = [
    {
      // 1) Game Safari
      title: 'Game Safari',
      // Descrição enfatizando foco em vendas e ROI
      description:
        'A Game Safari é especializada na revenda de produtos digitais (ex.: Game Pass, Netflix e outros serviços de streaming). A Virtual Mark implementou estratégias de marketing multicanal para aumentar as vendas e o ROI, otimizando campanhas de conversão tanto no Google quanto no Meta Ads. Também aplicamos técnicas avançadas de remarketing para reter e engajar o público interessado.',
      // Ferramentas utilizadas
      tools: ['Google Ads', 'Meta Ads', 'Marketing de Conteudo', 'Shopfy'],
      // Métricas (exemplos para destacar bons resultados)
      metrics: [
        { value: '+200%', label: 'Aumento de ROI' },
        { value: '+800', label: 'Novos Assinantes Mensais' },
        { value: '+1500', label: 'Vendas Mensais' }
      ],
      // Imagem (16:9) - Sugestão de dimensão: ~1200x675px
      // Substitua por um path real no seu projeto ou um placeholder
      image: '/game-safari.png'
    },
    {
      // 2) Amazônia Vital
      title: 'DDTizz',
      // Descrição enfatizando foco em vendas, ROI, loja de roupa feminina
      description:
        'A Amazônia Vital é uma loja de roupas femininas com forte presença online. Para impulsionar as vendas, trabalhamos campanhas segmentadas voltadas ao público-alvo feminino, otimizando anúncios de catálogo e ações de conversão. Também criamos estratégias de upsell e cross-sell para maximizar o ROI em cada etapa do funil de vendas.',
      // Ferramentas utilizadas
      tools: ['Meta Ads', 'Google Ads', 'Youtube Ads', 'Loja Integrada'],
      // Métricas de exemplo
      metrics: [
        { value: '+250%', label: 'Crescimento em Faturamento' },
        { value: '+1200', label: 'Novas Clientes Fiéis' },
        { value: '+95%', label: 'Aumento na Taxa de Retorno' }
      ],
      // Sugestão de dimensão: ~1200x675px
      image: '/ddtizz.png'
    },
    {
      // 3) Colonial Guararema
      title: 'Colonial Guararema',
      // Descrição enfatizando geração de leads
      description:
        'A Colonial Guararema atua no segmento de materiais de construção e precisava gerar leads qualificados via WhatsApp para o departamento de vendas. Implantamos estratégias de anúncios segmentados, integrando campanhas de captação de leads no Google e no Meta. Além disso, criamos formulários e landing pages otimizadas, direcionando os usuários diretamente para o WhatsApp da equipe comercial.',
      // Ferramentas utilizadas
      tools: ['Google Ads', 'Meta Ads', 'WhatsApp Business', 'Treinameto Personalizado'],
      // Métricas de exemplo
      metrics: [
        { value: '+400%', label: 'Leads Qualificados' },
        { value: '30%', label: 'Taxa de Conversão em Contatos' },
        { value: '+800', label: 'Mensagens no WhatsApp' }
      ],
      // Sugestão de dimensão: ~1200x675px
      image: '/colonial-guararema.png'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-custom">
      <div className="max-w-7xl mx-auto">
        
        {/* Container de animação para o título e subtítulo */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center"
        >
          <motion.p
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-500 text-sm font-medium mb-4 border border-primary-500/20 backdrop-blur-sm"
          >
            Cases de Sucesso
          </motion.p>
          
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Os Resultados
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
              {' '}falam pela gente
            </span>
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-gray-400 max-w-2xl mx-auto mb-12"
          >
            Transformamos estratégias em resultados mensuráveis para nossos clientes
          </motion.p>
        </motion.div>

        {/* Botões para selecionar o case ativo */}
        <motion.div
          variants={containerVariants}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {cases.map((item, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              onClick={() => setActiveCase(index)}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeCase === index
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-900/50 hover:bg-primary-500/20 border border-gray-800'
              }`}
            >
              {item.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Card com informações do case selecionado */}
        <motion.div
          variants={containerVariants}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Título do Case */}
              <h3 className="text-2xl font-bold">{cases[activeCase].title}</h3>
              
              {/* Descrição */}
              <p className="text-gray-400">
                {cases[activeCase].description}
              </p>
              
              {/* Ferramentas utilizadas */}
              <div className="space-y-4">
                <h4 className="font-semibold">Ferramentas Utilizadas:</h4>
                <div className="flex flex-wrap gap-3">
                  {cases[activeCase].tools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              {/* Container da Imagem (aspect-video = 16:9) */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={cases[activeCase].image}
                  alt={`Case study - ${cases[activeCase].title}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {cases[activeCase].metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800"
                  >
                    <div className="text-primary-500 text-2xl font-bold mb-2">
                      {metric.value}
                    </div>
                    <p className="text-gray-400 text-sm">{metric.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Results
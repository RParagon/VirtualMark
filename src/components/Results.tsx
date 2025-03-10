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
        'A Game Safari, um e-commerce especializado na revenda de serviços digitais como Game Pass e assinaturas de streaming, buscava expandir suas vendas sem perder eficiência. A Virtual Mark desenvolveu uma estratégia multicanal voltada à maximização de conversões, combinando campanhas otimizadas no Google e Meta Ads, além de remarketing para reengajar usuários e automações de e-mail para nutrir potenciais clientes. Graças ao monitoramento contínuo de métricas de custo por aquisição (CPA) e retorno sobre investimento (ROI), o resultado foi surpreendente: o ROI duplicou, houve a conquista de mais de 800 novos assinantes mensais e as vendas mensais chegaram a 1500 unidades. Esse crescimento consolidou a Game Safari como referência no mercado de produtos digitais e reforçou seu posicionamento como um e-commerce de alto desempenho.',
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
      // 2) DDtizz
      title: 'DDTizz',
      // Descrição enfatizando foco em vendas, ROI, loja de roupa feminina
      description:
        'A Ddtizz, especializada em soluções de controle de pragas, buscava expandir sua presença digital para atrair mais clientes residenciais e corporativos. A Virtual Mark elaborou um plano integrado que combinou marketing de conteúdo, campanhas segmentadas (Google e redes sociais) e otimização local, garantindo maior visibilidade para quem procurava serviços de dedetização. Páginas otimizadas para conversão e formulários de contato ágeis aceleraram o fechamento de orçamentos, enquanto o remarketing reengajou visitantes interessados. O resultado foi um salto de 60% no tráfego orgânico e um incremento expressivo na taxa de conversão, consolidando a DD Tizz como referência em controle de pragas e intensificando seu relacionamento com potenciais clientes.',
      // Ferramentas utilizadas
      tools: ['Google Ads', 'Social Media', 'WhatsApp'],
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
        'A Colonial Guararema, já reconhecida como referência na área de materiais de construção, precisava potencializar o volume de leads gerados por meio do WhatsApp – canal estratégico para vendas e relacionamento. Para suprir essa demanda, a Virtual Mark implementou uma ação de marketing com foco em campanhas segmentadas no Google e no Meta, cada qual configurada para atrair diferentes perfis do setor de construção civil. Em complemento, foram criados formulários e landing pages otimizadas, permitindo que os usuários interessados chegassem rapidamente ao WhatsApp da equipe comercial, encurtando o ciclo de vendas. O resultado dessa combinação de anúncios bem direcionados, automação de captação e ativos digitais eficientes foi um crescimento de 400% na geração de leads, com conversões atingindo cerca de 30% e mais de 800 mensagens de potenciais clientes recebidas mensalmente. Esse case ilustra como uma estratégia integrada e voltada a resultados pode fortalecer o relacionamento com o público-alvo e consolidar a posição de destaque da Colonial Guararema no competitivo mercado de materiais de construção.',
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

import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useContact } from '../contexts/ContactContext'

const Qualification = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  // Opções do checklist
  const checklistItems = [
    'Aumentar o retorno dos seus investimentos em anúncios pagos',
    'Atrair leads qualificados e aumentar conversões',
    'Elevar a performance de suas campanhas com estratégias avançadas de tráfego pago',
    'Conectar-se de forma eficaz com seu público-alvo',
    'Criar anúncios que se destaquem e gerem resultados'
  ]

  // Estados de seleção
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleToggle = (item: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((it) => it !== item)
        : [...prevSelected, item]
    )
  }

  // Lógica de WhatsApp
  const hasMinimumSelected = selectedItems.length >= 3
  const { contactInfo } = useContact()

  const handleWhatsAppRedirect = () => {
    if (!hasMinimumSelected) return
    const baseMessage = `Olá, tenho interesse em falar com a VirtualMark.\nMarquei as seguintes necessidades:`
    const listItems = selectedItems.map((item) => `\n- ${item}`).join('')
    const finalMessage = `${baseMessage}${listItems}`
    const whatsappURL = `https://api.whatsapp.com/send?phone=${contactInfo.whatsappNumber}&text=${encodeURIComponent(finalMessage)}`
    window.open(whatsappURL, '_blank')
  }

  // Animações: container e itens (checklist)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 }
    }
  }

  // Animação do path do gráfico, fazendo um "pulso"
  const chartPathVariants: Variants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  }

  // Métricas com tilt/escala
  const metricVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        delay: custom, // usa o valor passado para controlar o delay
        duration: 0.7,
        type: 'spring'
      }
    })
  }

  // Lista de métricas flutuantes
  const metrics = [
    { title: 'Conversões', value: '+150%', delay: 0 },
    { title: 'ROI', value: '+250%', delay: 0.3 },
    { title: 'Cliques', value: '+800', delay: 0.6 }
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-black/90 to-gray-900">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="relative max-w-7xl mx-auto z-10"
      >
        {/* Título */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Está na dúvida se a
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text mx-1">
              VirtualMark
            </span>
            é ideal para você?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Marque as alternativas que mais condizem com a sua necessidade atual:
          </p>
        </motion.div>

        {/* Grid principal */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {/* Coluna da esquerda: Checklist */}
          <div className="space-y-6">
            {checklistItems.map((item, index) => {
              const isSelected = selectedItems.includes(item)
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`flex items-center space-x-4 bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border 
                    ${
                      isSelected
                        ? 'border-primary-500/50'
                        : 'border-gray-800 hover:border-primary-500/50'
                    }
                    transition-all duration-300 cursor-pointer
                  `}
                  onClick={() => handleToggle(item)}
                >
                  <CheckCircleIcon
                    className={`h-6 w-6 flex-shrink-0 
                      ${isSelected ? 'text-primary-500' : 'text-gray-600'}
                    `}
                  />
                  <span className="text-gray-300">{item}</span>
                </motion.div>
              )
            })}
          </div>

          {/* Coluna da direita: Notebook + Gráfico + Métricas flutuantes */}
          <motion.div variants={itemVariants} className="relative hidden md:block">
            {/* Notebook com “float” suave */}
            <motion.div
              className="relative w-full max-w-md mx-auto aspect-[16/10] bg-gray-800 rounded-md overflow-hidden border border-gray-700 shadow-lg"
              // Animação de flutuação
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut'
              }}
            >
              {/* Tela do notebook */}
              <div className="absolute inset-0 top-6 bg-black/90 border-b border-gray-700">
                {/* SVG do gráfico */}
                <motion.svg
                  className="w-full h-full p-6"
                  viewBox="0 0 300 150"
                >
                  {/* Eixos */}
                  <line x1="20" y1="130" x2="280" y2="130" stroke="#4b5563" strokeWidth="2"/>
                  <line x1="20" y1="30" x2="20" y2="130" stroke="#4b5563" strokeWidth="2"/>

                  {/* Path do gráfico (com pulso invertendo) */}
                  <motion.path
                    d="M 20 130 Q 60 100 100 90 Q 140 80 180 50 Q 220 30 280 40"
                    fill="none"
                    stroke="url(#gradientChart)"
                    strokeWidth="3"
                    variants={chartPathVariants}
                  />
                  
                  <defs>
                    <linearGradient id="gradientChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </div>
              {/* Base do notebook */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] h-2 bg-gray-700 rounded-b" />
            </motion.div>

            {/* Métricas flutuantes (saindo do notebook) */}
            <div className="relative mt-4 h-40">
              {metrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  custom={metric.delay}
                  variants={metricVariants}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  className="absolute bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-primary-500/30 shadow-xl text-white"
                  style={{
                    left: `${30 + idx * 20}%`,
                    top: `${15 + idx * 15}%`
                  }}
                >
                  <p className="text-sm text-primary-500 mb-1">{metric.title}</p>
                  <p className="text-xl font-bold">{metric.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Botão final -> redireciona para WhatsApp */}
        <motion.div variants={itemVariants} className="text-center">
          <button
            className={`px-8 py-3 text-white rounded-lg font-semibold transition-colors animate-glow shadow-lg shadow-primary-600/20
              ${
                hasMinimumSelected
                  ? 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
                  : 'bg-gray-700 cursor-not-allowed'
              }
            `}
            onClick={handleWhatsAppRedirect}
          >
            Fale Conosco
          </button>
          {!hasMinimumSelected && (
            <p className="text-sm text-gray-500 mt-2">
              Selecione pelo menos 3 opções para continuar.
            </p>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Qualification

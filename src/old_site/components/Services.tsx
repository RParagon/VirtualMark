import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRef } from 'react'
import {
  RocketLaunchIcon,
  ChartBarIcon,
  GlobeAltIcon,
  DocumentChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      rotateZ: 1,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      rotateY: 5,
      boxShadow: "0 25px 35px -5px rgba(239, 68, 68, 0.2), 0 15px 15px -5px rgba(239, 68, 68, 0.1)",
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const consultingBlocks = [
    {
      title: 'Consultoria',
      description: 'Análise estratégica personalizada para identificar oportunidades de crescimento e otimizar processos.'
    },
    {
      title: 'Dados',
      description: 'Transformação de dados brutos em insights acionáveis para decisões mais precisas e estratégicas.'
    },
    {
      title: 'Tecnologia',
      description: 'Implementação de soluções inovadoras para automatizar processos e ampliar eficiência.'
    }
  ]

  const pillars = [
    {
      title: 'Tráfego',
      description: 'Atração vai além de anúncios, envolve diversas ações como otimização de site e parcerias.'
    },
    {
      title: 'Engajamento',
      description: 'Acompanhamos a interação do usuário em todos os pontos de contato para otimizar resultados.'
    },
    {
      title: 'Conversão',
      description: 'Análise completa do funil de conversão para maximizar resultados e reduzir custos.'
    },
    {
      title: 'Retenção',
      description: 'Estratégias personalizadas de pós-venda para garantir a fidelização e recorrência.'
    }
  ]

  const metrics = [
    { label: 'Vendas', value: 'R$ 618.000,91' },
    { label: 'Conversões', value: '14.322' }
  ]

  return (
    <section id="service" ref={containerRef} className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-custom overflow-hidden">
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent pointer-events-none"
      />
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="relative max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-24">
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-500 text-sm font-medium mb-4 border border-primary-500/20 backdrop-blur-sm"
          >
            <SparklesIcon className="w-4 h-4" />
            Nossos Serviços
          </motion.span>
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            O que a <span className="text-gradient">Virtual Mark</span> pode fazer por você?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transforme sua presença digital com soluções personalizadas e resultados mensuráveis
          </p>
        </motion.div>

        {/* Phone Mockup and Metrics */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24"
        >
          {/* Left Column - Phone Mockup */}
          <motion.div variants={itemVariants} className="relative flex justify-center">
            <div className="relative w-[300px] h-[600px] bg-gray-900/50 backdrop-blur-sm rounded-[40px] border-4 border-gray-800 overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl" />
              <div className="p-4 h-full bg-gradient-to-b from-primary-500/10 to-transparent">
                <img
                  src="mockup-analytics.png"
                  alt="Analytics Dashboard"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>
            {/* Floating Metric Cards */}
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`absolute ${index === 0 ? 'top-1/4 -left-4' : 'bottom-1/4 -right-4'} bg-gray-900/90 backdrop-blur-sm p-4 rounded-xl border border-gray-800 shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer`}
              >
                <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
                <p className="text-xl font-bold text-primary-500">{metric.value}</p>
              </motion.div>
            ))}
          </motion.div>
        
          {/* Right Column - Featured Services */}
          <motion.div variants={containerVariants} className="flex flex-col gap-8">
            {/* Tráfego Pago Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 transform transition-all duration-300"
            >
              <RocketLaunchIcon className="w-12 h-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Tráfego Pago</h3>
              <p className="text-gray-400">Gestão dos seus anúncios online no Google, Instagram, Linkedin, Pinterest, YouTube e mais. Atraímos seus clientes para seu funil de vendas com estratégias otimizadas.</p>
            </motion.div>
            {/* CRM Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 transform transition-all duration-300"
            >
              <ChartBarIcon className="w-12 h-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Dashboard Personalizado</h3>
              <p className="text-gray-400">Descubra o poder dos seus dados com uma visualização completa e feita sob medida. Identifique oportunidades, conecte-se estrategicamente com seu público e impulsione resultados, transformando cada insight em crescimento e inovação para seu negócio.</p>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Additional Services Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* Sites e Landing Pages Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 transform transition-all duration-300"
          >
            <GlobeAltIcon className="w-12 h-12 text-primary-500 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Sites e Landing Pages</h3>
            <p className="text-gray-400">Páginas web otimizadas para converter visitantes em clientes, utilizando elementos estratégicos e calls-to-action eficientes.</p>
          </motion.div>
          {/* Criativos para Anúncios Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 transform transition-all duration-300"
          >
            <DocumentChartBarIcon className="w-12 h-12 text-primary-500 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Criativos para Anúncios</h3>
            <p className="text-gray-400">Elementos visuais e textuais estratégicos para suas campanhas, desenvolvidos para maximizar conversões e resultados.</p>
          </motion.div>
        </motion.div>

        {/* Consulting Section */}
        <motion.div variants={containerVariants} className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {consultingBlocks.map((block, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-primary-500 font-bold text-xl">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{block.title}</h3>
                <p className="text-gray-400">{block.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pillars Section */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <motion.h3 variants={itemVariants} className="text-3xl font-bold mb-6">
              Tudo o que fazemos é baseado em
              <span className="text-gradient block mt-2">4 Pilares</span>
            </motion.h3>
            <motion.p variants={itemVariants} className="text-gray-400">
              Nossa metodologia é fundamentada em quatro pilares essenciais que garantem resultados consistentes e crescimento sustentável para o seu negócio.
            </motion.p>
          </div>
          <div className="lg:col-span-3 relative">
            <div className="absolute left-9 top-0 bottom-0 w-px bg-gray-800" />
            <div className="space-y-12">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative pl-24"
                >
                  <div className="absolute left-8 top-1/2 w-3 h-3 bg-primary-500 rounded-full transform -translate-y-1/2" />
                  <h4 className="text-xl font-semibold mb-2 text-primary-500">{pillar.title}</h4>
                  <p className="text-gray-400">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Services

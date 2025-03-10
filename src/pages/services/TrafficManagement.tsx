import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useService } from '../../contexts/ServiceContext'
import { useContact } from '../../contexts/ContactContext'
import {
  ChartBarIcon,
  RocketLaunchIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  ArrowsPointingOutIcon,
  BeakerIcon,
  LightBulbIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'

const TrafficManagement = () => {
  const { setCurrentService } = useService()
  const { } = useContact()

  useEffect(() => {
    setCurrentService('Gestão de Tráfego')
    return () => setCurrentService('')
  }, [setCurrentService])

  // Enhanced container variants with spring animation
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
        staggerChildren: 0.2
      }
    }
  }

  // Animação genérica para itens que surgem com fade + slide
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  // Animação para seções que "pulsam" ou flutuam levemente ao passar o mouse
  const hoverVariants = {
    hover: {
      scale: 1.03,
      y: -5,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  }

  // Dados de métricas (para a Seção de Métricas)
  const metrics = [
    { icon: ChartBarIcon, value: '350%', label: 'ROI Médio' },
    { icon: RocketLaunchIcon, value: '10x', label: 'Aumento em Leads' },
    { icon: ArrowTrendingUpIcon, value: '-40%', label: 'Redução de CPA' }
  ]

  // Dados dos benefícios da gestão de tráfego profissional
  const trafficBenefits = [
    { 
      icon: GlobeAltIcon, 
      title: 'Maior Alcance', 
      description: 'Expandimos a visibilidade da sua marca para além dos meios tradicionais, alcançando novos públicos e potenciais clientes.'
    },
    { 
      icon: CurrencyDollarIcon, 
      title: 'Otimização de Recursos', 
      description: 'Utilizamos ferramentas e análises avançadas para investir seu orçamento de forma inteligente, evitando desperdícios.'
    },
    { 
      icon: ChartPieIcon, 
      title: 'Resultados Mensuráveis', 
      description: 'Você acompanha de perto métricas-chave (ROI, CPC, CAC e outras), garantindo transparência e otimização contínua.'
    },
    { 
      icon: ArrowsPointingOutIcon, 
      title: 'Escalabilidade', 
      description: 'À medida que os resultados aparecem, escalamos as campanhas para ampliar ainda mais seu faturamento.'
    }
  ]

  // Dados do processo de excelência
  const processSteps = [
    {
      number: '1',
      title: 'Análise e Planejamento',
      description: 'Entendemos a fundo o seu negócio, público-alvo e metas. Em seguida, definimos a melhor estratégia de canais (Google Ads, Facebook Ads, Instagram, YouTube, etc.).'
    },
    {
      number: '2',
      title: 'Criação das Campanhas',
      description: 'Desenvolvemos anúncios personalizados que falam diretamente com o seu público, aumentando as chances de conversão.'
    },
    {
      number: '3',
      title: 'Otimização Contínua',
      description: 'Acompanhamos diariamente os resultados e ajustamos as campanhas para garantir o melhor retorno sobre o investimento.'
    },
    {
      number: '4',
      title: 'Relatórios e Transparência',
      description: 'Você tem acesso a relatórios claros e objetivos, entendendo exatamente como está o desempenho das suas campanhas.'
    }
  ]

  // Dados dos diferenciais da Virtual Mark
  const virtualMarkDifferentials = [
    {
      icon: BeakerIcon,
      title: 'Metodologia Exclusiva',
      description: 'Analisamos dados em profundidade para criar estratégias sob medida para o seu negócio.'
    },
    {
      icon: UserGroupIcon,
      title: 'Orientação Completa',
      description: 'Oferecemos suporte e consultoria constante, ajudando você a tomar decisões baseadas em resultados.'
    },
    {
      icon: LightBulbIcon,
      title: 'Alinhamento com o seu Objetivo',
      description: 'Se a sua meta é vender mais, gerar leads ou fortalecer sua marca, nosso foco é um só: entregar esse resultado.'
    }
  ]

  // Dados dos depoimentos
  const testimonials = [
    {
      name: 'Fernando',
      role: 'CEO, Negócio Local',
      content: 'Completando 5 meses de parceria, foi feito um ótimo trabalho ao otimizar nossas campanhas e melhorar nossa presença online. A equipe foi proativa e ajudou a aumentar nossas vendas nesse curto período. Super recomendo!',
      rating: 5
    },
    {
      name: 'Thiago',
      role: 'CEO, E-commerce',
      content: 'Parceria consolidada a mais de um ano. A equipe da Virtual Mark nos ajudou a melhorar nossa estratégia de Google Ads e Meta Ads, resultando em um aumento consistente nas vendas. A equipe foi eficiente em criar campanhas que realmente funcionaram para nossa loja online.',
      rating: 5
    },
    {
      name: 'Bruno',
      role: 'CEO, E-commerce',
      content: 'Ótima empresa, desde 2019 me trazendo um CPA ótimo e novos criativos, recomendo a todos!',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-custom flex flex-col relative">
      {/* Fundo animado adicional (opcional) */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 20% 50%, rgba(239,68,68,0.2), transparent 40%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.2), transparent 30%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
        {/* Radial de fundo (hero) */}
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Gestão de
              <span className="text-gradient"> Tráfego </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Na VirtualMark, impulsionamos suas campanhas de anúncios para o
              próximo nível, combinando inteligência de dados e estratégias
              altamente segmentadas. Converta tráfego em <strong>resultados reais </strong>
              e maximize seu ROI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Métricas */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={{...itemVariants, hover: hoverVariants.hover}}
                whileHover="hover"
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center relative overflow-hidden"
              >
                {/* Efeito sutil de "brilho" atrás do ícone */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(239,68,68,0.05), transparent 60%)'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: 'linear'
                  }}
                />
                <metric.icon className="w-12 h-12 text-primary-500 mx-auto mb-4 relative z-10" />
                <p className="text-3xl font-bold text-primary-500 mb-2 relative z-10">
                  {metric.value}
                </p>
                <p className="text-gray-400 relative z-10">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Por que você precisa de uma gestão de tráfego profissional? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-white text-center">
              Por que você precisa de uma
              <span className="text-gradient"> gestão de tráfego profissional</span>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trafficBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
                  whileHover="hover"
                  variants={hoverVariants}
                >
                  <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                    <benefit.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                  {/* Luz suave no fundo */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(239,68,68,0.05), transparent 60%)'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 30,
                      ease: 'linear'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Plataformas e Processo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Plataformas */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-white">
              Domínio em Diversas Plataformas
            </h2>
            <p className="text-gray-400 mb-8 max-w-3xl">
              Nós da <strong>VirtualMark</strong> utilizamos as principais
              platafor
              mas de anúncios para garantir abrangência máxima e
              resultados sólidos. Seja no Google, Meta ou outras redes,
              desenvolvemos campanhas que conversam com o público certo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Google Ads
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li>• Campanhas de Search</li>
                  <li>• Display Network</li>
                  <li>• YouTube Ads</li>
                  <li>• Performance Max</li>
                </ul>
              </motion.div>

              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Meta Ads
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li>• Facebook Ads</li>
                  <li>• Instagram Ads</li>
                  <li>• Messenger Ads</li>
                  <li>• Remarketing</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Processo */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-white">
              Nosso Processo de Excelência
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
                  whileHover="hover"
                  variants={hoverVariants}
                >
                  <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                    <span className="text-primary-500 font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                  {/* Luz suave no fundo */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(239,68,68,0.05), transparent 60%)'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 30,
                      ease: 'linear'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Por que Escolher a Virtual Mark? */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-white text-center">
              Por que Escolher a <span className="text-gradient">Virtual Mark</span>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {virtualMarkDifferentials.map((differential, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
                  whileHover="hover"
                  variants={hoverVariants}
                >
                  <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                    <differential.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{differential.title}</h3>
                  <p className="text-gray-400">{differential.description}</p>
                  {/* Luz suave no fundo */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(239,68,68,0.05), transparent 60%)'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 30,
                      ease: 'linear'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Depoimentos */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-white text-center">
              Depoimentos de quem <span className="text-gradient">confiou na Virtual Mark</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 card-hover"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-primary-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                  <div className="border-t border-gray-800 pt-6">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Final */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl font-extrabold mb-6 text-white">
              Pronto para Inovar seu Tráfego?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Fale com um de nossos especialistas aqui da{' '}
              <span className="font-bold">VirtualMark</span> e descubra como
              nossa abordagem futurista de anúncios pode levar seu negócio a
              resultados extraordinários.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold
                         hover:bg-gray-100 transition-colors duration-300 transform hover:-translate-y-1
                         shadow-lg shadow-primary-700/30"
            >
              Fale com um Especialista
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

export default TrafficManagement

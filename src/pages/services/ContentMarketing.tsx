import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
  DocumentTextIcon,
  GlobeAltIcon,
  MegaphoneIcon,
  ChartBarIcon,
  CalendarIcon,
  PencilSquareIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline'


const ContentMarketing = () => {
  // Enhanced container variants with spring physics
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

  // Enhanced item variants with 3D effects
  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.5,
        duration: 0.8
      }
    }
  }

  // Enhanced hover variants with spring physics
  const hoverVariants = {
    hover: {
      scale: 1.03,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        mass: 0.5,
        duration: 0.3
      }
    }
  }

  // Dados de tipos de conteúdo
  const contentTypes = [
    {
      icon: DocumentTextIcon,
      title: 'Blog Posts',
      description: 'Posts aprofundados e otimizados para SEO, elevando sua autoridade'
    },
    {
      icon: GlobeAltIcon,
      title: 'Redes Sociais',
      description: 'Calendário editorial estratégico para engajar e converter'
    },
    {
      icon: MegaphoneIcon,
      title: 'Email Marketing',
      description: 'Sequências automatizadas e campanhas personalizadas'
    }
  ]

  // Dados do processo em 4 passos
  const processSteps = [
    {
      icon: ChartBarIcon,
      title: 'Análise de Objetivo e Personas',
      description: 'Definimos claramente o que sua marca deseja alcançar (vendas, engajamento, fortalecimento de marca etc.) e traçamos o perfil detalhado das personas para quem produziremos conteúdo.'
    },
    {
      icon: CalendarIcon,
      title: 'Planejamento de Calendário Editorial',
      description: 'Criamos um cronograma estratégico de pautas, formatos (blog posts, e-books, infográficos, vídeos) e datas de publicação, garantindo consistência e relevância ao longo do tempo.'
    },
    {
      icon: PencilSquareIcon,
      title: 'Criação e Publicação',
      description: 'Nossa equipe de redatores e designers produz conteúdos otimizados para SEO e adequados ao tom de voz da sua marca. Em seguida, publicamos nos canais mais apropriados para alcançar sua audiência.'
    },
    {
      icon: PresentationChartLineIcon,
      title: 'Análise de KPIs Orgânicos e Relatórios',
      description: 'Acompanhamos métricas como visitas, tempo de permanência, taxa de conversão e compartilhamentos. Geramos relatórios para ajustes contínuos, visando maximizar o impacto de cada conteúdo.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-custom flex flex-col relative">
      {/* Fundo radial animado adicional */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 30% 60%, rgba(239,68,68,0.2), transparent 40%), radial-gradient(circle at 70% 30%, rgba(59,130,246,0.2), transparent 40%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
        {/* Radial no Hero */}
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Marketing de
              <span className="text-gradient"> Conteúdo </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              A <strong>VirtualMark</strong> cria e distribui conteúdos estratégicos para
              atrair, engajar e converter seu público. Construa autoridade e
              fortaleça seu relacionamento com clientes através de histórias bem
              contadas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tipos de Conteúdo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contentTypes.map((ct, index) => (
              <motion.div
                key={index}
                variants={{ ...itemVariants, hover: hoverVariants.hover }}
                whileHover="hover"
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center relative overflow-hidden"
              >
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
                <ct.icon className="w-12 h-12 text-primary-500 mx-auto mb-4 relative z-10" />
                <h3 className="text-xl font-semibold mb-2 text-white relative z-10">
                  {ct.title}
                </h3>
                <p className="text-gray-400 relative z-10">{ct.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Nosso Processo em 4 Passos */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-6 text-white">
              Nosso Processo em <span className="text-gradient">4 Passos</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Metodologia estruturada para garantir que seu conteúdo gere resultados consistentes e mensuráveis
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden flex flex-col h-full"
              >
                {/* Número do passo com efeito de gradiente */}
                <div className="absolute -top-6 -left-6 w-24 h-24 flex items-center justify-center opacity-10">
                  <span className="text-8xl font-bold text-gradient">{index + 1}</span>
                </div>
                
                {/* Luz de fundo animada */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: index % 2 === 0 
                      ? 'radial-gradient(circle, rgba(239,68,68,0.05), transparent 60%)'
                      : 'radial-gradient(circle, rgba(59,130,246,0.05), transparent 60%)'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 30,
                    ease: 'linear'
                  }}
                />
                
                <step.icon className="w-12 h-12 text-primary-500 mb-4 relative z-10" />
                <h3 className="text-xl font-semibold mb-3 text-white relative z-10">
                  {step.title}
                </h3>
                <p className="text-gray-400 relative z-10 flex-grow">{step.description}</p>
                
                {/* Linha conectora entre os passos (visível apenas em desktop) */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-transparent z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Seções adicionais */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Estratégia */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-white">
              Estratégia de Conteúdo
            </h2>
            <p className="text-gray-400 max-w-3xl mb-8">
              Planejamos cada etapa do funil, criando conteúdos que falam a
              língua do seu público. Do blog ao social media, tudo é otimizado
              para engajamento e conversão.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 relative overflow-hidden"
                whileHover="hover"
                variants={hoverVariants}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Planejamento Editorial
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li>• Calendário integrado</li>
                  <li>• Personas e jornada do cliente</li>
                  <li>• Palavras-chave estratégicas</li>
                  <li>• Análise de concorrência</li>
                </ul>
                {/* Luz suave */}
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

              <motion.div
                className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 relative overflow-hidden"
                whileHover="hover"
                variants={hoverVariants}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Distribuição e Engajamento
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li>• Social Media e Influencers</li>
                  <li>• SEO e link building</li>
                  <li>• Email Marketing segmentado</li>
                  <li>• Parcerias estratégicas</li>
                </ul>
                {/* Luz suave */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(59,130,246,0.05), transparent 60%)'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 30,
                    ease: 'linear'
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl font-extrabold mb-6 text-white">
              Quer Produzir Conteúdos que Convertem?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              A <strong>VirtualMark</strong> está pronta para levar sua
              estratégia de conteúdo ao próximo nível. Fale com a gente agora e
              conquiste resultados orgânicos e duradouros.
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

export default ContentMarketing

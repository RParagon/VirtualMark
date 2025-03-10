import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
  ChartBarIcon,
  LightBulbIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline'

const DigitalConsulting = () => {
  // Container e item
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
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

  // Hover
  const hoverVariants = {
    hover: {
      scale: 1.03,
      y: -5,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  }

  // Services data
  const services = [
    {
      icon: ChartBarIcon,
      title: 'Análise de Mercado',
      description: 'Estudo aprofundado de tendências e oportunidades'
    },
    {
      icon: LightBulbIcon,
      title: 'Diagnóstico Digital',
      description: 'Avaliação 360° da presença online e pontos de melhoria'
    },
    {
      icon: PresentationChartLineIcon,
      title: 'Planejamento',
      description: 'Estratégias sob medida para escalar resultados'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-custom flex flex-col relative">
      {/* Fundo radial animado */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 25% 50%, rgba(239,68,68,0.2), transparent 40%), radial-gradient(circle at 75% 30%, rgba(59,130,246,0.2), transparent 40%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      <Navbar />

      {/* Hero */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Consultoria
              <span className="text-gradient"> Digital </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              A <strong>VirtualMark</strong> oferece análises e diagnósticos
              profundos para reposicionar seu negócio no ambiente online. Vamos
              além de recomendações — desenhamos todo o caminho até a
              implementação.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComp = service.icon
              return (
                <motion.div
                  key={index}
                  variants={{ ...itemVariants, hover: hoverVariants.hover }}
                  whileHover="hover"
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center relative overflow-hidden"
                >
                  {/* Luz suave girando */}
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
                  <IconComp className="w-12 h-12 text-primary-500 mx-auto mb-4 relative z-10" />
                  <h3 className="text-xl font-semibold mb-2 text-white relative z-10">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 relative z-10">{service.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Metodologia */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-16 text-left">
            <h2 className="text-3xl font-extrabold mb-8 text-white">
              Nossa Metodologia
            </h2>
            <p className="text-gray-400 max-w-3xl mb-8">
              Realizamos um mergulho profundo no seu segmento, identificando
              oportunidades e riscos. Em seguida, criamos um roadmap de
              transformação digital completo, cobrindo desde o marketing até a
              infraestrutura.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 relative overflow-hidden"
                whileHover="hover"
                variants={hoverVariants}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Análise Inicial
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li>• Avaliação de Mercado e Concorrência</li>
                  <li>• Auditoria de Presença Online</li>
                  <li>• Identificação de KPIs</li>
                  <li>• Revisão de Ferramentas Digitais</li>
                </ul>
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
                  Planejamento Estratégico
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li>• Definição de Objetivos</li>
                  <li>• Adoção de Tecnologias</li>
                  <li>• Cronograma de Implementação</li>
                  <li>• Alinhamento de Equipe</li>
                </ul>
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
              Quer Transformar seu Negócio Digitalmente?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              A <strong>VirtualMark</strong> está aqui para mapear seu caminho e
              conduzir cada etapa da transformação. Fale com a gente agora.
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

export default DigitalConsulting

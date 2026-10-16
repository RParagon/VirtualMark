import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

const Assessment = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const handleAssessmentRequest = () => {
    window.location.href = '/contact'
  }

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

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-custom">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants}>
            <ClipboardDocumentCheckIcon className="w-16 h-16 text-primary-500 mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Avaliação
              <span className="text-gradient"> Gratuita </span>
              do Seu Negócio
            </h2>
            <p className="text-gray-400 mb-8">
              Descubra como podemos ajudar seu negócio a crescer. Nossa equipe fará uma análise completa da sua presença digital e identificará oportunidades de crescimento.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3 text-gray-300">
                <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Análise completa das suas redes sociais</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Avaliação da sua estratégia atual</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Recomendações personalizadas</span>
              </li>
            </ul>
            <button
              onClick={handleAssessmentRequest}
              className="button-primary"
            >
              Solicitar avaliação gratuita
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative hidden md:block"
          >
            <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent animate-pulse" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 card-hover">
              <h3 className="text-xl font-semibold mb-4">O que você receberá:</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary-500 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Relatório Detalhado</h4>
                    <p className="text-gray-400 text-sm">Análise completa da sua presença digital atual</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary-500 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Plano de Ação</h4>
                    <p className="text-gray-400 text-sm">Estratégias personalizadas para seu crescimento</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary-500 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Consultoria</h4>
                    <p className="text-gray-400 text-sm">30 minutos de consultoria com nosso especialista</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Assessment
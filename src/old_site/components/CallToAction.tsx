import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'

const CallToAction = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const handleConsultationRequest = () => {
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
        className="max-w-7xl mx-auto text-center"
      >
        <motion.div
          variants={itemVariants}
          className="bg-gray-900/50 backdrop-blur-sm p-12 rounded-2xl border border-gray-800 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Pronto para
            <span className="text-gradient"> Transformar </span>
            seu Negócio?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Agende uma consulta gratuita e descubra como podemos ajudar sua empresa a alcançar novos patamares
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleConsultationRequest}
              className="button-primary"
            >
              Agendar Consulta Gratuita
            </button>
            <Link
              to="/cases"
              className="button-secondary"
            >
              Ver Mais Cases
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default CallToAction
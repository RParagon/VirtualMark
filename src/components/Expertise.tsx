import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { BoltIcon, PresentationChartLineIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline'

const Expertise = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

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

  const expertiseAreas = [
    {
      icon: BoltIcon,
      title: 'Estratégia Digital',
      description: 'Desenvolvemos estratégias personalizadas para maximizar seu potencial online'
    },
    {
      icon: PresentationChartLineIcon,
      title: 'Análise de Dados',
      description: 'Tomada de decisão baseada em dados para otimizar suas campanhas'
    },
    {
      icon: CursorArrowRaysIcon,
      title: 'Otimização de Conversão',
      description: 'Aumente suas taxas de conversão com técnicas comprovadas'
    }
  ]

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
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Nossa
            <span className="text-gradient"> Expertise </span>
            em Marketing Digital
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Combinamos conhecimento técnico com criatividade para entregar resultados excepcionais
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {expertiseAreas.map((area, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 card-hover"
            >
              <area.icon className="w-12 h-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4">{area.title}</h3>
              <p className="text-gray-400">{area.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Expertise
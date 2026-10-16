import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ChartBarIcon } from '@heroicons/react/24/outline'

const Hero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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

  const stats = [
    { title: '+10 Milhões', subtitle: 'Faturados para nossos Clientes' },
    { title: '+1,5 Milhões', subtitle: 'Investidos em anúncios' },
    { title: '+5 Mil', subtitle: 'Anúncios criados no Google & Meta' }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: 0.80,
          scale: 1,
          x: 0
        }}
        transition={{ 
          duration: 1.5,
          ease: 'easeOut'
        }}
        className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat z-0 scale-100"
      />
      <div className="absolute inset-0 bg-gradient-radial from-primary-950/30 via-background to-background z-0" />
      
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="relative z-10 max-w-7xl mx-auto text-center"
        style={{ position: 'relative' }}
      >
        <motion.span
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-sm font-medium mb-4 border border-primary-500/20 backdrop-blur-sm"
        >
          <ChartBarIcon className="w-5 h-5 text-primary-500" />
          <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 text-transparent bg-clip-text font-semibold">Marketing Digital</span>
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
        >
          O <span className="text-primary-500">X</span> da Questão é
          <br />
          <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
            Vender Mais
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Tenha uma equipe especializada para o seu sucesso.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <a href="/#service" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors animate-glow shadow-lg shadow-primary-600/20">
            Quero mais informações
          </a>
          <Link to="/cases" className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
            Ver cases de sucesso
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-primary-500/50 transition-colors animate-float shadow-xl"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-primary-500 mb-2">
                {stat.title}
              </h3>
              <p className="text-gray-400">{stat.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
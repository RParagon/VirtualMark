import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useCases } from '../contexts/CaseContext'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CaseDetailPage = () => {
  const { slug } = useParams()
  const { getCaseBySlug, loading } = useCases()
  const case_ = getCaseBySlug(slug || '')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-custom flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500" />
      </div>
    )
  }

  if (!case_) {
    return (
      <div className="min-h-screen bg-gradient-custom flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Case não encontrado</h2>
          <Link to="/cases" className="text-primary-500 hover:text-primary-400">
            Voltar para casos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-custom flex flex-col">
      <Navbar />
      {/* Hero Section with Full-width Image */}
      <motion.div 
        className="relative h-[60vh] overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="absolute inset-0"
          variants={imageVariants}
        >
          <img
            src={case_.image_url}
            alt={case_.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </motion.div>
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-8"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/cases"
                className="inline-flex items-center text-white mb-6 hover:text-primary-500 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Voltar para casos
              </Link>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {case_.title}
            </motion.h1>
            <motion.div 
              className="flex flex-wrap gap-3 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {case_.tools.map((tool, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {tool}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold mb-6">O Desafio</h2>
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: case_.challenge }}
              />
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold mb-6">Nossa Solução</h2>
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: case_.solution }}
              />
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold mb-6">Resultados Alcançados</h2>
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: case_.results }}
              />
            </motion.section>

            {/* Gallery Section */}
            {case_.gallery && case_.gallery.length > 0 && (
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-6">Galeria</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {case_.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${case_.title} - Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right Column - Metrics and Info */}
          <div className="space-y-8">
            {/* Client Info Card */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800"
            >
              <h3 className="text-xl font-semibold mb-4">Informações do Cliente</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Cliente</p>
                  <p className="font-medium">{case_.client_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Indústria</p>
                  <p className="font-medium">{case_.client_industry}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Porte da Empresa</p>
                  <p className="font-medium">{case_.client_size}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Duração do Projeto</p>
                  <p className="font-medium">{case_.duration}</p>
                </div>
              </div>
            </motion.div>

            {/* Metrics Card */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800"
            >
              <h3 className="text-xl font-semibold mb-4">Métricas Principais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {case_.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-800/50 rounded-lg text-center"
                  >
                    <p className="text-2xl font-bold text-primary-500">
                      {metric.value}
                    </p>
                    <p className="text-sm text-gray-400">{metric.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Testimonial Card */}
            {case_.client_testimonial && (
              <motion.div
                variants={itemVariants}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800"
              >
                <h3 className="text-xl font-semibold mb-4">Depoimento do Cliente</h3>
                <blockquote className="text-gray-300 italic mb-4">
                  "{case_.client_testimonial}"
                </blockquote>
                <p className="font-medium">{case_.client_name}</p>
                {case_.client_role && (
                  <p className="text-sm text-gray-400">{case_.client_role}</p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  )
}

export default CaseDetailPage
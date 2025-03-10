import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCases } from '../contexts/CaseContext'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CasesPage = () => {
  const { cases, loading } = useCases()
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const industries = ['all', ...new Set(cases.map(c => c.client_industry))]

  const filteredCases = cases.filter(c => {
    const matchesIndustry = selectedIndustry === 'all' || c.client_industry === selectedIndustry
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesIndustry && matchesSearch
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
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
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-custom flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Nossos
              <span className="text-gradient"> Cases </span>
              de Sucesso
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Conheça as histórias de transformação digital que ajudamos a construir
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row gap-6 mb-12"
          >
            <motion.div variants={itemVariants} className="flex-1">
              <input
                type="text"
                placeholder="Buscar cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${selectedIndustry === industry
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800'}`}
                >
                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* Cases Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500 mx-auto" />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCases.map((case_) => (
                <motion.div
                  key={case_.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className={`bg-gray-900/50 rounded-xl overflow-hidden border transition-all duration-300 ${case_.featured ? 'border-primary-500 shadow-lg shadow-primary-500/20 scale-105' : 'border-gray-800 hover:border-primary-500/50'}`}
                >
                  {case_.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full shadow-lg">
                        Destaque
                      </span>
                    </div>
                  )}
                  <Link to={`/cases/${case_.slug}`}>
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={case_.image_url}
                        alt={case_.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        {case_.tools.slice(0, 3).map((tool, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-sm"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                      <h3 className={`text-xl font-bold mb-3 ${case_.featured ? 'text-primary-500' : ''}`}>{case_.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {case_.description}
                      </p>
                      <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                        <div className="text-sm text-gray-400">
                          {case_.client_industry}
                        </div>
                        <div className="flex items-center gap-2">
                          {case_.metrics.slice(0, 1).map((metric, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <ChartBarIcon className="h-4 w-4 text-primary-500" />
                              <span className="text-primary-500 font-semibold">
                                {metric.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {filteredCases.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 text-gray-400"
            >
              Nenhum case encontrado com os filtros selecionados.
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default CasesPage
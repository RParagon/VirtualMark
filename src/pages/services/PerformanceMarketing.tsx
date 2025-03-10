import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline'

const PerformanceMarketing = () => {
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

  // KPIs data
  const kpis = [
    { icon: ChartBarIcon, value: '45%', label: 'Aumento em CTR' },
    { icon: ArrowTrendingUpIcon, value: '2.5x', label: 'ROI Médio' },
    { icon: PresentationChartLineIcon, value: '-35%', label: 'Redução de CPA' }
  ]

  return (
    <div className="min-h-screen bg-gradient-custom flex flex-col relative">
      {/* Fundo radial animado */}
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
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Marketing de
              <span className="text-gradient"> Performance </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              A <strong>VirtualMark</strong> eleva suas campanhas a outro patamar
              com foco total em resultados. Nossas estratégias orientadas por
              dados garantem o máximo retorno para cada investimento.
            </p>
          </motion.div>
        </div>
      </section>

      {/* O que é Performance Marketing? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-white">
              O que é Performance Marketing?
            </h2>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden">
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
              <p className="text-gray-300 text-lg leading-relaxed">
                De forma simples, Performance Marketing é a união estratégica de ações de conteúdo altamente relevantes (capazes de engajar e educar o público) com campanhas de tráfego focadas em alcance e conversão, tudo guiado por métricas sólidas de ROI. Isso significa que cada passo é planejado para potencializar resultados, seja em vendas, leads ou reconhecimento de marca.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* KPIs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {kpis.map((kpi, index) => {
              const IconComp = kpi.icon
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
                  <p className="text-3xl font-bold text-primary-500 mb-2 relative z-10">
                    {kpi.value}
                  </p>
                  <p className="text-gray-400 relative z-10">{kpi.label}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Como Funciona Nosso Processo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-extrabold mb-8 text-white">
              Como Funciona Nosso Processo
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Etapa 1 */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary-500 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Criação de Conteúdo Estratégico
              </h3>
              <p className="text-gray-400">
                Desenvolvemos artigos, vídeos, posts e materiais ricos que comuniquem valor e posicionem sua marca como autoridade no mercado.
              </p>
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

            {/* Etapa 2 */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary-500 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Gestão de Tráfego Otimizada
              </h3>
              <p className="text-gray-400">
                Veiculamos campanhas segmentadas em canais como Google Ads e redes sociais, atraindo o público certo para o conteúdo que vai converter.
              </p>
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

            {/* Etapa 3 */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary-500 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Otimização e Análises Contínuas
              </h3>
              <p className="text-gray-400">
                Acompanhamos métricas de engajamento, custo por aquisição (CPA), ROI e outras KPIs relevantes para ajustar e maximizar seus resultados.
              </p>
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

            {/* Etapa 4 */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary-500 font-bold text-xl">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Construção de Autoridade e Crescimento
              </h3>
              <p className="text-gray-400">
                Com conteúdos bem posicionados e tráfego qualificado, sua marca ganha relevância digital e aumenta as chances de conversão e vendas ao longo do tempo.
              </p>
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
      </section>

      {/* Estratégias e Pilares */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Estratégias */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-white">
              Estratégias de Otimização
            </h2>
            <p className="text-gray-400 max-w-3xl mb-8">
              Realizamos testes contínuos, análise de dados e ajustes rápidos
              para manter suas campanhas sempre na melhor performance possível.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
                whileHover="hover"
                variants={hoverVariants}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Testes A/B
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li>• Títulos, imagens e CTAs</li>
                  <li>• Segmentação e público-alvo</li>
                  <li>• Modelos de landing pages</li>
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
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
                whileHover="hover"
                variants={hoverVariants}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Análise de Dados
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li>• Tracking avançado (GA4, Pixel, Tag Manager)</li>
                  <li>• Relatórios em tempo real</li>
                  <li>• Segmentação e remarketing inteligente</li>
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

          {/* Pilares */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-white">
              Pilares de Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
                whileHover="hover"
                variants={hoverVariants}
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-primary-500 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Métricas
                </h3>
                <p className="text-gray-400">
                  Foco nos KPIs que realmente importam: CAC, LTV, ROAS e mais.
                </p>
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
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
                whileHover="hover"
                variants={hoverVariants}
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-primary-500 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Otimização
                </h3>
                <p className="text-gray-400">
                  Ajustes rápidos e contínuos para reduzir custos e elevar
                  resultados.
                </p>
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

              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 relative overflow-hidden"
                whileHover="hover"
                variants={hoverVariants}
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-primary-500 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Escalabilidade
                </h3>
                <p className="text-gray-400">
                  Estratégias de crescimento para manter a performance mesmo em
                  grandes volumes de tráfego.
                </p>
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
            </div>
          </motion.div>

          {/* CTA Final */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl font-extrabold mb-6 text-white">
              Buscando Alta Performance?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              A <strong>VirtualMark</strong> tem a solução perfeita para
              potencializar suas campanhas e garantir resultados concretos.
              Fale agora com nossos especialistas.
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

export default PerformanceMarketing

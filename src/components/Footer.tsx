import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  // Variantes de container e itens para animações
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

  const currentYear = new Date().getFullYear()

  // Função para abrir WhatsApp
  const handleContactClick = () => {
    const phoneNumber = '5521999999999' // Ajuste para o seu número real
    const message = 'Olá! Gostaria de saber mais sobre os serviços da VirtualMark.'
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    window.open(whatsappURL, '_blank')
  }

  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800 overflow-hidden">
      {/* Gradiente sutil no fundo (opcional) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Pequena CTA (opcional) */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 rounded-xl border border-gray-700 px-6 py-4 mb-12 text-center flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
        >
          <div className="text-left sm:text-center md:text-left">
            <h4 className="text-lg font-semibold text-white">Quer falar com nossa equipe?</h4>
            <p className="text-gray-400 text-sm">
              Entre em contato e descubra como a VirtualMark pode alavancar seu negócio.
            </p>
          </div>
          <button
            onClick={handleContactClick}
            className="bg-primary-600 hover:bg-primary-700 transition-colors px-6 py-2 rounded-lg font-medium text-white"
          >
            WhatsApp
          </button>
        </motion.div>

        {/* VM Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <Link to="/" className="inline-block mb-4">
            <div className="flex items-center justify-center gap-2">
              <img src="/vm-logo.png" alt="VirtualMark Logo" className="h-8" />
              <h3 className="text-3xl font-bold tracking-wide">
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-transparent bg-clip-text">
                  VirtualMark
                </span>
              </h3>
            </div>
          </Link>
          <p className="text-gray-400 max-w-lg mx-auto">
            Transformando negócios através do marketing digital
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left"
        >
          {/* Serviços */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-4 text-white">Serviços</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services/traffic-management" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Gestão de Tráfego
                </Link>
              </li>
              <li>
                <Link to="/services/performance-marketing" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Marketing de Performance
                </Link>
              </li>
              <li>
                <Link to="/services/content-marketing" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Marketing de Conteúdo
                </Link>
              </li>
              <li>
                <Link to="/services/digital-consulting" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Consultoria Digital
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Links Rápidos */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-4 text-white">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cases" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Cases
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <button
                  onClick={handleContactClick}
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  WhatsApp
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Contato */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-4 text-white">Contato</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">(11) 91334-5769</li>
              <li className="text-gray-400">contato@virtualmark.com.br</li>
              <li className="text-gray-400">São Paulo, SP</li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Redes Sociais */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-800 pt-8 flex justify-center space-x-6 mb-8"
        >
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary-500 transition-colors"
          >
            <span className="sr-only">Facebook</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary-500 transition-colors"
          >
            <span className="sr-only">Instagram</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427A4.902 4.902 0 015.83 3.678a4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C10.53 2.013 10.885 2 12.315 2zm0 1.8c-1.417 0-1.76.011-2.378.048-.607.036-.94.156-1.16.258-.283.131-.487.29-.7.503-.212.212-.372.417-.503.7-.102.22-.222.553-.258 1.16-.037.618-.048.961-.048 2.378s.011 1.76.048 2.378c.036.607.156.94.258 1.16.131.283.29.487.503.7.212.212.417.372.7.503.22.102.553.222 1.16.258.618.037.961.048 2.378.048s1.76-.011 2.378-.048c.607-.036.94-.156 1.16-.258.283-.131.487-.29.7-.503.212-.212.372-.417.503-.7.102-.22.222-.553.258-1.16.037-.618.048-.961.048-2.378s-.011-1.76-.048-2.378c-.036-.607-.156-.94-.258-1.16-.131-.283-.29-.487-.503-.7a2.1 2.1 0 00-.7-.503c-.22-.102-.553-.222-1.16-.258-.618-.037-.961-.048-2.378-.048zm4.327 3.117a1.08 1.08 0 110 2.16 1.08 1.08 0 010-2.16zM12.315 7a5.315 5.315 0 100 10.63 5.315 5.315 0 000-10.63zm0 1.8a3.515 3.515 0 110 7.03 3.515 3.515 0 010-7.03z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          {/* Adicione mais ícones se desejar (LinkedIn, Twitter, etc.) */}
        </motion.div>

        {/* Direitos Reservados */}
        <motion.div variants={itemVariants} className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} VirtualMark. Todos os direitos reservados.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  )
}

export default Footer

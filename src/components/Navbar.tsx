import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useContact } from '../contexts/ContactContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    setIsServicesOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false)
    }, 500)
  }

  const serviceLinks = [
    { name: 'Gestão de Tráfego', href: '/services/traffic-management' },
    { name: 'Marketing de Performance', href: '/services/performance-marketing' },
    { name: 'Marketing de Conteúdo', href: '/services/content-marketing' },
    { name: 'Consultoria Digital', href: '/services/digital-consulting' }
  ]

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Cases', href: '/cases' },
    {
      name: 'Serviços',
      href: '/#services',
      hasSubmenu: true,
      submenu: serviceLinks
    },
    { name: 'Blog', href: '/blog' },
    { name: 'Contato', href: '/contact' }
  ]

  const { contactInfo } = useContact()

  const handleContactClick = () => {
    const message = 'Olá! Gostaria de saber mais sobre os serviços da VirtualMark.'
    const whatsappURL = `https://api.whatsapp.com/send?phone=${contactInfo.whatsappNumber}&text=${encodeURIComponent(message)}`
    window.open(whatsappURL, '_blank')
  }

  const languages = ['PT', 'EN', 'ES']

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-lg shadow-lg' : 'bg-background'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold">
              <span className="text-primary-500">Virtual</span>Mark
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group py-4">
                {link.hasSubmenu ? (
                  <div
                    className="text-gray-300 hover:text-primary-500 transition-colors cursor-pointer flex items-center space-x-1 group relative py-2"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span>{link.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform transform ${isServicesOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {/* Dropdown Menu */}
                    {isServicesOpen && (
                      <div className="absolute top-full left-0 w-64 bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl py-2 mt-2">
                        {link.submenu?.map((subLink) => (
                          <Link
                            key={subLink.name}
                            to={subLink.href}
                            className="block px-4 py-3 text-gray-300 hover:text-primary-500 hover:bg-gray-800/50 transition-colors"
                          >
                            {subLink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : link.href.startsWith('/#') ? (
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-primary-500 transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Language Selector and CTA Button */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Language selector commented out
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              {languages.map((lang, index) => (
                <span key={lang} className="hover:text-primary-500 cursor-pointer transition-colors">
                  {index > 0 && <span className="mx-2 text-gray-600">|</span>}
                  {lang}
                </span>
              ))}
            </div>
            */}
            <button
              onClick={handleContactClick}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors animate-glow shadow-lg shadow-primary-600/20"
            >
              Entrar em Contato
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-sm"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.hasSubmenu ? (
                    <>
                      <div
                        className="flex items-center justify-between px-3 py-2 text-base font-medium text-gray-300 hover:text-primary-500 transition-colors cursor-pointer"
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                      >
                        <span>{link.name}</span>
                        <svg
                          className={`w-4 h-4 transition-transform transform ${isServicesOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {isServicesOpen && (
                        <div className="pl-4 space-y-1 bg-gray-800/30">
                          {link.submenu?.map((subLink) => (
                            <Link
                              key={subLink.name}
                              to={subLink.href}
                              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-primary-500 transition-colors"
                              onClick={() => {
                                setIsServicesOpen(false)
                                setIsOpen(false)
                              }}
                            >
                              {subLink.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : link.href.startsWith('/#') ? (
                    <a
                      href={link.href}
                      className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-primary-500 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-primary-500 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 pb-2 border-t border-gray-800">
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    {languages.map((lang, index) => (
                      <span
                        key={lang}
                        className="hover:text-primary-500 cursor-pointer transition-colors"
                      >
                        {index > 0 && <span className="mx-2 text-gray-600">|</span>}
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 px-3">
                  <button
                    onClick={handleContactClick}
                    className="w-full px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors animate-glow shadow-lg shadow-primary-600/20"
                  >
                    Entrar em Contato
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
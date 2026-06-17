import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { PostProvider } from './contexts/PostContext'
import { CaseProvider } from './contexts/CaseContext'
import { ContactProvider } from './contexts/ContactContext'
import { ServiceProvider } from './contexts/ServiceContext'
import { AuthProvider } from './contexts/AuthContext'
import { CookieProvider } from './contexts/CookieContext'
import ScrollToTop from './components/ScrollToTop'
import Seo from './components/Seo'

// Components will be imported here as they are created
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Results from './components/Results'
import Qualification from './components/Qualification'
import Services from './components/Services'
import Expertise from './components/Expertise'
import Assessment from './components/Assessment'
import Testimonials from './components/Testimonials'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'
import BlogPage from './pages/BlogPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import AdminPage from './pages/AdminPage'
import CasesPage from './pages/CasesPage'
import CaseDetailPage from './pages/CaseDetailPage'
import ContactPage from './pages/ContactPage'
import CookieConsent from './components/CookieConsent'
import ImobiliariaPage from './pages/ImobiliariaPage'
import QuizImobiliariaTreePage from './pages/QuizImobiliariaTreePage'
import EcommercePage from './pages/EcommercePage'
import QuizEcommerceTreePage from './pages/QuizEcommerceTreePage'
import SimuladorPage from './pages/SimuladorPage'

// Service Pages
import TrafficManagement from './pages/services/TrafficManagement'
import PerformanceMarketing from './pages/services/PerformanceMarketing'
import ContentMarketing from './pages/services/ContentMarketing'
import DigitalConsulting from './pages/services/DigitalConsulting'

function App() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <Router>
      <AuthProvider>
        <PostProvider>
          <CaseProvider>
            <ContactProvider>
              <ServiceProvider>
                <CookieProvider>
                  <div className="relative">
                    <motion.div
                      className="fixed top-0 left-0 right-0 h-1 bg-primary-600 origin-left z-50"
                      style={{ scaleX }}
                    />
                    <ScrollToTop />
                    <Routes>
                      <Route path="/blog/*" element={<BlogPage />} />
                      <Route path="/admin" element={<AdminPage />} />
                      <Route path="/cases" element={<CaseProvider><CasesPage /></CaseProvider>} />
                      <Route path="/cases/:slug" element={<CaseProvider><CaseDetailPage /></CaseProvider>} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/imobiliarias" element={<ImobiliariaPage />} />
                      <Route path="/quiz-imoveis" element={<QuizImobiliariaTreePage />} />
                      <Route path="/quiz-imoveis-v2" element={<Navigate to="/quiz-imoveis" replace />} />
                      <Route path="/ecommerce" element={<EcommercePage />} />
                      <Route path="/quiz-ecommerce" element={<QuizEcommerceTreePage />} />
                      <Route path="/simulador-imoveis" element={<SimuladorPage />} />
                      <Route path="/simulador" element={<Navigate to="/simulador-imoveis" replace />} />
                      <Route path="/services/traffic-management" element={<ServiceProvider><TrafficManagement /></ServiceProvider>} />
                      <Route path="/services/performance-marketing" element={<ServiceProvider><PerformanceMarketing /></ServiceProvider>} />
                      <Route path="/services/content-marketing" element={<ServiceProvider><ContentMarketing /></ServiceProvider>} />
                      <Route path="/services/digital-consulting" element={<ServiceProvider><DigitalConsulting /></ServiceProvider>} />
                      <Route path="/" element={
                        <main className="relative">
                          <Seo
                            title="VirtualMark | Marketing Digital e Geração de Leads que Viram Vendas"
                            description="Agência de marketing digital orientada a performance: Google Ads, Meta Ads e landing pages que geram leads qualificados e vendas reais. Diagnóstico gratuito."
                            path="/"
                          />
                          <Navbar />
                          <Hero />
                          <Results />
                          <Qualification />
                          <Services />
                          <Expertise />
                          <Assessment />
                          <Testimonials />
                          <CallToAction />
                          <Footer />
                        </main>
                      } />
                    </Routes>
                    <CookieConsent />
                  </div>
                </CookieProvider>
              </ServiceProvider>
            </ContactProvider>
          </CaseProvider>
        </PostProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
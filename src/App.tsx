import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom'
import { PostProvider } from './contexts/PostContext'
import { CaseProvider } from './contexts/CaseContext'
import { ContactProvider } from './contexts/ContactContext'
import { ServiceProvider } from './contexts/ServiceContext'
import { AuthProvider } from './contexts/AuthContext'
import { CookieProvider } from './contexts/CookieContext'
import ScrollToTop from './components/ScrollToTop'

// Components will be imported here as they are created
import HomePage from './pages/HomeNova'
import PortfolioPage from './pages/PortfolioPage'
import BlogPage from './pages/BlogPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import AdminPage from './pages/AdminPage'
import CasesNova from './pages/CasesNova'
import CaseNova from './pages/CaseNova'
import { casoPorSlug } from './components/nova/casos'
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

/** Cases novos (anônimos) primeiro; slugs antigos continuam abrindo a página antiga. */
const CaseRota = () => {
  const { slug } = useParams()
  const caso = casoPorSlug(slug)
  return caso ? <CaseNova caso={caso} /> : <CaseProvider><CaseDetailPage /></CaseProvider>
}

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
                      <Route path="/cases" element={<CasesNova />} />
                      <Route path="/cases/:slug" element={<CaseRota />} />
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
                      <Route path="/" element={<HomePage />} />
                      <Route path="/portfolio" element={<PortfolioPage />} />
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
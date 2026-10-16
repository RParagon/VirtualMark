import { Suspense, lazy, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom'
import { PostProvider } from './contexts/PostContext'
import { CaseProvider } from './contexts/CaseContext'
import { ContactProvider } from './contexts/ContactContext'
import { ServiceProvider } from './contexts/ServiceContext'
import { AuthProvider } from './contexts/AuthContext'
import { CookieProvider } from './contexts/CookieContext'
import ScrollToTop from './components/ScrollToTop'
import { EsquecerHtmlAoNavegar, HtmlEstatico } from './components/HtmlEstatico'

// Components will be imported here as they are created
import HomePage from './pages/HomeNova'
const PortfolioPage = lazy(() => import('./old_site/pages/PortfolioPage'))
const BlogPage = lazy(() => import('./old_site/pages/BlogPage'))
const PrivacyPolicyPage = lazy(() => import('./old_site/pages/PrivacyPolicyPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
import CasesNova from './pages/CasesNova'
import CaseNova from './pages/CaseNova'
import { casoPorSlug } from './components/nova/casos'
const CaseDetailPage = lazy(() => import('./old_site/pages/CaseDetailPage'))
const ContactPage = lazy(() => import('./old_site/pages/ContactPage'))
import CookieConsent from './components/CookieConsent'
const ImobiliariaPage = lazy(() => import('./old_site/pages/ImobiliariaPage'))
const QuizImobiliariaTreePage = lazy(() => import('./old_site/pages/QuizImobiliariaTreePage'))
const EcommercePage = lazy(() => import('./old_site/pages/EcommercePage'))
const QuizEcommerceTreePage = lazy(() => import('./old_site/pages/QuizEcommerceTreePage'))
const SimuladorPage = lazy(() => import('./old_site/pages/SimuladorPage'))

// Service Pages
const TrafficManagement = lazy(() => import('./old_site/pages/services/TrafficManagement'))
const PerformanceMarketing = lazy(() => import('./old_site/pages/services/PerformanceMarketing'))
const ContentMarketing = lazy(() => import('./old_site/pages/services/ContentMarketing'))
const DigitalConsulting = lazy(() => import('./old_site/pages/services/DigitalConsulting'))

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
                    <EsquecerHtmlAoNavegar />
                    <Suspense fallback={<HtmlEstatico />}>
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
                    </Suspense>
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
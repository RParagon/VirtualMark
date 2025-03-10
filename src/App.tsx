import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { PostProvider } from './contexts/PostContext'
import { CaseProvider } from './contexts/CaseContext'
import { ContactProvider } from './contexts/ContactContext'
import { ServiceProvider } from './contexts/ServiceContext'
import { AuthProvider } from './contexts/AuthContext'
import ScrollToTop from './components/ScrollToTop'

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
import AdminPage from './pages/AdminPage'
import CasesPage from './pages/CasesPage'
import CaseDetailPage from './pages/CaseDetailPage'
import ContactPage from './pages/ContactPage'

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
    <AuthProvider>
      <PostProvider>
        <ContactProvider>
          <Router>
            <ScrollToTop />
          <div className="relative min-h-screen">
        {/* Progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary-600 origin-left z-50"
          style={{ scaleX }}
        />

        {/* Main content */}
        <Routes>
          <Route path="/blog/*" element={<BlogPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/cases" element={<CaseProvider><CasesPage /></CaseProvider>} />
          <Route path="/cases/:slug" element={<CaseProvider><CaseDetailPage /></CaseProvider>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services/traffic-management" element={<ServiceProvider><TrafficManagement /></ServiceProvider>} />
          <Route path="/services/performance-marketing" element={<ServiceProvider><PerformanceMarketing /></ServiceProvider>} />
          <Route path="/services/content-marketing" element={<ServiceProvider><ContentMarketing /></ServiceProvider>} />
          <Route path="/services/digital-consulting" element={<ServiceProvider><DigitalConsulting /></ServiceProvider>} />
          <Route path="/" element={
            <main className="relative">
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
      </div>
    </Router>
        </ContactProvider>
      </PostProvider>
    </AuthProvider>
  )
}

export default App
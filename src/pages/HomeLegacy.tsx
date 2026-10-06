import Seo from '../components/Seo'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Results from '../components/Results'
import Qualification from '../components/Qualification'
import Services from '../components/Services'
import Expertise from '../components/Expertise'
import Assessment from '../components/Assessment'
import Testimonials from '../components/Testimonials'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

const HomePage = () => (
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
)

export default HomePage

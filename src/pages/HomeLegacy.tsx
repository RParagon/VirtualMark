/**
 * Home v1 (arquivada). Mantida em /home-antiga, fora dos buscadores, para
 * consulta e comparação (A/B) com a nova home.
 */
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

const HomeLegacy = () => (
  <main className="relative">
    <Seo
      title="VirtualMark | Home v1 (arquivo)"
      description="Versão anterior da home da VirtualMark."
      path="/home-antiga"
      noindex
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

export default HomeLegacy

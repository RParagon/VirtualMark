import { motion } from 'framer-motion'
import { useContact } from '../contexts/ContactContext'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MultiStepContactForm from '../components/MultiStepContactForm'

const ContactPage = () => {
  const { contactInfo } = useContact()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
              A partir de agora, seu maior problema será ter
              <span className="text-gradient"> clientes demais</span>.
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Aumente o seu número de vendas e seja a primeira opção dos seus clientes, através de uma parceria duradoura com uma das agências de tráfego mais respeitadas do país.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl font-bold text-white mb-8">Fale com um especialista</h2>
              <MultiStepContactForm />
            </motion.div>

            {/* Contact Information Column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Contact Info Card */}
              <motion.div
                variants={itemVariants}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800"
              >
                <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>
                <div className="space-y-6">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                      <MapPinIcon className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1">Endereço</h4>
                      <p className="text-gray-400">{contactInfo.address.street} - {contactInfo.address.neighborhood}<br />{contactInfo.address.city}, {contactInfo.address.state} - {contactInfo.address.zipCode}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                      <PhoneIcon className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1">Telefone</h4>
                      <p className="text-gray-400">{contactInfo.phoneNumber}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                      <EnvelopeIcon className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1">Email</h4>
                      <p className="text-gray-400">{contactInfo.email}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Social Media Card */}
              <motion.div
                variants={itemVariants}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800"
              >
                <h3 className="text-2xl font-bold mb-6">Redes Sociais</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/virtualmark.com.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center hover:bg-primary-500/20 transition-colors"
                  >
                    <FaInstagram className="h-6 w-6 text-primary-500" />
                  </a>
                  <a
                    href="https://wa.me/5511913345769"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center hover:bg-primary-500/20 transition-colors"
                  >
                    <FaWhatsapp className="h-6 w-6 text-primary-500" />
                  </a>
                </div>
              </motion.div>

              {/* Google Maps */}
              <motion.div
                variants={itemVariants}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 overflow-hidden"
              >
                <h3 className="text-2xl font-bold mb-6">Localização</h3>
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0998847991837!2d-46.65390492506619!3d-23.563224361669753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1sen!2sbr!4v1645488532648!5m2!1sen!2sbr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default ContactPage
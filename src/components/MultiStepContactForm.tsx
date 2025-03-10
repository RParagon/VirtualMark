import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { FaInstagram } from 'react-icons/fa'

type FormData = {
  name: string
  phone: string
  email: string
  instagram: string
  business_category: string
  monthly_revenue: string
}

const businessCategories = [
  { id: 'retail', label: 'Varejo presencial (Restaurantes, Lojas, Óticas...)' },
  { id: 'infoproducts', label: 'Infoprodutos (Cursos Online, Mentorias...)' },
  { id: 'services', label: 'Prestador de serviços (Médicos, Advogados, Imobiliárias...)' },
  { id: 'ecommerce', label: 'Ecommerce' }
]

const revenueRanges = [
  { id: 'up_to_100k', label: 'Até R$100.000,00' },
  { id: '100k_to_300k', label: 'De R$100.000,00 a R$300.000,00' },
  { id: '300k_to_500k', label: 'De R$300.000,00 a R$500.000,00' },
  { id: 'above_500k', label: 'Acima de R$500.000,00' }
]

const MultiStepContactForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    instagram: '',
    business_category: '',
    monthly_revenue: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Clear errors when changing steps
  useEffect(() => {
    setErrors({})
  }, [currentStep])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle radio button changes
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validate current step
  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    switch (currentStep) {
      case 0: // Name
        if (!formData.name.trim()) {
          newErrors.name = 'Por favor, informe seu nome'
        }
        break
      case 1: // Phone
        if (!formData.phone.trim()) {
          newErrors.phone = 'Por favor, informe seu telefone'
        } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
          newErrors.phone = 'Telefone inválido'
        }
        break
      case 2: // Email
        if (!formData.email.trim()) {
          newErrors.email = 'Por favor, informe seu email'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email inválido'
        }
        break
      case 3: // Instagram (optional)
        // No validation needed as it's optional
        break
      case 4: // Business Category
        if (!formData.business_category) {
          newErrors.business_category = 'Por favor, selecione uma categoria'
        }
        break
      case 5: // Monthly Revenue
        if (!formData.monthly_revenue) {
          newErrors.monthly_revenue = 'Por favor, selecione uma faixa de faturamento'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (validateStep()) {
      setIsSubmitting(true)
      try {
        const { error } = await supabase.from('leads').insert([
          {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            instagram: formData.instagram || null,
            business_category: formData.business_category,
            monthly_revenue: formData.monthly_revenue
          }
        ])

        if (error) throw error
        
        // Show success message
        setIsSubmitted(true)
      } catch (error) {
        console.error('Error submitting form:', error)
        setErrors({ submit: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.' })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  // Progress bar calculation
  const progress = ((currentStep + 1) / 7) * 100

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return 'Qual é o seu nome?'
      case 1:
        return `${formData.name}, qual o seu melhor telefone para contato?`
      case 2:
        return `${formData.name}, qual é o seu principal e-mail?`
      case 3:
        return `Qual o "@" do Instagram da empresa que você representa?`
      case 4:
        return `${formData.name}, em qual dessas categorias você se encaixa?`
      case 5:
        return `Qual o faturamento mensal da sua empresa?`
      case 6:
        return 'Confirme seus dados'
      default:
        return ''
    }
  }

  // Get step description
  const getStepDescription = () => {
    switch (currentStep) {
      case 0:
        return 'Vamos começar com o seu nome completo.'
      case 1:
        return 'Precisamos do seu telefone para entrar em contato.'
      case 2:
        return 'Seu e-mail será usado para enviarmos informações importantes.'
      case 3:
        return 'Opcional: Nos informe o Instagram da sua empresa.'
      case 4:
        return 'Isso nos ajudará a entender melhor o seu negócio.'
      case 5:
        return 'Esta informação é importante para personalizarmos nossa proposta.'
      case 6:
        return 'Por favor, verifique se todas as informações estão corretas.'
      default:
        return ''
    }
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Name
        return (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 bg-gray-900/50 border ${errors.name ? 'border-red-500' : 'border-gray-800'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors`}
                placeholder="Seu nome completo"
                autoFocus
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
        )
      case 1: // Phone
        return (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 bg-gray-900/50 border ${errors.phone ? 'border-red-500' : 'border-gray-800'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors`}
                placeholder="(00) 00000-0000"
                autoFocus
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
        )
      case 2: // Email
        return (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-gray-800'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors`}
                placeholder="seu@email.com"
                autoFocus
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        )
      case 3: // Instagram (optional)
        return (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaInstagram className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="@suaempresa"
                autoFocus
              />
            </div>
            <p className="text-sm text-gray-400">Este campo é opcional</p>
          </div>
        )
      case 4: // Business Category
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {businessCategories.map((category) => (
                <label
                  key={category.id}
                  className={`flex items-center p-4 bg-gray-900/50 border ${formData.business_category === category.id ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-800'} rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors`}
                >
                  <input
                    type="radio"
                    name="business_category"
                    value={category.id}
                    checked={formData.business_category === category.id}
                    onChange={() => handleRadioChange('business_category', category.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${formData.business_category === category.id ? 'border-primary-500' : 'border-gray-500'}`}>
                      {formData.business_category === category.id && (
                        <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                      )}
                    </div>
                    <div>
                      <BuildingStorefrontIcon className="h-5 w-5 text-gray-400 mr-2 inline-block" />
                      <span className="text-white">{category.label}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.business_category && (
              <p className="text-sm text-red-500">{errors.business_category}</p>
            )}
          </div>
        )
      case 5: // Monthly Revenue
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {revenueRanges.map((range) => (
                <label
                  key={range.id}
                  className={`flex items-center p-4 bg-gray-900/50 border ${formData.monthly_revenue === range.id ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-800'} rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors`}
                >
                  <input
                    type="radio"
                    name="monthly_revenue"
                    value={range.id}
                    checked={formData.monthly_revenue === range.id}
                    onChange={() => handleRadioChange('monthly_revenue', range.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${formData.monthly_revenue === range.id ? 'border-primary-500' : 'border-gray-500'}`}>
                      {formData.monthly_revenue === range.id && (
                        <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                      )}
                    </div>
                    <div>
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2 inline-block" />
                      <span className="text-white">{range.label}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.monthly_revenue && (
              <p className="text-sm text-red-500">{errors.monthly_revenue}</p>
            )}
          </div>
        )
      case 6: // Confirmation
        return (
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-400">Nome:</span>
                </div>
                <span className="text-white font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-400">Telefone:</span>
                </div>
                <span className="text-white font-medium">{formData.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-400">Email:</span>
                </div>
                <span className="text-white font-medium">{formData.email}</span>
              </div>
              {formData.instagram && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FaInstagram className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-400">Instagram:</span>
                  </div>
                  <span className="text-white font-medium">{formData.instagram}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <BuildingStorefrontIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-400">Categoria:</span>
                </div>
                <span className="text-white font-medium">
                  {businessCategories.find(c => c.id === formData.business_category)?.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-400">Faturamento:</span>
                </div>
                <span className="text-white font-medium">
                  {revenueRanges.find(r => r.id === formData.monthly_revenue)?.label}
                </span>
              </div>
            </div>
            {errors.submit && (
              <p className="text-sm text-red-500">{errors.submit}</p>
            )}
          </div>
        )
      default:
        return null
    }
  }

  // Success screen
  const renderSuccessScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-8"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
        <CheckCircleIcon className="h-10 w-10 text-green-500" />
      </div>
      <h3 className="text-2xl font-bold text-white">Obrigado, {formData.name}!</h3>
      <p className="text-gray-300 max-w-md mx-auto">
        Recebemos sua solicitação com sucesso. Um de nossos especialistas entrará em contato com você em breve para agendar uma consultoria personalizada para o seu negócio.
      </p>
      <div className="pt-4">
        <p className="text-gray-400 text-sm">
          Enquanto isso, que tal conhecer mais sobre nossos serviços e casos de sucesso?
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <a
            href="/services"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Nossos Serviços
          </a>
          <a
            href="/cases"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Casos de Sucesso
          </a>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <motion.div
          className="h-full bg-primary-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-6 md:p-8">
        {!isSubmitted ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-2xl font-bold text-white mb-2">{getStepTitle()}</h3>
                <p className="text-gray-400">{getStepDescription()}</p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-8"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Voltar
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Próximo
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>Enviar</>  
                  )}
                </button>
              )}
            </div>
          </>
        ) : (
          renderSuccessScreen()
        )}
      </div>
    </div>
  )
}

export default MultiStepContactForm
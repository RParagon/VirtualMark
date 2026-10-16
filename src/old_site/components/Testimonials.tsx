import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { StarIcon } from '@heroicons/react/24/solid'

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

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

  const testimonials = [
    {
      name: 'Fernando',
      role: 'CEO, Negócio Local',
      content: 'Completando 5 meses de parceria, foi feito um ótimo trabalho ao otimizar nossas campanhas e melhorar nossa presença online. A equipe foi proativa e ajudou a aumentar nossas vendas nesse curto período. Super recomendo!',
      rating: 5
    },
    {
      name: 'Thiago',
      role: 'CEO, E-commerce',
      content: 'Parceria consolidada a mais de um ano. A equipe da Virtual Mark nos ajudou a melhorar nossa estratégia de Google Ads e Meta Ads, resultando em um aumento consistente nas vendas. A equipe foi eficiente em criar campanhas que realmente funcionaram para nossa loja online.',
      rating: 5
    },
    {
      name: 'Bruno',
      role: 'CEO, E-commerce',
      content: 'Ótima empresa, desde 2019 me trazendo um CPA ótimo e novos criativos, recomendo a todos!',
      rating: 5
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-custom">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            O Que Nossos
            <span className="text-gradient"> Clientes </span>
            Dizem
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Histórias reais de empresas que transformaram seus resultados com nossa ajuda
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 card-hover"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-primary-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
              <div className="border-t border-gray-800 pt-6">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Testimonials
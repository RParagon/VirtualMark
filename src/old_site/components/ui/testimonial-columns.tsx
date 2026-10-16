import React from 'react'
import { motion } from 'framer-motion'

interface Testimonial {
  text: string
  image: string
  name: string
  role: string
}

const testimonials: Testimonial[] = [
  {
    text: 'Completando 5 meses de parceria, foi feito um ótimo trabalho ao otimizar nossas campanhas e melhorar nossa presença online. A equipe foi proativa e ajudou a aumentar nossas vendas nesse curto período. Super recomendo!',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Fernando',
    role: 'CEO, Negócio Imobiliário',
  },
  {
    text: 'Parceria consolidada a mais de um ano. A VirtualMark nos ajudou a melhorar nossa estratégia de Google Ads e Meta Ads, resultando em um aumento consistente nas vendas. A equipe foi eficiente em criar campanhas que realmente funcionaram.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Thiago',
    role: 'Diretor Comercial, Imobiliária',
  },
  {
    text: 'Em menos de 30 dias já estava recebendo leads qualificados direto no WhatsApp. O custo por lead caiu quase 50% em relação ao que pagava nos portais. Estrutura profissional, relatório claro e resultado real.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Ana Clara',
    role: 'Corretora SR, São Paulo',
  },
  {
    text: 'Ótima empresa, desde 2019 me trazendo um CPA ótimo e novos criativos. Os leads chegam qualificados e o processo de atendimento é muito transparente. Recomendo a todos os corretores!',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Bruno',
    role: 'Corretor Independente',
  },
  {
    text: 'Nossa equipe de corretores estava sobrecarregada com leads de baixa qualidade. A VirtualMark reestruturou tudo. Hoje temos menos leads, porém muito mais qualificados — a taxa de conversão triplicou.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Rodrigo',
    role: 'Gerente de Captação, SP',
  },
  {
    text: 'Investimos R$4.000 em Meta Ads no primeiro mês e geramos 280 contatos qualificados. Fechamos 2 vendas naquele período. O ROI foi imediato e a equipe foi transparente em cada etapa.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Camila',
    role: 'Diretora Comercial, Imobiliária',
  },
  {
    text: 'Tentei outras agências antes e nunca tive resultado concreto. A VirtualMark foi diferente desde o início — diagnóstico sério, estratégia personalizada para imóveis de alto padrão e resultados reais em 45 dias.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Lucas',
    role: 'Sócio-fundador, Imobiliária Premium',
  },
  {
    text: 'Sempre tive receio de anúncios online pois já joguei dinheiro fora antes. Com a VirtualMark foi completamente diferente. Landing page que converte, segmentação cirúrgica e relatório semanal sem enrolação.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Patricia',
    role: 'Corretora, Rio de Janeiro',
  },
  {
    text: 'Em 6 meses de parceria, saímos de 0 para 180 leads por mês com custo médio de R$14 por lead. Nossa imobiliária cresceu 60% em faturamento. Vale cada centavo investido na gestão da VirtualMark.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Marcos',
    role: 'Proprietário, Imobiliária Curitiba',
  },
]

const col1 = testimonials.slice(0, 3)
const col2 = testimonials.slice(3, 6)
const col3 = testimonials.slice(6, 9)

function TestimonialsColumn({
  items,
  duration = 15,
  className,
}: {
  items: Testimonial[]
  duration?: number
  className?: string
}) {
  return (
    <div className={className}>
      <motion.ul
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        className="flex flex-col gap-5 pb-5 list-none m-0 p-0"
      >
        {[0, 1].map((clone) => (
          <React.Fragment key={clone}>
            {items.map(({ text, image, name, role }, i) => (
              <li
                key={`${clone}-${i}`}
                aria-hidden={clone === 1 ? 'true' : 'false'}
                className="p-7 rounded-2xl border border-gray-800 bg-gray-900/70 max-w-xs w-full select-none"
              >
                <blockquote className="m-0 p-0">
                  <div className="flex mb-3">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className="text-primary-500 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed m-0">"{text}"</p>
                  <footer className="flex items-center gap-3 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={`Avatar de ${name}`}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-800 flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <cite className="font-semibold not-italic text-white text-sm leading-5">
                        {name}
                      </cite>
                      <span className="text-xs text-gray-500 mt-0.5">{role}</span>
                    </div>
                  </footer>
                </blockquote>
              </li>
            ))}
          </React.Fragment>
        ))}
      </motion.ul>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="w-full h-full object-cover opacity-[0.06]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-background z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-widest text-primary-500 bg-primary-500/10 px-4 py-2 rounded-full border border-primary-500/20 mb-5">
            DEPOIMENTOS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold">
            O Que Nossos Clientes{' '}
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 text-transparent bg-clip-text">
              Dizem
            </span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Imobiliárias e corretores de todo o Brasil gerando leads qualificados e fechando mais negócios.
          </p>
        </div>

        <div className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn items={col1} duration={20} />
          <TestimonialsColumn items={col2} className="hidden md:block" duration={25} />
          <TestimonialsColumn items={col3} className="hidden lg:block" duration={22} />
        </div>
      </motion.div>
    </section>
  )
}

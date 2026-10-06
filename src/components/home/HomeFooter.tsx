import { Link } from 'react-router-dom'
import { waLink } from './shared'

const cols = [
  {
    title: 'Serviços',
    items: [
      { label: 'Gestão de Tráfego', to: '/services/traffic-management' },
      { label: 'Marketing de Performance', to: '/services/performance-marketing' },
      { label: 'Marketing de Conteúdo', to: '/services/content-marketing' },
      { label: 'Consultoria Digital', to: '/services/digital-consulting' },
    ],
  },
  {
    title: 'Explorar',
    items: [
      { label: 'Cases', to: '/cases' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contato', to: '/contact' },
      { label: 'Política de Privacidade', to: '/privacy-policy' },
    ],
  },
]

const HomeFooter = () => (
  <footer className="relative border-t border-white/10 px-5 pb-10 pt-20 sm:px-8">
    <div className="mx-auto max-w-[88rem]">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Link to="/" aria-label="VirtualMark, página inicial">
            <img src="/vm-logo.svg" alt="VirtualMark" className="h-12 w-auto" width={96} height={48} loading="lazy" />
          </Link>
          <p className="mt-6 max-w-[34ch] font-display text-2xl font-bold leading-tight tracking-tight text-white">
            Você chega com uma ideia. Sai com o negócio no ar.
          </p>
        </div>

        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title} className="lg:col-span-2">
            <p className="text-sm text-white/45">{c.title}</p>
            <ul className="mt-4 space-y-3">
              {c.items.map((i) => (
                <li key={i.label}>
                  <Link to={i.to} className="text-base text-white/80 transition-colors hover:text-primary-400">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="lg:col-span-3">
          <p className="text-sm text-white/45">Contato</p>
          <ul className="mt-4 space-y-3 text-base text-white/80">
            <li>
              <a href={waLink('Olá! Gostaria de saber mais sobre os serviços da VirtualMark.')} className="transition-colors hover:text-primary-400">
                (11) 99279-4634
              </a>
            </li>
            <li>
              <a href="mailto:contato@virtualmark.com.br" className="transition-colors hover:text-primary-400">
                contato@virtualmark.com.br
              </a>
            </li>
            <li>São Paulo, SP</li>
            <li className="flex gap-5 pt-1">
              <a href="https://www.instagram.com/virtualmark.com.br/" target="_blank" rel="noopener noreferrer" className="underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-primary-500">
                Instagram
              </a>
              <a href="https://br.linkedin.com/company/vmredot" target="_blank" rel="noopener noreferrer" className="underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-primary-500">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="mt-16 border-t border-white/10 pt-6 text-sm text-white/45">
        © {new Date().getFullYear()} VirtualMark. Todos os direitos reservados.
      </p>
    </div>
  </footer>
)

export default HomeFooter

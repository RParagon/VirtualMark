import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { alternarSom, aoMudarSom, somLigado } from './som'
import { Botao, EASE, LogoVM, caminho } from './ui'

export type LinkTopo = { rotulo: string; href: string }

const LINKS: LinkTopo[] = [
  { rotulo: 'Serviços', href: '#servicos' },
  { rotulo: 'Cases', href: '#cases' },
  { rotulo: 'Sobre', href: '#como-trabalhamos' },
  { rotulo: 'Contato', href: '#contato' },
]

const IconeTema = ({ claro }: { claro: boolean }) =>
  claro ? (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )

export const Topo = ({ claro, alternarTema, links = LINKS }: { claro: boolean; alternarTema: () => void; links?: LinkTopo[] }) => {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [som, setSom] = useState(true)
  useEffect(() => {
    setSom(somLigado())
    return aoMudarSom(setSom)
  }, [])

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const botaoTema = (
    <button
      type="button"
      onClick={alternarTema}
      className="grid h-10 w-10 place-items-center rounded-full border border-vm-borda text-vm-suave transition-colors hover:text-vm-texto"
      aria-label={claro ? 'Usar tema escuro' : 'Usar tema claro'}
    >
      <IconeTema claro={claro} />
    </button>
  )

  const botaoSom = (
    <button
      type="button"
      onClick={alternarSom}
      className="grid h-10 w-10 place-items-center rounded-full border border-vm-borda text-vm-suave transition-colors hover:text-vm-texto"
      aria-label={som ? 'Desligar sons' : 'Ligar sons'}
      aria-pressed={som}
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 10v4h4l5 4V6L8 10H4z" />
        {som ? <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /> : <path d="M17 9l5 6M22 9l-5 6" />}
      </svg>
    </button>
  )

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        rolou || aberto ? 'border-vm-borda bg-vm-fundo/80 backdrop-blur-xl' : 'border-transparent bg-vm-fundo'
      }`}
    >
      <nav className="mx-auto flex max-w-[90rem] items-center justify-between px-5 py-4 sm:px-8 lg:px-20 lg:py-5" aria-label="Principal">
        <a href={caminho('/')} className="shrink-0" aria-label="Virtual Mark, início">
          <LogoVM className="h-7 w-auto lg:h-8" />
        </a>
        <ul className="hidden items-center gap-10 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="relative font-manrope text-[15px] font-medium text-vm-suave transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-vm-verm after:transition-transform after:duration-300 hover:text-vm-texto hover:after:scale-x-100">
                {l.rotulo}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-4 lg:flex">
          <a href="tel:+5511992794634" className="font-manrope text-sm font-medium text-vm-suave transition-colors hover:text-vm-texto">
            (11) 99279-4634
          </a>
          {botaoSom}
          {botaoTema}
          <Botao href="#contato" className="!py-3.5">Fale com a gente</Botao>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          {botaoSom}
          {botaoTema}
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-vm-borda text-vm-texto"
            aria-expanded={aberto}
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-0.5 w-4 rounded bg-current transition-all duration-300 ${aberto ? 'top-[5px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-[5px] h-0.5 w-4 rounded bg-current transition-opacity duration-200 ${aberto ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-0.5 w-4 rounded bg-current transition-all duration-300 ${aberto ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
            </span>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden border-t border-vm-borda lg:hidden"
          >
            <ul className="flex flex-col px-5 py-4 sm:px-8">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setAberto(false)} className="block py-3 font-manrope text-2xl font-bold tracking-tight text-vm-texto">
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

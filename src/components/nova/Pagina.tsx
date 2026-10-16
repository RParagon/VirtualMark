import { useEffect, useState, type ReactNode } from 'react'
import { Topo, type LinkTopo } from './Topo'
import { MarkGuiaProvider } from './MarkGuia'
import { RodapeVM, WhatsFlutuante } from './Final'
import { caminho } from './ui'

const CHAVE = 'vm-tema-escolha'

const LINKS_FORA: LinkTopo[] = [
  { rotulo: 'Serviços', href: '/#servicos' },
  { rotulo: 'Cases', href: '/cases' },
  { rotulo: 'Sobre', href: '/#como-trabalhamos' },
  { rotulo: 'Contato', href: '#contato' },
]

/** Casca das páginas novas: tema do sistema (ou o escolhido no botão), um só Mark, menu, rodapé e WhatsApp. */
export const PaginaVM = ({ children, home = false }: { children: ReactNode; home?: boolean }) => {
  // sem escolha manual o tema segue o sistema (claro ou escuro); o botão grava a escolha
  const [escolha, setEscolha] = useState<'auto' | 'claro' | 'escuro'>('auto')
  const [sistemaClaro, setSistemaClaro] = useState(false)

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE)
      if (salvo === 'claro' || salvo === 'escuro') setEscolha(salvo)
    } catch {
      /* sem armazenamento: segue o sistema */
    }
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const aoMudar = () => setSistemaClaro(mq.matches)
    aoMudar()
    mq.addEventListener('change', aoMudar)
    return () => mq.removeEventListener('change', aoMudar)
  }, [])

  const claro = escolha === 'auto' ? sistemaClaro : escolha === 'claro'
  const alternarTema = () => {
    const nova = claro ? 'escuro' : 'claro'
    setEscolha(nova)
    try {
      localStorage.setItem(CHAVE, nova)
    } catch {
      /* ignora */
    }
  }

  return (
    <div className="vm-tema min-h-screen bg-vm-fundo font-manrope text-vm-texto antialiased transition-colors duration-500" data-tema={escolha}>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-vm-verm focus:px-4 focus:py-2 focus:text-white">
        Pular para o conteúdo
      </a>
      <MarkGuiaProvider>
        <Topo claro={claro} alternarTema={alternarTema} links={home ? undefined : LINKS_FORA.map((l) => ({ ...l, href: l.href.startsWith('/#') ? caminho('/') + l.href.slice(1) : l.href.startsWith('/') ? caminho(l.href) : l.href }))} />
        <main id="conteudo">{children}</main>
        <RodapeVM home={home} />
        <WhatsFlutuante />
      </MarkGuiaProvider>
    </div>
  )
}

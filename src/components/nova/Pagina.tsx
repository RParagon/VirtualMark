import { useEffect, useState, type ReactNode } from 'react'
import { Topo, type LinkTopo } from './Topo'
import { MarkGuiaProvider } from './MarkGuia'
import { RodapeVM, WhatsFlutuante } from './Final'
import { caminho } from './ui'

const CHAVE = 'vm-tema'

/** Casca das páginas novas: tema escuro/claro salvo por visitante, um só Mark, menu, rodapé e WhatsApp. */
const LINKS_FORA: LinkTopo[] = [
  { rotulo: 'Serviços', href: '/#servicos' },
  { rotulo: 'Cases', href: '/cases' },
  { rotulo: 'Sobre', href: '/#como-trabalhamos' },
  { rotulo: 'Contato', href: '#contato' },
]

export const PaginaVM = ({ children, home = false }: { children: ReactNode; home?: boolean }) => {
  const [claro, setClaro] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(CHAVE) === 'claro') setClaro(true)
    } catch {
      /* sem armazenamento: fica no escuro */
    }
  }, [])

  const alternarTema = () =>
    setClaro((c) => {
      try {
        localStorage.setItem(CHAVE, c ? 'escuro' : 'claro')
      } catch {
        /* ignora */
      }
      return !c
    })

  return (
    <div className="vm-tema min-h-screen bg-vm-fundo font-manrope text-vm-texto antialiased transition-colors duration-500" data-tema={claro ? 'claro' : 'escuro'}>
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

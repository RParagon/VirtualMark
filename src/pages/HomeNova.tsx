import { useEffect, useState } from 'react'
import Seo from '../components/Seo'
import { Topo } from '../components/nova/Topo'
import { Abertura } from '../components/nova/Abertura'
import { Cases, Pista, Prova, Servicos } from '../components/nova/Secoes'
import { MarkGuiaProvider } from '../components/nova/MarkGuia'
import { Chamada, Quiz, RodapeVM, WhatsFlutuante } from '../components/nova/Final'

const CHAVE = 'vm-tema'

/** Nova home (Figma "Virtual Mark — Nova home e cases"). Escuro é o padrão; o claro fica salvo por visitante. */
const HomeNova = () => {
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
      <Seo
        title="VirtualMark | Tráfego pago, criativos e site que vendem"
        description="Tráfego pago no Google e no Meta, criativos e site em um só time. Cases com número: 23,5x de retorno numa loja de lingerie e 34 mil vendas para uma loja de games. Avaliação gratuita."
        path="/"
      />
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-vm-verm focus:px-4 focus:py-2 focus:text-white">
        Pular para o conteúdo
      </a>
      <MarkGuiaProvider>
      <Topo claro={claro} alternarTema={alternarTema} />
      <main id="conteudo">
        <Abertura />
        <Prova />
        <Servicos />
        <Pista />
        <Cases />
        <Quiz />
        <Chamada />
      </main>
      <RodapeVM />
      <WhatsFlutuante />
      </MarkGuiaProvider>
    </div>
  )
}

export default HomeNova

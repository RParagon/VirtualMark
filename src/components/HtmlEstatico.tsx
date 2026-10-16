import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * HTML que veio pré-renderizado do servidor (scripts/prerender.mjs), guardado antes
 * do React montar. Enquanto o código de uma página carregada sob demanda chega,
 * ele continua na tela no lugar de uma tela vazia.
 */
let html = ''

export const guardarHtmlEstatico = (raiz: HTMLElement) => {
  html = raiz.innerHTML
}

export const HtmlEstatico = () => (html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null)

/** O HTML guardado só vale para a primeira página; na primeira navegação ele é descartado. */
export const EsquecerHtmlAoNavegar = () => {
  const { pathname } = useLocation()
  const primeira = useRef(pathname)
  useEffect(() => {
    if (pathname !== primeira.current) html = ''
  }, [pathname])
  return null
}

/** Se a página chegou pré-renderizada, a abertura dela não precisa animar de novo. */
export const veioPreRenderizada = () => html !== ''

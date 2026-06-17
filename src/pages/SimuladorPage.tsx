import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import SimuladorVM from '../components/SimuladorVM'

const WPP_NUMBER = '5511992794634'
const SITE_URL = 'https://virtualmark.com.br'

// Tema alinhado ao quiz/imobiliárias (premium escuro)
const T = {
  bg: '#0b0b0c',
  ink: '#f4f1ea',
  inkSoft: '#b9b3a7',
  inkMute: '#8a8276',
  inkFaint: '#5b554c',
  line: 'rgba(255,255,255,0.09)',
  red: '#dc2626',
  green: '#1f9d57',
}

const SimuladorPage = () => {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    const url = `${SITE_URL}/simulador-imoveis`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Fallback: seleção manual
      window.prompt('Copie o link do simulador:', url)
    }
  }

  const wppMsg = encodeURIComponent(
    'Olá! Usei o simulador de cenários da VirtualMark e quero entender como aumentar o lucro líquido da minha imobiliária.'
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.bg,
        color: T.ink,
        fontFamily: "'Hanken Grotesk', 'Segoe UI', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 16px 48px',
      }}
    >
      <Seo
        title="Simulador de Cenários para Imobiliárias | VirtualMark"
        description="Simule comissão, custos e lucro líquido da sua imobiliária por perfil de imóvel. Ajuste valor e comissão e veja o resultado real da operação em tempo real."
        path="/simulador-imoveis"
      />

      {/* Branding topo */}
      <div style={{ width: '100%', maxWidth: 960, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <Link to="/imobiliarias" style={{ textDecoration: 'none', fontSize: 21, fontWeight: 700, letterSpacing: '-0.01em', color: T.ink }}>
          <span style={{ color: T.red }}>Virtual</span>Mark
        </Link>
        <button
          onClick={copyLink}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px',
            borderRadius: 10, border: `1px solid ${T.line}`, background: 'rgba(255,255,255,0.03)',
            color: copied ? T.green : T.inkSoft, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'color .2s, border-color .2s',
          }}
          title="Salvar o link deste simulador"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            {copied ? (
              <path d="M20 6 9 17l-5-5" />
            ) : (
              <>
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </>
            )}
          </svg>
          {copied ? 'Link copiado!' : 'Copiar link'}
        </button>
      </div>

      {/* Simulador */}
      <div style={{ width: '100%', maxWidth: 960 }}>
        <SimuladorVM />
      </div>

      {/* CTA */}
      <div
        style={{
          width: '100%', maxWidth: 960, marginTop: 36, textAlign: 'center',
          padding: '30px 26px', borderRadius: 18, background: '#0f0d0d', border: `1px solid ${T.line}`,
        }}
      >
        <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em', lineHeight: 1.25 }}>
          Quer aumentar o lucro líquido da sua imobiliária?
        </h3>
        <p style={{ margin: '0 auto 22px', fontSize: 13.5, color: T.inkSoft, lineHeight: 1.55, maxWidth: 460 }}>
          A VirtualMark estrutura a captação de imóveis e o tráfego para você fechar mais vendas com a mesma equipe.
        </p>
        <a
          href={`https://wa.me/${WPP_NUMBER}?text=${wppMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '15px 40px', borderRadius: 14, fontSize: 16, fontWeight: 700,
            background: T.green, color: '#fff', textDecoration: 'none', boxShadow: '0 8px 28px rgba(31,157,87,0.28)',
          }}
        >
          Falar com Especialista
        </a>
      </div>

      {/* Rodapé / navegação */}
      <div style={{ width: '100%', maxWidth: 960, textAlign: 'center', marginTop: 28, display: 'flex', justifyContent: 'center', gap: 22, flexWrap: 'wrap' }}>
        <Link to="/quiz-imoveis" style={{ textDecoration: 'none', fontSize: 12, color: T.inkMute, fontWeight: 600, letterSpacing: '1px' }}>
          ← Fazer o diagnóstico
        </Link>
        <Link to="/imobiliarias" style={{ textDecoration: 'none', fontSize: 12, color: T.inkFaint, fontWeight: 600, letterSpacing: '1px' }}>
          VIRTUAL MARK · MKT DIGITAL
        </Link>
      </div>
    </div>
  )
}

export default SimuladorPage

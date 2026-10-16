import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, type FormEvent } from 'react'
import { getAttribution } from '../../lib/quizTracking'
import { FaWhatsapp } from 'react-icons/fa'
import { Ancora, useMarkGuia } from './MarkGuia'
import { Botao, EASE, LogoVM, Mono, Sobrelinha, Surge, waLink } from './ui'

const evento = (payload: Record<string, unknown>) => {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
}

const caixa = 'mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-20'
const tela = 'lg:flex lg:min-h-[calc(100svh-93px)] lg:flex-col lg:justify-center lg:py-[clamp(24px,5vh,112px)]'

/* ───────── Quiz de 3 perguntas com o Mark ───────── */
const PERGUNTAS = [
  { id: 'negocio', t: 'Que tipo de negócio você tem?', o: ['E-commerce', 'Loja ou serviço local', 'Clínica e saúde', 'Imobiliária', 'Outro'] },
  { id: 'verba', t: 'Quanto você investe por mês em anúncio hoje?', o: ['Ainda não invisto', 'Até R$ 2 mil', 'De R$ 2 mil a R$ 10 mil', 'Mais de R$ 10 mil'] },
  { id: 'dor', t: 'O que mais te incomoda hoje?', o: ['O anúncio gasta e não vende', 'Chegam poucos contatos', 'Os contatos não fecham', 'Não sei de onde vêm as vendas'] },
]

const COMECO: Record<string, string> = {
  'O anúncio gasta e não vende': 'Começar revendo a conta pelo custo por venda e cortando o que não traz retorno.',
  'Chegam poucos contatos': 'Começar pelo criativo e pela página do anúncio, que é onde o contato se perde.',
  'Os contatos não fecham': 'Começar pelo público e pela qualificação, para chegar gente pronta para comprar.',
  'Não sei de onde vêm as vendas': 'Começar pelo rastreio: cada lead com a origem do anúncio, num painel mensal.',
}

export const Quiz = () => {
  const [passo, setPasso] = useState(0)
  const [resp, setResp] = useState<string[]>([])
  const { definirBase, comemorar } = useMarkGuia()
  const fim = passo >= PERGUNTAS.length
  useEffect(() => definirBase('quiz', fim ? 'pronto' : passo === 0 ? 'olhando' : 'pensando'), [fim, passo, definirBase])
  const q = PERGUNTAS[Math.min(passo, PERGUNTAS.length - 1)]

  const responder = (o: string) => {
    const nova = [...resp.slice(0, passo), o]
    setResp(nova)
    evento({ event: 'home_quiz_answered', question_id: q.id, answer: o })
    window.setTimeout(() => {
      setPasso((p) => p + 1)
      if (passo + 1 >= PERGUNTAS.length) {
        evento({ event: 'home_quiz_completed', negocio: nova[0] })
        comemorar()
      }
    }, 260)
  }

  const quizCompleto = resp[0] === 'E-commerce' ? '/quiz-ecommerce' : resp[0] === 'Imobiliária' ? '/quiz-imoveis' : null
  const msg = `Oi! Fiz o diagnóstico no site da Virtual Mark.\nNegócio: ${resp[0]}\nInvestimento em anúncio: ${resp[1]}\nO que incomoda: ${resp[2]}`

  return (
    <section id="diagnostico" className={`scroll-mt-24 bg-vm-sup py-24 ${tela}`}>
      <div className={`${caixa} flex flex-col items-center gap-14 lg:flex-row lg:gap-20`}>
        <Surge className="w-full flex-1">
          <Sobrelinha>Diagnóstico em 3 perguntas</Sobrelinha>
          <h2 className="mt-6 font-manrope text-[clamp(2.1rem,3.8vw,3rem)] font-extrabold leading-[1.04] tracking-[-0.025em] text-vm-texto" style={{ textWrap: 'balance' }}>
            Conta pra gente onde você está. O Mark mostra por onde começar.
          </h2>
          <p className="mt-6 max-w-[36rem] font-manrope text-lg leading-relaxed text-vm-suave">
            O quiz muda conforme o seu tipo de negócio. No fim, você recebe o plano por WhatsApp e marca 30 minutos com a equipe.
          </p>
          <div className="relative mt-6 hidden h-[200px] items-center lg:flex baixo:h-[150px]">
            <Ancora id="quiz" estado="olhando" className="-ml-5 w-[200px] baixo:w-[150px]" />
            <AnimatePresence mode="wait">
              <motion.span
                key={fim ? 'fim' : passo}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-1 rounded-[14px] border border-vm-borda bg-vm-fundo px-3.5 py-2.5 font-manrope text-[13px] font-medium text-vm-suave"
              >
                {fim ? 'Pronto, seu diagnóstico saiu!' : passo === 0 ? 'Bora? São só três perguntas.' : 'Calculando o seu diagnóstico…'}
              </motion.span>
            </AnimatePresence>
          </div>
        </Surge>

        <Surge delay={0.1} className="w-full lg:w-[520px] lg:shrink-0">
          <div className="rounded-[28px] border border-vm-borda bg-vm-fundo p-6 sm:p-9" aria-live="polite">
            <div className="flex items-center justify-between">
              <Mono>{fim ? 'Resultado' : `Pergunta ${passo + 1} de 3`}</Mono>
              {resp[0] && <span className="font-manrope text-[13px] font-semibold text-vm-vermt">{resp[0]}</span>}
            </div>
            <div className="mt-5 flex gap-1.5" aria-hidden>
              {PERGUNTAS.map((_, i) => (
                <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-vm-borda">
                  <motion.span className="block h-full rounded-full bg-vm-verm" initial={false} animate={{ width: i < passo || fim ? '100%' : '0%' }} transition={{ duration: 0.5, ease: EASE }} />
                </span>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              {!fim ? (
                <motion.div key={passo} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease: EASE }}>
                  <p className="mt-6 font-manrope text-[26px] font-bold leading-tight tracking-[-0.01em] text-vm-texto">{q.t}</p>
                  <div className="mt-6 flex flex-col gap-2.5" role="radiogroup" aria-label={q.t}>
                    {q.o.map((o) => {
                      const sel = resp[passo] === o
                      return (
                        <button
                          key={o}
                          type="button"
                          role="radio"
                          aria-checked={sel}
                          onClick={() => responder(o)}
                          className={`flex items-center gap-3 rounded-2xl border px-[18px] py-4 text-left font-manrope text-base transition-all duration-200 hover:border-vm-vermt/60 active:scale-[0.99] ${
                            sel ? 'border-vm-verm bg-vm-verms font-semibold text-vm-texto' : 'border-vm-borda bg-vm-sup font-medium text-vm-texto'
                          }`}
                        >
                          <span className={`h-[18px] w-[18px] shrink-0 rounded-full border transition-all ${sel ? 'border-[5px] border-vm-verm' : 'border-[1.5px] border-vm-apagado'}`} />
                          {o}
                        </button>
                      )
                    })}
                  </div>
                  <div className="mt-6 flex h-6 items-center">
                    {passo > 0 && (
                      <button type="button" onClick={() => setPasso((p) => p - 1)} className="font-manrope text-sm font-medium text-vm-suave transition-colors hover:text-vm-texto">
                        ← Voltar
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="fim" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                  <p className="mt-6 font-manrope text-[26px] font-bold leading-tight tracking-[-0.01em] text-vm-texto">Por onde começar no seu caso</p>
                  <p className="mt-3 font-manrope text-lg leading-relaxed text-vm-suave">{COMECO[resp[2]]}</p>
                  <div className="mt-7 flex flex-col gap-3">
                    <Botao href={waLink(msg)} className="w-full">Receber o plano no WhatsApp</Botao>
                    {quizCompleto && (
                      <Botao tipo="contorno" href={quizCompleto} className="w-full">Fazer o diagnóstico completo</Botao>
                    )}
                  </div>
                  <button type="button" onClick={() => { setPasso(0); setResp([]) }} className="mt-5 font-manrope text-sm font-medium text-vm-suave transition-colors hover:text-vm-texto">
                    Refazer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Surge>
      </div>
    </section>
  )
}

/* ───────── Chamada final com formulário ───────── */
const FAIXAS = ['Ainda não invisto', 'Até R$ 2 mil', 'De R$ 2 mil a R$ 10 mil', 'Mais de R$ 10 mil']

const Check = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-vm-vermt" fill="none" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const campo = 'w-full rounded-[14px] border border-vm-borda bg-vm-fundo px-[18px] py-4 font-manrope text-base text-vm-texto outline-none transition-colors placeholder:text-vm-apagado focus:border-vm-vermt'

export const Chamada = () => {
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const reduce = useReducedMotion()
  const { definirBase, comemorar } = useMarkGuia()
  useEffect(() => definirBase('contato', enviado ? 'pronto' : 'esperando'), [enviado, definirBase])

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const nome = String(f.get('nome') || '').trim()
    const empresa = String(f.get('empresa') || '').trim()
    const whats = String(f.get('whatsapp') || '').trim()
    const verba = String(f.get('verba') || '')
    setEnviando(true)
    const base = { name: nome, phone: whats, email: '', business_category: empresa, monthly_revenue: `Investe em anúncio: ${verba}` }
    try {
      // import sob demanda: o cliente do Supabase só carrega quando alguém envia
      const { insertLeadWithFallback } = await import('../../lib/leadCapture')
      await insertLeadWithFallback('leads', [{ ...base, ...getAttribution() }, base])
    } catch (err) {
      console.error('Lead da home não gravou; segue pelo WhatsApp.', err)
    }
    evento({ event: 'home_lead_submitted', verba })
    setEnviando(false)
    setEnviado(true)
    comemorar()
    window.open(waLink(`Oi! Sou ${nome}, da ${empresa}. Quero minha avaliação gratuita.\nInvestimento em anúncio: ${verba}`), '_blank', 'noopener')
  }

  return (
    <section id="contato" className={`relative scroll-mt-24 overflow-hidden py-24 ${tela}`}>
      <div className="pointer-events-none absolute inset-0 -z-0" style={{ background: 'radial-gradient(50% 60% at 15% 100%, rgba(220,38,38,0.16), transparent 70%)' }} aria-hidden />
      <div className={`${caixa} relative flex flex-col items-center gap-14 lg:flex-row lg:gap-20`}>
        <Surge className="w-full flex-1">
          <Sobrelinha>Avaliação gratuita</Sobrelinha>
          <h2 className="mt-6 font-manrope text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.035em] text-vm-texto" style={{ textWrap: 'balance' }}>
            Vamos conversar sobre o seu <span className="text-vm-vermt">crescimento?</span>
          </h2>
          <ul className="mt-8 flex flex-col gap-3">
            {['Análise da sua conta de anúncio e do site', 'Plano com público, verba e criativo', '30 minutos de conversa com a equipe'].map((t) => (
              <li key={t} className="flex items-center gap-3 font-manrope text-[17px] text-vm-texto">
                <Check />
                {t}
              </li>
            ))}
          </ul>
          <Ancora id="contato" estado="esperando" className="mt-6 hidden w-[150px] lg:block baixo:mt-2 baixo:w-[110px]" />
        </Surge>
        <Surge delay={0.1} className="w-full lg:w-[560px] lg:shrink-0">
          <div className="rounded-[28px] border border-vm-borda bg-vm-sup p-6 sm:p-9 baixo:p-7">
            <AnimatePresence mode="wait" initial={false}>
              {enviado ? (
                <motion.div key="ok" initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: EASE }} className="flex flex-col items-center py-10 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-vm-verms text-vm-vermt"><Check /></span>
                  <p className="mt-4 font-manrope text-2xl font-bold tracking-[-0.01em] text-vm-texto">Recebemos! O WhatsApp abriu com a sua mensagem.</p>
                  <p className="mt-2 max-w-[36ch] font-manrope text-[15px] text-vm-suave">Se ele não abriu, é só tocar no botão abaixo. A equipe responde em horário comercial.</p>
                  <Botao href={waLink('Oi! Acabei de pedir a avaliação gratuita pelo site.')} className="mt-6">Abrir o WhatsApp</Botao>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={enviar} exit={{ opacity: 0 }} className="flex flex-col gap-4 baixo:gap-3">
                  <label className="flex flex-col gap-2">
                    <span className="font-manrope text-[13px] font-semibold text-vm-suave">Nome</span>
                    <input name="nome" required autoComplete="name" placeholder="Como podemos te chamar?" className={campo} />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-manrope text-[13px] font-semibold text-vm-suave">Empresa</span>
                    <input name="empresa" required autoComplete="organization" placeholder="Nome da empresa ou do site" className={campo} />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-manrope text-[13px] font-semibold text-vm-suave">WhatsApp</span>
                    <input name="whatsapp" required type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 9 0000-0000" pattern="[0-9()+\s-]{10,}" className={campo} />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-manrope text-[13px] font-semibold text-vm-suave">Investimento mensal em anúncio</span>
                    <select name="verba" required defaultValue="" className={`${campo} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path d=%22M6 9l6 6 6-6%22 stroke=%22%238a8a8a%22 stroke-width=%222%22 fill=%22none%22 stroke-linecap=%22round%22/></svg>')] bg-[length:18px] bg-[right_16px_center] bg-no-repeat invalid:text-vm-apagado`}>
                      <option value="" disabled>Escolha uma faixa</option>
                      {FAIXAS.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </label>
                  <Botao type="submit" className="mt-2 w-full" disabled={enviando}>
                    {enviando ? 'Enviando…' : 'Quero minha avaliação gratuita'}
                  </Botao>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Surge>
      </div>
    </section>
  )
}

/* ───────── Rodapé ───────── */
export const RodapeVM = () => (
  <footer className="border-t border-vm-borda pb-10 pt-16">
    <div className={caixa}>
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-16">
        <div>
          <LogoVM className="h-8 w-auto" />
          <p className="mt-5 font-manrope text-[22px] font-bold tracking-[-0.01em] text-vm-texto">O X da questão é vender mais.</p>
          <p className="mt-2 font-manrope text-[15px] text-vm-suave">Tráfego pago, criativos e site em um só time.</p>
        </div>
        {[
          ['Navegação', [['Serviços', '#servicos'], ['Cases', '/cases'], ['Sobre', '#como-trabalhamos'], ['Contato', '#contato']]],
          ['Contato', [['WhatsApp (11) 99279-4634', waLink('Oi! Vim pelo site da Virtual Mark.')], ['Instagram @virtualmarkgroup', 'https://www.instagram.com/virtualmarkgroup/'], ['YouTube @VirtualMark', 'https://www.youtube.com/@VirtualMark']]],
          ['Serviços', [['Tráfego pago', '#servicos'], ['Sites e landing pages', '#servicos'], ['Criativos e vídeo', '#servicos'], ['Rastreio e painel', '#servicos']]],
        ].map(([h, itens]) => (
          <div key={h as string}>
            <Mono>{h as string}</Mono>
            <ul className="mt-4 flex flex-col gap-3">
              {(itens as string[][]).map(([r, href]) => (
                <li key={r}>
                  <a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="font-manrope text-[15px] text-vm-suave transition-colors hover:text-vm-texto">
                    {r}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-vm-borda pt-6 font-manrope text-[13px] text-vm-apagado">
        <span>© {new Date().getFullYear()} Virtual Mark</span>
        <a href="/privacy-policy" className="transition-colors hover:text-vm-texto">Política de privacidade</a>
      </div>
    </div>
  </footer>
)

/* ───────── WhatsApp flutuante: aparece depois da abertura ───────── */
export const WhatsFlutuante = () => {
  const [mostrar, setMostrar] = useState(false)
  useEffect(() => {
    const onScroll = () => setMostrar(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <AnimatePresence>
      {mostrar && (
        <motion.a
          href={waLink('Oi! Vim pelo site da Virtual Mark e quero vender mais.')}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-vm-verm py-3.5 pl-4 pr-5 font-manrope text-sm font-semibold text-white shadow-[0_8px_24px_rgba(220,38,38,0.35)] transition-transform hover:-translate-y-0.5 sm:bottom-8 sm:right-8"
          aria-label="Fale no WhatsApp"
          data-mark-whats
        >
          <FaWhatsapp className="h-6 w-6" aria-hidden />
          <span className="hidden sm:inline">Fale no WhatsApp</span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}

// Voz do Mark: efeitos curtos sintetizados com Web Audio (sem arquivos).
// Só o personagem faz som (pulo, susto, piscada, fala, voo, sono, festa);
// passar o mouse em botões não toca nada.
// O navegador só libera áudio depois de um gesto da pessoa; antes disso tudo fica mudo.

export type Som = 'pulo' | 'oh' | 'pisca' | 'fala' | 'festa' | 'voo' | 'sono'

const CHAVE = 'vm-som'
let ctx: AudioContext | null = null
let ligado = false
const ouvintes = new Set<(v: boolean) => void>()

try {
  // nesta primeira versão o som começa desligado; liga só quem apertar o botão
  ligado = localStorage.getItem(CHAVE) === 'on'
} catch {
  /* sem armazenamento: fica desligado */
}

export const somLigado = () => ligado

export function alternarSom() {
  ligado = !ligado
  try {
    localStorage.setItem(CHAVE, ligado ? 'on' : 'off')
  } catch {
    /* ignora */
  }
  ouvintes.forEach((f) => f(ligado))
  if (ligado) tocar('pisca')
}

export function aoMudarSom(f: (v: boolean) => void) {
  ouvintes.add(f)
  return () => {
    ouvintes.delete(f)
  }
}

function contexto() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function nota(c: AudioContext, freq: number, ini: number, dur: number, vol: number, tipo: OscillatorType = 'sine', ate?: number) {
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = tipo
  o.frequency.setValueAtTime(freq, ini)
  if (ate) o.frequency.exponentialRampToValueAtTime(ate, ini + dur)
  g.gain.setValueAtTime(0.0001, ini)
  g.gain.exponentialRampToValueAtTime(vol, ini + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, ini + dur)
  o.connect(g).connect(c.destination)
  o.start(ini)
  o.stop(ini + dur + 0.02)
}

export function tocar(som: Som) {
  if (!ligado) return
  if (typeof navigator !== 'undefined' && 'userActivation' in navigator && !(navigator as Navigator & { userActivation: { hasBeenActive: boolean } }).userActivation.hasBeenActive) return
  const c = contexto()
  if (!c) return
  const t = c.currentTime
  if (som === 'pulo') {
    nota(c, 380, t, 0.12, 0.06, 'sine', 760)
    nota(c, 620, t + 0.1, 0.12, 0.04, 'sine', 900)
  } else if (som === 'oh') {
    nota(c, 520, t, 0.14, 0.05, 'triangle', 1180)
  } else if (som === 'pisca') {
    nota(c, 1320, t, 0.09, 0.035, 'sine', 1560)
  } else if (som === 'fala') {
    ;[0, 1, 2].forEach((i) => nota(c, 300 + Math.random() * 280, t + i * 0.075, 0.07, 0.035, 'square'))
  } else if (som === 'voo') {
    nota(c, 300, t, 0.24, 0.02, 'sine', 640)
  } else if (som === 'sono') {
    nota(c, 420, t, 0.5, 0.025, 'sine', 210)
  } else if (som === 'festa') {
    ;[523, 659, 784, 1047].forEach((f, i) => nota(c, f, t + i * 0.08, 0.22, 0.05, 'triangle'))
  }
}

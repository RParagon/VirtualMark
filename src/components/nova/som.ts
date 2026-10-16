// Efeitos sonoros curtos, sintetizados com Web Audio (sem arquivos).
// O navegador só libera áudio depois de um gesto da pessoa; antes disso tudo fica mudo.

export type Som = 'hover' | 'clique' | 'escolha' | 'festa' | 'voo'

const CHAVE = 'vm-som'
let ctx: AudioContext | null = null
let ligado = true
let ultimoHover = 0
const ouvintes = new Set<(v: boolean) => void>()

try {
  ligado = localStorage.getItem(CHAVE) !== 'off'
} catch {
  /* sem armazenamento: fica ligado */
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
  if (ligado) tocar('clique')
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
  if (som === 'hover') {
    if (performance.now() - ultimoHover < 90) return
    ultimoHover = performance.now()
    nota(c, 880, t, 0.06, 0.025, 'sine', 1040)
  } else if (som === 'clique') {
    nota(c, 520, t, 0.08, 0.06, 'triangle', 780)
  } else if (som === 'escolha') {
    nota(c, 660, t, 0.09, 0.05, 'triangle')
    nota(c, 990, t + 0.07, 0.12, 0.045, 'triangle')
  } else if (som === 'voo') {
    nota(c, 300, t, 0.22, 0.02, 'sine', 620)
  } else if (som === 'festa') {
    ;[523, 659, 784, 1047].forEach((f, i) => nota(c, f, t + i * 0.08, 0.22, 0.05, 'triangle'))
  }
}

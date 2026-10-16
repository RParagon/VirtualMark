// Mark v3: o ponto do "vm." como personagem plano. Porte do motor
// paragon-entrega/motor/mark-v3/mark-v3.js. Função pura do tempo:
// markSvg(t, estado, opts) devolve o <svg> do quadro t (em segundos).

export type MarkEstado =
  | 'parado'
  | 'olhando'
  | 'pensando'
  | 'trabalhando'
  | 'esperando'
  | 'pronto'
  | 'travado'
  | 'falando'
  | 'surpreso'
  | 'procurando'
  | 'comemorando'
  | 'analisando'
  | 'atendendo'
  | 'dormindo'
  | 'gerindo'
  | 'lendo'
  | 'piscando'

/**
 * look: para onde os olhos apontam (-1 a 1), ex.: seguindo o cursor.
 * de + k: transição suave vindo do estado `de` (k vai de 0 a 1).
 */
export type MarkOpts = { shadow?: boolean; color?: string; look?: [number, number]; de?: MarkEstado; k?: number }

const RED = '#dc2626'
const INK = '#0a0a0a'
const TAU = Math.PI * 2
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x))
const lerp = (a: number, b: number, k: number) => a + (b - a) * k

function blob(sx: number, sy: number, wob: number, t: number) {
  const pts: [number, number][] = []
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * TAU
    const r = 100 * (1 + wob * 0.025 * Math.sin(3 * a + t * 4) + wob * 0.015 * Math.sin(5 * a - t * 3))
    const x = Math.cos(a) * r * sx
    let y = Math.sin(a) * r * sy
    if (y > 0) y *= 0.965 - 0.04 * Math.pow(Math.abs(Math.cos(a)), 6)
    pts.push([x, y])
  }
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % pts.length]
    const p3 = pts[(i + 2) % pts.length]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
  }
  return d + ' Z'
}

type EyeOpts = { h: number; w?: number; tilt?: number; arc?: boolean; x?: boolean }

function eye(cx: number, cy: number, o: EyeOpts) {
  if (o.arc) return `<path d="M ${cx - 12} ${cy + 7} Q ${cx} ${cy - 14} ${cx + 12} ${cy + 7}" fill="none" stroke="${INK}" stroke-width="9.5" stroke-linecap="round"/>`
  if (o.x) return `<path d="M ${cx - 8} ${cy - 8} L ${cx + 8} ${cy + 8} M ${cx + 8} ${cy - 8} L ${cx - 8} ${cy + 8}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`
  const w = 17 * (o.w || 1)
  const h = Math.max(5, 38 * o.h)
  return `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${w / 2}" fill="${INK}" transform="rotate(${o.tilt || 0} ${cx} ${cy})"/>`
}

function blinkAt(t: number, period: number, off = 0) {
  const p = ((t + off) % period) / period
  return 1 - clamp(1 - Math.abs(p - 0.5) / 0.03)
}

type Pose = {
  back: string; w: number; y: number; sx: number; sy: number; rot: number; wob: number
  look: [number, number]; h: number; tilt: number; arc: boolean; x: boolean; extra: string; focus?: boolean
}

function pose(t: number, estado: MarkEstado): Pose {
  const s: Pose = { back: '', w: 1, y: 0, sx: 1.0, sy: 0.975, rot: 0, wob: 0, look: [0, 0], h: 1, tilt: 0, arc: false, x: false, extra: '' }
  const breathe = Math.sin((t * TAU) / 3.2)
  s.sx += breathe * 0.012
  s.sy -= breathe * 0.012
  if (estado === 'parado' || estado === 'olhando' || estado === 'analisando' || estado === 'atendendo') {
    const k = Math.floor(t / 2.6)
    const f = ease((t % 2.6) / 0.35)
    const L: [number, number][] = [[0, 0], [0.7, -0.2], [0, 0], [-0.6, 0.15]]
    const a = L[(k + 3) % 4]
    const b = L[k % 4]
    s.look = [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]
    s.h = blinkAt(t, 3.4, 1.1)
  }
  if (estado === 'pensando') {
    s.look = [0.6, -0.8]
    s.h = 0.78 * blinkAt(t, 4, 2)
    s.rot = Math.sin((t * TAU) / 2.4) * 4
    const a = (t * TAU) / 1.6
    const dot = `<circle cx="${(Math.cos(a) * 140).toFixed(1)}" cy="${(-70 + Math.sin(a) * 26).toFixed(1)}" r="${(10 + 3 * Math.sin(a)).toFixed(1)}" fill="${RED}"/>`
    if (Math.sin(a) < 0) s.back = dot
    else s.extra = dot
  }
  if (estado === 'trabalhando') {
    const p = (t % 0.5) / 0.5
    const hop = Math.sin(p * Math.PI)
    s.y = -hop * 26
    s.sy = 0.975 + hop * 0.07 - (1 - hop) * 0.05
    s.sx = 1.0 - hop * 0.05 + (1 - hop) * 0.05
    s.look = [0.35, 0.1]
    s.h = 0.62
    s.wob = 0.2
    s.focus = true
  }
  if (estado === 'esperando') {
    s.rot = Math.sin((t * TAU) / 2) * 6
    s.h = blinkAt(t, 2.2, 0.6)
    s.y = -Math.max(0, Math.sin(t * TAU)) * 4
  }
  if (estado === 'pronto') {
    const p = (t % 1.4) / 1.4
    const hop = p < 0.4 ? Math.sin((p / 0.4) * Math.PI) : 0
    s.y = -hop * 40
    s.sy = 0.975 + hop * 0.06
    s.sx = 1.0 - hop * 0.04
    s.arc = true
    const sp = clamp((p - 0.15) / 0.5)
    if (sp > 0 && sp < 1)
      s.extra = [[-120, -90], [125, -70], [-95, -135]]
        .map(([x, y], i) => `<path d="M ${x} ${y - 14 * (1 - sp)} l 0 -12 M ${x - 6} ${y - 6 - 14 * (1 - sp)} l 12 0" stroke="${RED}" stroke-width="5" stroke-linecap="round" opacity="${(1 - sp).toFixed(2)}" transform="translate(0 ${-i * 4})"/>`)
        .join('')
  }
  if (estado === 'travado') {
    s.x = true
    s.rot = Math.sin(t * 40) * 1.5 * (Math.sin((t * TAU) / 1.8) > 0.6 ? 1 : 0)
  }
  if (estado === 'falando') {
    const syl = Math.abs(Math.sin(t * 9.3)) * Math.abs(Math.sin(t * 3.1 + 1))
    s.sy += syl * 0.045
    s.sx -= syl * 0.03
    s.y = -syl * 5
    s.h = blinkAt(t, 2.7, 0.3)
    s.look = [0.1, 0]
  }
  if (estado === 'surpreso') {
    const p = (t % 2.4) / 2.4
    const pop = p < 0.18 ? Math.sin((p / 0.18) * Math.PI) : 0
    s.y = -pop * 22
    s.h = 1.18
    s.w = 1.15
    s.sy += pop * 0.05
    s.extra = `<path d="M 118 -120 l 0 34" stroke="${RED}" stroke-width="9" stroke-linecap="round" opacity="${p < 0.6 ? 1 : 0}"/><circle cx="118" cy="-68" r="5" fill="${RED}" opacity="${p < 0.6 ? 1 : 0}"/>`
  }
  if (estado === 'procurando') {
    const k = Math.sin((t * TAU) / 2.2)
    s.look = [k, 0.1]
    s.h = 0.72
    s.rot = k * 3
  }
  if (estado === 'dormindo') {
    const b = Math.sin((t * TAU) / 3.6)
    s.sx += b * 0.03
    s.sy -= b * 0.03
    s.h = 0.1
    s.look = [0, 0.4]
    s.extra = [0, 1, 2]
      .map((i) => {
        const f = (t / 3 + i / 3) % 1
        return `<text x="${(70 + f * 60).toFixed(1)}" y="${(-80 - f * 80).toFixed(1)}" font-family="Manrope,Inter,sans-serif" font-weight="800" font-size="${(22 + f * 18).toFixed(1)}" fill="${RED}" opacity="${Math.sin(f * Math.PI).toFixed(2)}">z</text>`
      })
      .join('')
  }
  if (estado === 'gerindo') {
    // "fingindo" que gere anúncios: olha para um painelzinho com barras que sobem
    s.look = [0.55, 0.55]
    s.h = 0.7 * blinkAt(t, 3.1, 0.4)
    s.rot = Math.sin((t * TAU) / 3) * 2
    const bars = [0, 1, 2, 3]
      .map((i) => {
        const hh = 14 + 26 * (0.5 + 0.5 * Math.sin(t * 2.2 + i * 1.3)) * (0.6 + i * 0.15)
        return `<rect x="${78 + i * 17}" y="${(96 - hh).toFixed(1)}" width="11" height="${hh.toFixed(1)}" rx="3" fill="${i === 3 ? RED : '#a3a3a3'}"/>`
      })
      .join('')
    s.extra = `<g><rect x="64" y="34" width="86" height="72" rx="12" fill="${INK}" stroke="#3a3a3a" stroke-width="3"/>${bars}<circle cx="${(84 + 50 * (0.5 + 0.5 * Math.sin(t * 1.4))).toFixed(1)}" cy="46" r="4" fill="#22c55e"/></g>`
  }
  if (estado === 'lendo') {
    // lê o que a pessoa digita: os olhos varrem a linha e voltam, cabeça um pouco baixa
    const p = (t % 1.3) / 1.3
    const varre = p < 0.82 ? -0.8 + (1.6 * p) / 0.82 : 0.8 - (1.6 * (p - 0.82)) / 0.18
    s.look = [varre, 0.55]
    s.h = 0.72 * blinkAt(t, 3.6, 0.9)
    s.rot = -3
    s.y = 2
  }
  if (estado === 'piscando') {
    // piscadinha de um olho só: feliz e cúmplice
    s.arc = true
    s.y = -Math.abs(Math.sin(t * 5)) * 6
    s.rot = 5
  }
  if (estado === 'comemorando') {
    s.arc = true
    s.rot = Math.sin(t * TAU * 2) * 9
    s.y = -Math.abs(Math.sin(t * TAU)) * 18
    s.extra = Array.from({ length: 10 }, (_, i) => {
      const a = i * 2.4 + 0.7
      const f = (t * 0.7 + i / 10) % 1
      const x = Math.cos(a) * (60 + f * 120)
      const y = -60 - f * 120 + f * f * 200
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="10" height="16" rx="2" fill="${i % 3 ? RED : '#fafafa'}" opacity="${(1 - f).toFixed(2)}" transform="rotate(${(f * 360 + i * 40).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
    }).join('')
  }
  return s
}

const ACC: Partial<Record<MarkEstado, string>> = {
  analisando: `<g fill="none" stroke="${INK}" stroke-width="7"><circle cx="-25" cy="-4" r="27"/><circle cx="25" cy="-4" r="27"/><path d="M -52 -8 L -84 -18 M 52 -8 L 84 -18" stroke-linecap="round"/></g>`,
  atendendo: `<g><path d="M -86 -10 Q -84 -112 0 -112 Q 84 -112 86 -10" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><rect x="-100" y="-30" width="22" height="44" rx="10" fill="${INK}"/><rect x="78" y="-30" width="22" height="44" rx="10" fill="${INK}"/><path d="M -90 14 Q -80 54 -36 58" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="-34" cy="58" r="7" fill="${INK}"/></g>`,
}

const OLHAR_LIVRE = new Set<MarkEstado>(['parado', 'olhando', 'surpreso', 'falando', 'atendendo', 'analisando', 'esperando'])

const mistura = (a: Pose, b: Pose, k: number): Pose => {
  // números se misturam; o que é "sim ou não" troca no meio, escondido por uma piscada
  const e = ease(k)
  const m: Pose = { ...(k < 0.5 ? a : b) }
  m.y = lerp(a.y, b.y, e)
  m.sx = lerp(a.sx, b.sx, e)
  m.sy = lerp(a.sy, b.sy, e)
  m.rot = lerp(a.rot, b.rot, e)
  m.wob = lerp(a.wob, b.wob, e)
  m.w = lerp(a.w, b.w, e)
  m.look = [lerp(a.look[0], b.look[0], e), lerp(a.look[1], b.look[1], e)]
  const piscada = 1 - Math.sin(Math.PI * clamp(k)) * 0.85
  m.h = Math.min(lerp(a.h, b.h, e), piscada)
  return m
}

/** Conteúdo interno do SVG (viewBox -170 -170 340 340) para o quadro t. */
export function markInner(tempo: number, estado: MarkEstado = 'parado', opts: MarkOpts = {}) {
  // o rAF pode entregar um instante anterior ao início; tempo negativo quebra a pose
  const t = Math.max(0, tempo)
  const poseCom = (e: MarkEstado) => {
    const p = pose(t, e)
    // olhos que seguem o cursor só nos estados de olhar livre
    if (opts.look && OLHAR_LIVRE.has(e)) p.look = opts.look
    return p
  }
  const k = opts.de && opts.de !== estado && opts.k != null ? clamp(opts.k) : 1
  const s = k < 1 ? mistura(poseCom(opts.de as MarkEstado), poseCom(estado), k) : poseCom(estado)
  const acc = ACC[k < 0.5 && opts.de ? opts.de : estado] || ''
  const piscaUm = estado === 'piscando' && k >= 0.5
  const ex = 23
  const ey = -4
  const lx = s.look[0] * 9
  const ly = s.look[1] * 9
  const eyes = piscaUm
    ? eye(-ex + lx, ey + ly, { h: 1, arc: true }) + eye(ex + lx, ey + ly, { h: Math.max(s.h, 0.9) })
    : s.focus
      ? eye(-ex + lx, ey + ly, { h: s.h, tilt: 14 }) + eye(ex + lx, ey + ly, { h: s.h, tilt: -14 })
      : eye(-ex + lx, ey + ly, s) + eye(ex + lx, ey + ly, s)
  const shadowK = 1 - clamp(-s.y / 60) * 0.5
  const shadow = opts.shadow === false
    ? ''
    : `<ellipse cx="0" cy="104" rx="${(74 * shadowK).toFixed(1)}" ry="${(9 * shadowK).toFixed(1)}" fill="#000" opacity="${(0.28 * shadowK).toFixed(2)}"/>`
  return `${shadow}${s.back}<g transform="translate(0 ${s.y.toFixed(2)}) rotate(${s.rot.toFixed(2)} 0 90)"><g transform="translate(0 ${(100 * (1 - s.sy) * 0.93).toFixed(2)})"><path d="${blob(s.sx, s.sy, s.wob, t)}" fill="${opts.color || RED}"/></g>${acc}${eyes}</g>${s.extra}`
}

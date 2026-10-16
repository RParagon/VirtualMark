import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * "Pipeline": o diagrama vivo do serviço da VirtualMark.
 *
 * Um fluxo de pontos percorre uma pista em loop. Quatro portões marcam as quatro frentes:
 *  1 Atrair    funil que recolhe a atenção dispersa
 *  2 Converter o X da marca: tudo que passa sai organizado e vermelho
 *  3 Medir     nós nas pistas (cada ponto leva a origem, o gclid)
 *  4 Reter     a pista faz uma curva e volta: quem comprou retorna (LTV)
 *
 * `stage` (0..4) posiciona a câmera: 0 = visão geral (hero), 1..4 = cada portão.
 * Quem controla `stage` é a rolagem da página (ver PipelineCanvas).
 */

import { GATES } from './constants'

export { GATES }
const W = 21
const R = 2.5
const X0 = -12

type V3 = [number, number, number]
type Key = { p: V3; t: V3 }

/** Câmera: posição e alvo por estágio. Cada par define o enquadramento de um portão. */
const KEYS: Key[] = [
  { p: [-10.4, 3.2, 15.0], t: [1.2, 1.0, 0] }, // 0 visão geral: de frente para o fluxo, em diagonal
  { p: [-16.2, 2.3, 8.6], t: [-3.4, 0.2, 0] }, // 1 funil
  { p: [-8.6, 0.9, 5.6], t: [-1.0, 0.1, 0] }, // 2 X
  { p: [0.2, 1.5, 6.4], t: [4.2, 0.0, 0] }, // 3 medição
  { p: [-1.2, 3.0, 27.5], t: [-1.2, 2.5, 0] }, // 4 loop
]

/** hero em tela estreita: o X de perto, com um pedaço do funil e do fluxo */
const KEY0_NARROW: Key = { p: [-8.6, 2.7, 15.4], t: [-2.0, 0.8, 0] }

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPx;
  uniform float uSize;
  uniform float uFocusX;
  uniform float uFocusR;
  uniform float uFocus;
  uniform float uLoop;
  attribute vec4 aSeed;
  varying float vAlpha;
  varying float vHot;

  const float W = ${W.toFixed(1)};
  const float R = ${R.toFixed(1)};
  const float X0 = ${X0.toFixed(1)};
  const float PI = 3.14159265;

  void main() {
    float L = 2.0 * W + 2.0 * PI * R;
    float s = fract(aSeed.x + uTime * (2.1 / L) * (0.86 + 0.28 * aSeed.y)) * L;

    vec2 p;
    vec2 n = vec2(0.0, 1.0);
    float seg;
    float a = 0.0;
    if (s < W) {
      p = vec2(X0 + s, 0.0);
      seg = 0.0;
    } else if (s < W + PI * R) {
      a = (s - W) / R;
      p = vec2(X0 + W + sin(a) * R, R - cos(a) * R);
      n = vec2(sin(a), -cos(a));
      seg = 1.0;
    } else if (s < 2.0 * W + PI * R) {
      float u = s - W - PI * R;
      p = vec2(X0 + W - u, 2.0 * R);
      seg = 2.0;
    } else {
      a = (s - 2.0 * W - PI * R) / R;
      p = vec2(X0 - sin(a) * R, R + cos(a) * R);
      n = vec2(-sin(a), cos(a));
      seg = 3.0;
    }

    // caos de quem acabou de chegar: cresce à esquerda do X, some depois do portão 2
    float c = 0.0;
    if (seg == 0.0) c = 1.0 - smoothstep(-9.5, -1.9, p.x);
    if (seg == 3.0) c = smoothstep(0.35, 1.0, a / PI);
    float chaosY = (aSeed.z - 0.5) * (0.5 + 6.2 * c);
    float chaosZ = (aSeed.w - 0.5) * (0.4 + 6.4 * c);

    float lane = (floor(aSeed.z * 5.0) - 2.0) * 0.32;
    float off = mix(lane, chaosY, c);
    vec2 q = p + n * off;
    float z = mix((aSeed.w - 0.5) * 0.1, chaosZ, c);

    vec4 mv = modelViewMatrix * vec4(q.x, q.y, z, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPx * (0.9 + 1.1 * aSeed.y) * (9.0 / -mv.z);

    // cor: frio antes do X, vermelho depois; na volta esmaece
    float hot = 1.0;
    if (seg == 0.0) hot = smoothstep(-2.6, -1.1, p.x);
    if (seg == 3.0) hot = 1.0 - smoothstep(0.2, 0.9, a / PI);
    vHot = hot;

    float base = seg == 0.0 ? mix(0.6, 1.0, hot) : (seg == 2.0 ? 0.65 : 0.9);
    float focus = exp(-pow((p.x - uFocusX) / uFocusR, 2.0));
    float f = mix(1.0, 0.4 + 1.1 * focus, uFocus);
    float loopBoost = seg == 0.0 ? 1.0 : mix(1.0, 2.1, uLoop);
    float loopDim = seg == 0.0 ? mix(1.0, 0.5, uLoop) : 1.0;
    vAlpha = base * f * loopBoost * loopDim;
  }
`

const FRAG = /* glsl */ `
  varying float vAlpha;
  varying float vHot;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.28, d);
    vec3 cold = vec3(0.66, 0.68, 0.74);
    vec3 hot = vec3(1.0, 0.22, 0.24);
    gl_FragColor = vec4(mix(cold, hot, vHot), a * vAlpha);
  }
`

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const smooth = (t: number) => t * t * (3 - 2 * t)

export type PipelineOptions = {
  host: HTMLElement
  count: number
  /** tempo congelado (prefers-reduced-motion) */
  frozen: boolean
}

export type PipelineFrame = {
  stage: number
  time: number
  px: number
  py: number
}

export type Layout = {
  w: number
  h: number
  /** deslocamento horizontal do cenário, em fração da largura (empurra o cenário para a direita) */
  shiftX: number
  shiftY: number
  dpr: number
}

const DIM = new THREE.Color(0x8d909b)
const HOT = new THREE.Color(0xff2c3c)

export function createPipeline({ host, count, frozen }: PipelineOptions) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  host.appendChild(renderer.domElement)
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = env
  scene.environmentIntensity = 0.5

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 120)

  const disposables: { dispose: () => void }[] = [env, pmrem]
  const track = <T extends { dispose: () => void }>(o: T) => {
    disposables.push(o)
    return o
  }

  /* ───────── chão em grade, bem discreto ───────── */
  {
    const pos: number[] = []
    const col: number[] = []
    const y = -2.3
    const push = (x: number, z: number, k: number) => {
      pos.push(x, y, z)
      col.push(0.16 * k, 0.16 * k, 0.2 * k)
    }
    const fade = (x: number, z: number) => clamp(1 - (Math.abs(z) / 11 + Math.abs(x - 1) / 22) * 0.9, 0, 1)
    for (let z = -10; z <= 10; z += 2) {
      for (let x = -18; x < 18; x += 2) {
        push(x, z, fade(x, z))
        push(x + 2, z, fade(x + 2, z))
      }
    }
    for (let x = -18; x <= 18; x += 2) {
      for (let z = -10; z < 10; z += 2) {
        push(x, z, fade(x, z))
        push(x, z + 2, fade(x, z + 2))
      }
    }
    const g = track(new THREE.BufferGeometry())
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    const m = track(
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
    )
    scene.add(new THREE.LineSegments(g, m))
  }

  /* ───────── trilho do fluxo (linha fina) ───────── */
  let trackMat: THREE.LineBasicMaterial
  {
    const pts: THREE.Vector3[] = []
    const N = 160
    const add = (x: number, y: number) => pts.push(new THREE.Vector3(x, y, 0))
    for (let i = 0; i <= N; i++) add(X0 + (W * i) / N, 0)
    for (let i = 1; i <= 40; i++) {
      const a = (Math.PI * i) / 40
      add(X0 + W + Math.sin(a) * R, R - Math.cos(a) * R)
    }
    for (let i = 1; i <= N; i++) add(X0 + W - (W * i) / N, 2 * R)
    for (let i = 1; i <= 40; i++) {
      const a = (Math.PI * i) / 40
      add(X0 - Math.sin(a) * R, R + Math.cos(a) * R)
    }
    const g = track(new THREE.BufferGeometry().setFromPoints(pts))
    trackMat = track(new THREE.LineBasicMaterial({ color: 0xff2c3c, transparent: true, opacity: 0.16, depthWrite: false }))
    scene.add(new THREE.Line(g, trackMat))
  }

  /* ───────── portões ───────── */
  const ringGeo = (r: number) => track(new THREE.TorusGeometry(r, 0.014, 6, 140).rotateY(Math.PI / 2))
  const ringMats: THREE.MeshBasicMaterial[] = []
  const lineMats: THREE.LineBasicMaterial[] = []
  const gateGroups: THREE.Group[] = []
  const mkRingMat = () => {
    const m = track(new THREE.MeshBasicMaterial({ color: DIM, transparent: true, opacity: 0.4, depthWrite: false }))
    ringMats.push(m)
    return m
  }
  const mkLineMat = () => {
    const m = track(new THREE.LineBasicMaterial({ color: DIM, transparent: true, opacity: 0.35, depthWrite: false }))
    lineMats.push(m)
    return m
  }

  // 1 · funil
  {
    const g = new THREE.Group()
    g.position.x = GATES[0]
    const mat = mkRingMat()
    g.add(new THREE.Mesh(ringGeo(2.7), mat))
    const inner = new THREE.Mesh(ringGeo(0.9), mat)
    inner.position.x = 2.2
    g.add(inner)
    const verts: number[] = []
    const n = 14
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      verts.push(0, Math.cos(a) * 2.7, Math.sin(a) * 2.7, 2.2, Math.cos(a) * 0.9, Math.sin(a) * 0.9)
    }
    const lg = track(new THREE.BufferGeometry())
    lg.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    g.add(new THREE.LineSegments(lg, mkLineMat()))
    scene.add(g)
    gateGroups.push(g)
  }

  // 2 · o X
  const xBars: THREE.Mesh[] = []
  const xMat = track(
    new THREE.MeshStandardMaterial({ color: 0x0e0b0c, metalness: 0.92, roughness: 0.24, emissive: new THREE.Color(0xff2c3c), emissiveIntensity: 0 })
  )
  {
    const g = new THREE.Group()
    g.position.x = GATES[1]
    g.add(new THREE.Mesh(ringGeo(1.95), mkRingMat()))
    const barGeo = track(new THREE.BoxGeometry(0.2, 3.8, 0.2))
    for (const s of [1, -1]) {
      const b = new THREE.Mesh(barGeo, xMat)
      b.rotation.x = (s * Math.PI) / 4
      g.add(b)
      xBars.push(b)
    }
    const edge = track(new THREE.EdgesGeometry(barGeo))
    for (const b of xBars) {
      const e = new THREE.LineSegments(edge, mkLineMat())
      b.add(e)
    }
    scene.add(g)
    gateGroups.push(g)
  }

  // 3 · medição
  const nodes: THREE.Mesh[] = []
  const nodeMat = track(new THREE.MeshBasicMaterial({ color: HOT, transparent: true, opacity: 0.55 }))
  {
    const g = new THREE.Group()
    g.position.x = GATES[2]
    g.add(new THREE.Mesh(ringGeo(1.3), mkRingMat()))
    const sg = track(new THREE.SphereGeometry(0.075, 16, 12))
    const tg = track(new THREE.TorusGeometry(0.16, 0.006, 6, 40).rotateY(Math.PI / 2))
    const tm = mkRingMat()
    for (let i = -2; i <= 2; i++) {
      const s = new THREE.Mesh(sg, nodeMat)
      s.position.y = i * 0.32
      g.add(s)
      nodes.push(s)
      const t = new THREE.Mesh(tg, tm)
      t.position.y = i * 0.32
      g.add(t)
    }
    scene.add(g)
    gateGroups.push(g)
  }

  // 4 · retorno
  {
    const g = new THREE.Group()
    g.position.x = GATES[3]
    g.add(new THREE.Mesh(ringGeo(1.05), mkRingMat()))
    scene.add(g)
    gateGroups.push(g)
  }

  /* ───────── fluxo de pontos ───────── */
  const seeds = new Float32Array(count * 4)
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random()
  const pg = track(new THREE.BufferGeometry())
  pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
  pg.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
  const pm = track(
    new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPx: { value: 1 },
        uSize: { value: 3.3 },
        uFocusX: { value: GATES[1] },
        uFocusR: { value: 2.4 },
        uFocus: { value: 0 },
        uLoop: { value: 0 },
      },
    })
  )
  const points = new THREE.Points(pg, pm)
  points.frustumCulled = false
  scene.add(points)

  /* luz para o X */
  const red = new THREE.PointLight(0xff2c3c, 45, 20, 1.6)
  red.position.set(GATES[1] - 2.5, 2.2, 3.2)
  const cool = new THREE.DirectionalLight(0xbfc8ff, 0.5)
  cool.position.set(2, 4, 6)
  scene.add(red, cool)

  /* ───────── layout ───────── */
  let layout: Layout = { w: 1, h: 1, shiftX: 0, shiftY: 0, dpr: 1 }
  let narrow = false
  const setLayout = (l: Layout) => {
    layout = l
    renderer.setPixelRatio(l.dpr)
    renderer.setSize(l.w, l.h, false)
    camera.aspect = l.w / l.h
    // mantém a largura útil do cenário em telas mais "quadradas" ou em retrato
    const a = l.w / l.h
    narrow = a < 1
    camera.fov = narrow ? 36 : (2 * Math.atan(Math.tan((16 * Math.PI) / 180) * Math.max(1, 1.78 / a)) * 180) / Math.PI
    camera.setViewOffset(l.w, l.h, -l.shiftX * l.w, -l.shiftY * l.h, l.w, l.h)
    camera.updateProjectionMatrix()
    pm.uniforms.uPx.value = l.dpr
  }

  const setShift = (shiftX: number, shiftY: number) => {
    layout = { ...layout, shiftX, shiftY }
    camera.setViewOffset(layout.w, layout.h, -shiftX * layout.w, -shiftY * layout.h, layout.w, layout.h)
    camera.updateProjectionMatrix()
  }

  /* ───────── quadro ───────── */
  const camPos = new THREE.Vector3()
  const camTgt = new THREE.Vector3()
  const tmp = new THREE.Vector3()

  const poseAt = (stage: number) => {
    const s = clamp(stage, 0, 4)
    const i = Math.min(3, Math.floor(s))
    const e = smooth(s - i)
    const a = i === 0 && narrow ? KEY0_NARROW : KEYS[i]
    const b = KEYS[i + 1]
    camPos.set(a.p[0] + (b.p[0] - a.p[0]) * e, a.p[1] + (b.p[1] - a.p[1]) * e, a.p[2] + (b.p[2] - a.p[2]) * e)
    camTgt.set(a.t[0] + (b.t[0] - a.t[0]) * e, a.t[1] + (b.t[1] - a.t[1]) * e, a.t[2] + (b.t[2] - a.t[2]) * e)
  }

  const render = (f: PipelineFrame) => {
    poseAt(f.stage)
    camPos.x += f.px * 0.6
    camPos.y += f.py * 0.35
    camera.position.copy(camPos)
    camera.lookAt(camTgt)

    // foco: no hero, o X; nos estágios, o portão atual
    const st = f.stage
    const gi = clamp(Math.round(st) - 1, 0, 3)
    pm.uniforms.uTime.value = frozen ? 7 : f.time
    pm.uniforms.uFocus.value = st < 1 ? st * 0.8 : 0.8
    pm.uniforms.uFocusX.value = st < 1 ? GATES[1] + (GATES[0] - GATES[1]) * smooth(st) : GATES[gi]
    pm.uniforms.uFocusR.value = st > 3.2 ? 6.5 : 2.6
    pm.uniforms.uLoop.value = clamp(st - 3, 0, 1)

    // portões: o atual acende em vermelho; no hero o X é a estrela
    for (let i = 0; i < 4; i++) {
      let a = clamp(1 - Math.abs(st - (i + 1)), 0, 1)
      if (i === 1) a = Math.max(a, 0.95 * clamp(1 - st, 0, 1))
      const op = 0.3 + 0.7 * a + 0.2 * clamp(1 - st, 0, 1)
      gateGroups[i].traverse((o) => {
        const mm = (o as THREE.Mesh).material as THREE.Material | undefined
        if (mm && 'color' in mm && mm !== xMat && mm !== nodeMat) {
          ;(mm as THREE.MeshBasicMaterial).color.copy(DIM).lerp(HOT, a)
          mm.opacity = op
        }
      })
    }
    trackMat.opacity = 0.14 + 0.3 * clamp(st - 3, 0, 1)
    xMat.emissiveIntensity = 0.5 * clamp(1 - Math.abs(st - 2), 0, 1) + 0.5 * clamp(1 - st, 0, 1)
    const aMed = clamp(1 - Math.abs(st - 3), 0, 1)
    nodeMat.opacity = 0.45 + 0.55 * aMed
    nodes.forEach((n, i) => n.scale.setScalar(1 + (frozen ? 0 : 0.45 * aMed * Math.sin(f.time * 4 + i * 0.9))))
    if (!frozen) xBars.forEach((b, i) => (b.rotation.x = ((i === 0 ? 1 : -1) * Math.PI) / 4 + Math.sin(f.time * 0.35) * 0.05))

    renderer.render(scene, camera)
  }

  /** posição de um ponto do mundo, em pixels (no espaço do canvas) */
  const project = (x: number, y: number, z = 0) => {
    tmp.set(x, y, z).project(camera)
    return { x: (tmp.x * 0.5 + 0.5) * layout.w, y: (-tmp.y * 0.5 + 0.5) * layout.h, behind: tmp.z > 1 }
  }

  const dispose = () => {
    disposables.forEach((d) => d.dispose())
    renderer.dispose()
    renderer.domElement.remove()
  }

  return { setLayout, setShift, render, project, dispose }
}

export type Pipeline = ReturnType<typeof createPipeline>

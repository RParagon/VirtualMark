import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * O "X da questão": duas barras de obsidiana polida cruzadas, com um fluxo de
 * partículas que atravessa. À esquerda do X a atenção chega dispersa e fria;
 * ao atravessar, converge e sai organizada em pistas vermelhas (a venda
 * rastreada). Carregado sob demanda (React.lazy) e pausado fora da tela.
 * Mobile e prefers-reduced-motion: um único quadro estático da mesma cena.
 */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute vec4 aSeed;
  varying float vAfter;
  varying float vAlpha;

  void main() {
    float t = fract(aSeed.x + uTime * (0.045 + aSeed.y * 0.03));
    float x = mix(-9.0, 9.0, t);

    // 1 = caos (antes do X), 0 = ordem (depois do X)
    float chaos = 1.0 - smoothstep(-1.6, 0.9, x);
    float after = smoothstep(0.7, 2.6, x);

    float baseY = (aSeed.z - 0.5);
    float baseZ = (aSeed.w - 0.5);

    float wob = sin(uTime * 0.8 + aSeed.x * 40.0) * 0.35;
    float y = baseY * (0.5 + 5.2 * chaos) + wob * chaos;
    float z = baseZ * (0.5 + 4.0 * chaos);

    // depois do X: encaixa em 5 pistas
    float lane = (floor(aSeed.z * 5.0) - 2.0) * 0.34;
    y = mix(y, lane, after);
    z = mix(z, 0.0, after * 0.9);

    vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + 0.9 * after + 0.5 * aSeed.y) * (14.0 / -mv.z);

    vAfter = after;
    vAlpha = smoothstep(-9.0, -6.5, x) * (1.0 - smoothstep(6.5, 9.0, x)) * (0.35 + 0.65 * after + 0.25 * aSeed.y);
  }
`

const FRAG = /* glsl */ `
  varying float vAfter;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    vec3 cold = vec3(0.72, 0.74, 0.8);
    vec3 hot = vec3(1.0, 0.18, 0.16);
    vec3 col = mix(cold, hot, vAfter);
    gl_FragColor = vec4(col * (0.5 + 0.8 * core), core * vAlpha * (1.0 - 0.4 * vAfter));
  }
`

const XScene = () => {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 640
    const animated = !reduce && !small

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return // sem WebGL: o brilho em CSS do hero cobre
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, animated ? 1.75 : 1.5))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    el.appendChild(renderer.domElement)
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex
    scene.environmentIntensity = 0.55

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0, 14)

    // O X: duas barras bisseladas cruzadas
    const rig = new THREE.Group()
    scene.add(rig)
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x120808,
      metalness: 1,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1,
    })
    const barGeo = new RoundedBoxGeometry(5.6, 0.82, 0.82, 6, 0.18)
    const barA = new THREE.Mesh(barGeo, mat)
    const barB = new THREE.Mesh(barGeo, mat)
    barA.rotation.z = Math.PI / 4
    barB.rotation.z = -Math.PI / 4
    // a barra B ligeiramente à frente para o cruzamento ler como entrelaçado
    barB.position.z = 0.02
    rig.add(barA, barB)

    // luz: rim vermelho (como na foto do José) + contraluz frio
    const red = new THREE.PointLight(0xff2a24, 90, 30, 1.6)
    red.position.set(-4.2, 2.8, 3.2)
    const red2 = new THREE.PointLight(0xff1a14, 55, 30, 1.6)
    red2.position.set(4.6, -2.6, 2.4)
    const cool = new THREE.DirectionalLight(0xbfc8ff, 0.55)
    cool.position.set(2, 4, -3)
    scene.add(red, red2, cool)

    // partículas
    const COUNT = animated ? 2600 : 1500
    const seeds = new Float32Array(COUNT * 4)
    for (let i = 0; i < COUNT * 4; i++) seeds[i] = Math.random()
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3))
    pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
    const pMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 6.0 }, uSize: { value: 22 * Math.min(window.devicePixelRatio, 1.75) } },
    })
    const points = new THREE.Points(pGeo, pMat)
    points.frustumCulled = false
    rig.add(points)

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    }

    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      // em telas estreitas o X afasta para caber
      camera.position.z = w / h < 0.9 ? 17 : w / h < 1.5 ? 11.5 : 14
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const clock = new THREE.Clock()
    let raf = 0
    let visible = true
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      const t = clock.getElapsedTime()
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      const scrollK = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.5)
      rig.rotation.y = mouse.x * 0.35 + Math.sin(t * 0.25) * 0.18 - scrollK * 0.5
      rig.rotation.x = mouse.y * 0.18 + scrollK * 0.2
      barA.rotation.x = t * 0.12
      barB.rotation.x = -t * 0.12
      pMat.uniforms.uTime.value = 6 + t
      renderer.render(scene, camera)
    }

    if (animated) {
      el.addEventListener('pointermove', onMove)
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
      io.observe(el)
      frame()
      ;(el as HTMLDivElement & { _io?: IntersectionObserver })._io = io
    } else {
      rig.rotation.y = -0.28
      rig.rotation.x = 0.08
      barA.rotation.x = 0.5
      barB.rotation.x = -0.5
      renderer.render(scene, camera)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointermove', onMove)
      ;(el as HTMLDivElement & { _io?: IntersectionObserver })._io?.disconnect()
      pGeo.dispose(); pMat.dispose(); barGeo.dispose(); mat.dispose(); envTex.dispose(); pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={host} className="absolute inset-0" aria-hidden />
}

export default XScene

import { invoke } from "@tauri-apps/api/core";
import { emit, listen } from "@tauri-apps/api/event";
import { getCurrentWindow, LogicalSize, PhysicalPosition } from "@tauri-apps/api/window";
import { EV_ALERTA, EV_BANDEJA, EV_CLIQUE, EV_ESTADO, type Alerta, type Estado, type PedidoEstado } from "./eventos";
import { animacao, precarregar, quadroOlhar, TODOS_ESTADOS } from "./sprites";

interface Area {
  x: number;
  y: number;
  largura: number;
  altura: number;
  escala: number;
}

const janela = getCurrentWindow();
const img = document.getElementById("mark") as HTMLImageElement;
const balaoEl = document.getElementById("balao-mark")!;

// Tamanhos lógicos (iguais aos de tauri.conf.json e do CSS).
const LARGURA = 104;
const ALTURA = 112;
const BALAO_L = 250; // espaço extra ao lado para o balão
const BALAO_A = 46; // espaço extra acima

// ---------- Animação ----------

let base: Estado = "idle";
let atual: Estado = "idle";
let quadro = 0;
let restantes = 0; // ciclos que faltam numa animação de "uma vez"
let relogio = 0;
let olhandoAte = 0; // enquanto o cursor mexe, o Mark olha para ele em vez de piscar

function tocar(estado: Estado, vezes = 0) {
  if (vezes === 0) base = estado;
  atual = estado;
  restantes = vezes;
  quadro = 0;
  agendar();
}

function agendar() {
  clearTimeout(relogio);
  const { quadros, fps } = animacao(atual);
  if (!(atual === "idle" && Date.now() < olhandoAte)) img.src = quadros[quadro];
  relogio = window.setTimeout(() => {
    quadro++;
    if (quadro >= quadros.length) {
      quadro = 0;
      if (restantes > 0 && --restantes === 0) atual = base;
    }
    agendar();
  }, 1000 / fps);
}

// ---------- Movimento ----------

let area: Area = { x: 0, y: 0, largura: 1920, altura: 1080, escala: 1 };
let casa = { x: 0, y: 0 }; // onde o Rafael deixou o Mark (canto da janela sem balão)
let pos = { x: 0, y: 0 };
let movendo = 0; // id do movimento em curso (0 = parado)
let comBalao = false;

const VELOCIDADE = 90; // px lógicos por segundo

function moverPara(x: number, y: number, velocidade = VELOCIDADE): Promise<boolean> {
  const id = ++movendo;
  const v = velocidade * area.escala;
  return new Promise((fim) => {
    let antes = performance.now();
    let ultimoEnvio = 0;
    const passo = (agora: number) => {
      if (movendo !== id) return fim(false);
      const dt = (agora - antes) / 1000;
      antes = agora;
      const dx = x - pos.x;
      const dy = y - pos.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= v * dt) {
        pos = { x, y };
        janela.setPosition(new PhysicalPosition(Math.round(x), Math.round(y)));
        movendo = 0;
        return fim(true);
      }
      pos = { x: pos.x + (dx / dist) * v * dt, y: pos.y + (dy / dist) * v * dt };
      // ~30 quadros por segundo bastam e poupam CPU
      if (agora - ultimoEnvio > 33) {
        ultimoEnvio = agora;
        janela.setPosition(new PhysicalPosition(Math.round(pos.x), Math.round(pos.y)));
      }
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  });
}

async function passear() {
  const largura = LARGURA * area.escala;
  const alvo = area.x + Math.random() * (area.largura - largura);
  tocar(alvo < pos.x ? "running-left" : "running-right", 0);
  const chegou = await moverPara(alvo, casa.y, VELOCIDADE * 0.6);
  if (chegou) casa = { x: alvo, y: casa.y };
  tocar("idle");
}

// De vez em quando, quando está à toa, ele passeia ou dá um pulinho.
function vidaPropria() {
  const espera = 20000 + Math.random() * 40000;
  setTimeout(() => {
    if (!movendo && !comBalao && !arrastando && base === "idle" && atual === "idle" && Date.now() > olhandoAte) {
      const sorte = Math.random();
      if (sorte < 0.45) passear();
      else if (sorte < 0.7) tocar("jumping", 1);
      else if (sorte < 0.8) tocar("waving", 1);
    }
    vidaPropria();
  }, espera);
}

// ---------- Olhar para o cursor ----------

let ultimoCursor = { x: -1, y: -1 };

async function seguirCursor() {
  try {
    const c = await invoke<[number, number] | null>("cursor");
    if (c && !movendo && !arrastando && base === "idle" && atual === "idle") {
      const [cx, cy] = c;
      if (Math.hypot(cx - ultimoCursor.x, cy - ultimoCursor.y) > 3) {
        ultimoCursor = { x: cx, y: cy };
        // Centro da cabeça do Mark (a imagem fica no canto de baixo da janela).
        const e = area.escala;
        const centroX = casa.x + (LARGURA / 2) * e;
        const centroY = casa.y + (ALTURA - 52) * e;
        const dx = cx - centroX;
        const dy = cy - centroY;
        if (Math.hypot(dx, dy) > 40 * e) {
          olhandoAte = Date.now() + 2500;
          img.src = quadroOlhar(Math.atan2(dy, dx));
        }
      }
    }
  } catch {
    // sem cursor (tela bloqueada etc.): tenta de novo no próximo ciclo
  }
  setTimeout(seguirCursor, 120);
}

// ---------- Balão ao lado da cabeça ----------

let relogioBalao = 0;

async function mostrarBalao(texto: string, segundos = 9) {
  clearTimeout(relogioBalao);
  movendo = 0;
  const e = area.escala;
  // Balão do lado que tem mais espaço na tela.
  const esquerda = casa.x + (LARGURA / 2) * e > area.x + area.largura / 2;
  balaoEl.textContent = texto;
  document.body.classList.toggle("balao-esquerda", esquerda);
  document.body.classList.add("com-balao");
  if (!comBalao) {
    comBalao = true;
    await janela.setSize(new LogicalSize(LARGURA + BALAO_L, ALTURA + BALAO_A));
    const x = esquerda ? casa.x - BALAO_L * e : casa.x;
    pos = { x, y: casa.y - BALAO_A * e };
    await janela.setPosition(new PhysicalPosition(Math.round(pos.x), Math.round(pos.y)));
  }
  relogioBalao = window.setTimeout(esconderBalao, segundos * 1000);
}

async function esconderBalao() {
  clearTimeout(relogioBalao);
  if (!comBalao) return;
  comBalao = false;
  document.body.classList.remove("com-balao");
  pos = { ...casa };
  await janela.setPosition(new PhysicalPosition(Math.round(casa.x), Math.round(casa.y)));
  await janela.setSize(new LogicalSize(LARGURA, ALTURA));
  if (base !== "idle") tocar("idle");
}

balaoEl.addEventListener("click", (e) => {
  e.stopPropagation();
  emit(EV_CLIQUE);
  esconderBalao();
});

// ---------- Arrastar e clicar ----------

let apertou: { x: number; y: number } | null = null;
let arrastando = false;
let fimArrasto = 0;

window.addEventListener("mousedown", (e) => {
  if (e.button !== 0 || (e.target as HTMLElement).closest(".balao-mark")) return;
  apertou = { x: e.screenX, y: e.screenY };
  arrastando = false;
});
window.addEventListener("mousemove", async (e) => {
  if (!apertou || arrastando) return;
  if (Math.hypot(e.screenX - apertou.x, e.screenY - apertou.y) > 4) {
    apertou = null;
    movendo = 0; // cancela passeio
    if (comBalao) await esconderBalao();
    arrastando = true;
    tocar("jumping", 0); // esperneando enquanto é carregado
    janela.startDragging();
  }
});
window.addEventListener("mouseup", () => {
  if (apertou && !arrastando) {
    emit(EV_CLIQUE);
    tocar("waving", 1);
  }
  apertou = null;
});

// Quando o Rafael solta o Mark num lugar novo, ali vira a casa dele.
janela.onMoved(({ payload }) => {
  if (movendo || comBalao) return;
  pos = { x: payload.x, y: payload.y };
  casa = { ...pos };
  if (arrastando) {
    // Não há evento de "soltou": quando para de mexer, considera que pousou.
    clearTimeout(fimArrasto);
    fimArrasto = window.setTimeout(() => {
      arrastando = false;
      tocar("idle");
      tocar("jumping", 1);
    }, 300);
  }
});

// ---------- Eventos ----------

const ANIMACAO_DO_ALERTA: Record<Alerta["fonte"], Estado> = {
  ads: "failed",
  asana: "waving",
  claude: "waiting",
};

async function demonstracao() {
  for (const e of TODOS_ESTADOS) {
    tocar(e, 2);
    await new Promise((ok) => setTimeout(ok, (animacao(e).quadros.length / animacao(e).fps) * 2000 + 200));
  }
  tocar("idle");
}

async function iniciar() {
  await precarregar();
  const a = await invoke<Area | null>("area_trabalho");
  if (a) area = a;
  const p = await janela.outerPosition();
  pos = { x: p.x, y: p.y };
  casa = { ...pos };
  tocar("idle");
  vidaPropria();
  seguirCursor();

  await listen<PedidoEstado>(EV_ESTADO, ({ payload }) => {
    if (!arrastando) tocar(payload.estado, payload.vezes ?? 0);
  });
  await listen<Alerta>(EV_ALERTA, ({ payload }) => {
    tocar(ANIMACAO_DO_ALERTA[payload.fonte], 3);
    mostrarBalao(payload.texto);
  });
  await listen<string>(EV_BANDEJA, ({ payload }) => {
    if (payload === "demo") demonstracao();
  });
}

iniciar();

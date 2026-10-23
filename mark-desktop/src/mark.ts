import { invoke } from "@tauri-apps/api/core";
import { emit, listen } from "@tauri-apps/api/event";
import { getCurrentWindow, PhysicalPosition } from "@tauri-apps/api/window";
import { EV_ALERTA, EV_BANDEJA, EV_CLIQUE, EV_ESTADO, type Alerta, type Estado, type PedidoEstado } from "./eventos";
import { animacao, precarregar, TODOS_ESTADOS } from "./sprites";

interface Area {
  x: number;
  y: number;
  largura: number;
  altura: number;
  escala: number;
}

const janela = getCurrentWindow();
const img = document.getElementById("mark") as HTMLImageElement;

// ---------- Animação ----------

let base: Estado = "idle";
let atual: Estado = "idle";
let quadro = 0;
let restantes = 0; // ciclos que faltam numa animação de "uma vez"
let relogio = 0;

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
  img.src = quadros[quadro];
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
let casa = { x: 0, y: 0 }; // onde o Rafael deixou o Mark
let pos = { x: 0, y: 0 };
let movendo = 0; // id do movimento em curso (0 = parado)
let longeDeCasa = false;

const LARGURA = 104;
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

/** Corre até logo abaixo da barra no topo e fica apontando para ela. */
async function irAteBarra(estado: Estado) {
  const largura = LARGURA * area.escala;
  const x = area.x + (area.largura - largura) / 2;
  const y = area.y + 50 * area.escala;
  longeDeCasa = true;
  tocar("jumping", 0);
  await moverPara(x, y, VELOCIDADE * 4);
  tocar(estado);
}

async function voltarParaCasa() {
  if (!longeDeCasa) return;
  longeDeCasa = false;
  tocar("jumping", 0);
  await moverPara(casa.x, casa.y, VELOCIDADE * 4);
  tocar("idle");
}

// De vez em quando, quando está à toa, ele passeia ou dá um pulinho.
function vidaPropria() {
  const espera = 20000 + Math.random() * 40000;
  setTimeout(() => {
    if (!movendo && !longeDeCasa && base === "idle" && atual === "idle") {
      const sorte = Math.random();
      if (sorte < 0.45) passear();
      else if (sorte < 0.7) tocar("jumping", 1);
      else if (sorte < 0.8) tocar("waving", 1);
    }
    vidaPropria();
  }, espera);
}

// ---------- Arrastar e clicar ----------

let apertou: { x: number; y: number } | null = null;
let arrastando = false;

window.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  apertou = { x: e.screenX, y: e.screenY };
  arrastando = false;
});
window.addEventListener("mousemove", (e) => {
  if (!apertou || arrastando) return;
  if (Math.hypot(e.screenX - apertou.x, e.screenY - apertou.y) > 4) {
    arrastando = true;
    movendo = 0; // cancela passeio
    longeDeCasa = false;
    apertou = null;
    janela.startDragging();
  }
});
window.addEventListener("mouseup", () => {
  if (apertou && !arrastando) {
    emit(EV_CLIQUE);
    voltarParaCasa();
  }
  apertou = null;
});

// Quando o Rafael solta o Mark num lugar novo, ali vira a casa dele.
janela.onMoved(({ payload }) => {
  if (movendo) return;
  pos = { x: payload.x, y: payload.y };
  if (!longeDeCasa) casa = { ...pos };
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

  await listen<PedidoEstado>(EV_ESTADO, ({ payload }) => tocar(payload.estado, payload.vezes ?? 0));
  await listen<Alerta>(EV_ALERTA, ({ payload }) => irAteBarra(ANIMACAO_DO_ALERTA[payload.fonte]));
  await listen(EV_CLIQUE, () => voltarParaCasa());
  await listen<string>(EV_BANDEJA, ({ payload }) => {
    if (payload === "demo") demonstracao();
  });
}

iniciar();

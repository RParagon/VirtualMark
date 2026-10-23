import { emit, listen } from "@tauri-apps/api/event";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { openUrl } from "@tauri-apps/plugin-opener";
import { EV_ALERTA, EV_BANDEJA, EV_CLIQUE, type Alerta, type Fonte } from "./eventos";

// Barra VM no topo da tela: logo, balão com a última fala do Mark e três indicadores.
// Passando o mouse ela abre e mostra a lista do indicador escolhido.

interface Item {
  titulo: string;
  detalhe: string;
  atencao?: boolean;
  link?: string;
}

interface Painel {
  nivel: "nenhum" | "ok" | "trabalhando" | "atencao";
  numero: string;
  itens: Item[];
  vazio: string;
}

const LARGURA = 440;
const ALTURA_FECHADA = 44;
const ALTURA_ABERTA = 330;

const janela = getCurrentWindow();
const ilha = document.getElementById("ilha")!;
const painelEl = document.getElementById("painel")!;
const balao = document.getElementById("balao")!;

// Até as integrações entrarem, cada indicador mostra o que falta ligar.
const paineis: Record<Fonte, Painel> = {
  asana: { nivel: "nenhum", numero: "–", itens: [], vazio: "Asana ainda não conectado (etapa 2)." },
  ads: { nivel: "nenhum", numero: "–", itens: [], vazio: "Google Ads ainda não conectado (etapa 3)." },
  claude: { nivel: "nenhum", numero: "–", itens: [], vazio: "Hooks do Claude Code ainda não instalados (etapa 4)." },
};

let aba: Fonte = "asana";
let aberta = false;
let fechar = 0;
let pausadoAte = 0;

function desenharChips() {
  for (const fonte of Object.keys(paineis) as Fonte[]) {
    const chip = document.querySelector<HTMLElement>(`.chip[data-aba="${fonte}"]`)!;
    chip.dataset.nivel = paineis[fonte].nivel;
    chip.classList.toggle("ativa", aberta && aba === fonte);
    document.getElementById(`n-${fonte}`)!.textContent = paineis[fonte].numero;
  }
}

function desenharPainel() {
  const p = paineis[aba];
  painelEl.replaceChildren();
  if (!p.itens.length) {
    const v = document.createElement("p");
    v.className = "vazio";
    v.textContent = p.vazio;
    painelEl.append(v);
    return;
  }
  for (const it of p.itens) {
    const linha = document.createElement("div");
    linha.className = "item" + (it.atencao ? " atencao" : "");
    const t = document.createElement("span");
    t.className = "t";
    t.textContent = it.titulo;
    const s = document.createElement("span");
    s.className = "s";
    s.textContent = it.detalhe;
    linha.append(t, s);
    if (it.link) {
      linha.style.cursor = "pointer";
      linha.addEventListener("click", () => openUrl(it.link!));
    }
    painelEl.append(linha);
  }
}

async function abrir(fonte?: Fonte) {
  clearTimeout(fechar);
  if (fonte) aba = fonte;
  if (!aberta) {
    aberta = true;
    await janela.setSize(new LogicalSize(LARGURA, ALTURA_ABERTA));
    ilha.classList.add("aberta");
  }
  ilha.classList.remove("alerta");
  desenharPainel();
  desenharChips();
}

function fecharDepois() {
  clearTimeout(fechar);
  fechar = window.setTimeout(async () => {
    aberta = false;
    ilha.classList.remove("aberta");
    desenharChips();
    await janela.setSize(new LogicalSize(LARGURA, ALTURA_FECHADA));
  }, 500);
}

function falar(texto: string, ativo = true) {
  balao.textContent = texto;
  balao.classList.toggle("ativo", ativo);
}

function alertar(a: Alerta) {
  if (Date.now() < pausadoAte) return;
  falar(a.texto);
  ilha.classList.add("alerta");
  aba = a.fonte;
  emit(EV_ALERTA, a);
}

ilha.addEventListener("mouseenter", () => abrir());
ilha.addEventListener("mouseleave", fecharDepois);
for (const chip of document.querySelectorAll<HTMLElement>(".chip")) {
  chip.addEventListener("mouseenter", () => abrir(chip.dataset.aba as Fonte));
  chip.addEventListener("click", () => abrir(chip.dataset.aba as Fonte));
}

listen(EV_CLIQUE, () => abrir());
listen<string>(EV_BANDEJA, ({ payload }) => {
  if (payload === "pausar") {
    pausadoAte = Date.now() + 60 * 60 * 1000;
    const hora = new Date(pausadoAte).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    falar(`Alertas pausados até ${hora}.`, false);
  } else if (payload === "alerta-teste") {
    alertar({ fonte: "ads", texto: "Teste: a conta WB está sem impressões hoje." });
  }
});

falar("Oi, Rafael! Tô de olho por aqui.", false);
desenharChips();

import { invoke } from "@tauri-apps/api/core";
import { emit, listen } from "@tauri-apps/api/event";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { openUrl } from "@tauri-apps/plugin-opener";
import { EV_ALERTA, EV_BANDEJA, EV_CLIQUE, type Alerta, type Fonte } from "./eventos";

// Barra VM colada no topo da tela, como um notch. Quatro formas:
//   recolhida: só uma lingueta, depois de um tempo parada;
//   fechada:   logo, frase curta e os três indicadores;
//   falando:   fechada + a frase inteira do Mark (alertas);
//   aberta:    lista do indicador escolhido.

interface Item {
  titulo: string;
  detalhe: string;
  atencao?: boolean;
  link?: string | null;
  sub?: string | null;
  desde_ms?: number | null;
  id?: string | null;
}

interface Painel {
  fonte?: Fonte;
  nivel: "nenhum" | "ok" | "trabalhando" | "atencao";
  numero: string;
  itens: Item[];
  vazio: string;
}

type Forma = "recolhida" | "fechada" | "falando" | "aberta";

const LARGURA = 460;
const ALTURA_MAX = 400;
const DURACAO = 240; // ms, igual à transição do CSS

const janela = getCurrentWindow();
const ilha = document.getElementById("ilha")!;
const painelEl = document.getElementById("painel")!;
const balao = document.getElementById("balao")!;
const fala = document.getElementById("fala")!;

const NOMES: Record<Fonte, string> = { asana: "Asana", ads: "Google Ads", claude: "Claude Code" };
const paineis: Record<Fonte, Painel> = {
  asana: { nivel: "nenhum", numero: "–", itens: [], vazio: "" },
  ads: { nivel: "nenhum", numero: "–", itens: [], vazio: "" },
  claude: { nivel: "nenhum", numero: "–", itens: [], vazio: "" },
};

let aba: Fonte = "asana";
let forma: Forma = "fechada";
let recolherApos = 20;
let pausadoAte = 0;
let relogioRecolher = 0;
let relogioFala = 0;
let relogioFechar = 0;
let confirmando = ""; // id da tarefa esperando o segundo clique em "concluir"

// ---------- Forma e tamanho ----------

function alturaDoConteudo(f: Forma): number {
  if (f === "recolhida") return 8;
  const topo = 38;
  if (f === "fechada") return topo;
  if (f === "falando") return topo + fala.scrollHeight;
  return Math.min(ALTURA_MAX, topo + painelEl.scrollHeight);
}

async function mudarForma(nova: Forma) {
  const antes = alturaDoConteudo(forma);
  forma = nova;
  ilha.className = `ilha ${nova}`;
  const depois = alturaDoConteudo(nova);
  ilha.style.height = `${depois}px`;
  if (depois >= antes) {
    // Crescendo: a janela aumenta antes, para a animação não ser cortada.
    await janela.setSize(new LogicalSize(LARGURA, depois + 2));
  } else {
    setTimeout(() => {
      if (forma === nova) janela.setSize(new LogicalSize(LARGURA, alturaDoConteudo(nova) + 2));
    }, DURACAO);
  }
  desenharChips();
  agendarRecolher();
}

function agendarRecolher() {
  clearTimeout(relogioRecolher);
  if (!recolherApos || forma !== "fechada" || ilha.matches(":hover")) return;
  relogioRecolher = window.setTimeout(() => {
    if (forma === "fechada" && !ilha.matches(":hover")) mudarForma("recolhida");
  }, recolherApos * 1000);
}

// ---------- Desenho ----------

function haQuanto(ms: number): string {
  const min = Math.round((Date.now() - ms) / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  return h < 24 ? `há ${h} h` : `há ${Math.floor(h / 24)} d`;
}

function desenharChips() {
  for (const fonte of Object.keys(paineis) as Fonte[]) {
    const chip = document.querySelector<HTMLElement>(`.chip[data-aba="${fonte}"]`)!;
    chip.dataset.nivel = paineis[fonte].nivel;
    chip.classList.toggle("ativa", forma === "aberta" && aba === fonte);
    document.getElementById(`n-${fonte}`)!.textContent = paineis[fonte].numero;
  }
}

function botao(texto: string, classe: string, aoClicar: (e: MouseEvent) => void) {
  const b = document.createElement("button");
  b.className = classe;
  b.textContent = texto;
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    aoClicar(e);
  });
  return b;
}

function desenharPainel() {
  const p = paineis[aba];
  painelEl.replaceChildren();
  const cab = document.createElement("h3");
  cab.textContent = NOMES[aba];
  painelEl.append(cab);

  // Sem conexão ou com erro: explica e oferece o caminho.
  if (p.nivel === "nenhum" && (p.vazio === "" || p.numero === "!")) {
    const v = document.createElement("p");
    v.className = "vazio" + (p.numero === "!" ? " erro" : "");
    v.textContent = p.numero === "!" ? p.vazio : `${NOMES[aba]} ainda não está conectado.`;
    const acoes = document.createElement("div");
    acoes.className = "acoes";
    if (p.numero === "!") acoes.append(botao("Tentar de novo", "btn", () => atualizar()));
    acoes.append(botao("Configurar", p.numero === "!" ? "btn sec" : "btn", () => invoke("abrir_config")));
    painelEl.append(v, acoes);
    return;
  }
  if (!p.itens.length) {
    const v = document.createElement("p");
    v.className = "vazio";
    v.textContent = p.vazio;
    painelEl.append(v);
    return;
  }

  p.itens.forEach((it, i) => {
    const linha = document.createElement("div");
    linha.className = "item" + (it.atencao ? " atencao" : "");
    linha.style.animationDelay = `${Math.min(i, 8) * 25}ms`;
    const texto = document.createElement("div");
    texto.className = "texto";
    const t = document.createElement("span");
    t.className = "t";
    t.textContent = it.titulo;
    texto.append(t);
    if (it.sub) {
      const sub = document.createElement("span");
      sub.className = "sub";
      sub.textContent = it.sub;
      texto.append(sub);
    }
    const lado = document.createElement("div");
    lado.className = "lado";
    const s = document.createElement("span");
    s.className = "s";
    s.textContent = it.desde_ms ? `${it.detalhe} · ${haQuanto(it.desde_ms)}` : it.detalhe;
    lado.append(s);

    if (aba === "asana" && it.id) {
      const id = it.id;
      const acoes = document.createElement("div");
      acoes.className = "acoes-item";
      const concluir = botao(confirmando === id ? "confirmar?" : "concluir", "mini" + (confirmando === id ? " quente" : ""), async () => {
        if (confirmando !== id) {
          confirmando = id;
          return desenharPainel();
        }
        confirmando = "";
        concluir.textContent = "…";
        try {
          await invoke("concluir_tarefa", { id });
          falar(`Concluí no Asana: ${it.titulo}`, false);
        } catch (e) {
          falar(`Não consegui concluir: ${e}`, true);
        }
      });
      const ocultar = botao("ocultar", "mini", async () => {
        await invoke("ocultar_tarefa", { id });
      });
      acoes.append(concluir, ocultar);
      lado.append(acoes);
    }

    linha.append(texto, lado);
    if (it.link) {
      linha.classList.add("clicavel");
      linha.addEventListener("click", () => openUrl(it.link!));
    }
    painelEl.append(linha);
  });
}

async function abrir(fonte?: Fonte) {
  clearTimeout(relogioFechar);
  if (fonte) aba = fonte;
  ilha.classList.remove("alerta");
  desenharPainel();
  await mudarForma("aberta");
}

function fecharDepois() {
  clearTimeout(relogioFechar);
  relogioFechar = window.setTimeout(() => {
    confirmando = "";
    if (forma === "aberta") mudarForma("fechada");
    else agendarRecolher();
  }, 450);
}

function falar(texto: string, destaque = true) {
  balao.textContent = texto;
  balao.classList.toggle("ativo", destaque);
  fala.textContent = texto;
  if (forma === "aberta") return;
  clearTimeout(relogioFala);
  mudarForma("falando");
  relogioFala = window.setTimeout(() => {
    if (forma === "falando") mudarForma("fechada");
  }, 9000);
}

function alertar(a: Alerta) {
  if (Date.now() < pausadoAte) return;
  aba = a.fonte;
  ilha.classList.add("alerta");
  falar(a.texto);
  ilha.classList.add("alerta");
  emit(EV_ALERTA, a);
}

async function atualizar() {
  falar("Atualizando…", false);
  await invoke("atualizar");
}

function receber(p: Painel) {
  if (!p.fonte) return;
  paineis[p.fonte] = p;
  desenharChips();
  if (forma === "aberta" && aba === p.fonte) {
    desenharPainel();
    mudarForma("aberta"); // reajusta a altura
  }
}

async function carregarStatus() {
  try {
    (await invoke<Painel[]>("status_atual")).forEach(receber);
  } catch {
    setTimeout(carregarStatus, 1000);
  }
}

function aplicarConfig(cfg: { tema?: string; ilha_recolher_seg?: number }) {
  document.documentElement.dataset.tema = cfg.tema === "claro" ? "claro" : "";
  recolherApos = cfg.ilha_recolher_seg ?? 20;
  agendarRecolher();
}

// ---------- Eventos ----------

ilha.addEventListener("mouseenter", () => {
  clearTimeout(relogioFechar);
  clearTimeout(relogioRecolher);
  if (forma === "recolhida") mudarForma("fechada");
});
ilha.addEventListener("mouseleave", fecharDepois);
for (const chip of document.querySelectorAll<HTMLElement>(".chip")) {
  chip.addEventListener("click", () => abrir(chip.dataset.aba as Fonte));
  // Parar o mouse sobre um indicador abre a lista dele.
  chip.addEventListener("mouseenter", () => {
    setTimeout(() => chip.matches(":hover") && abrir(chip.dataset.aba as Fonte), forma === "aberta" ? 0 : 280);
  });
}
balao.addEventListener("click", () => abrir());
document.getElementById("engrenagem")!.addEventListener("click", () => invoke("abrir_config"));

listen<Painel>("status", ({ payload }) => receber(payload));
listen<Alerta>("regra:alerta", ({ payload }) => alertar(payload));
listen(EV_CLIQUE, () => abrir());
listen<{ tema?: string; ilha_recolher_seg?: number }>("config", ({ payload }) => aplicarConfig(payload));
listen<string>(EV_BANDEJA, ({ payload }) => {
  if (payload === "pausar") {
    pausadoAte = Date.now() + 60 * 60 * 1000;
    const hora = new Date(pausadoAte).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    falar(`Alertas pausados até ${hora}.`, false);
  } else if (payload === "alerta-teste") {
    alertar({ fonte: "ads", texto: "Teste: a conta WB está sem impressões hoje." });
  } else if (payload === "atualizar") {
    falar("Atualizando…", false);
  }
});

// Os "há 3 min" envelhecem sozinhos.
setInterval(() => {
  if (forma === "aberta") desenharPainel();
}, 30000);

invoke<{ tema?: string; ilha_recolher_seg?: number }>("ler_config").then(aplicarConfig).catch(() => {});
carregarStatus();
desenharChips();
ilha.style.height = "38px";
setTimeout(() => falar("Oi, Rafael! Tô de olho no Asana, no Ads e no Claude.", false), 600);

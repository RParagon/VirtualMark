import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { openUrl } from "@tauri-apps/plugin-opener";
import type { Fonte } from "./eventos";

// Tela de Configurações: conexões (Asana, Google Ads, Claude Code) e regras dos alertas.

type Config = Record<string, string | number>;
interface Conexoes { asana: boolean; ads: boolean; claude: boolean }
interface Painel { fonte?: Fonte; nivel: string; numero: string; vazio: string; itens: unknown[] }

let cfg: Config = {};
const ultimos: Partial<Record<Fonte, Painel>> = {};

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const bloco = (f: Fonte) => $(`.cfg-bloco[data-fonte="${f}"]`);

function msg(f: Fonte, texto: string, erro = false) {
  const p = bloco(f).querySelector<HTMLElement>(".msg")!;
  p.textContent = texto;
  p.classList.toggle("erro", erro);
}

async function desenharConexoes() {
  const c = await invoke<Conexoes>("conexoes");
  for (const f of ["asana", "ads", "claude"] as Fonte[]) {
    const est = bloco(f).querySelector<HTMLElement>(".estado")!;
    const p = ultimos[f];
    const comErro = c[f] && p?.numero === "!";
    est.textContent = !c[f] ? "não conectado" : comErro ? "com erro" : "conectado";
    est.dataset.nivel = !c[f] ? "nenhum" : comErro ? "atencao" : "ok";
    if (comErro) msg(f, p!.vazio, true);
  }
}

function preencher() {
  for (const el of document.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-cfg]")) {
    const v = cfg[el.dataset.cfg!];
    if (v !== undefined) el.value = String(v);
  }
}

function coletar(): Config {
  const novo = { ...cfg };
  for (const el of document.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-cfg]")) {
    const chave = el.dataset.cfg!;
    novo[chave] = typeof cfg[chave] === "number" ? Number(el.value) : el.value;
  }
  return novo;
}

async function acao(botao: HTMLElement) {
  const fonte = botao.closest<HTMLElement>(".cfg-bloco")?.dataset.fonte as Fonte | undefined;
  try {
    switch (botao.dataset.acao) {
      case "salvar-asana": {
        const input = $<HTMLInputElement>("#token-asana");
        if (!input.value.trim()) return msg("asana", "Cole o token primeiro.", true);
        await invoke("salvar_token", { nome: "asana_token", valor: input.value });
        input.value = "";
        msg("asana", "Token salvo. Consultando o Asana…");
        break;
      }
      case "importar-ads":
        await invoke("importar_ads", { caminho: $<HTMLInputElement>("#env-ads").value });
        msg("ads", "Credenciais importadas. Consultando as contas…");
        break;
      case "instalar-hooks": {
        const arq = await invoke<string>("instalar_hooks");
        msg("claude", `Hooks gravados em ${arq}. Abra uma sessão nova do Claude Code para testar.`);
        break;
      }
      case "testar-hooks":
        await invoke("testar_hooks");
        msg("claude", "Mandei uma sessão de teste. Ela deve aparecer no indicador Claude da barra por alguns segundos.");
        break;
      case "remover-hooks":
        await invoke("remover_hooks");
        msg("claude", "Hooks do Mark removidos.");
        break;
      case "desconectar":
        await invoke("desconectar", { fonte: botao.dataset.alvo });
        msg(botao.dataset.alvo as Fonte, "Desconectado.");
        break;
      case "atualizar":
        await invoke("atualizar");
        if (fonte) msg(fonte, "Atualizando…");
        break;
      case "salvar-config":
        cfg = coletar();
        await invoke("salvar_config", { cfg });
        $("#salvo").textContent = "Preferências salvas.";
        setTimeout(() => ($("#salvo").textContent = ""), 3000);
        break;
    }
  } catch (e) {
    if (fonte) msg(fonte, String(e), true);
    else $("#salvo").textContent = String(e);
  }
  desenharConexoes();
}

document.addEventListener("click", (e) => {
  const alvo = e.target as HTMLElement;
  const link = alvo.closest<HTMLElement>("[data-abrir]");
  if (link) {
    e.preventDefault();
    openUrl(link.dataset.abrir!);
    return;
  }
  const botao = alvo.closest<HTMLElement>("button[data-acao]");
  if (botao) acao(botao);
});

listen<Painel>("status", ({ payload }) => {
  if (!payload.fonte) return;
  ultimos[payload.fonte] = payload;
  if (payload.numero !== "!") msg(payload.fonte, "");
  desenharConexoes();
});

async function iniciar() {
  cfg = await invoke<Config>("ler_config");
  preencher();
  for (const p of await invoke<Painel[]>("status_atual")) if (p.fonte) ultimos[p.fonte] = p;
  desenharConexoes();
}

iniciar();

/**
 * Iscas das LPs de captura (campo "guia"):
 *   solar     — /energia-solar, Guia WB da Energia Solar 2026
 *   automacao — /automacao, Guia WB da Casa Inteligente 2026
 *
 * action "create"      — grava o lead (nome, WhatsApp, e-mail, origem) e, com deliver=true, envia o guia.
 * action "personalize" — com o código e o mesmo e-mail, grava as respostas e envia o guia com o
 *                        diagnóstico da pessoa nas primeiras páginas (o PDF do simulador + o guia).
 * action "deliver"     — envia o guia padrão (quem escolheu personalizar e depois pulou as perguntas).
 *
 * O guia é o PDF estático de public/materiais/, lido do próprio site. Mesmas variáveis de ambiente
 * da lead-email.mts (SMTP_*, MAIL_FROM, MAIL_COPY_TO, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * MAIL_DRY_RUN, PDF_SHOW_PRICES).
 */
import { randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { PDFDocument } from "pdf-lib";
import {
  parseAutomacaoInput, parseSolarAnswers, resumoAutomacao, resumoSolar, type AutomacaoInput, type SolarAnswers,
} from "../../src/components/lp/calc-logic";
import { WB_CONTATO, pdfAutomacao, pdfSolar } from "./_lib/pdf";

export const config = { path: "/api/lead-guia" };

const SITE_HOSTS = new Set(["wbsolucoeseletricas.com.br", "www.wbsolucoeseletricas.com.br"]);
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_RE = /^WB-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}$/;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

const env = (k: string) => process.env[k]?.trim() || undefined;

type Diag = { nome: string | null; code: string };

/** Uma entrada por isca; o front manda o nome em "guia" (sem ele, solar, como antes). */
const GUIAS = {
  solar: {
    calc: "solar",
    nome: "Guia WB da Energia Solar 2026",
    path: "/materiais/guia-energia-solar-wb-2026.pdf",
    filename: "guia-energia-solar-wb-2026",
    lp: "/energia-solar",
    curto: "Guia solar",
    parse: parseSolarAnswers,
    resumo: (a: unknown) => resumoSolar(a as SolarAnswers),
    diag: (a: unknown, o: Diag) => pdfSolar(a as SolarAnswers, o),
    conteudo:
      "a Lei 14.300 explicada, como ler a sua conta, quanto sistema você precisa, o que observar no telhado e nos equipamentos, 12 perguntas antes de assinar e um comparador de orçamentos",
    oQueVemNoDiag: "o tamanho do sistema estimado para o seu consumo e como chegamos nesse número",
    proximoPasso: "Quando quiser o projeto do seu sistema, mande a foto da sua conta de luz para a gente",
    textoProximo: (wa: string, code: string) =>
      `Para o projeto do seu sistema, mande a foto da conta no WhatsApp ${wa} e informe o código ${code}.`,
    fechamento: "A análise é feita por um responsável técnico, sem compromisso.",
    botao: "Mandar a conta no WhatsApp",
    waMsg: (code: string) => `Olá! Recebi o Guia WB da Energia Solar (Cód: ${code}) e quero a análise da minha conta.`,
    assunto: "energia solar",
  },
  automacao: {
    calc: "automacao",
    nome: "Guia WB da Casa Inteligente 2026",
    path: "/materiais/guia-casa-inteligente-wb-2026.pdf",
    filename: "guia-casa-inteligente-wb-2026",
    lp: "/automacao",
    curto: "Guia automação",
    parse: parseAutomacaoInput,
    resumo: (a: unknown) => resumoAutomacao(a as AutomacaoInput),
    diag: (a: unknown, o: Diag) =>
      pdfAutomacao(a as AutomacaoInput, { ...o, showPrices: env("PDF_SHOW_PRICES") === "1" }),
    conteudo:
      "Wi-Fi ou Zigbee, a base elétrica que a automação precisa, o que preparar na obra, cômodo por cômodo, 12 perguntas antes de contratar e um planejador para a sua casa",
    oQueVemNoDiag: "o pacote indicado para a sua casa e o que entra em cada cômodo",
    proximoPasso: "Quando quiser a proposta, chame a gente para agendar a visita técnica",
    textoProximo: (wa: string, code: string) =>
      `Para agendar a visita técnica, chame a WB no WhatsApp ${wa} e informe o código ${code}.`,
    fechamento: "A visita é feita por um responsável técnico da WB, sem compromisso.",
    botao: "Agendar a visita no WhatsApp",
    waMsg: (code: string) => `Olá! Recebi o Guia WB da Casa Inteligente (Cód: ${code}) e quero agendar a visita técnica.`,
    assunto: "automação residencial",
  },
} as const;
type Guia = (typeof GUIAS)[keyof typeof GUIAS];
const str = (v: unknown, max = 512) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
const oneLine = (v: string | null) => (v ? v.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim() : null);
const esc = (t: string) => t.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function newCode() {
  const b = randomBytes(5);
  return "WB-" + Array.from(b, (x) => CODE_ALPHABET[x % CODE_ALPHABET.length]).join("");
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function originOk(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const host = new URL(origin).host;
    return SITE_HOSTS.has(host) || host === new URL(req.url).host;
  } catch {
    return false;
  }
}

/** Telefone brasileiro com DDD (10 ou 11 dígitos) → +55XXXXXXXXXXX. */
function phoneE164(v: unknown) {
  const d = typeof v === "string" ? v.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "") : "";
  return d.length === 10 || d.length === 11 ? `+55${d}` : null;
}

const fmtPhone = (e164: string) => {
  const d = e164.slice(3);
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
};

type Row = { lead_code: string; name: string | null; email: string | null; phone: string | null; calc_summary: string | null };

async function supabase(method: "POST" | "PATCH", query: string, body: unknown): Promise<Row[] | null> {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  const res = await fetch(`${url}/rest/v1/leads${query}`, {
    method,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`supabase ${method} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as Row[];
}

function transport() {
  if (env("MAIL_DRY_RUN") === "1") return nodemailer.createTransport({ streamTransport: true, buffer: true });
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");
  if (!user || !pass) return null;
  const port = Number(env("SMTP_PORT") ?? 465);
  return nodemailer.createTransport({ host: env("SMTP_HOST") ?? "smtp.hostinger.com", port, secure: port === 465, auth: { user, pass } });
}

async function guiaPdf(req: Request, g: Guia) {
  const res = await fetch(new URL(g.path, req.url));
  if (!res.ok) throw new Error(`guia ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

/** Capa do guia + diagnóstico (PDF do simulador) + resto do guia. */
async function guiaPersonalizado(g: Guia, guia: Uint8Array, a: unknown, o: Diag) {
  const base = await PDFDocument.load(guia);
  const diag = await PDFDocument.load(await g.diag(a, o));
  const out = await PDFDocument.create();
  out.setTitle(`${g.nome} · seu diagnóstico`);
  out.setAuthor("WB Soluções Elétricas");
  const [capa, ...resto] = await out.copyPages(base, base.getPageIndices());
  out.addPage(capa);
  for (const p of await out.copyPages(diag, diag.getPageIndices())) out.addPage(p);
  for (const p of resto) out.addPage(p);
  return out.save();
}

function emailLead(g: Guia, o: { nome: string | null; code: string; personalizado: boolean }) {
  const ola = o.nome ? `Olá, ${esc(o.nome)}!` : "Olá!";
  const wa = `${WB_CONTATO.whatsappLink}?text=${encodeURIComponent(g.waMsg(o.code))}`;
  const corpo = o.personalizado
    ? `Segue o seu <b>${g.nome}</b>, agora com o seu diagnóstico logo depois da capa: ${g.oQueVemNoDiag}.`
    : `Segue o seu <b>${g.nome}</b>: ${g.conteudo}.`;
  const html = `<!doctype html><html><body style="margin:0;background:#f3f5f8;font-family:Arial,Helvetica,sans-serif;color:#1a2230">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f5f8;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:#0b1424;padding:22px 28px;color:#ffffff;font-size:18px;font-weight:bold">WB Soluções Elétricas</td></tr>
<tr><td style="padding:28px">
<p style="margin:0 0 14px;font-size:16px">${ola}</p>
<p style="margin:0 0 14px;font-size:15px;line-height:1.55">${corpo} O PDF está em anexo.</p>
<p style="margin:0 0 22px;font-size:15px;line-height:1.55">${g.proximoPasso} e informe o código <b>${o.code}</b>. ${g.fechamento}</p>
<p style="margin:0 0 26px"><a href="${wa}" style="display:inline-block;background:#25d366;color:#000000;text-decoration:none;font-weight:bold;padding:13px 22px;border-radius:999px">${g.botao}</a></p>
<p style="margin:0;font-size:12px;color:#5b6575;line-height:1.5">WhatsApp ${WB_CONTATO.whatsapp} · ${WB_CONTATO.email}<br>CNPJ ${WB_CONTATO.cnpj} · Porto Alegre/RS</p>
</td></tr></table>
<p style="font-size:11px;color:#8a93a0;margin:14px 0 0">Você recebeu este e-mail porque pediu o guia no site ${WB_CONTATO.site}.</p>
</td></tr></table></body></html>`;
  const text =
    `${o.nome ? `Olá, ${o.nome}!` : "Olá!"}\n\nSegue em anexo o seu ${g.nome}` +
    `${o.personalizado ? ", com o seu diagnóstico depois da capa" : ""}.\n` +
    `${g.textoProximo(WB_CONTATO.whatsapp, o.code)}\n\n` +
    `WB Soluções Elétricas · ${WB_CONTATO.site}`;
  return {
    subject: o.personalizado ? `Seu guia de ${g.assunto} personalizado · WB Soluções Elétricas` : `Seu ${g.nome}`,
    html,
    text,
  };
}

export default async (req: Request) => {
  if (req.method !== "POST") return json(405, { error: "method" });
  if (!originOk(req)) return json(403, { error: "origin" });

  let p: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 10_000) throw new Error("too large");
    p = JSON.parse(raw);
  } catch {
    return json(400, { error: "json" });
  }

  const action = p.action === "personalize" ? "personalize" : p.action === "deliver" ? "deliver" : "create";
  const g: Guia = p.guia === "automacao" ? GUIAS.automacao : GUIAS.solar;
  const email = str(p.email, 254)?.toLowerCase() ?? null;
  if (!email || !EMAIL_RE.test(email)) return json(422, { error: "email" });

  let code: string;
  let nome: string | null = null;
  let phone: string | null = null;
  let answers: unknown = null;
  let deliver = false;
  let saved = false;
  const t = (p.touch && typeof p.touch === "object" ? p.touch : {}) as Record<string, unknown>;

  if (action === "create") {
    // anti-robô: campo invisível preenchido ou formulário enviado rápido demais
    if (str(p.website) || (typeof p.elapsed_ms === "number" && p.elapsed_ms < 2500)) return json(200, { ok: true });
    nome = oneLine(str(p.name, 80));
    phone = phoneE164(p.phone);
    if (!nome) return json(422, { error: "name" });
    if (!phone) return json(422, { error: "phone" });
    if (p.consent !== true) return json(422, { error: "consent" });
    deliver = p.deliver === true;
    code = newCode();
    try {
      const rows = await supabase("POST", "", {
        lead_code: code,
        channel: "email",
        calc: g.calc,
        name: nome,
        email,
        phone,
        calc_summary: `Pediu o ${g.nome.replace(/ 20\d\d$/, "")} (LP ${g.lp})`,
        consent_at: new Date().toISOString(),
        gclid: str(t.gclid),
        gbraid: str(t.gbraid),
        wbraid: str(t.wbraid),
        utm_source: str(t.utm_source, 256),
        utm_medium: str(t.utm_medium, 256),
        utm_campaign: str(t.utm_campaign, 256),
        utm_term: str(t.utm_term, 256),
        utm_content: str(t.utm_content, 256),
        landing_page: str(t.landing_page, 1024),
        click_page: str(p.page, 1024),
        referrer: str(t.referrer, 1024),
        first_seen_at: str(t.first_seen_at, 40),
        user_agent: str(req.headers.get("user-agent")),
      });
      saved = rows !== null;
    } catch (e) {
      console.error("[lead-guia] supabase insert", e);
    }
  } else {
    const c = str(p.code, 8);
    if (!c || !CODE_RE.test(c)) return json(422, { error: "code" });
    code = c;
    if (action === "personalize") {
      answers = g.parse(p.answers);
      if (!answers) return json(422, { error: "answers" });
    }
    deliver = true;
    // o código só vale junto com o e-mail que o criou
    try {
      const rows = await supabase(
        "PATCH",
        `?lead_code=eq.${code}&email=eq.${encodeURIComponent(email)}`,
        // sem respostas, regrava o próprio e-mail: só para confirmar que código e e-mail batem
        answers ? { calc_summary: `Guia personalizado (LP ${g.lp})\n${g.resumo(answers)}` } : { email },
      );
      if (rows && rows.length === 0) return json(404, { error: "lead" });
      if (rows) {
        saved = true;
        nome = rows[0].name;
        phone = rows[0].phone;
      }
    } catch (e) {
      console.error("[lead-guia] supabase update", e);
    }
  }

  if (!deliver) return json(200, { ok: true, code });

  const mailer = transport();
  if (!mailer) {
    console.error("[lead-guia] SMTP não configurado (SMTP_USER/SMTP_PASS)");
    return json(503, { error: "smtp", code });
  }
  try {
    const guia = await guiaPdf(req, g);
    const pdf = answers ? await guiaPersonalizado(g, guia, answers, { nome, code }) : guia;
    const from = { name: "WB Soluções Elétricas", address: env("MAIL_FROM") ?? env("SMTP_USER") ?? WB_CONTATO.email };
    const msg = emailLead(g, { nome, code, personalizado: !!answers });
    const filename = `${g.filename}${answers ? "-personalizado" : ""}.pdf`;
    const sent = await mailer.sendMail({
      from,
      to: email,
      replyTo: env("MAIL_COPY_TO") ?? from.address,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      attachments: [{ filename, content: Buffer.from(pdf), contentType: "application/pdf" }],
    });

    // aviso para a WB, com o WhatsApp do lead clicável (sem anexo: o guia é sempre o mesmo)
    const origem = [str(t.gclid) ? "Google Ads (gclid)" : null, str(t.utm_source, 256), str(t.utm_campaign, 256)]
      .filter(Boolean)
      .join(" · ") || (action === "create" ? "direto/orgânico" : "ver lead no painel");
    const wa = phone ? `https://wa.me/${phone.replace("+", "")}` : null;
    const copy = await mailer.sendMail({
      from,
      to: env("MAIL_COPY_TO") ?? from.address,
      replyTo: nome ? { name: nome, address: email } : email,
      subject: `${answers ? `${g.curto} personalizado` : `Novo lead · ${g.curto}`} · ${code}${nome ? ` · ${nome}` : ""}`,
      text:
        `${answers ? "O lead respondeu as perguntas e recebeu o guia personalizado." : `Novo lead pela LP ${g.lp} (${g.nome}).`}\n\n` +
        `Código: ${code}\nNome: ${nome ?? "(ver painel)"}\nWhatsApp: ${phone ? fmtPhone(phone) : "(ver painel)"}${wa ? `  ${wa}` : ""}\n` +
        `E-mail: ${email}\nOrigem: ${origem}\n` +
        (answers ? `\n${g.resumo(answers)}\n` : "") +
        `\nResponda este e-mail para falar direto com o lead.` +
        (saved || !env("SUPABASE_URL") ? "" : "\n\n(Atenção: o lead NÃO foi gravado no painel — verifique SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY.)"),
    });
    if (env("MAIL_DRY_RUN") === "1") (globalThis as Record<string, unknown>).__lastMails = [sent, copy];
  } catch (e) {
    console.error("[lead-guia] envio", e);
    return json(502, { error: "send", code });
  }

  if (saved) {
    try {
      await supabase("PATCH", `?lead_code=eq.${code}`, { email_sent_at: new Date().toISOString() });
    } catch (e) {
      console.error("[lead-guia] supabase email_sent_at", e);
    }
  }
  return json(200, { ok: true, code });
};

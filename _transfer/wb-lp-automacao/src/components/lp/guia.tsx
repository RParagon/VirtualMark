import { useState } from "react";
import {
  ArrowRight, CheckCircle2, Download, FileText, Hammer, Home, Lock, ShieldCheck, Sparkles, Store, Wallet,
} from "lucide-react";
import { getLeadTouch } from "@/lib/lead-tracking";
import { Choice, ITENS, LIGACOES, Nav, Question, Shell, Stepper, trackStep } from "./calculators";
import {
  NOME_ITEM, PACOTE, PRE_AUTOMACAO, calcAutomacao, fmtNum, solveSolar,
  type AutomacaoInput, type Ligacao, type SolarAnswers,
} from "./calc-logic";

/**
 * Iscas das LPs de captura. Cada PDF fica em public/materiais/ (gerado à parte) e também vai por
 * e-mail pela função /api/lead-guia, que tem a mesma lista do lado do servidor.
 */
export type GuiaKind = "solar" | "automacao";

const GUIAS: Record<
  GuiaKind,
  {
    pdf: string;
    capa: string;
    capaAlt: string;
    titulo: string;
    sub: string;
    personalizar: string;
    personalizarSub: string;
    perguntas: number;
    tema: string;
  }
> = {
  solar: {
    pdf: "/materiais/guia-energia-solar-wb-2026.pdf",
    capa: "/materiais/guia-capa.webp",
    capaAlt: "Capa do Guia WB da Energia Solar 2026",
    titulo: "Energia solar em Porto Alegre: o guia completo antes de investir",
    sub: "Lei 14.300 em 2026, como ler a conta, quanto sistema você precisa e 12 perguntas antes de assinar.",
    personalizar: "Quero o guia personalizado para a minha conta",
    personalizarSub: "+3 perguntas rápidas. Você recebe o tamanho do sistema ideal para o seu consumo.",
    perguntas: 3,
    tema: "energia solar",
  },
  automacao: {
    pdf: "/materiais/guia-casa-inteligente-wb-2026.pdf",
    capa: "/materiais/guia-automacao-capa.webp",
    capaAlt: "Capa do Guia WB da Casa Inteligente 2026",
    titulo: "Casa inteligente em Porto Alegre: o guia completo antes de automatizar",
    sub: "Wi-Fi ou Zigbee, a base elétrica que evita dor de cabeça, o que preparar na obra e 12 perguntas antes de contratar.",
    personalizar: "Quero o guia personalizado para a minha casa",
    personalizarSub: "+4 perguntas rápidas. Você recebe o pacote indicado para a sua casa.",
    perguntas: 4,
    tema: "automação residencial",
  },
};

type Fase = "form" | "quiz" | "enviado" | "personalizado";
type Answers = SolarAnswers | AutomacaoInput;

function push(data: Record<string, unknown>) {
  const w = window as typeof window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(data);
}

/** (51) 99681-6691 enquanto digita; aceita só dígitos. */
function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

async function api(body: Record<string, unknown>) {
  const res = await fetch("/api/lead-guia", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { code?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? String(res.status));
  return data;
}

/**
 * Captura primeiro, personalização depois (e só se a pessoa quiser).
 * 1. Nome, WhatsApp e e-mail → o lead é gravado e o guia sai na hora (download + e-mail).
 * 2. Opcional: as perguntas do simulador → o guia chega de novo, com o diagnóstico dela na frente.
 * Quem marca "personalizar antes" vai direto para as perguntas; se pular, recebe o guia padrão.
 */
export function Guia({ kind }: { kind: GuiaKind }) {
  const g = GUIAS[kind];
  const [fase, setFase] = useState<Fase>("form");
  const [startedAt] = useState(() => Date.now());
  const [nome, setNome] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [personalizar, setPersonalizar] = useState(false);
  const [website, setWebsite] = useState(""); // campo-isca para robôs (invisível)
  const [code, setCode] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  // o guia padrão já saiu? (no caminho "personalizar antes" ele só sai no fim ou ao pular)
  const [guiaEnviado, setGuiaEnviado] = useState(false);
  const [answers, setAnswers] = useState<Answers | null>(null);

  const emailOk = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim());
  const digits = phone.replace(/\D/g, "");
  const phoneOk = digits.length === 10 || digits.length === 11;
  const nomeOk = nome.trim().length >= 2;
  const podeEnviar = nomeOk && phoneOk && emailOk && consent && !enviando;

  const abrirQuiz = () => {
    setFase("quiz");
    trackStep(kind, "guia-etapa-1");
  };

  const cadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podeEnviar) return;
    setEnviando(true);
    setErro(null);
    try {
      const data = await api({
        action: "create",
        guia: kind,
        deliver: !personalizar,
        name: nome.trim(),
        phone: digits,
        email: email.trim(),
        consent,
        website,
        elapsed_ms: Date.now() - startedAt,
        page: location.origin + location.pathname,
        touch: getLeadTouch(),
      });
      setCode(data.code ?? null);
      // Conversão do Google Ads (GTM): gatilho no evento vm_form_lead. E-mail e telefone vão
      // para as conversões otimizadas (o GTM faz o hash antes de mandar para o Google).
      push({
        event: "vm_form_lead",
        vm_form: `guia-${kind}`,
        vm_lead_code: data.code ?? null,
        vm_email: email.trim().toLowerCase(),
        vm_phone: `+55${digits}`,
      });
      if (personalizar) {
        abrirQuiz();
      } else {
        setGuiaEnviado(true);
        setFase("enviado");
      }
    } catch {
      setErro("Não conseguimos registrar agora. Confira os dados e tente de novo.");
    } finally {
      setEnviando(false);
    }
  };

  /** Fim das perguntas: o guia volta por e-mail com o diagnóstico na frente. */
  const finalizar = async (a: Answers) => {
    if (!code) return;
    setEnviando(true);
    setErro(null);
    try {
      await api({ action: "personalize", guia: kind, code, email: email.trim(), answers: a });
      trackStep(kind, "guia-personalizado");
      setAnswers(a);
      setGuiaEnviado(true);
      setFase("personalizado");
    } catch {
      setErro("Não conseguimos enviar o guia personalizado. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  };

  /** Desistiu das perguntas: manda o guia padrão para não ficar sem a isca. */
  const pular = async () => {
    if (guiaEnviado || !code) {
      setFase("enviado");
      return;
    }
    setEnviando(true);
    try {
      await api({ action: "deliver", guia: kind, code, email: email.trim() });
      setGuiaEnviado(true);
    } catch {
      // o download na tela continua valendo
    } finally {
      setEnviando(false);
      setFase("enviado");
    }
  };

  const input =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm outline-none placeholder:text-foreground/35 focus:border-[oklch(0.7_0.15_245)]";

  if (fase === "form") {
    return (
      <form
        onSubmit={cadastrar}
        noValidate
        className="relative rounded-3xl border border-white/10 bg-background md:bg-background/80 md:backdrop-blur-xl p-6 sm:p-8 glow-blue text-left"
      >
        <div className="flex gap-4 sm:gap-5 items-start">
          <img
            src={g.capa}
            alt={g.capaAlt}
            width={240}
            height={340}
            className="w-20 sm:w-24 shrink-0 rounded-md shadow-2xl shadow-black/50 rotate-[-3deg] border border-white/10"
          />
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[oklch(0.8_0.14_80)]">
              <Sparkles className="size-3.5" /> Guia gratuito · PDF
            </div>
            <h3 className="mt-1.5 text-xl sm:text-2xl font-semibold tracking-tight text-balance leading-tight">{g.titulo}</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-foreground/60">{g.sub}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-2.5">
          <input className={input} placeholder="Seu nome" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={80} aria-label="Seu nome" required />
          <input
            className={input}
            type="tel"
            inputMode="tel"
            placeholder="WhatsApp com DDD"
            autoComplete="tel-national"
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
            aria-label="WhatsApp com DDD"
            required
          />
          <input className={input} type="email" inputMode="email" placeholder="Seu melhor e-mail" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} aria-label="Seu e-mail" required />
          <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} name="website" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
        </div>

        <label className="mt-3 flex items-start gap-2.5 rounded-xl border border-[oklch(0.7_0.15_245)]/30 bg-[oklch(0.35_0.12_245)]/15 px-3.5 py-3 text-sm cursor-pointer">
          <input type="checkbox" checked={personalizar} onChange={(e) => setPersonalizar(e.target.checked)} className="mt-0.5 size-4 accent-[oklch(0.7_0.15_245)]" />
          <span>
            <span className="font-medium">{g.personalizar}</span>
            <span className="block text-xs text-foreground/55 mt-0.5">{g.personalizarSub}</span>
          </span>
        </label>

        <label className="mt-3 flex items-start gap-2.5 text-xs text-foreground/60 cursor-pointer">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-4 accent-[oklch(0.7_0.15_245)]" />
          <span>Autorizo a WB Soluções Elétricas a me enviar o guia e a entrar em contato sobre {g.tema}, conforme a LGPD.</span>
        </label>

        <button
          type="submit"
          disabled={!podeEnviar}
          className="lp-pulse group mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none"
        >
          {enviando ? "Enviando…" : personalizar ? `Continuar para as ${g.perguntas} perguntas` : "Quero o guia grátis"}
          {!enviando && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />}
        </button>
        {erro && <p className="mt-2 text-xs text-amber-300/90" role="alert">{erro}</p>}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-foreground/45">
          <Lock className="size-3" /> Seus dados ficam só com a WB. Nada de spam.
        </p>
      </form>
    );
  }

  if (fase === "quiz") {
    const rodape = (
      <>
        {erro && <p className="mt-3 text-xs text-amber-300/90" role="alert">{erro}</p>}
        <button
          type="button"
          onClick={pular}
          disabled={enviando}
          className="mt-3 w-full text-center text-xs text-foreground/50 hover:text-foreground transition-colors py-2"
        >
          Pular e receber o guia padrão
        </button>
      </>
    );
    return kind === "solar" ? (
      <SolarQuiz enviando={enviando} onFinish={finalizar} footer={rodape} />
    ) : (
      <AutomacaoQuiz enviando={enviando} onFinish={finalizar} footer={rodape} />
    );
  }

  // enviado | personalizado
  const personalizado = fase === "personalizado" && answers;
  return (
    <div className="relative rounded-3xl border border-white/10 bg-background md:bg-background/80 md:backdrop-blur-xl p-6 sm:p-8 glow-blue text-left" role="status">
      <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
        <CheckCircle2 className="size-5" /> {personalizado ? "Seu guia personalizado está a caminho!" : "Pronto! Seu guia está liberado."}
      </div>
      <p className="mt-2 text-sm text-foreground/65">
        {guiaEnviado ? (
          <>Mandamos para <b className="text-foreground/85">{email.trim()}</b>. Se não aparecer em alguns minutos, confira o spam.</>
        ) : (
          <>Baixe agora pelo botão abaixo.</>
        )}
      </p>

      {personalizado && kind === "solar" && <SolarResumo a={answers as SolarAnswers} />}
      {personalizado && kind === "automacao" && <AutomacaoResumo a={answers as AutomacaoInput} />}

      <a
        href={g.pdf}
        target="_blank"
        rel="noreferrer"
        onClick={() => push({ event: "vm_guia_download", vm_form: `guia-${kind}`, vm_lead_code: code })}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all"
      >
        <Download className="size-4" /> Baixar o guia agora
      </a>

      {fase === "enviado" && (
        <button
          type="button"
          onClick={abrirQuiz}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/[0.04] text-sm font-medium hover:bg-white/[0.1] transition-colors"
        >
          <FileText className="size-4" /> {kind === "solar" ? "Personalizar para a minha conta" : "Personalizar para a minha casa"} (1 min)
        </button>
      )}

      <p className="mt-5 text-xs text-foreground/50 leading-relaxed">
        Um responsável técnico da WB pode entrar em contato pelo WhatsApp informado para tirar dúvidas
        {code ? <> (seu código: <b className="text-foreground/70">{code}</b>)</> : null}.
      </p>
    </div>
  );
}

type QuizProps = { enviando: boolean; onFinish: (a: Answers) => void; footer: React.ReactNode };

/* ─────────────────────────────── Energia solar ─────────────────────────────── */

function SolarQuiz({ enviando, onFinish, footer }: QuizProps) {
  const [step, setStep] = useState(0);
  const [tipo, setTipo] = useState<"casa" | "comercio" | null>(null);
  const [unidade, setUnidade] = useState<"reais" | "kwh">("reais");
  const [valor, setValor] = useState("");
  const [ligacao, setLigacao] = useState<Ligacao | "nao-sei" | null>(null);

  const numero = Number(valor.replace(/\./g, "").replace(",", "."));
  const valido = Number.isFinite(numero) && numero >= 100 && numero <= 100000;
  const answers: SolarAnswers | null =
    tipo && ligacao && valido ? { tipo, unidade, valor: numero, ligacao } : null;

  const go = (n: number) => {
    setStep(n);
    trackStep("solar", `guia-etapa-${n + 1}`);
  };

  return (
    <Shell title="Personalizar meu guia" step={step} total={3}>
      {step === 0 && (
        <>
          <Question hint="Leva menos de 1 minuto. O guia chega com o seu sistema estimado na primeira página.">Onde você quer instalar?</Question>
          <div className="grid gap-3">
            <Choice icon={Home} label="Na minha casa" selected={tipo === "casa"} onClick={() => setTipo("casa")} />
            <Choice icon={Store} label="No meu comércio ou empresa" selected={tipo === "comercio"} onClick={() => setTipo("comercio")} />
          </div>
          <Nav onNext={() => go(1)} disabled={!tipo} nextLabel="Começar" />
        </>
      )}
      {step === 1 && (
        <>
          <Question hint="Use a média dos últimos meses. O consumo em kWh aparece na conta, perto do gráfico.">Quanto vem a sua conta de luz?</Question>
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 mb-4" role="group" aria-label="Unidade">
            {(["reais", "kwh"] as const).map((u) => (
              <button
                key={u}
                type="button"
                aria-pressed={unidade === u}
                onClick={() => setUnidade(u)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${unidade === u ? "bg-white text-black" : "text-foreground/65 hover:text-foreground"}`}
              >
                {u === "reais" ? "Valor em R$" : "Consumo em kWh"}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 focus-within:border-[oklch(0.7_0.15_245)]">
            <span className="text-foreground/50 text-sm">{unidade === "reais" ? "R$" : "kWh"}</span>
            <input
              inputMode="numeric"
              autoComplete="off"
              placeholder={unidade === "reais" ? "450" : "500"}
              value={valor}
              onChange={(e) => setValor(e.target.value.replace(/[^\d.,]/g, ""))}
              onKeyDown={(e) => { if (e.key === "Enter" && valido) go(2); }}
              className="w-full bg-transparent text-xl font-semibold tabular-nums outline-none placeholder:text-foreground/25"
              aria-label={unidade === "reais" ? "Valor médio da conta em reais" : "Consumo médio em kWh"}
            />
            <span className="text-foreground/40 text-sm">/mês</span>
          </label>
          {valor && !valido && (
            <p className="mt-2 text-xs text-amber-300/90">
              {unidade === "reais" ? "Informe um valor a partir de R$ 100." : "Informe um consumo a partir de 100 kWh."}
            </p>
          )}
          <Nav onBack={() => go(0)} onNext={() => go(2)} disabled={!valido} />
        </>
      )}
      {step === 2 && (
        <>
          <Question hint="Está escrito na conta como tipo de fornecimento. Se não souber, tudo bem.">Qual é o tipo de ligação?</Question>
          <div className="grid gap-2.5">
            {LIGACOES.map((l) => (
              <Choice key={l.id} label={l.label} sub={l.sub} selected={ligacao === l.id} onClick={() => setLigacao(l.id)} />
            ))}
            <Choice label="Não sei" sub="A gente confere na análise da conta" selected={ligacao === "nao-sei"} onClick={() => setLigacao("nao-sei")} />
          </div>
          <Nav
            onBack={() => go(1)}
            onNext={() => answers && onFinish(answers)}
            disabled={!answers || enviando}
            nextLabel={enviando ? "Enviando…" : "Receber meu guia"}
          />
        </>
      )}
      {footer}
    </Shell>
  );
}

function SolarResumo({ a }: { a: SolarAnswers }) {
  const r = solveSolar(a).result;
  return (
    <div className="mt-5 grid grid-cols-3 gap-2.5">
      {[
        { v: `${fmtNum(r.kwp, 1)} kWp`, l: "sistema estimado" },
        { v: String(r.modulos), l: "módulos" },
        { v: `~${r.areaM2} m²`, l: "de telhado" },
      ].map((s) => (
        <div key={s.l} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center">
          <div className="text-lg font-semibold tabular-nums">{s.v}</div>
          <div className="text-[11px] text-foreground/55 leading-tight mt-0.5">{s.l}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── Automação residencial ─────────────────────────── */

/** As mesmas perguntas do simulador de automação, sem preço e sem WhatsApp no fim. */
function AutomacaoQuiz({ enviando, onFinish, footer }: QuizProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AutomacaoInput>({
    situacao: "pronta",
    itens: [],
    ambientes: 2,
    pontosLuz: 8,
    janelas: 3,
    prioridade: "economia",
  });
  const [situacaoEscolhida, setSituacaoEscolhida] = useState(false);
  const [prioridadeEscolhida, setPrioridadeEscolhida] = useState(false);

  const set = <K extends keyof AutomacaoInput>(k: K, v: AutomacaoInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const go = (n: number) => {
    setStep(n);
    trackStep("automacao", `guia-etapa-${n + 1}`);
  };
  const toggle = (id: AutomacaoInput["itens"][number]) =>
    set("itens", form.itens.includes(id) ? form.itens.filter((x) => x !== id) : [...form.itens, id]);
  const has = (id: AutomacaoInput["itens"][number]) => form.itens.includes(id);
  const precisaQtd = has("luzes") || has("climaTv") || has("persianas");

  return (
    <Shell title="Personalizar meu guia" step={step} total={4}>
      {step === 0 && (
        <>
          <Question hint="Leva menos de 1 minuto. O guia chega com o pacote indicado para a sua casa na primeira página.">
            Sua casa está pronta ou em obra?
          </Question>
          <div className="grid gap-3">
            <Choice
              icon={Home}
              label="Casa pronta"
              sub="Quero automatizar sem quebrar parede"
              selected={situacaoEscolhida && form.situacao === "pronta"}
              onClick={() => { set("situacao", "pronta"); setSituacaoEscolhida(true); }}
            />
            <Choice
              icon={Hammer}
              label="Em obra ou reforma"
              sub="Quero deixar a casa preparada desde já"
              selected={situacaoEscolhida && form.situacao === "obra"}
              onClick={() => { set("situacao", "obra"); setSituacaoEscolhida(true); }}
            />
          </div>
          <Nav onNext={() => go(1)} disabled={!situacaoEscolhida} nextLabel="Começar" />
        </>
      )}

      {step === 1 && (
        <>
          <Question hint="Pode marcar mais de um.">O que você quer automatizar?</Question>
          <div className="grid gap-2.5">
            {ITENS.map((it) => (
              <Choice key={it.id} icon={it.icon} label={it.label} sub={it.sub} selected={has(it.id)} onClick={() => toggle(it.id)} />
            ))}
          </div>
          <Nav onBack={() => go(0)} onNext={() => go(precisaQtd ? 2 : 3)} disabled={form.itens.length === 0} />
        </>
      )}

      {step === 2 && (
        <>
          <Question hint="Uma estimativa já basta. Na visita técnica a gente confere tudo.">Quantos, mais ou menos?</Question>
          <div className="grid gap-2.5">
            {has("luzes") && (
              <Stepper label="Pontos de luz" value={form.pontosLuz} min={1} max={60} onChange={(n) => set("pontosLuz", n)} />
            )}
            {has("climaTv") && (
              <Stepper label="Ambientes com ar ou TV" value={form.ambientes} min={1} max={15} onChange={(n) => set("ambientes", n)} />
            )}
            {has("persianas") && (
              <Stepper label="Janelas com persiana" value={form.janelas} min={1} max={20} onChange={(n) => set("janelas", n)} />
            )}
          </div>
          <Nav onBack={() => go(1)} onNext={() => go(3)} />
        </>
      )}

      {step === 3 && (
        <>
          <Question>O que é mais importante para você?</Question>
          <div className="grid gap-3">
            <Choice
              icon={Wallet}
              label="Começar gastando pouco"
              sub="Funcional, pelo app e por voz. Depende do Wi-Fi da casa."
              selected={prioridadeEscolhida && form.prioridade === "economia"}
              onClick={() => { set("prioridade", "economia"); setPrioridadeEscolhida(true); }}
            />
            <Choice
              icon={ShieldCheck}
              label="Estabilidade e garantia"
              sub="Central própria, marcas com garantia no Brasil e cenas completas."
              selected={prioridadeEscolhida && form.prioridade === "estabilidade"}
              onClick={() => { set("prioridade", "estabilidade"); setPrioridadeEscolhida(true); }}
            />
          </div>
          <Nav
            onBack={() => go(precisaQtd ? 2 : 1)}
            onNext={() => onFinish(form)}
            disabled={!prioridadeEscolhida || enviando}
            nextLabel={enviando ? "Enviando…" : "Receber meu guia"}
          />
        </>
      )}
      {footer}
    </Shell>
  );
}

function AutomacaoResumo({ a }: { a: AutomacaoInput }) {
  const r = calcAutomacao(a);
  const pacote = PACOTE[r.tier];
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[oklch(0.75_0.15_245)]">Pacote indicado</div>
      <div className="mt-0.5 text-lg font-semibold">{pacote.nome}</div>
      <ul className="mt-2 space-y-1.5">
        {r.linhas.map((l) => (
          <li key={l.item} className="flex items-start gap-2 text-sm text-foreground/75">
            <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-[oklch(0.7_0.15_245)]" /> {NOME_ITEM[l.item](l.qtd)}
          </li>
        ))}
      </ul>
      {a.situacao === "obra" && (
        <p className="mt-3 text-xs text-foreground/55">
          O guia traz o checklist de pré-automação para a sua obra: {PRE_AUTOMACAO[0].toLowerCase()} e mais.
        </p>
      )}
    </div>
  );
}

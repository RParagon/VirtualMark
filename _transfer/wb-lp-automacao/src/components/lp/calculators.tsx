import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AirVent, ArrowLeft, ArrowRight, Blinds, CheckCircle2, ChefHat, FileText, Hammer, Home, Lightbulb,
  LockKeyhole, MessageCircle, Minus, Plus, Sparkles, Store, Wallet, ShieldCheck,
} from "lucide-react";
import { getLeadTouch, openWhatsAppLead } from "@/lib/lead-tracking";
import {
  AUTOMACAO_REFERENCIA_INSTALADA, LIGACAO_LABEL, NOME_ITEM, PACOTE, PRE_AUTOMACAO, SOLAR_PREMISSAS, TAXA_MINIMA_KWH,
  calcAutomacao, calcSolar, fmtNum, fmtRange, reaisParaKwh, type AutomacaoInput, type ItemAutomacao, type Ligacao,
} from "./calc-logic";

export type CalculatorKind = "solar" | "automacao";

/** Funil da isca no GTM/GA: em que etapa as pessoas param. A conversão continua sendo o clique no WhatsApp. */
export function trackStep(calc: CalculatorKind, step: string) {
  const w = window as typeof window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "vm_calc_step", vm_calc: calc, vm_calc_step: step });
}

/* ───────────────────────────── peças de UI ───────────────────────────── */

export function Shell({
  title,
  step,
  total,
  children,
}: {
  title: string;
  step: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-background md:bg-background/80 md:backdrop-blur-xl p-6 sm:p-8 glow-blue text-left">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] sm:tracking-[0.2em] text-foreground/55 whitespace-nowrap">
          <Sparkles className="size-3.5 text-[oklch(0.75_0.15_245)]" /> {title}
        </div>
        <span className="text-xs text-foreground/45 tabular-nums whitespace-nowrap" aria-live="polite">
          {step < total ? `Etapa ${step + 1} de ${total}` : "Resultado"}
        </span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden mb-7" aria-hidden="true">
        <div
          className="h-full bg-[oklch(0.7_0.15_245)] transition-[width] duration-500"
          style={{ width: `${(Math.min(step, total) / total) * 100}%` }}
        />
      </div>
      {children}
    </div>
  );
}

export function Question({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-balance">{children}</h3>
      {hint && <p className="mt-1.5 text-sm text-foreground/55">{hint}</p>}
    </div>
  );
}

export function Choice({
  icon: Icon,
  label,
  sub,
  selected,
  onClick,
}: {
  icon?: LucideIcon;
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.7_0.15_245)] ${
        selected
          ? "border-[oklch(0.7_0.15_245)] bg-[oklch(0.35_0.12_245)]/25"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      {Icon && (
        <span className="size-9 shrink-0 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
          <Icon className="size-4.5 text-foreground/90" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        {sub && <span className="block text-xs text-foreground/55 mt-0.5">{sub}</span>}
      </span>
      <CheckCircle2
        className={`size-5 shrink-0 transition-opacity ${selected ? "opacity-100 text-[oklch(0.75_0.15_245)]" : "opacity-0"}`}
      />
    </button>
  );
}

export function Stepper({
  label,
  value,
  min = 0,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const btn =
    "size-10 rounded-full border border-white/15 bg-white/[0.04] grid place-items-center hover:bg-white/[0.1] disabled:opacity-30 disabled:hover:bg-white/[0.04] transition-colors";
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Menos — ${label}`}>
          <Minus className="size-4" />
        </button>
        <span className="w-7 text-center text-lg font-semibold tabular-nums" aria-live="polite">{value}</span>
        <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Mais — ${label}`}>
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function Nav({
  onBack,
  onNext,
  nextLabel = "Continuar",
  disabled,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-7 flex items-center justify-between gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Voltar
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {nextLabel} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

/**
 * Isca por e-mail: o relatório em PDF sai pela Netlify Function /api/lead-email
 * (SMTP da Hostinger). O servidor refaz a conta a partir das respostas, então
 * aqui só vão as respostas, nunca o resultado.
 */
function EmailReport({
  calc,
  answers,
  startedAt,
}: {
  calc: CalculatorKind;
  answers: unknown;
  startedAt: number;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // campo-isca para robôs (invisível)
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const emailOk = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOk || !consent || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/lead-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          calc,
          answers,
          email: email.trim(),
          name: name.trim(),
          consent,
          website,
          elapsed_ms: Date.now() - startedAt,
          page: location.origin + location.pathname,
          touch: getLeadTouch(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { code?: string };
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      const w = window as typeof window & { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: "vm_email_lead", vm_lead_code: data.code ?? null, vm_calc: calc });
      trackStep(calc, "email");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-4 text-sm" role="status">
        <div className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="size-4 text-emerald-400" /> Relatório enviado!
        </div>
        <p className="mt-1 text-foreground/65">
          Mandamos para <b className="text-foreground/85">{email.trim()}</b>. Se não aparecer em alguns minutos, confira o spam.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm outline-none placeholder:text-foreground/35 focus:border-[oklch(0.7_0.15_245)]";
  return (
    <form onSubmit={submit} className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4" noValidate>
      <div className="flex items-center gap-2 text-sm font-medium">
        <FileText className="size-4 text-[oklch(0.75_0.15_245)]" /> Receba o relatório completo em PDF
      </div>
      <p className="mt-1 text-xs text-foreground/55">Com o resultado, o que considerar e os próximos passos, no seu e-mail.</p>
      <div className="mt-3 grid gap-2">
        <input className={input} placeholder="Seu nome (opcional)" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} aria-label="Seu nome" />
        <input className={input} type="email" inputMode="email" placeholder="Seu melhor e-mail" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} aria-label="Seu e-mail" required />
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          name="website"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
      </div>
      <label className="mt-3 flex items-start gap-2.5 text-xs text-foreground/60 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-4 accent-[oklch(0.7_0.15_245)]" />
        <span>
          Autorizo a WB Soluções Elétricas a me enviar o relatório e a entrar em contato sobre esta simulação, conforme a LGPD.
        </span>
      </label>
      <button
        type="submit"
        disabled={!emailOk || !consent || state === "sending"}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/15 bg-white/[0.06] text-sm font-medium hover:bg-white/[0.12] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {state === "sending" ? "Enviando…" : "Enviar para o meu e-mail"}
      </button>
      {state === "error" && (
        <p className="mt-2 text-xs text-amber-300/90" role="alert">
          Não conseguimos enviar agora. Tente de novo ou peça o relatório pelo WhatsApp.
        </p>
      )}
    </form>
  );
}

function WhatsCta({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lp-pulse mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#25D366] text-black font-medium hover:scale-[1.01] transition-transform"
    >
      <MessageCircle className="size-5" /> {label}
    </button>
  );
}

/* ─────────────────────────── Automação residencial ─────────────────────────── */

export const ITENS: { id: ItemAutomacao; icon: LucideIcon; label: string; sub: string }[] = [
  { id: "luzes", icon: Lightbulb, label: "Luzes", sub: "Ligar, desligar e criar cenas pelo celular ou pela voz" },
  { id: "climaTv", icon: AirVent, label: "Ar-condicionado e TV", sub: "Ligar o ar antes de chegar em casa" },
  { id: "persianas", icon: Blinds, label: "Persianas", sub: "Abrir e fechar no horário ou com um toque" },
  { id: "fechadura", icon: LockKeyhole, label: "Fechadura digital", sub: "Senha, biometria e acesso pelo app" },
  { id: "cozinha", icon: ChefHat, label: "Cozinha", sub: "Sensor de gás, tomadas inteligentes e iluminação" },
];

export function AutomacaoCalculator({ phone, showPrices }: { phone: string; showPrices: boolean }) {
  const TOTAL = 4;
  const [step, setStep] = useState(0);
  const [startedAt] = useState(() => Date.now());
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
    trackStep("automacao", n >= TOTAL ? "resultado" : `etapa-${n + 1}`);
  };
  const toggle = (id: ItemAutomacao) =>
    set("itens", form.itens.includes(id) ? form.itens.filter((x) => x !== id) : [...form.itens, id]);
  const has = (id: ItemAutomacao) => form.itens.includes(id);
  const precisaQtd = has("luzes") || has("climaTv") || has("persianas");

  const result = calcAutomacao(form);
  const pacote = PACOTE[result.tier];

  const enviar = () => {
    const itens = result.linhas.map((l) => NOME_ITEM[l.item](l.qtd)).join(", ");
    const msg =
      `Olá! Fiz a simulação de automação residencial no site. ` +
      `${form.situacao === "obra" ? "Estou em obra/reforma" : "Minha casa já está pronta"}. ` +
      `Quero automatizar: ${itens}. Pacote sugerido: ${pacote.nome}. ` +
      `Quero receber a estimativa${form.situacao === "obra" ? " e o checklist de pré-automação" : ""}.`;
    trackStep("automacao", "whatsapp");
    openWhatsAppLead(phone, msg, "calc-automacao");
  };

  return (
    <Shell title="Simulador de automação" step={step} total={TOTAL}>
      {step === 0 && (
        <>
          <Question hint="Leva menos de 1 minuto. No final você recebe o pacote ideal para a sua casa.">
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
          <Nav onBack={() => go(precisaQtd ? 2 : 1)} onNext={() => go(4)} disabled={!prioridadeEscolhida} nextLabel="Ver meu resultado" />
        </>
      )}

      {step === 4 && (
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[oklch(0.75_0.15_245)]">Pacote indicado</div>
          <h3 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">{pacote.nome}</h3>
          <p className="mt-2 text-sm text-foreground/65">{pacote.resumo}</p>
          {form.situacao === "obra" && form.prioridade === "economia" && (
            <p className="mt-2 text-xs text-foreground/50">
              Para obra ou reforma indicamos a linha com central: a infraestrutura já fica pronta para crescer.
            </p>
          )}

          <ul className="mt-5 divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
            {result.linhas.map((l) => (
              <li key={l.item} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span>{NOME_ITEM[l.item](l.qtd)}</span>
                {showPrices && <span className="text-foreground/60 tabular-nums whitespace-nowrap">{fmtRange(l.faixa)}</span>}
              </li>
            ))}
          </ul>

          {showPrices ? (
            <div className="mt-4 rounded-2xl border border-[oklch(0.7_0.15_245)]/40 bg-[oklch(0.35_0.12_245)]/15 px-4 py-4">
              <div className="text-xs text-foreground/60">Equipamentos (estimativa, sem mão de obra)</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">{fmtRange(result.equipamento)}</div>
              <p className="mt-2 text-xs text-foreground/50 leading-relaxed">
                Referência: uma casa de 3 quartos completa no pacote {pacote.nome} fica entre{" "}
                {fmtRange(AUTOMACAO_REFERENCIA_INSTALADA[result.tier], "e")} já instalada. O valor exato sai na proposta,
                depois da visita técnica.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {pacote.inclui.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-foreground/75">
                  <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-[oklch(0.7_0.15_245)]" /> {t}
                </li>
              ))}
            </ul>
          )}

          {form.situacao === "obra" && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
              <div className="text-sm font-medium">Bônus: checklist de pré-automação</div>
              <p className="mt-1 text-xs text-foreground/55">Custa pouco agora e evita quebrar parede depois:</p>
              <ul className="mt-3 space-y-1.5">
                {PRE_AUTOMACAO.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-foreground/75">
                    <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-emerald-400" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <WhatsCta
            label={showPrices ? "Receber o orçamento no WhatsApp" : "Receber minha estimativa no WhatsApp"}
            onClick={enviar}
          />
          <p className="mt-3 text-center text-xs text-foreground/45">
            Sem compromisso. A simulação vai junto na mensagem, você não precisa repetir nada.
          </p>
          <EmailReport calc="automacao" answers={form} startedAt={startedAt} />
          <button
            type="button"
            onClick={() => go(0)}
            className="mt-2 w-full text-center text-xs text-foreground/50 hover:text-foreground transition-colors py-2"
          >
            Refazer simulação
          </button>
        </div>
      )}
    </Shell>
  );
}

/* ─────────────────────────────── Energia solar ─────────────────────────────── */

export const LIGACOES: { id: Ligacao; label: string; sub: string }[] = [
  { id: "mono", label: "Monofásica", sub: "2 fios no padrão de entrada" },
  { id: "bi", label: "Bifásica", sub: "3 fios no padrão de entrada" },
  { id: "tri", label: "Trifásica", sub: "4 fios no padrão de entrada" },
];

export function SolarCalculator({ phone }: { phone: string }) {
  const TOTAL = 3;
  const [step, setStep] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [tipo, setTipo] = useState<"casa" | "comercio" | null>(null);
  const [unidade, setUnidade] = useState<"reais" | "kwh">("reais");
  const [valor, setValor] = useState("");
  const [ligacao, setLigacao] = useState<Ligacao | "nao-sei" | null>(null);

  const go = (n: number) => {
    setStep(n);
    trackStep("solar", n >= TOTAL ? "resultado" : `etapa-${n + 1}`);
  };

  const numero = Number(valor.replace(/\./g, "").replace(",", "."));
  const valido = Number.isFinite(numero) && numero >= 100 && numero <= 100000;
  const consumoKwh = unidade === "kwh" ? Math.round(numero) : reaisParaKwh(numero);
  // "não sei" usa bifásica, a mais comum em casas de Porto Alegre
  const lig: Ligacao = ligacao && ligacao !== "nao-sei" ? ligacao : "bi";
  const r = calcSolar({ consumoKwh: valido ? consumoKwh : 0, ligacao: lig });

  const enviar = () => {
    const conta = unidade === "reais" ? `conta média de R$ ${fmtNum(numero)}` : `consumo médio de ${fmtNum(numero)} kWh`;
    const msg =
      `Olá! Fiz a simulação de energia solar no site para ${tipo === "comercio" ? "meu comércio" : "minha casa"}: ` +
      `${conta}, ligação ${ligacao === "nao-sei" || !ligacao ? "não sei" : LIGACAO_LABEL[ligacao].toLowerCase()}. ` +
      `Resultado: cerca de ${fmtNum(r.kwp, 1)} kWp (${r.modulos} módulos). Quero receber a proposta.`;
    trackStep("solar", "whatsapp");
    openWhatsAppLead(phone, msg, "calc-solar");
  };

  return (
    <Shell title="Simulador solar" step={step} total={TOTAL}>
      {step === 0 && (
        <>
          <Question hint="Leva menos de 1 minuto. Você vê o tamanho do sistema para o seu consumo.">
            Onde você quer instalar?
          </Question>
          <div className="grid gap-3">
            <Choice icon={Home} label="Na minha casa" selected={tipo === "casa"} onClick={() => setTipo("casa")} />
            <Choice icon={Store} label="No meu comércio ou empresa" selected={tipo === "comercio"} onClick={() => setTipo("comercio")} />
          </div>
          <Nav onNext={() => go(1)} disabled={!tipo} nextLabel="Começar" />
        </>
      )}

      {step === 1 && (
        <>
          <Question hint="Use a média dos últimos meses. O consumo em kWh aparece na conta, perto do gráfico.">
            Quanto vem a sua conta de luz?
          </Question>
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
          <Question hint="Está escrito na conta como tipo de fornecimento. Se não souber, tudo bem.">
            Qual é o tipo de ligação?
          </Question>
          <div className="grid gap-2.5">
            {LIGACOES.map((l) => (
              <Choice key={l.id} label={l.label} sub={l.sub} selected={ligacao === l.id} onClick={() => setLigacao(l.id)} />
            ))}
            <Choice label="Não sei" sub="A gente confere na análise da conta" selected={ligacao === "nao-sei"} onClick={() => setLigacao("nao-sei")} />
          </div>
          <Nav onBack={() => go(1)} onNext={() => go(3)} disabled={!ligacao} nextLabel="Ver meu resultado" />
        </>
      )}

      {step === 3 && (
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[oklch(0.75_0.15_245)]">Sistema estimado</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums">{fmtNum(r.kwp, 1)}</span>
            <span className="text-lg text-foreground/60">kWp</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {[
              { v: String(r.modulos), l: "módulos" },
              { v: `~${r.areaM2} m²`, l: "de telhado" },
              { v: `~${fmtNum(r.geracaoKwh)}`, l: "kWh/mês gerados" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center">
                <div className="text-lg font-semibold tabular-nums">{s.v}</div>
                <div className="text-[11px] text-foreground/55 leading-tight mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-foreground/50 leading-relaxed">
            Estimativa para Porto Alegre com módulos de {SOLAR_PREMISSAS.potenciaModulo} W, cobrindo o consumo acima da
            taxa mínima da distribuidora ({TAXA_MINIMA_KWH[lig]} kWh na ligação {LIGACAO_LABEL[lig].toLowerCase()}).
            O projeto final considera o seu telhado, a sombra e o histórico da conta.
          </p>
          <WhatsCta label="Receber minha proposta no WhatsApp" onClick={enviar} />
          <p className="mt-3 text-center text-xs text-foreground/45">
            Sem compromisso. Mande também a foto da conta, que a proposta sai mais precisa.
          </p>
          <EmailReport
            calc="solar"
            answers={{ tipo, unidade, valor: numero, ligacao }}
            startedAt={startedAt}
          />
          <button
            type="button"
            onClick={() => go(0)}
            className="mt-2 w-full text-center text-xs text-foreground/50 hover:text-foreground transition-colors py-2"
          >
            Refazer simulação
          </button>
        </div>
      )}
    </Shell>
  );
}

export function Calculator({ kind, phone, showPrices }: { kind: CalculatorKind; phone: string; showPrices: boolean }) {
  return kind === "solar" ? <SolarCalculator phone={phone} /> : <AutomacaoCalculator phone={phone} showPrices={showPrices} />;
}


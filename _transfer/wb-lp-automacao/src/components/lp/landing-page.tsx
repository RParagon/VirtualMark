import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, Download, MapPin, Mail, MessageCircle, Phone } from "lucide-react";
import { SeamlessVideo } from "@/components/ui/seamless-video";
import { LogoCloud } from "@/components/ui/logo-cloud-3";
import { PortfolioGallery } from "@/components/ui/portfolio-gallery";
import { openWhatsAppLead } from "@/lib/lead-tracking";
import { Calculator, type CalculatorKind } from "./calculators";
import { GoogleReviews } from "./google-reviews";
import { Guia, type GuiaKind } from "./guia";
import { CountUp, Reveal, trackSpotlight, useInView, useScrolled } from "./motion";

// Servido de public/ com nome estável (mesmo arquivo da home, já em cache)
const logo = "/logo-wb.webp";

const PHONE_RAW = "5551996816691";
const PHONE_DISPLAY = "(51) 99681-6691";
const EMAIL = "contato@wbsolucoeseletricas.com.br";

export interface LpCta {
  label: string;
  message: string;
}

export interface LpConfig {
  /** Título da aba / resultado de busca */
  title: string;
  description: string;
  hero: {
    badge: string;
    titleStart: string;
    titleEm: string;
    titleEnd: string;
    lead: string;
    checks: string[];
    primary: LpCta;
    /** Vídeo de fundo em loop. Padrão: o da home (painéis solares); false desliga. */
    video?: false | { src: string; poster: string; playbackRate?: number };
    secondary?: LpCta & { icon: LucideIcon };
    stats: { value: string; suffix?: string; label: string }[];
    /** Foto da direita (desktop). Ignorada quando a LP tem calculadora — ela ocupa esse lugar. */
    image?: string;
    imageAlt?: string;
    chips?: { icon: LucideIcon; title: string; sub: string }[];
  };
  /** Isca digital: simulador no lugar da foto do hero; o botão principal leva até ele. */
  calculator?: {
    kind: CalculatorKind;
    cta: string;
    /** Mostra faixas de preço no resultado. Para pré-visualizar sem publicar: ?precos=1 na URL. */
    showPrices?: boolean;
  };
  /**
   * Captura por formulário no lugar do WhatsApp: o card do guia ocupa o lugar da foto do hero
   * e todos os botões da página levam até ele (#guia). Nenhum link de WhatsApp sai na página.
   */
  capture?: {
    /** Qual isca vai no card (padrão: solar) */
    guia?: GuiaKind;
    /** Texto dos botões principais (hero, cabeçalho, barra do celular) */
    cta: string;
    /** Texto curto dos links dos cards de serviço */
    link: string;
  };
  logos: { src: string; alt: string; width: number; height: number }[];
  services: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { icon: LucideIcon; title: string; desc: string; message: string }[];
  };
  steps: {
    title: string;
    lead: string;
    items: { icon: LucideIcon; title: string; desc: string; tag: string }[];
    foot: string;
    cta: LpCta;
  };
  audience?: {
    title: string;
    items: { img: string; alt: string; cat: string; title: string; desc: string }[];
  };
  gallery?: { title: string; images: { src: string; alt: string; title?: string }[] };
  trust: {
    eyebrow: string;
    title: string;
    lead: string;
    points: string[];
    cta: LpCta;
  };
  /** Cidade/região mostrada no rodapé */
  location: string;
  faq: { lead: string; items: { q: string; a: string }[] };
  final: { title: string; lead: string; cta: LpCta };
  stickyLabel: string;
}

function trackedWhats(message: string, source: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openWhatsAppLead(PHONE_RAW, message, source);
  };
}

/** Link estático como reserva se o JS falhar; o clique passa por openWhatsAppLead. */
function WaLink({
  message,
  source,
  className,
  children,
}: {
  message: string;
  source: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(message)}`}
      onClick={trackedWhats(message, source)}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

/** Botão que leva ao formulário do guia (modo captura). O clique vai para o dataLayer como os do WhatsApp. */
function FormLink({ source, className, children }: { source: string; className?: string; children: React.ReactNode }) {
  return (
    <a
      href="#guia"
      onClick={() => {
        const w = window as typeof window & { dataLayer?: unknown[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({ event: "vm_cta_click", vm_source: source });
      }}
      className={className}
    >
      {children}
    </a>
  );
}

/** CTA da LP: WhatsApp normal, ou âncora para o formulário do guia no modo captura (a mensagem é ignorada). */
function Cta({ form, ...p }: { form: boolean; message: string; source: string; className?: string; children: React.ReactNode }) {
  return form ? <FormLink source={p.source} className={p.className}>{p.children}</FormLink> : <WaLink {...p} />;
}

const BTN_WHITE =
  "group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all hover:scale-[1.02]";
const BTN_GHOST =
  "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/[0.03] text-foreground hover:bg-white/[0.08] transition-all md:backdrop-blur";
const BTN_WA =
  "inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#25D366] text-black font-medium hover:scale-[1.02] transition-transform";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/50 mb-4">
      <span className="h-px w-8 bg-foreground/30" />
      {children}
    </div>
  );
}

/** true enquanto o elemento com esse id aparece na tela (IntersectionObserver). */
function useElementVisible(id: string | null) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = id ? document.getElementById(id) : null;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return visible;
}

/** Metadados da aba + noindex (a LP é só para tráfego pago; o header X-Robots-Tag está no netlify.toml). */
function useLandingMeta(title: string, description: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    const set = (name: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      const created = !el;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      const prev = el.content;
      el.content = content;
      return () => {
        if (created) el!.remove();
        else el!.content = prev;
      };
    };
    const undoDesc = set("description", description);
    const undoRobots = set("robots", "noindex, nofollow");
    return () => {
      document.title = prevTitle;
      undoDesc();
      undoRobots();
    };
  }, [title, description]);
}

export function LandingPage({ config }: { config: LpConfig }) {
  useLandingMeta(config.title, config.description);
  const { hero, calculator } = config;
  const scrolled = useScrolled();
  const showPrices =
    !!calculator?.showPrices ||
    (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("precos") === "1");
  const [stepsRef, stepsIn] = useInView<HTMLOListElement>();
  const capture = config.capture;
  const calcVisible = useElementVisible(capture ? "guia" : calculator ? "simulador" : null);
  const CtaIcon = capture ? Download : MessageCircle;
  const btnStrong = capture ? BTN_WHITE : BTN_WA;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-0">
      {/* Cabeçalho enxuto: logo + CTA (sem menu, para não dispersar o clique) */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color] duration-500 border-b ${
          scrolled ? "bg-background md:bg-background/80 md:backdrop-blur-xl border-white/5" : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between gap-4">
          <a href="#topo" aria-label="WB Soluções Elétricas">
            <img src={logo} alt="WB Soluções Elétricas" width={546} height={96} fetchPriority="high" className="h-9 lg:h-10 w-auto" />
          </a>
          <div className="hidden lg:flex items-center gap-6 text-xs text-foreground/60">
            {["CREA · ART · NR10", "Emitimos NF", "Atende fins de semana"].map((s) => (
              <span key={s} className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[oklch(0.7_0.15_245)]" /> {s}
              </span>
            ))}
          </div>
          {capture ? (
            <FormLink
              source="topbar"
              className="inline-flex items-center gap-2 whitespace-nowrap px-4 sm:px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all"
            >
              <Download className="size-4" /> <span><span className="hidden sm:inline">Baixar o </span>guia grátis</span>
            </FormLink>
          ) : (
            <WaLink
              message={hero.primary.message}
              source="topbar"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all"
            >
              <MessageCircle className="size-4" /> <span className="hidden sm:inline">Falar no</span> WhatsApp
            </WaLink>
          )}
        </div>
      </header>

      <main id="topo">
        {/* HERO — mesmo vídeo de fundo da home */}
        <section className="relative isolate pt-28 pb-12 lg:pt-40 lg:pb-20 overflow-hidden">
          {hero.video !== false && (
            <SeamlessVideo
              className="absolute inset-0 z-0 h-full w-full object-cover"
              src={hero.video?.src ?? "/hero-loop.mp4"}
              poster={hero.video?.poster ?? "/hero-loop-poster.webp"}
              playbackRate={hero.video?.playbackRate ?? 0.5}
            />
          )}
          <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,oklch(0.16_0.03_245/0.86),oklch(0.16_0.03_245/0.78)_50%,oklch(0.16_0.03_245/0.94))] pointer-events-none" />
          <div className="absolute inset-0 z-[2] tech-grid opacity-60 radial-fade pointer-events-none" />
          <div className="glow-orb absolute -top-40 -right-40 z-[2] w-[600px] h-[600px] opacity-25 pointer-events-none [--orb:oklch(0.45_0.18_250)] [--orb-blur:120px]" />
          <div className="glow-orb absolute bottom-0 -left-32 z-[2] w-[400px] h-[400px] opacity-15 pointer-events-none [--orb:oklch(0.4_0.15_240)] [--orb-blur:100px]" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
            <div className="animate-rise text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 md:backdrop-blur text-xs text-foreground/70 mb-6">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {hero.badge}
              </div>
              <h1 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-extrabold tracking-tight text-balance leading-[1.05]">
                {hero.titleStart} <span className="font-thin text-white">{hero.titleEm}</span>
                {hero.titleEnd}
              </h1>
              <p className="mt-5 text-sm lg:text-base text-foreground/65 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {hero.lead}
              </p>
              <ul className="mt-6 space-y-2.5 max-w-xl mx-auto lg:mx-0 text-left">
                {hero.checks.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm text-foreground/80">
                    <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-[oklch(0.7_0.15_245)]" /> {c}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                {capture && (
                  <FormLink source="hero" className={`${BTN_WHITE} lp-pulse`}>
                    {capture.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </FormLink>
                )}
                {!capture && calculator && (
                  <a href="#simulador" className={`${BTN_WHITE} lp-pulse`}>
                    {calculator.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                )}
                {!capture && (
                <WaLink
                  message={hero.primary.message}
                  source="hero"
                  className={calculator ? BTN_GHOST : `${BTN_WHITE} lp-pulse`}
                >
                  {calculator && <MessageCircle className="size-4" />}
                  {hero.primary.label}
                  {!calculator && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />}
                </WaLink>
                )}
                {!capture && hero.secondary && (
                  <WaLink message={hero.secondary.message} source="hero-secundario" className={BTN_GHOST}>
                    <hero.secondary.icon className="size-4" /> {hero.secondary.label}
                  </WaLink>
                )}
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
                {hero.stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl lg:text-3xl font-semibold tracking-tight">
                      <CountUp value={s.value} />
                      {s.suffix && <span className="text-foreground/40 text-lg ml-0.5">{s.suffix}</span>}
                    </div>
                    <div className="mt-1 text-xs text-foreground/55 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {capture ? (
              <div id="guia" className="relative scroll-mt-24 animate-fade-up" style={{ animationDelay: "0.15s" }}>
                <Guia kind={capture.guia ?? "solar"} />
              </div>
            ) : calculator ? (
              <div id="simulador" className="relative scroll-mt-24 animate-fade-up" style={{ animationDelay: "0.15s" }}>
                <Calculator kind={calculator.kind} phone={PHONE_RAW} showPrices={showPrices} />
              </div>
            ) : hero.image ? (
            /* Foto: só no desktop, para o CTA ficar acima da dobra no mobile */
            <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <div className="relative rounded-3xl overflow-hidden border border-white/10 glow-blue aspect-[4/5]">
                <img
                  src={hero.image}
                  alt={hero.imageAlt}
                  width={1000}
                  height={1250}
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 inset-x-4 grid grid-cols-2 gap-3">
                  {hero.chips?.map((c) => (
                    <div
                      key={c.title}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-background/85 md:bg-background/70 md:backdrop-blur-md px-4 py-3"
                    >
                      <c.icon className="size-5 shrink-0 text-[oklch(0.7_0.15_245)]" />
                      <div className="leading-tight">
                        <div className="text-sm font-medium">{c.title}</div>
                        <div className="text-xs text-foreground/55">{c.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ) : null}
          </div>
        </section>

        {/* Parceiros e clientes (mesmos logos da home) */}
        <section className="relative border-t border-white/5 py-8 overflow-hidden">
          <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
            <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-foreground/45">
              Clientes e parceiros
            </p>
            <LogoCloud logos={config.logos} />
          </div>
        </section>

        {/* Serviços */}
        <section className="relative py-16 lg:py-28 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-2xl">
              <SectionLabel>{config.services.eyebrow}</SectionLabel>
              <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-balance">
                {config.services.title}
              </h2>
              <p className="mt-4 text-foreground/60">{config.services.lead}</p>
            </div>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4" onMouseMove={trackSpotlight}>
              {config.services.items.map((s, i) => (
                <Reveal
                  key={s.title}
                  delay={(i % 4) * 90}
                  className="lp-spot hover-lift group relative flex flex-col p-7 rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.03] to-transparent"
                >
                  <div className="lp-ico size-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center mb-5 group-hover:bg-[oklch(0.35_0.12_245)]/30 transition-colors">
                    <s.icon className="size-5 text-foreground/90" />
                  </div>
                  <h3 className="font-medium text-[15px] mb-2">{s.title}</h3>
                  <p className="text-sm text-foreground/55 leading-relaxed">{s.desc}</p>
                  <Cta
                    form={!!capture}
                    message={s.message}
                    source={`servico-${i + 1}`}
                    className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm text-[oklch(0.75_0.15_245)] hover:text-foreground transition-colors"
                  >
                    {capture?.link ?? "Pedir orçamento"} <ArrowRight className="size-3.5" />
                  </Cta>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="relative py-16 lg:py-28 border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 tech-grid opacity-30 radial-fade pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
              <div className="max-w-xl">
                <SectionLabel>Como funciona</SectionLabel>
                <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-balance">
                  {config.steps.title}
                </h2>
              </div>
              <p className="text-foreground/55 max-w-sm text-sm">{config.steps.lead}</p>
            </div>
            {/* Linha de progresso que se acende quando a lista entra na tela (desktop) */}
            <div className={`relative ${stepsIn ? "lp-steps-in" : ""}`}>
              <div aria-hidden="true" className="hidden lg:block absolute -top-6 inset-x-0 h-px bg-white/10">
                <div className="lp-line-fill absolute inset-0 bg-gradient-to-r from-[oklch(0.7_0.15_245)] to-[oklch(0.7_0.15_245/0.2)]" />
              </div>
            <ol ref={stepsRef} className={`grid gap-4 sm:grid-cols-2 ${config.steps.items.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
              {config.steps.items.map((st, i) => (
                <Reveal as="li" delay={i * 110} key={st.title} className="relative p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                  <span
                    aria-hidden="true"
                    style={{ "--lp-delay": `${i * 280}ms` } as React.CSSProperties}
                    className="lp-dot hidden lg:block absolute -top-[27px] left-6 size-1.5 rounded-full bg-white/25"
                  />
                  <div className="flex items-center justify-between mb-5">
                    <div className="size-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
                      <st.icon className="size-5 text-foreground/90" />
                    </div>
                    <span className="text-3xl font-thin text-foreground/25">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-medium text-[15px] mb-2">{st.title}</h3>
                  <p className="text-sm text-foreground/55 leading-relaxed">{st.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-foreground/60">
                    <CheckCircle2 className="size-3.5 text-[oklch(0.7_0.15_245)]" /> {st.tag}
                  </span>
                </Reveal>
              ))}
            </ol>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-white/8 bg-white/[0.02] px-6 py-5">
              <p className="text-sm text-foreground/70">{config.steps.foot}</p>
              <Cta form={!!capture} message={config.steps.cta.message} source="como-funciona" className={btnStrong}>
                <CtaIcon className="size-5" /> {config.steps.cta.label}
              </Cta>
            </div>
          </div>
        </section>

        {/* Para quem */}
        {config.audience && (
        <section className="relative py-16 lg:py-28 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl mb-12">
              <SectionLabel>Para quem</SectionLabel>
              <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-balance">
                {config.audience.title}
              </h2>
            </div>
            <div className={`grid gap-4 ${config.audience.items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {config.audience.items.map((a, i) => (
                <Reveal as="article" delay={i * 120} key={a.title} className="group relative rounded-2xl overflow-hidden border border-white/8 aspect-[4/5]">
                  <img
                    src={a.img}
                    alt={a.alt}
                    width={800}
                    height={1000}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <div className="text-xs uppercase tracking-[0.2em] text-[oklch(0.75_0.15_245)] mb-2">{a.cat}</div>
                    <h3 className="text-xl font-medium">{a.title}</h3>
                    <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{a.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Galeria de obras (material real) */}
        {config.gallery && (
          <section className="relative py-16 lg:py-28 border-t border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <PortfolioGallery title={config.gallery.title} images={config.gallery.images} />
            </div>
          </section>
        )}

        {/* Avaliações reais do Google (some se não houver nenhuma) */}
        <GoogleReviews />

        {/* Garantia / por que a WB */}
        <section className="relative py-16 lg:py-28 border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 tech-grid opacity-30 radial-fade pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-10">
              <SectionLabel>{config.trust.eyebrow}</SectionLabel>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-balance">{config.trust.title}</h2>
              <p className="mt-4 text-foreground/60">{config.trust.lead}</p>
              <ul className="mt-6 space-y-3">
                {config.trust.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-foreground/80">
                    <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-[oklch(0.7_0.15_245)]" /> {p}
                  </li>
                ))}
              </ul>
              <Cta form={!!capture} message={config.trust.cta.message} source="garantia" className={`${BTN_WHITE} mt-8`}>
                {config.trust.cta.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Cta>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-16 lg:py-28 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6 lg:px-10">
            <div className="max-w-2xl mb-12">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-balance">Perguntas frequentes.</h2>
              <p className="mt-4 text-foreground/60">{config.faq.lead}</p>
            </div>
            <div className="space-y-3">
              {config.faq.items.map((f, i) => (
                <Reveal as="div" delay={(i % 4) * 60} key={f.q}>
                <details className="group rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-medium text-foreground/85 hover:text-foreground transition-colors select-none">
                    <span>{f.q}</span>
                    <span className="shrink-0 size-6 rounded-full border border-white/15 bg-white/[0.04] grid place-items-center transition-transform duration-200 group-open:rotate-45">
                      <svg className="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-sm text-foreground/60 leading-relaxed border-t border-white/5 pt-4">{f.a}</p>
                </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="relative py-16 lg:py-32 border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 tech-grid opacity-40 radial-fade pointer-events-none" />
          <div className="glow-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] max-w-full opacity-25 pointer-events-none [--orb:oklch(0.4_0.18_245)] [--orb-blur:140px]" />
          <Reveal className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
            <SectionLabel>Fale conosco</SectionLabel>
            <h2 className="text-3xl lg:text-6xl font-semibold tracking-tight text-balance leading-[1.05]">
              {config.final.title}
            </h2>
            <p className="mt-6 text-foreground/65 max-w-2xl mx-auto">{config.final.lead}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Cta form={!!capture} message={config.final.cta.message} source="cta-final" className={btnStrong}>
                <CtaIcon className="size-5" /> {config.final.cta.label}
                {!capture && <> · {PHONE_DISPLAY}</>}
              </Cta>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="relative border-t border-white/5 py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[2fr_1fr_1fr] gap-10">
          <div>
            <img src={logo} alt="WB Soluções Elétricas" width={546} height={96} loading="lazy" className="h-11 w-auto mb-4" />
            <p className="text-sm text-foreground/55 max-w-sm">
              Engenharia elétrica em Porto Alegre: instalações, energia solar, padrões de entrada e atendimento
              emergencial, com equipe própria.
            </p>
            <p className="mt-4 text-xs text-foreground/40">Willian da Costa Baptista — CNPJ 53.522.809/0001-40</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-4">Navegação</div>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><a href="/" className="hover:text-foreground transition">Site institucional</a></li>
              <li><a href="/galeria" className="hover:text-foreground transition">Galeria de obras</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-4">Contato</div>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li>
                {capture ? (
                  <span className="flex items-center gap-2">
                    <Phone className="size-4" /> {PHONE_DISPLAY}
                  </span>
                ) : (
                  <WaLink message={config.final.cta.message} source="rodape" className="flex items-center gap-2 hover:text-foreground transition">
                    <Phone className="size-4" /> {PHONE_DISPLAY}
                  </WaLink>
                )}
              </li>
              <li className="flex items-center gap-2"><Mail className="size-4" /> {EMAIL}</li>
              <li className="flex items-center gap-2"><MapPin className="size-4" /> {config.location}</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-10 pt-8 border-t border-white/5 flex flex-wrap justify-between items-center gap-4 text-xs text-foreground/40">
          <div>© {new Date().getFullYear()} WB Soluções Elétricas. Todos os direitos reservados.</div>
          <div>CREA · ART · NR10 · NBR 5410</div>
        </div>
      </footer>

      {/* WhatsApp: botão flutuante no desktop, barra fixa no mobile */}
      {!capture && (
      <WaLink
        message={hero.primary.message}
        source="flutuante"
        className="hidden md:grid fixed bottom-6 right-6 z-40 size-14 rounded-full bg-[#25D366] place-items-center shadow-2xl shadow-emerald-500/30 hover:scale-110 transition-transform"
      >
        <MessageCircle className="size-6 text-black" aria-label="WhatsApp" />
      </WaLink>
      )}
      {/* Some enquanto o simulador (ou o formulário do guia) está na tela, para não cobrir o botão */}
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-background/95 border-t border-white/10 transition-transform duration-300 ${
          calcVisible ? "translate-y-full" : ""
        }`}
        aria-hidden={calcVisible || undefined}
      >
        <Cta form={!!capture} message={hero.primary.message} source="barra-mobile" className={`${btnStrong} lp-pulse w-full`}>
          <CtaIcon className="size-5" /> {config.stickyLabel}
        </Cta>
      </div>
    </div>
  );
}

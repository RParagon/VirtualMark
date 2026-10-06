import { useState } from "react";

const ICP_KEYS = ["icp1","icp2","icp3","icp4","icp5","icp6"];

const questions = [
  {
    id: 1,
    question: "Há quanto tempo você trabalha com imóveis de alto padrão?",
    options: [
      { text: "Menos de 2 anos — estou migrando ou começando", weights: {icp1:0,icp2:0,icp3:1,icp4:4,icp5:0,icp6:0} },
      { text: "2 a 10 anos — já tenho carteira mas quero crescer", weights: {icp1:0,icp2:1,icp3:3,icp4:2,icp5:2,icp6:0} },
      { text: "10 a 20 anos — mercado consolidado na minha região", weights: {icp1:2,icp2:2,icp3:1,icp4:0,icp5:3,icp6:2} },
      { text: "Mais de 20 anos — conheço todo mundo no mercado", weights: {icp1:4,icp2:1,icp3:0,icp4:0,icp5:1,icp6:3} },
    ],
  },
  {
    id: 2,
    question: "De onde vem a maioria dos seus clientes hoje?",
    options: [
      { text: "Indicações e networking presencial", weights: {icp1:5,icp2:0,icp3:1,icp4:1,icp5:0,icp6:1} },
      { text: "Portais imobiliários (ZAP, OLX, VivaReal)", weights: {icp1:0,icp2:5,icp3:1,icp4:0,icp5:0,icp6:1} },
      { text: "Instagram / redes sociais orgânicas", weights: {icp1:0,icp2:0,icp3:2,icp4:3,icp5:1,icp6:0} },
      { text: "Anúncios pagos (Google ou Instagram)", weights: {icp1:0,icp2:0,icp3:0,icp4:0,icp5:5,icp6:2} },
      { text: "Não tenho uma fonte principal definida", weights: {icp1:1,icp2:1,icp3:2,icp4:3,icp5:0,icp6:0} },
    ],
  },
  {
    id: 3,
    question: "Quanto você investe por mês em marketing digital?",
    options: [
      { text: "Nada — estou começando do zero", weights: {icp1:4,icp2:0,icp3:1,icp4:3,icp5:0,icp6:0} },
      { text: "Até R$1.000 (basicamente portais)", weights: {icp1:1,icp2:4,icp3:1,icp4:1,icp5:0,icp6:0} },
      { text: "R$1.000 a R$3.000", weights: {icp1:0,icp2:1,icp3:2,icp4:2,icp5:2,icp6:1} },
      { text: "R$3.000 a R$5.000", weights: {icp1:0,icp2:0,icp3:0,icp4:0,icp5:4,icp6:2} },
      { text: "Mais de R$5.000", weights: {icp1:0,icp2:0,icp3:0,icp4:0,icp5:2,icp6:5} },
    ],
  },
  {
    id: 4,
    question: "Você já tentou fazer anúncios pagos?",
    options: [
      { text: "Nunca — não sei por onde começar", weights: {icp1:3,icp2:1,icp3:0,icp4:4,icp5:0,icp6:0} },
      { text: "Já impulsionei posts, mas sem resultado claro", weights: {icp1:0,icp2:0,icp3:4,icp4:2,icp5:0,icp6:0} },
      { text: "Já testei por 1-3 meses e parei", weights: {icp1:0,icp2:0,icp3:5,icp4:1,icp5:0,icp6:0} },
      { text: "Faço atualmente, mas gerencio sozinho", weights: {icp1:0,icp2:0,icp3:0,icp4:0,icp5:5,icp6:1} },
      { text: "Faço com agência, mas não estou satisfeito", weights: {icp1:0,icp2:0,icp3:1,icp4:0,icp5:3,icp6:3} },
    ],
  },
  {
    id: 5,
    question: "Você trabalha solo ou gerencia equipe?",
    options: [
      { text: "Trabalho solo", weights: {icp1:2,icp2:2,icp3:2,icp4:3,icp5:2,icp6:0} },
      { text: "Tenho 1-3 corretores comigo", weights: {icp1:1,icp2:1,icp3:1,icp4:1,icp5:2,icp6:1} },
      { text: "Gerencio equipe de 4-10 corretores", weights: {icp1:0,icp2:0,icp3:0,icp4:0,icp5:1,icp6:4} },
      { text: "Imobiliária com mais de 10 corretores", weights: {icp1:0,icp2:0,icp3:0,icp4:0,icp5:0,icp6:5} },
    ],
  },
  {
    id: 6,
    question: "Quando um lead entra em contato, em quanto tempo você responde?",
    options: [
      { text: "Menos de 5 minutos — tenho processo definido", weights: {icp1:0,icp2:0,icp3:0,icp4:0,icp5:3,icp6:4} },
      { text: "Até 1 hora", weights: {icp1:0,icp2:1,icp3:1,icp4:1,icp5:2,icp6:1} },
      { text: "No mesmo dia, quando dá", weights: {icp1:1,icp2:2,icp3:2,icp4:2,icp5:0,icp6:0} },
      { text: "Pode demorar mais de 24h", weights: {icp1:3,icp2:1,icp3:1,icp4:2,icp5:0,icp6:0} },
      { text: "Não tenho processo de resposta definido", weights: {icp1:2,icp2:1,icp3:2,icp4:3,icp5:0,icp6:0} },
    ],
  },
  {
    id: 7,
    question: "Qual frase mais representa sua situação atual?",
    subtitle: "Seja honesto — isso personaliza 100% do seu diagnóstico.",
    options: [
      { text: "\"Meu negócio é olho no olho. Não preciso de internet pra vender.\"", weights: {icp1:6,icp2:0,icp3:0,icp4:0,icp5:0,icp6:0} },
      { text: "\"Já gasto com portal, não quero mais uma despesa.\"", weights: {icp1:0,icp2:6,icp3:0,icp4:0,icp5:0,icp6:0} },
      { text: "\"Já tentei anúncios e joguei dinheiro fora.\"", weights: {icp1:0,icp2:0,icp3:6,icp4:0,icp5:0,icp6:0} },
      { text: "\"Sei que preciso de tráfego pago, mas não sei por onde começar.\"", weights: {icp1:0,icp2:0,icp3:0,icp4:6,icp5:0,icp6:0} },
      { text: "\"Já faço tráfego, mas não estou tirando o máximo.\"", weights: {icp1:0,icp2:0,icp3:0,icp4:0,icp5:6,icp6:0} },
      { text: "\"Preciso de operação profissional com números claros e ROI.\"", weights: {icp1:0,icp2:0,icp3:0,icp4:0,icp5:0,icp6:6} },
    ],
  },
];

const profiles = {
  icp1: {
    name: "O Tradicionalista Convicto",
    tag: "SEM PRESENÇA DIGITAL",
    icon: "🏛️",
    color: "#dc2626",
    gradient: "linear-gradient(135deg, #991b1b, #dc2626)",
    lightBg: "#fef2f2",
    headline: "Seu Maior Ativo Está Virando Seu Maior Risco",
    description: "Você construiu uma carreira sólida com relacionamento e confiança pessoal. Isso é raro e valioso. Mas o mercado mudou: corretores mais jovens estão fechando negócios na sua região porque aparecem primeiro quando o cliente pesquisa online.",
    stats: [
      { value: "78%", label: "dos compradores de alto padrão pesquisam online antes de contatar um corretor" },
      { value: "3", label: "negócios/mês perdidos em média por corretores sem presença digital" },
      { value: "21x", label: "mais chance de fechar quando o cliente te encontra primeiro no Google" },
    ],
    actions: [
      "Criar sua vitrine digital — uma landing page que transmita sua autoridade e experiência de 15+ anos",
      "Garantir presença no Google para buscas como 'corretor alto padrão [sua região]'",
      "Manter o relacionamento como base e adicionar o digital como amplificador — não substituto",
    ],
    cta: "Agende uma conversa de 15 min. Vamos mostrar como proteger seu território digital sem mudar o que você faz de melhor.",
  },
  icp2: {
    name: "O Dependente de Portais",
    tag: "SEM PRESENÇA DIGITAL",
    icon: "🔄",
    color: "#ea580c",
    gradient: "linear-gradient(135deg, #9a3412, #ea580c)",
    lightBg: "#fff7ed",
    headline: "Você Está Pagando Caro Por Leads Que Não São Seus",
    description: "Cada lead que chega pelo portal é disputado por 20-30 corretores simultaneamente. Você precisa ligar em 2 minutos ou perde. E o pior: o portal fica mais caro todo ano enquanto a qualidade cai. Isso não é marketing digital — é aluguel de vitrine compartilhada.",
    stats: [
      { value: "+40%", label: "de aumento no custo dos portais nos últimos 2 anos" },
      { value: "30", label: "corretores disputando o mesmo lead que você recebe do portal" },
      { value: "-50%", label: "custo por lead quando você migra de portal para captação exclusiva" },
    ],
    actions: [
      "Comparar custo real: quanto paga por lead no portal vs. lead exclusivo que só chega pra você",
      "Iniciar campanha de captação própria mantendo o portal como backup — transição gradual",
      "Em 90 dias, ter dados reais para decidir com segurança: manter, reduzir ou eliminar portais",
    ],
    cta: "Receba uma planilha comparativa personalizada: Portal vs. Lead Exclusivo. Os números vão falar por si.",
  },
  icp3: {
    name: "O Curioso Frustrado",
    tag: "PRESENÇA PARCIAL",
    icon: "🔥",
    color: "#d97706",
    gradient: "linear-gradient(135deg, #92400e, #d97706)",
    lightBg: "#fffbeb",
    headline: "Você Não Falhou — A Estratégia É Que Estava Errada",
    description: "O que você fez não foi gestão de tráfego — foi impulsionamento. São coisas completamente diferentes. Impulsionar um post é como colocar um cartaz na rua e torcer pra alguém parar. Gestão profissional coloca seu anúncio na frente de quem JÁ está procurando um imóvel na sua faixa.",
    stats: [
      { value: "80%", label: "de redução no CPL quando se migra de impulsionamento para gestão profissional" },
      { value: "0", label: "leads qualificados é o resultado típico de impulsionamento sem estratégia" },
      { value: "30 dias", label: "é o tempo médio para ver os primeiros leads com uma campanha bem estruturada" },
    ],
    actions: [
      "Entender exatamente o que deu errado na sua tentativa anterior (nós explicamos sem compromisso)",
      "Testar uma campanha piloto de 30 dias com investimento mínimo e landing page dedicada",
      "Ver os primeiros leads qualificados chegando antes de assumir qualquer compromisso longo",
    ],
    cta: "Diagnóstico gratuito: nos mostre o que você fez antes e explicamos exatamente por que não funcionou.",
  },
  icp4: {
    name: "O Ambicioso sem Infraestrutura",
    tag: "PRESENÇA PARCIAL",
    icon: "🚀",
    color: "#16a34a",
    gradient: "linear-gradient(135deg, #166534, #16a34a)",
    lightBg: "#f0fdf4",
    headline: "Você Tem a Mentalidade Certa — Só Falta a Estrutura",
    description: "Você já entende que o digital é o caminho. O que te trava não é falta de vontade — é falta de estrutura e medo de errar com dinheiro que não pode perder. A boa notícia: você não precisa de orçamento alto pra começar. Precisa de estratégia certa.",
    stats: [
      { value: "15-25", label: "leads qualificados no primeiro mês com apenas R$1.500 de investimento" },
      { value: "R$50", label: "por dia é o investimento mínimo para validar o canal com estratégia profissional" },
      { value: "∞", label: "é o custo de não começar — cada mês sem captação digital é market share cedido" },
    ],
    actions: [
      "Montar infraestrutura mínima: landing page + pixel + CRM gratuito + processo de follow-up",
      "Iniciar com R$50/dia em Meta Ads focado na sua região e faixa de preço",
      "Em 30 dias ter dados reais: quantos leads, qual custo, qual qualidade — decidir com informação",
    ],
    cta: "Plano de lançamento personalizado: investimento mínimo, timeline de 30 dias, projeção de resultados. Sem surpresas.",
  },
  icp5: {
    name: "O Investidor Otimista",
    tag: "MATURIDADE DIGITAL",
    icon: "📈",
    color: "#2563eb",
    gradient: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    lightBg: "#eff6ff",
    headline: "Seus Resultados Estão Bons — Mas Você Está Deixando Dinheiro na Mesa",
    description: "Você já investe, já gera leads, já sabe que funciona. O problema é que gerencia tudo sozinho — e isso custa tempo que deveria estar vendendo. Sem otimização avançada, seu CPL provavelmente é 30-50% maior do que poderia ser.",
    stats: [
      { value: "-40%", label: "redução média no CPL nos primeiros 60 dias com gestão especializada" },
      { value: "5-10h", label: "por semana que você gasta gerenciando campanhas em vez de vendendo" },
      { value: "2-3", label: "reuniões extras por semana se você delegar a operação para um especialista" },
    ],
    actions: [
      "Auditoria completa da sua operação atual: onde estão os gaps que você não está vendo",
      "Transição suave: assumimos a operação sem pausar campanhas — zero downtime",
      "Dashboard personalizado com CPL, taxa de conversão e ROI por campanha",
    ],
    cta: "Auditoria gratuita: identificamos os 3 maiores gaps de otimização e quanto dinheiro você está deixando na mesa.",
  },
  icp6: {
    name: "O Empresário Imobiliário",
    tag: "MATURIDADE DIGITAL",
    icon: "🏢",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #4c1d95, #7c3aed)",
    lightBg: "#f5f3ff",
    headline: "Sua Equipe Precisa de Uma Máquina de Leads Previsível",
    description: "Você pensa como empresário. Precisa alimentar uma equipe inteira com leads qualificados todos os meses. Se a fonte seca, perde corretores bons para concorrentes. Precisa de operação especializada com ROI claro e dashboard profissional.",
    stats: [
      { value: "-40%", label: "menos turnover de corretores em imobiliárias com captação digital estruturada" },
      { value: "3-6 meses", label: "de mídia é o custo equivalente de repor um corretor bom que saiu" },
      { value: "100%", label: "de rastreabilidade: atribuir vendas reais a campanhas específicas" },
    ],
    actions: [
      "Operação completa: campanhas segmentadas por perfil de comprador e faixa de preço",
      "Dashboard em tempo real com CPL, conversão e ROI por campanha e por corretor",
      "Distribuição inteligente de leads por perfil + tracking até o fechamento",
    ],
    cta: "Proposta com case real: como uma imobiliária do mesmo porte estruturou captação digital com ROI mensurado.",
  },
};

function classifyICP(answers) {
  const totals = {};
  ICP_KEYS.forEach(k => totals[k] = 0);
  answers.forEach(a => { ICP_KEYS.forEach(k => { totals[k] += (a.weights[k] || 0); }); });
  let best = "icp4"; let max = 0;
  ICP_KEYS.forEach(k => { if (totals[k] > max) { max = totals[k]; best = k; } });
  return { key: best, totals, max };
}

function StatBar({ label, value, maxVal, color }) {
  const pct = maxVal > 0 ? Math.min((value / maxVal) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: "#94a3b8" }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ height: "100%", borderRadius: 3, background: color, width: `${pct}%`, transition: "width 1.2s ease-out" }} />
      </div>
    </div>
  );
}

export default function QuizICP() {
  const [step, setStep] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fading, setFading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [openAnswer, setOpenAnswer] = useState("");

  const result = answers.length >= questions.length ? classifyICP(answers) : null;
  const profile = result ? profiles[result.key] : null;

  function handleSelect(opt, idx) {
    setSelected(idx);
    setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        const next = [...answers, opt];
        setAnswers(next);
        if (current < questions.length - 1) {
          setCurrent(current + 1);
        } else {
          setStep("open");
        }
        setSelected(null);
        setFading(false);
      }, 280);
    }, 180);
  }

  const progress = step === "quiz" ? ((current + 1) / (questions.length + 2)) * 100
    : step === "open" ? ((questions.length + 1) / (questions.length + 2)) * 100
    : step === "capture" ? 96 : 0;

  const bg = "linear-gradient(160deg, #0a0f1e 0%, #111827 40%, #0f172a 100%)";

  return (
    <div style={{
      minHeight: "100vh", background: bg,
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: "#f1f5f9", display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 16px",
    }}>
      {/* ===== INTRO ===== */}
      {step === "intro" && (
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center", animation: "fadeUp .6s ease-out" }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px", fontSize: 36,
            boxShadow: "0 12px 40px rgba(37,99,235,0.35)",
          }}>🏠</div>

          <div style={{
            display: "inline-block", padding: "6px 18px", borderRadius: 20,
            background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.25)",
            fontSize: 12, fontWeight: 700, color: "#60a5fa", marginBottom: 24, letterSpacing: "1px",
          }}>DIAGNÓSTICO ESTRATÉGICO • 3 MINUTOS</div>

          <h1 style={{
            fontSize: 30, fontWeight: 800, lineHeight: 1.2, margin: "0 0 16px",
            background: "linear-gradient(to right, #f8fafc, #94a3b8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Descubra Se Sua Imobiliária Está Perdendo Clientes Para a Concorrência
          </h1>

          <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 12px" }}>
            Responda 8 perguntas e receba um <strong style={{ color: "#e2e8f0" }}>diagnóstico personalizado</strong> para
            o seu perfil — com os gargalos específicos que estão travando seu crescimento.
          </p>

          <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 32px" }}>
            Não é um quiz genérico. Identificamos <strong style={{ color: "#94a3b8" }}>6 perfis diferentes</strong> de
            corretores e entregamos recomendações cirúrgicas para cada um.
          </p>

          <button onClick={() => setStep("quiz")} style={{
            width: "100%", maxWidth: 380, padding: "18px 32px", border: "none",
            borderRadius: 16, fontSize: 17, fontWeight: 700, cursor: "pointer",
            background: "linear-gradient(135deg, #2563eb, #6366f1)",
            color: "#fff", boxShadow: "0 6px 28px rgba(37,99,235,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.target.style.transform = ""; }}
          >
            Fazer Meu Diagnóstico →
          </button>

          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20, fontSize: 13, color: "#64748b" }}>
            <span>✓ Gratuito</span><span>✓ Resultado imediato</span><span>✓ Sem compromisso</span>
          </div>
        </div>
      )}

      {/* ===== QUIZ / OPEN / CAPTURE ===== */}
      {(step === "quiz" || step === "open" || step === "capture") && (
        <div style={{ maxWidth: 560, width: "100%" }}>
          <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.08)", marginBottom: 36, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 3, width: `${progress}%`,
              background: "linear-gradient(90deg, #2563eb, #7c3aed)", transition: "width 0.5s ease" }} />
          </div>

          {step === "quiz" && current < questions.length && (
            <div key={current} style={{ animation: fading ? "fadeOut .28s ease" : "fadeUp .4s ease-out" }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 10, letterSpacing: "1.5px" }}>
                PERGUNTA {current + 1} DE {questions.length}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.35, color: "#e2e8f0" }}>
                {questions[current].question}
              </h2>
              {questions[current].subtitle && (
                <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px" }}>{questions[current].subtitle}</p>
              )}
              {!questions[current].subtitle && <div style={{ height: 16 }} />}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {questions[current].options.map((opt, i) => (
                  <button key={i} onClick={() => handleSelect(opt, i)} style={{
                    padding: "13px 16px",
                    border: selected === i ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    background: selected === i ? "rgba(37,99,235,0.15)" : "rgba(255,255,255,0.03)",
                    color: "#e2e8f0", fontSize: 14, textAlign: "left", cursor: "pointer",
                    transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12,
                    lineHeight: 1.4,
                  }}
                  onMouseEnter={e => { if (selected !== i) e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { if (selected !== i) e.target.style.background = "rgba(255,255,255,0.03)"; }}
                  >
                    <span style={{
                      width: 26, height: 26, minWidth: 26, borderRadius: 7,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: selected === i ? "#2563eb" : "rgba(255,255,255,0.08)",
                      fontSize: 12, fontWeight: 800, color: selected === i ? "#fff" : "#64748b",
                    }}>{String.fromCharCode(65 + i)}</span>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "open" && (
            <div style={{ animation: "fadeUp .4s ease-out" }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 10, letterSpacing: "1.5px" }}>ÚLTIMA PERGUNTA</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: "#e2e8f0" }}>
                Se pudéssemos resolver UM problema do seu marketing, qual seria?
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px" }}>Seja específico — isso personaliza seu plano de ação.</p>
              <textarea value={openAnswer} onChange={e => setOpenAnswer(e.target.value)}
                placeholder="Ex: Preciso gerar mais leads qualificados para imóveis acima de R$500 mil na zona sul..."
                style={{
                  width: "100%", minHeight: 110, padding: 16, border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12, background: "rgba(255,255,255,0.04)", color: "#e2e8f0",
                  fontSize: 14, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box",
                }} />
              <button onClick={() => setStep("capture")} style={{
                marginTop: 14, width: "100%", padding: "15px", border: "none", borderRadius: 12,
                fontSize: 16, fontWeight: 700, cursor: openAnswer.trim() ? "pointer" : "default",
                background: openAnswer.trim() ? "linear-gradient(135deg, #2563eb, #6366f1)" : "rgba(255,255,255,0.08)",
                color: openAnswer.trim() ? "#fff" : "#475569",
              }}>Ver Meu Resultado →</button>
            </div>
          )}

          {step === "capture" && (
            <div style={{ animation: "fadeUp .4s ease-out" }}>
              <div style={{
                textAlign: "center", padding: 24, borderRadius: 16, marginBottom: 28,
                background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)",
              }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>🎯</div>
                <h3 style={{ margin: "0 0 6px", fontSize: 19, color: "#e2e8f0", fontWeight: 700 }}>Seu diagnóstico está pronto!</h3>
                <p style={{ margin: 0, fontSize: 14, color: "#94a3b8" }}>
                  Identificamos seu perfil. Preencha abaixo para revelar seu resultado completo.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { ph: "Seu nome", val: name, set: setName, type: "text" },
                  { ph: "Seu melhor e-mail", val: email, set: setEmail, type: "email" },
                  { ph: "WhatsApp (com DDD)", val: phone, set: setPhone, type: "tel" },
                ].map((f, i) => (
                  <input key={i} type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)}
                    style={{
                      padding: "14px 16px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12,
                      background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: 15, fontFamily: "inherit",
                    }} />
                ))}
                <button onClick={() => { if (name && email && phone) setStep("result"); }}
                  disabled={!name.trim() || !email.trim() || !phone.trim()}
                  style={{
                    marginTop: 6, padding: "16px", border: "none", borderRadius: 12, fontSize: 16,
                    fontWeight: 700, cursor: name && email && phone ? "pointer" : "not-allowed",
                    background: name && email && phone ? "linear-gradient(135deg, #2563eb, #6366f1)" : "rgba(255,255,255,0.08)",
                    color: name && email && phone ? "#fff" : "#475569",
                  }}>
                  Revelar Meu Diagnóstico 🔓
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== RESULT ===== */}
      {step === "result" && profile && result && (
        <div style={{ maxWidth: 580, width: "100%", animation: "fadeUp .6s ease-out" }}>
          {/* Profile header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{profile.icon}</div>
            <div style={{
              display: "inline-block", padding: "5px 16px", borderRadius: 16,
              background: profile.gradient, fontSize: 11, fontWeight: 800,
              color: "#fff", marginBottom: 6, letterSpacing: "1px",
            }}>{profile.tag}</div>
            <div style={{
              display: "block", padding: "4px 14px", borderRadius: 12,
              fontSize: 14, fontWeight: 700, color: profile.color, marginBottom: 16,
            }}>{profile.name}</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px", color: "#e2e8f0", lineHeight: 1.3 }}>
              {name ? `${name}, ` : ""}{profile.headline}
            </h2>
            <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.65, margin: 0 }}>{profile.description}</p>
          </div>

          {/* Profile match bars */}
          <div style={{
            padding: 20, borderRadius: 16, marginBottom: 20,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" }}>
              ANÁLISE DE PERFIL
            </h3>
            {ICP_KEYS.map(k => (
              <StatBar key={k} label={profiles[k].name} value={result.totals[k]} maxVal={result.max} color={result.key === k ? profile.color : "#334155"} />
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {profile.stats.map((s, i) => (
              <div key={i} style={{
                padding: "16px 12px", borderRadius: 14, textAlign: "center",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: profile.color, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{
            padding: 22, borderRadius: 16, marginBottom: 20,
            background: `${profile.color}11`, border: `1px solid ${profile.color}30`,
          }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>
              🎯 Seus 3 Próximos Passos
            </h3>
            {profile.actions.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < 2 ? 12 : 0 }}>
                <span style={{
                  width: 24, height: 24, minWidth: 24, borderRadius: 7, flexShrink: 0,
                  background: `${profile.color}22`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 12, fontWeight: 800, color: profile.color,
                }}>{i + 1}</span>
                <p style={{ margin: 0, fontSize: 13, color: "#cbd5e1", lineHeight: 1.5 }}>{a}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            textAlign: "center", padding: 28, borderRadius: 16,
            background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))",
            border: "1px solid rgba(37,99,235,0.25)",
          }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>
              Quer transformar esse diagnóstico em resultados?
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
              {profile.cta}
            </p>
            <button style={{
              padding: "15px 44px", border: "none", borderRadius: 14, fontSize: 16,
              fontWeight: 700, cursor: "pointer",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff", boxShadow: "0 6px 28px rgba(34,197,94,0.3)",
            }}>
              💬 Falar Com Especialista
            </button>
            <p style={{ margin: "14px 0 0", fontSize: 12, color: "#64748b" }}>
              Conversa gratuita de 15 min • Sem compromisso
            </p>
          </div>

          {/* VM branding */}
          <div style={{ textAlign: "center", marginTop: 32, padding: "16px 0" }}>
            <span style={{ fontSize: 13, color: "#334155", fontWeight: 600, letterSpacing: "2px" }}>
              VIRTUAL MARK • MKT DIGITAL
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeOut { from { opacity:1; } to { opacity:0; transform:translateY(-10px); } }
        input::placeholder, textarea::placeholder { color: #4b5563; }
        input:focus, textarea:focus { outline:none; border-color: #2563eb !important; }
      `}</style>
    </div>
  );
}

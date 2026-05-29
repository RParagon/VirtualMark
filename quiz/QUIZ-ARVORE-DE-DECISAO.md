# Quiz Diagnóstico por ICP — Árvore de Decisão (Ponta a Ponta)

> **Documento mestre do funil de quiz da Virtual Mark.**
> Consolida o Mapa de ICPs (PDF), o Funil v2 (docx), o protótipo `.jsx` e a versão da Paola (`app.js`) em uma única arquitetura: uma **árvore de decisão real**, orientada a entregar valor máximo ao corretor.
>
> **Versão:** 1.1 — Maio 2026
> **Status:** em desenvolvimento por partes. Base = `src/pages/QuizImobiliariaPage.tsx` (já existe, na marca VM, captura nome no início).

---

## 🔄 Revisão v1.1 (decisões do alinhamento)

1. **Base de implementação:** evoluir a página existente `QuizImobiliariaPage.tsx` (rota `/quiz-imoveis`) — não recomeçar do zero. Ela já está na marca VM e já captura o nome no início.
2. **Nome capturado no início** (já implementado) — usado para personalizar a jornada inteira.
3. **Menos telas de insight:** reduzir para **1 insight forte por ramo** (a "virada"). O resto vira microfeedback inline (uma frase após responder), sem tela cheia.
4. **Apelidos não ofensivos** — o lead vê um nome digno; o time mantém o nome interno do Mapa de ICPs:

| ICP | Nome interno (time) | Nome exibido ao lead (novo) | Tag de maturidade |
|---|---|---|---|
| icp1 | Tradicionalista Convicto | **A Autoridade de Relacionamento** | Presença digital a construir |
| icp2 | Dependente de Portais | **O Estrategista de Portais** | Presença digital a construir |
| icp3 | Curioso Frustrado | **O Explorador Digital** | Presença em desenvolvimento |
| icp4 | Ambicioso sem Infraestrutura | **O Ambicioso Digital** | Presença em desenvolvimento |
| icp5 | Investidor Otimista | **O Investidor Estratégico** | Maturidade digital |
| icp6 | Empresário Imobiliário | **O Empreendedor Imobiliário** | Maturidade digital |

5. **Dados & tracking (Parte 1 — feito):** `supabase/quiz_leads.sql` (tabela) + `src/lib/quizTracking.ts` (eventos GTM + atribuição UTM).

---

## 1. Visão & Objetivo

### 1.1 O objetivo verdadeiro
O quiz **não é** um teste de personalidade nem um gerador de leads frios. É um **instrumento de geração de confiança** que funciona em três tempos:

```
ENTREGAR VALOR REAL  →  GERAR RECONHECIMENTO ("isso fui eu")  →  TORNAR O CONTATO INEVITÁVEL
```

A meta declarada: ao terminar o quiz, o corretor precisa sentir que **a Virtual Mark entende a situação dele melhor do que ele mesmo** — e que a única saída lógica para resolver o que acabou de ser exposto é falar com a gente. Não porque foi empurrado, mas porque o valor entregue tornou óbvio que existe um caminho e que nós o conhecemos.

### 1.2 Os três pilares de valor (o que o lead leva, mesmo sem fechar)
1. **Diagnóstico preciso** — ele descobre exatamente em que estágio de maturidade digital está e qual é o gargalo real (não o sintoma).
2. **Educação acionável** — a cada etapa ele aprende algo verdadeiro sobre o mercado digital imobiliário (ex.: "impulsionar post ≠ tráfego pago"; "78% dos compradores de alto padrão pesquisam online antes de ligar").
3. **Clareza de próximo passo** — ele sai sabendo o que fazer primeiro. Mas a execução exige expertise que ele não tem → contatar a VM vira o próximo passo natural.

### 1.3 Por que esse objetivo muda o design
Como o foco é **valor antes de captura**, a árvore precisa:
- Entregar micro-lições **no meio do caminho** (telas de insight adaptativas), não só no resultado final.
- Personalizar a **jornada** (qual pergunta vem depois, qual conteúdo aparece), não apenas o resultado.
- Pedir os dados de contato **depois** que o valor já foi percebido (captura tardia, no pico de reconhecimento).

---

## 2. Os 6 ICPs (referência rápida)

Os perfis são organizados por **nível de maturidade digital** — e esse eixo é a espinha dorsal da árvore.

| Nível de maturidade | ICP | Apelido | Essência | Prioridade comercial |
|---|---|---|---|---|
| **Sem presença digital** | ICP 1 | O Tradicionalista Convicto | 50+, vive de indicação, "olho no olho" | Baixa |
| **Sem presença digital** | ICP 2 | O Dependente de Portais | Toda geração via ZAP/Viva/OLX, confunde portal com mkt | Média (melhor argumento de venda) |
| **Presença parcial** | ICP 3 | O Curioso Frustrado | Já tentou ads sozinho, se queimou | **ALTA (70% do esforço)** |
| **Presença parcial** | ICP 4 | O Ambicioso sem Infraestrutura | Quer digital, não sabe começar, falta estrutura | **ALTA (70% do esforço)** |
| **Maturidade digital** | ICP 5 | O Investidor Otimista | Já investe, gerencia sozinho, quer otimizar | Média |
| **Maturidade digital** | ICP 6 | O Empresário Imobiliário | Dono, gerencia equipe, pensa ROI/dashboard | Futura (ticket de escala) |

**Prioridades estratégicas herdadas do Mapa de ICPs:**
- **70% do esforço → ICP 3 + ICP 4** (menor resistência, ciclo curto). O quiz deve ser afiado para converter esses dois.
- **Melhor arma de venda → ICP 2** (a conta "portal vs. lead exclusivo").
- **Ticket de escala → ICP 6** (exige cases e dashboard; tratado com tom empresarial).

---

## 3. Filosofia da Árvore (decision tree vs. scoring)

### 3.1 Limite do modelo atual (scoring puro)
As duas versões existentes somam pesos de todas as respostas e elegem o ICP de maior pontuação. Funciona, mas:
- **Todos percorrem o mesmo caminho** — o ICP 6 (empresário) responde às mesmas perguntas que o ICP 1 (tradicionalista). Desperdiça relevância.
- O valor só aparece no final. No meio, o lead "trabalha" sem receber nada.

### 3.2 O modelo escolhido: **árvore híbrida (ramificação + scoring de refino)**
- **Tronco (ramificação):** a 1ª pergunta classifica o lead em 1 dos **3 níveis de maturidade**. A partir daí ele entra em um **ramo dedicado** com perguntas e conteúdos próprios.
- **Galhos (scoring de refino):** dentro do ramo, 2–3 perguntas distinguem os **2 ICPs daquele nível** via peso, e acumulam contexto (tempo de mercado, verba, time).
- **Confirmação (override):** uma pergunta de auto-reconhecimento perto do fim (cada opção = 1 ICP) serve como **desempate e correção** — tem peso dominante.
- **Regra dura (cross-cutting):** "gerencia equipe de 4+" → força **ICP 6**, independente do ramo de entrada.

> **Por que híbrido e não árvore 100% rígida:** a ramificação pura quebra em respostas ambíguas. O scoring dentro do ramo + a confirmação final dão robustez sem perder a personalização da jornada.

---

## 4. Arquitetura Macro (mapa visual)

```
                          ┌─────────────────────────────┐
                          │   TELA 0 — ABERTURA          │
                          │   (promessa de valor + nome) │
                          └──────────────┬──────────────┘
                                         │
                          ┌──────────────▼──────────────┐
                          │   Q1 — RAIZ                  │
                          │   "De onde vêm seus clientes?"│
                          │   → classifica MATURIDADE     │
                          └───┬───────────┬───────────┬──┘
                              │           │           │
              ┌───────────────▼──┐  ┌─────▼───────┐  ┌▼────────────────┐
              │ RAMO A           │  │ RAMO B      │  │ RAMO C          │
              │ AINDA NÃO DIGITAL│  │ PARCIAL     │  │ JÁ INVESTE      │
              │ (ICP 1 · ICP 2)  │  │ (ICP3·ICP4) │  │ (ICP 5 · ICP 6) │
              └───────┬──────────┘  └──────┬──────┘  └────────┬────────┘
                      │                    │                  │
              ┌───────▼─────────┐  ┌────────▼───────┐  ┌───────▼────────┐
              │ INSIGHT 1       │  │ INSIGHT 1      │  │ INSIGHT 1      │
              │ (valor adaptado)│  │ (valor adapt.) │  │ (valor adapt.) │
              └───────┬─────────┘  └────────┬───────┘  └───────┬────────┘
                      │                     │                  │
              ┌───────▼─────────┐  ┌────────▼───────┐  ┌───────▼────────┐
              │ Q2/Q3 do ramo   │  │ Q2/Q3 do ramo  │  │ Q2/Q3 do ramo  │
              │ (distinguir 1↔2)│  │ (distinguir3↔4)│  │ (distinguir5↔6)│
              └───────┬─────────┘  └────────┬───────┘  └───────┬────────┘
                      │                     │                  │
              ┌───────▼─────────┐  ┌────────▼───────┐  ┌───────▼────────┐
              │ INSIGHT 2       │  │ INSIGHT 2      │  │ INSIGHT 2      │
              │ (a "virada")    │  │ (a "virada")   │  │ (a "virada")   │
              └───────┬─────────┘  └────────┬───────┘  └───────┬────────┘
                      └──────────┬──────────┴──────────────────┘
                                 │
                  ┌──────────────▼──────────────┐
                  │ Q-UNIVERSAL — Tempo de resposta│
                  │ (bomba de valor: regra dos 5min)│
                  └──────────────┬──────────────┘
                                 │
                  ┌──────────────▼──────────────┐
                  │ Q-CONFIRMAÇÃO                │
                  │ "Qual frase é você?"          │
                  │ (6 opções = 6 ICPs · override)│
                  └──────────────┬──────────────┘
                                 │
                  ┌──────────────▼──────────────┐
                  │ Q-ABERTA — a dor nas palavras │
                  │ dele (vai pro script do closer)│
                  └──────────────┬──────────────┘
                                 │
                  ┌──────────────▼──────────────┐
                  │ CAPTURA — nome/email/WhatsApp │
                  │ (no pico de reconhecimento)   │
                  └──────────────┬──────────────┘
                                 │
                  ┌──────────────▼──────────────┐
                  │ RESULTADO personalizado por  │
                  │ ICP + CTA WhatsApp pré-pronto │
                  └─────────────────────────────┘
```

**Comprimento da jornada por lead:** ~7 perguntas + 2 insights + abertura + captura + resultado. Cada lead responde **menos** perguntas que o modelo linear de 10, mas cada uma é mais relevante.

---

## 5. A Árvore Completa — Ponta a Ponta

> Notação: cada opção mostra `→ destino` (ramo ou ICP) e `[pesos]`. Pesos alimentam o scoring de refino. A confirmação final tem peso dominante (×3).

### TELA 0 — ABERTURA
- **Eyebrow:** `DIAGNÓSTICO ESTRATÉGICO • 3 MINUTOS`
- **H1:** "Descubra onde a captação dos seus imóveis de alto padrão está perdendo dinheiro — e o que fazer sobre isso."
- **Subtexto:** "Não é um quiz genérico. Identificamos 6 perfis de corretor e entregamos um diagnóstico cirúrgico para o seu. Sem julgamento sobre o que você tentou antes."
- **Campo:** nome (opcional) · **Botão:** "Fazer meu diagnóstico →"
- **Selos:** ✓ Gratuito · ✓ Resultado imediato · ✓ Sem compromisso

---

### Q1 — RAIZ · Segmentação por maturidade
**"De onde vem a maioria dos seus clientes hoje?"**
*(Subtítulo: "Essa é a pergunta que mais revela onde está sua maior oportunidade.")*

| Opção | Destino | Pesos |
|---|---|---|
| A) Indicações e networking presencial | **RAMO A** | ICP1 +5, ICP3 +1 |
| B) Portais imobiliários (ZAP, OLX, VivaReal) | **RAMO A** | ICP2 +5, ICP6 +1 |
| C) Instagram / redes sociais orgânicas | **RAMO B** | ICP3 +2, ICP4 +3 |
| D) Já faço anúncios pagos (Google/Meta) | **RAMO C** | ICP5 +4, ICP6 +2 |
| E) Não tenho uma fonte principal definida | **RAMO B** | ICP4 +3, ICP3 +2 |

---

## RAMO A — "Ainda não digital" (ICP 1 vs ICP 2)

### INSIGHT 1A (adaptativo ao que liderou em Q1)
- **Se liderou ICP1:** "Quem vive de indicação tem o ativo mais valioso do mercado: confiança. O risco invisível é que **o comprador de alto padrão hoje pesquisa no Google antes de pedir referência** — e encontra quem aparece primeiro."
- **Se liderou ICP2:** "Pagar portal parece marketing digital, mas é **aluguel de vitrine compartilhada**. O mesmo lead que você compra está sendo vendido para outros 20–30 corretores ao mesmo tempo."
- **Botão:** "Continuar diagnóstico"

### A-Q2 — "Quando você pensa em anúncios online, o que mais te representa?"
| Opção | Pesos |
|---|---|
| A) "Nunca investi — meu negócio é relacionamento" | ICP1 +5 |
| B) "Acho que já faço — pago o portal todo mês" | ICP2 +5 |
| C) "Já pensei, mas acho caro e complexo" | ICP1 +3, ICP4 +2 |
| D) "Pago portal, mas sei que isso não é a mesma coisa que anunciar" | ICP2 +4, ICP5 +1 |

### A-Q3 — "Há quanto tempo você trabalha com imóveis de alto padrão?"
*(contexto — abre a copy do diagnóstico)*
| Opção | Pesos |
|---|---|
| A) Mais de 20 anos — conheço todo mundo | ICP1 +4, ICP6 +1 |
| B) 10 a 20 anos — mercado consolidado | ICP1 +2, ICP2 +2 |
| C) 2 a 10 anos — tenho carteira, quero crescer | ICP2 +2, ICP5 +1 |
| D) Menos de 2 anos — começando/migrando | ICP4 +3 |

### INSIGHT 2A — a "virada" (adaptativo)
- **ICP1:** "**78% dos compradores de alto padrão pesquisam online antes de contatar um corretor.** Sua experiência de 15+ anos é o maior diferencial possível — mas só funciona se o cliente te encontra. Hoje, corretores mais novos estão fechando negócios que cairiam no seu colo."
- **ICP2:** "O custo dos portais subiu **+40% em 2 anos** enquanto a qualidade caiu. Um lead exclusivo via Google custa **30–50% menos** e converte **3x mais** — porque só liga pra você."
- → segue para Q-UNIVERSAL.

---

## RAMO B — "Presença parcial" (ICP 3 vs ICP 4) · **PRIORIDADE MÁXIMA**

### INSIGHT 1B (adaptativo)
- **Se liderou ICP3 (insta orgânico):** "Você já está no jogo digital — tem presença, posta, aparece. O que provavelmente falta é transformar atenção em **comprador qualificado**, não em curioso pedindo preço."
- **Se liderou ICP4 (sem fonte definida):** "Não ter uma fonte principal não é falha sua — é falta de estrutura. A boa notícia: estrutura se monta rápido e barato quando se sabe a ordem certa."
- **Botão:** "Continuar diagnóstico"

### B-Q2 — A PERGUNTA DE OURO: "Você já tentou fazer anúncios pagos?"
| Opção | Pesos |
|---|---|
| A) Nunca — não sei por onde começar | ICP4 +5 |
| B) Já impulsionei posts, mas sem resultado claro | ICP3 +5 |
| C) Já testei por 1–3 meses e parei porque não funcionou | ICP3 +5 |
| D) Consumo muito conteúdo sobre, mas nunca operei de verdade | ICP4 +4 |

### B-Q3 — "Quanto você investe por mês em marketing hoje (portais + anúncios + ferramentas)?"
| Opção | Pesos |
|---|---|
| A) Nada — começando do zero | ICP4 +4 |
| B) Até R$1.000 | ICP4 +2, ICP3 +1 |
| C) R$1.000 a R$3.000 | ICP3 +2, ICP5 +1 |
| D) Mais de R$3.000 | ICP5 +2 |

### INSIGHT 2B — a "virada" (adaptativo) — *o coração da conversão*
- **ICP3 (Curioso Frustrado):** "Aqui está a verdade que ninguém te contou: **impulsionar post NÃO é tráfego pago.** São coisas diferentes. Impulsionar é colocar um cartaz na rua e torcer. Gestão profissional coloca seu anúncio na frente de quem **já está procurando** um imóvel na sua faixa, na sua região, agora. Você não falhou — a estratégia é que estava errada. Campanha bem estruturada reduz o custo por lead em **60–80%** vs. impulsionamento."
- **ICP4 (Ambicioso):** "Você não precisa de R$10.000/mês pra começar. Corretores que iniciam com **R$1.500/mês + estratégia certa geram 15–25 leads qualificados no primeiro mês.** O que trava não é dinheiro — é a ordem: landing page + pixel + CRM + follow-up, montados antes de ligar a campanha."
- → segue para Q-UNIVERSAL.

---

## RAMO C — "Já investe" (ICP 5 vs ICP 6)

### INSIGHT 1C
- "Você já passou da dúvida 'será que funciona?'. Agora a pergunta certa é: **quanto resultado está ficando na mesa por falta de otimização ou estrutura?**"
- **Botão:** "Continuar diagnóstico"

### C-Q2 — REGRA DURA: "Você trabalha solo ou gerencia equipe?"
| Opção | Pesos | Regra |
|---|---|---|
| A) Trabalho solo | ICP5 +4 | — |
| B) Tenho 1–3 corretores comigo | ICP5 +3, ICP6 +1 | — |
| C) Gerencio equipe de 4–10 corretores | ICP6 +6 | **força ICP6** |
| D) Imobiliária com mais de 10 corretores | ICP6 +8 | **força ICP6** |

### C-Q3 — "O que mais te incomoda na sua operação digital hoje?"
| Opção | Pesos |
|---|---|
| A) Gasto tempo demais gerenciando campanha sozinho | ICP5 +4 |
| B) Meu custo por lead poderia ser bem menor | ICP5 +3 |
| C) Preciso de previsibilidade pra alimentar minha equipe | ICP6 +4 |
| D) Não consigo medir ROI / atribuir venda à campanha | ICP6 +4 |

### INSIGHT 2C — a "virada" (adaptativo)
- **ICP5:** "Sem otimização avançada (remarketing, lookalike, tracking offline), seu CPL provavelmente está **30–50% acima** do possível. E as 5–10h/semana que você gasta gerenciando campanha poderiam virar **2–3 reuniões extras** com leads qualificados."
- **ICP6:** "Imobiliárias com captação digital estruturada têm **40% menos turnover** — corretor fica onde tem lead. O custo de repor um bom corretor equivale a **3–6 meses de mídia.** Operação profissional permite atribuir venda real a cada campanha."
- → segue para Q-UNIVERSAL.

---

### Q-UNIVERSAL — Tempo de resposta (bomba de valor para todos)
**"Quando um lead entra em contato, em quanto tempo você (ou sua equipe) responde?"**

| Opção | Pesos |
|---|---|
| A) Menos de 5 minutos — tenho processo | ICP5 +2, ICP6 +2 |
| B) Até 1 hora | ICP5 +1, ICP6 +1 |
| C) No mesmo dia, quando dá | ICP1 +1, ICP2 +1, ICP3 +1 |
| D) Pode demorar mais de 24h | ICP1 +2 |
| E) Não tenho processo definido | ICP4 +2, ICP3 +1 |

**Valor exibido logo após responder:** "Leads respondidos em **menos de 5 minutos têm 21x mais chance de fechar.** Você respondeu **[opção]** — o que significa que uma fatia dos seus leads potenciais está indo direto para a concorrência."

---

### Q-CONFIRMAÇÃO — Auto-reconhecimento (override, peso ×3)
**"Qual dessas frases mais representa você hoje?"**
*(Subtítulo: "Seja honesto — isso personaliza 100% do seu diagnóstico.")*

| Opção | ICP (peso ×3) |
|---|---|
| A) "Meu negócio é olho no olho. Não preciso de internet pra vender." | ICP1 |
| B) "Já gasto com portal, não quero mais uma despesa que talvez não funcione." | ICP2 |
| C) "Já tentei anúncios e joguei dinheiro fora. Preciso de prova que funciona." | ICP3 |
| D) "Sei que preciso de tráfego pago, mas não sei por onde começar sem errar." | ICP4 |
| E) "Já faço tráfego, mas sei que não estou tirando o máximo." | ICP5 |
| F) "Preciso de uma operação profissional com números claros e ROI." | ICP6 |

> Esta pergunta é o **pico emocional** do quiz: o lead se vê na frase e pensa "eles entendem exatamente minha situação". Por isso tem peso dominante — corrige qualquer ambiguidade acumulada.

---

### Q-ABERTA — A dor nas palavras dele
**"Se pudéssemos resolver UM problema do seu marketing imobiliário agora, qual seria?"**
*(Subtítulo: "Escreva do seu jeito — isso vai direto para a análise do especialista.")*
- Campo de texto livre. **Botão:** "Ver meu resultado →"
- **Uso interno:** essa frase entra no script de follow-up do closer literalmente. É o dado de maior valor comercial do quiz.

---

### CAPTURA — no pico de reconhecimento
- **Cabeçalho:** "🎯 Seu diagnóstico está pronto! Identificamos seu perfil. Preencha para revelar o resultado completo."
- **Campos:** Nome · Melhor e-mail · WhatsApp (com DDD)
- **Botão:** "Revelar meu diagnóstico 🔓"
- A captura vem **só agora**, depois de o lead já ter recebido 2 insights e a bomba dos 5 minutos. O valor percebido sustenta o pedido de dados.

---

### RESULTADO — personalizado por ICP
Estrutura da tela de resultado (igual para os 6, conteúdo trocado):
1. **Ícone + tag de maturidade + nome do perfil** (ex.: "PRESENÇA PARCIAL · O Curioso Frustrado")
2. **Headline personalizada** com o primeiro nome do lead.
3. **Diagnóstico** (parágrafo que espelha as crenças/dores do ICP).
4. **Barras "Análise de Perfil"** — mostra a aderência a cada ICP (transparência + prova de personalização).
5. **3 dados de impacto** (cards com números).
6. **"Seus 3 próximos passos"** (acionáveis).
7. **CTA** → botão WhatsApp com mensagem pré-preenchida carregando ICP + dor escrita.
8. **Branding VM.**

---

## 6. Lógica de Classificação (pseudocódigo)

```
1. Q1 define o RAMO (maturidade). O lead percorre só as perguntas do ramo.
2. Cada resposta soma pesos em scores{icp1..icp6}.
3. Q-CONFIRMAÇÃO soma com peso ×3 (override suave).
4. REGRA DURA: se C-Q2 == "4–10" ou ">10" corretores → resultado = ICP6 (ignora scoring).
5. Vencedor = argmax(scores). Empate → desempata pela Q-CONFIRMAÇÃO.
6. "Aderência %" exibida = score_vencedor / soma_total, clampada entre 62% e 96%
   (nunca mostrar baixo demais — quebra a percepção de precisão).
```

**Fallback:** se por algum motivo nenhum score > 0 (impossível na prática), default = **ICP4** (perfil de maior volume e abordagem mais segura).

---

## 7. Os 6 Diagnósticos Finais (copy de referência)

> Texto-base do docx v2, pronto para a tela de resultado. Refinar com o time de copy.

### ICP 1 — "Seu Maior Ativo Está Virando Seu Maior Risco"
- **Diagnóstico:** Você construiu uma carreira sólida com relacionamento. Mas o mercado mudou: o comprador de alto padrão começa no Google, não no telefone. Suas indicações continuam vindo — só que cada vez menos.
- **Dados:** 78% pesquisam online antes de contatar corretor · 3 negócios/mês perdidos em média sem presença digital · 21x mais chance de fechar quando te encontram primeiro.
- **3 passos:** vitrine digital (landing de autoridade) · presença no Google para "corretor alto padrão [região]" · digital como amplificador do relacionamento, não substituto.
- **CTA:** "Agende 15 min. Vamos proteger seu território digital sem mudar o que você faz de melhor."

### ICP 2 — "Você Está Pagando Caro Por Leads Que Não São Seus"
- **Diagnóstico:** Portal não é marketing — é aluguel de vitrine compartilhada. Cada lead é disputado por 20–30 corretores, e fica mais caro todo ano.
- **Dados:** +40% custo dos portais em 2 anos · 30 corretores no mesmo lead · −50% custo por lead exclusivo.
- **3 passos:** comparar custo real portal vs. exclusivo · captação própria com portal de backup · em 90 dias decidir com dados.
- **CTA:** "Receba uma planilha comparativa personalizada: Portal vs. Lead Exclusivo."

### ICP 3 — "Você Não Falhou — A Estratégia É Que Estava Errada"
- **Diagnóstico:** O que você fez foi impulsionamento, não gestão de tráfego. Gestão profissional coloca o anúncio na frente de quem já procura imóvel na sua faixa.
- **Dados:** 60–80% de redução de CPL vs. impulsionamento · 0 leads qualificados é o típico do impulsionamento · 30 dias para os primeiros leads com campanha estruturada.
- **3 passos:** entender o que deu errado antes · piloto de 30 dias com verba mínima + landing dedicada · ver leads chegando antes de compromisso longo.
- **CTA:** "Diagnóstico gratuito: mostre o que fez antes e explicamos exatamente por que não funcionou."

### ICP 4 — "Você Tem a Mentalidade Certa — Só Falta a Estrutura"
- **Diagnóstico:** Você já entende que o digital é o caminho. O que trava é estrutura + medo de errar com dinheiro. Não precisa de orçamento alto — precisa de estratégia certa.
- **Dados:** 15–25 leads no 1º mês com R$1.500 · R$50/dia valida o canal · o custo de não começar é market share cedido.
- **3 passos:** infraestrutura mínima (landing + pixel + CRM + follow-up) · começar com R$50/dia em Meta Ads na sua região · em 30 dias decidir com dados.
- **CTA:** "Plano de lançamento personalizado: investimento mínimo, timeline de 30 dias, projeção de resultados."

### ICP 5 — "Seus Resultados Estão Bons — Mas Você Está Deixando Dinheiro na Mesa"
- **Diagnóstico:** Você já investe e gera leads. O problema é gerenciar tudo sozinho — e, sem otimização avançada, seu CPL está 30–50% acima do possível.
- **Dados:** −40% CPL em 60 dias com gestão especializada · 5–10h/semana gastas gerenciando · 2–3 reuniões extras/semana se delegar.
- **3 passos:** auditoria da operação atual · transição sem downtime · dashboard de CPL/conversão/ROI.
- **CTA:** "Auditoria gratuita: os 3 maiores gaps e quanto dinheiro você deixa na mesa."

### ICP 6 — "Sua Equipe Precisa de Uma Máquina de Leads Previsível"
- **Diagnóstico:** Você pensa como empresário. Precisa alimentar a equipe com leads todo mês — se a fonte seca, perde bons corretores. Precisa de operação especializada com ROI claro.
- **Dados:** −40% turnover com captação estruturada · 3–6 meses de mídia = custo de repor um corretor bom · 100% de rastreabilidade.
- **3 passos:** campanhas segmentadas por perfil/faixa · dashboard em tempo real por campanha e corretor · distribuição inteligente de leads + tracking até o fechamento.
- **CTA:** "Proposta com case real: como uma imobiliária do mesmo porte estruturou captação com ROI mensurado."

---

## 8. Captura & Roteamento Operacional (handoff ao closer)

Ao revelar o resultado e capturar contato, o lead é roteado automaticamente. O closer recebe: **ICP identificado + aderência % + respostas-chave + a dor escrita na Q-Aberta.**

| ICP | Closer | Timing | Canal | Material de apoio |
|---|---|---|---|---|
| ICP 1 | José | 24–48h | Ligação + áudio WhatsApp | Caso de corretor similar |
| ICP 2 | Vitor | < 2h | WhatsApp + planilha | Comparativo portal vs. exclusivo |
| ICP 3 | Yan | < 30min | WhatsApp empático | Explicação do erro anterior |
| ICP 4 | Yan | < 30min | WhatsApp + plano de lançamento | Plano de 30 dias com valores |
| ICP 5 | José | < 1h | WhatsApp com análise prévia | Auditoria da conta atual |
| ICP 6 | Rafael/José | < 2h | WhatsApp formal + e-mail | Case com números + proposta |

**Mensagem WhatsApp pré-preenchida (deeplink no botão de CTA):**
```
Olá, Virtual Mark!
Nome: {nome}
Perfil do diagnóstico: {nome_do_ICP}
Aderência: {%}
Minha prioridade: {resposta_da_Q_aberta}
Quero entender qual estrutura corrige esse gargalo primeiro.
```

---

## 9. Especificação Técnica (para implementação)

> Esta seção orienta a construção em React/TS dentro do projeto VirtualMark.

### 9.1 Onde vive
- Rota: **`/quiz-imoveis`** (já existe no projeto — este quiz substitui/atualiza o conteúdo atual). Confirmar se mantém URL ou cria nova.
- Página standalone (sem Navbar/Footer pesados? a definir) ou seção dedicada.

### 9.2 Marca (corrigir o protótipo `.jsx`, que está azul/roxo)
- Fundo `#0a0a0a`, primário vermelho `#ef4444`/`#dc2626`, cards `bg-gray-900/50 border-gray-800`, gradiente `from-primary-500 to-primary-700`, fonte Inter, animações Framer Motion. Manter as cores de "nível de maturidade" (vermelho / âmbar / verde) como acento secundário das tags.

### 9.3 Modelo de dados (estado do quiz)
```ts
type ICP = 'icp1'|'icp2'|'icp3'|'icp4'|'icp5'|'icp6';
type Branch = 'A'|'B'|'C';
interface QuizState {
  step: 'intro'|'question'|'insight'|'confirm'|'open'|'capture'|'result';
  branch: Branch | null;
  scores: Record<ICP, number>;
  answers: Answer[];
  forcedICP: ICP | null;     // regra dura (equipe 4+)
  name: string; email: string; phone: string;
  openAnswer: string;
}
```

### 9.4 Persistência & tracking (hoje INEXISTENTE nas duas versões)
- **Salvar o lead** no Supabase (tabela `quiz_leads`): nome, email, phone, icp, aderência, todas as respostas, openAnswer, timestamp, UTM.
- **Webhook/CRM** para disparar o roteamento ao closer (ou notificação WhatsApp interna).
- **Eventos de tracking** (GA4/Meta Pixel): `quiz_start`, `quiz_question_{n}`, `quiz_branch_{A|B|C}`, `quiz_capture`, `quiz_result_{icp}`, `quiz_cta_whatsapp`.
- **Pixel de conversão** no clique do CTA para otimizar campanhas por ICP.

### 9.5 Reaproveitar dos protótipos
- Da **versão da Paola** (`app.js`): o conceito de **intermissions adaptativas** (já implementado para 3 pontos) e o **deeplink de WhatsApp** com mensagem montada.
- Do **`.jsx`**: a estrutura dos **6 profiles**, as **barras de aderência** (`StatBar`) e o fluxo intro→quiz→open→capture→result.

---

## 10. Decisões em Aberto (a resolver antes/durante a implementação)

1. **URL:** mantém `/quiz-imoveis` ou cria rota nova? O `/imobiliarias` aponta para qual?
2. **Layout:** página cheia standalone ou com header/footer do site?
3. **Persistência:** Supabase + qual mecanismo de notificação ao closer (webhook? e-mail? grupo WhatsApp interno via API?).
4. **Edge case ICP6 sem digital:** dono de imobiliária que ainda vive de portal — a regra dura manda pra ICP6; validar se a copy do ICP6 atende esse subcaso.
5. **Q-Aberta obrigatória ou pulável?** (a versão da Paola permite pular; o `.jsx` exige). Decisão impacta a qualidade do dado pro closer.
6. **Quantas perguntas por ramo:** este desenho usa Q1 + 2 do ramo + universal + confirmação + aberta (= 5 objetivas + 1 aberta). Validar se quer adicionar a pergunta de "investimento" em todos os ramos.

---

## 11. Próximos Passos

1. ✅ **Alinhar objetivo** (feito: valor-first, contato como conclusão lógica).
2. ✅ **Definir motor** (feito: árvore de decisão híbrida).
3. 🔲 **Validar esta árvore** com o time (José na lógica, copy do time, Paola nos criativos).
4. 🔲 **Resolver decisões em aberto** (seção 10).
5. 🔲 **Implementar em TSX** na marca VM, com persistência + tracking.
6. 🔲 **Soft launch** (R$500, foco ICP 3 e 4) — conforme cronograma de 8 semanas do docx.

---

*Virtual Mark — Documento estratégico interno · Quiz Diagnóstico por ICP v1.0*

# Quiz Diagnóstico por ICP — Árvore de Decisão Profunda (Ponta a Ponta)

> **Documento mestre do funil de quiz da Virtual Mark.**
> Árvore de decisão **multi-nível**: ramifica em 3 níveis (maturidade → perfil → contexto), com **6 caminhos distintos**, cada um coletando dados relevantes e entregando conteúdo cirúrgico para aquele ICP.
>
> **Versão:** 2.0 — árvore profunda · Maio 2026
> **Status:** especificação completa + implementado em `src/pages/QuizImobiliariaTreePage.tsx` (rota preview `/quiz-imoveis-v2`).

---

## 1. Objetivo

Entregar **tanto valor real** sobre o digital imobiliário que contatar a VM vire a conclusão lógica do corretor:

```
ENTREGAR VALOR REAL  →  GERAR RECONHECIMENTO ("isso fui eu")  →  TORNAR O CONTATO INEVITÁVEL
```

A árvore profunda serve a isso porque **personaliza a jornada inteira**: cada resposta abre perguntas específicas do seu caso, o filtro fica cirúrgico, e o closer recebe um dossiê preciso antes do primeiro contato.

---

## 2. Os 6 ICPs (referência)

| Nível | ICP | Nome interno | Nome exibido ao lead | Prioridade |
|---|---|---|---|---|
| Inicial | icp1 | Tradicionalista Convicto | **A Autoridade de Relacionamento** | Baixa |
| Inicial | icp2 | Dependente de Portais | **O Estrategista de Portais** | Média (melhor arma de venda) |
| Parcial | icp3 | Curioso Frustrado | **O Explorador Digital** | **ALTA** |
| Parcial | icp4 | Ambicioso sem Infra | **O Ambicioso Digital** | **ALTA** |
| Avançado | icp5 | Investidor Otimista | **O Investidor Estratégico** | Média |
| Avançado | icp6 | Empresário Imobiliário | **O Empreendedor Imobiliário** | Futura (escala) |

---

## 3. Modelo da árvore profunda

**3 níveis de ramificação + cauda compartilhada:**

- **Nível 1 — RAIZ (maturidade):** "De onde vêm seus clientes?" → roteia para 1 de 3 ramos (A/B/C).
- **Nível 2 — DISCRIMINADOR:** uma pergunta que divide os 2 ICPs do ramo → roteia para 1 de 6 **sub-caminhos**.
- **Nível 3 — CONTEXTO:** 2 perguntas específicas do ICP daquele sub-caminho (coletam dados relevantes para o diagnóstico e para o closer).
- **INSIGHT:** 1 tela de virada, específica do ICP (6 variantes).
- **CAUDA (compartilhada):** confirmação (override) → pergunta aberta → captura → resultado.

**Toda jornada tem exatamente 5 perguntas + 1 insight + 1 aberta.** (~3–4 min)

```
                                 RAIZ (Q1) — maturidade
              ┌──────────────────────┼──────────────────────┐
            RAMO A                  RAMO B                  RAMO C
        (indicação/portais)     (insta/sem fonte)       (já anuncia)
              │                       │                       │
          DISC a2                 DISC b2                 DISC c2
        (anúncios?)            (já tentou ads?)        (solo/equipe?)
          ┌──┴──┐                 ┌──┴──┐                 ┌──┴──┐
        icp1   icp2             icp3   icp4             icp5   icp6
         │      │                │      │                │      │
       a3,a4  a3,a4            b3,b4  b3,b4            c3,c4  c3,c4   ← 2 perguntas
         │      │                │      │                │      │       de contexto
      ins1   ins2             ins3   ins4             ins5   ins6   ← insight do ICP
         └──────┴───────────────┴──────┴───────────────┴──────┘
                                 │
                        CONFIRMAÇÃO (override ×8)
                                 │
                          PERGUNTA ABERTA
                                 │
                        CAPTURA → RESULTADO
```

---

## 4. A árvore completa — nó a nó

> Notação: `→ destino` indica o próximo nó. Pesos alimentam o scoring de refino.

### RAIZ — `root`
**"De onde vem a maioria dos seus clientes hoje?"**
*Sub: "Essa é a pergunta que mais revela onde está sua maior oportunidade."*

| Opção | Ramo | Pesos | → |
|---|---|---|---|
| Indicações e networking presencial | A | icp1 +5, icp3 +1 | `a2` |
| Portais imobiliários (ZAP, OLX, VivaReal) | A | icp2 +5 | `a2` |
| Instagram / redes sociais orgânicas | B | icp3 +2, icp4 +3 | `b2` |
| Já faço anúncios pagos (Google ou Meta) | C | icp5 +4, icp6 +2 | `c2` |
| Não tenho uma fonte principal definida | B | icp4 +3, icp3 +2 | `b2` |

---

### RAMO A — "Ainda não digital" (icp1 ↔ icp2)

#### `a2` — DISCRIMINADOR: "Quando você pensa em anúncios online, o que mais te representa?"
| Opção | Pesos | → |
|---|---|---|
| "Nunca investi — meu negócio é relacionamento" | icp1 +5 | `a3_icp1` |
| "Já pensei, mas acho caro e complexo" | icp1 +3, icp4 +1 | `a3_icp1` |
| "Acho que já faço — pago o portal todo mês" | icp2 +5 | `a3_icp2` |
| "Pago portal, mas sei que não é a mesma coisa que anunciar" | icp2 +4, icp5 +1 | `a3_icp2` |

#### `a3_icp1` — "Há quanto tempo você atua com imóveis de alto padrão?"
| Opção | Pesos | → |
|---|---|---|
| Mais de 20 anos | icp1 +4 | `a4_icp1` |
| 10 a 20 anos | icp1 +3 | `a4_icp1` |
| 2 a 10 anos | icp1 +1, icp5 +1 | `a4_icp1` |
| Menos de 2 anos | icp4 +2 | `a4_icp1` |

#### `a4_icp1` — "Quando alguém quer te indicar, onde a pessoa te encontra antes de ligar?"
| Opção | Pesos | → |
|---|---|---|
| Em lugar nenhum — só indicação direta | icp1 +3 | `insight:icp1` |
| No meu Instagram pessoal, sem estratégia | icp1 +2 | `insight:icp1` |
| Num site/perfil antigo que quase não atualizo | icp1 +2 | `insight:icp1` |
| Ela me acha no Google | icp1 +1, icp5 +1 | `insight:icp1` |

#### `a3_icp2` — "Quanto você investe por mês nos portais?"
| Opção | Pesos | → |
|---|---|---|
| Até R$500 | icp2 +3 | `a4_icp2` |
| R$500 a R$1.500 | icp2 +4 | `a4_icp2` |
| R$1.500 a R$3.000 | icp2 +4, icp6 +1 | `a4_icp2` |
| Mais de R$3.000 | icp2 +3, icp6 +2 | `a4_icp2` |

#### `a4_icp2` — "O que mais te incomoda nos leads que vêm do portal?"
| Opção | Pesos | → |
|---|---|---|
| Vêm disputados com muitos corretores | icp2 +4 | `insight:icp2` |
| Qualidade baixa — muito curioso | icp2 +3 | `insight:icp2` |
| O custo sobe todo ano | icp2 +3 | `insight:icp2` |
| Não consigo medir se vale a pena | icp2 +2, icp5 +1 | `insight:icp2` |

---

### RAMO B — "Presença parcial" (icp3 ↔ icp4) · **PRIORIDADE MÁXIMA**

#### `b2` — DISCRIMINADOR (de ouro): "Você já tentou fazer anúncios pagos?"
| Opção | Pesos | → |
|---|---|---|
| Nunca — não sei por onde começar | icp4 +5 | `b3_icp4` |
| Consumo muito conteúdo sobre, mas nunca operei | icp4 +4 | `b3_icp4` |
| Já impulsionei posts, mas sem resultado claro | icp3 +5 | `b3_icp3` |
| Já testei por 1–3 meses e parei porque não funcionou | icp3 +5 | `b3_icp3` |

#### `b3_icp3` — "O que exatamente você já fez?"
| Opção | Pesos | → |
|---|---|---|
| Só impulsionei posts no Instagram | icp3 +4 | `b4_icp3` |
| Rodei Google/Meta Ads por conta própria | icp3 +4 | `b4_icp3` |
| Contratei agência ou freelancer | icp3 +2, icp5 +1 | `b4_icp3` |
| Um pouco de cada | icp3 +3 | `b4_icp3` |

#### `b4_icp3` — "Quanto você chegou a gastar nessas tentativas?"
| Opção | Pesos | → |
|---|---|---|
| Até R$500 | icp3 +3 | `insight:icp3` |
| R$500 a R$2.000 | icp3 +4 | `insight:icp3` |
| Mais de R$2.000 | icp3 +3, icp5 +1 | `insight:icp3` |
| Não lembro / foi pouco | icp3 +2 | `insight:icp3` |

#### `b3_icp4` — "Quanto você teria disponível pra investir por mês em anúncios?"
| Opção | Pesos | → |
|---|---|---|
| Ainda não sei | icp4 +3 | `b4_icp4` |
| Até R$500 | icp4 +3 | `b4_icp4` |
| R$500 a R$1.500 | icp4 +4 | `b4_icp4` |
| Mais de R$1.500 | icp4 +3, icp5 +1 | `b4_icp4` |

#### `b4_icp4` — "O que você já tem montado da sua estrutura digital?"
| Opção | Pesos | → |
|---|---|---|
| Nada ainda | icp4 +4 | `insight:icp4` |
| Só o Instagram | icp4 +3 | `insight:icp4` |
| Instagram + um site ou landing | icp4 +2, icp5 +1 | `insight:icp4` |
| Tenho CRM/processo, mas não anuncio | icp4 +2, icp5 +2 | `insight:icp4` |

---

### RAMO C — "Já investe" (icp5 ↔ icp6)

#### `c2` — DISCRIMINADOR (regra dura): "Você trabalha solo ou gerencia equipe?"
| Opção | Pesos | Regra | → |
|---|---|---|---|
| Trabalho solo | icp5 +4 | — | `c3_icp5` |
| Tenho 1–3 corretores comigo | icp5 +3, icp6 +1 | — | `c3_icp5` |
| Gerencio equipe de 4–10 corretores | icp6 +6 | **força icp6** | `c3_icp6` |
| Imobiliária com mais de 10 corretores | icp6 +8 | **força icp6** | `c3_icp6` |

#### `c3_icp5` — "Quanto você investe por mês em mídia hoje?"
| Opção | Pesos | → |
|---|---|---|
| R$1.000 a R$3.000 | icp5 +3 | `c4_icp5` |
| R$3.000 a R$5.000 | icp5 +4 | `c4_icp5` |
| R$5.000 a R$10.000 | icp5 +4, icp6 +1 | `c4_icp5` |
| Mais de R$10.000 | icp5 +3, icp6 +2 | `c4_icp5` |

#### `c4_icp5` — "Quem cuida das suas campanhas hoje?"
| Opção | Pesos | → |
|---|---|---|
| Eu mesmo, no tempo que sobra | icp5 +4 | `insight:icp5` |
| Um freelancer ou gestor | icp5 +3 | `insight:icp5` |
| Uma agência, mas não estou satisfeito | icp5 +2, icp6 +1 | `insight:icp5` |
| Ninguém fixo — vai e volta | icp5 +3 | `insight:icp5` |

#### `c3_icp6` — "Qual o maior desafio de leads pra sua equipe hoje?"
| Opção | Pesos | → |
|---|---|---|
| Volume previsível todo mês | icp6 +4 | `c4_icp6` |
| Distribuir leads com critério entre corretores | icp6 +4 | `c4_icp6` |
| Medir ROI e atribuir vendas às campanhas | icp6 +4 | `c4_icp6` |
| Reduzir dependência dos portais premium | icp6 +3, icp2 +1 | `c4_icp6` |

#### `c4_icp6` — "Você já trabalhou com agência de marketing antes?"
| Opção | Pesos | → |
|---|---|---|
| Nunca | icp6 +3 | `insight:icp6` |
| Sim, e foi uma experiência ruim | icp6 +4 | `insight:icp6` |
| Sim, foi ok mas quero algo melhor | icp6 +3 | `insight:icp6` |
| Trabalho com uma hoje, avaliando trocar | icp6 +3 | `insight:icp6` |

---

### CAUDA (compartilhada por todos os caminhos)

#### `confirm` — CONFIRMAÇÃO (peso ×8, override suave + desempate)
**"Qual frase mais representa você hoje?"** · *Sub: "Seja honesto — isso personaliza 100% do seu diagnóstico."*

| Opção | ICP |
|---|---|
| "Meu negócio é olho no olho. Não preciso de internet pra vender." | icp1 |
| "Já gasto com portal, não quero mais uma despesa que talvez não funcione." | icp2 |
| "Já tentei anúncios e joguei dinheiro fora. Preciso de prova que funciona." | icp3 |
| "Sei que preciso de tráfego pago, mas não sei por onde começar sem errar." | icp4 |
| "Já faço tráfego, mas sei que não estou tirando o máximo." | icp5 |
| "Preciso de uma operação profissional com números claros e ROI." | icp6 |
→ `open`

#### `open` — PERGUNTA ABERTA
**"Se pudéssemos resolver UM problema do seu marketing, qual seria?"** (campo livre, pulável) → `capture`

#### `capture` → `result`
Captura e-mail + WhatsApp (nome já coletado no início) → revela o resultado.

---

## 5. Os 6 insights (1 por jornada, específico do ICP)

| ICP | Eyebrow | Título (a virada) |
|---|---|---|
| icp1 | UMA VIRADA IMPORTANTE | 78% dos compradores de alto padrão pesquisam online antes de falar com um corretor. |
| icp2 | UMA VIRADA IMPORTANTE | Portal não é marketing digital — é aluguel de vitrine compartilhada. |
| icp3 | A VERDADE QUE NINGUÉM TE CONTOU | Impulsionar post NÃO é tráfego pago. São coisas completamente diferentes. |
| icp4 | O QUE TE TRAVA NÃO É DINHEIRO | Você não precisa de R$10.000/mês pra começar. |
| icp5 | ONDE ESTÁ O DINHEIRO NA MESA | Sem otimização avançada, seu CPL provavelmente está 30–50% acima do possível. |
| icp6 | PENSANDO COMO EMPRESÁRIO | Imobiliárias com captação estruturada têm 40% menos turnover de corretores. |

*(Corpo completo de cada insight no componente.)*

---

## 6. Lógica de classificação

```
1. O CAMINHO já determina fortemente o ICP (root → discriminador → sub-perguntas só daquele perfil).
2. Scoring de refino: soma todos os pesos das respostas em scores{icp1..6}.
3. Confirmação: adiciona +8 ao ICP escolhido (nudge/desempate, não anula o caminho).
4. REGRA DURA: equipe 4+ corretores → resultado = icp6 (ignora scoring).
5. Vencedor = argmax(scores); empate → desempata pela confirmação.
6. Aderência % = clamp(round(score_vencedor / total * 100), 62, 96).
```

Como cada sub-caminho só faz perguntas do seu ICP, o vencedor é robusto. A confirmação cobre o caso raro de auto-percepção divergente.

---

## 7. Os 6 diagnósticos finais

> Copy completa no componente (`profiles`). Resumo:

- **icp1 — A Autoridade de Relacionamento:** "Seu Maior Ativo Está Virando Seu Maior Risco."
- **icp2 — O Estrategista de Portais:** "Você Está Pagando Caro Por Leads Que Não São Seus."
- **icp3 — O Explorador Digital:** "Você Não Falhou — A Estratégia É Que Estava Errada."
- **icp4 — O Ambicioso Digital:** "Você Tem a Mentalidade Certa — Só Falta a Estrutura."
- **icp5 — O Investidor Estratégico:** "Seus Resultados Estão Bons — Mas Você Está Deixando Dinheiro na Mesa."
- **icp6 — O Empreendedor Imobiliário:** "Sua Equipe Precisa de Uma Máquina de Leads Previsível."

Cada um tem: headline personalizada (com o nome), diagnóstico, barras de aderência, 3 dados de impacto, 3 próximos passos, CTA WhatsApp com mensagem pré-preenchida (perfil + dor + nome).

---

## 8. Captura & roteamento (handoff ao closer)

Cada lead salvo em `quiz_leads` (Supabase) com: contato, icp, icp_name, branch, aderência, scores, **toda a trilha de respostas**, dor aberta, UTM/atribuição. Roteamento sugerido:

| ICP | Closer | Timing | Canal | Material |
|---|---|---|---|---|
| icp1 | José | 24–48h | Ligação + áudio | Caso de corretor similar |
| icp2 | Vitor | <2h | WhatsApp + planilha | Comparativo portal vs. exclusivo |
| icp3 | Yan | <30min | WhatsApp empático | Explicação do erro anterior |
| icp4 | Yan | <30min | WhatsApp + plano | Plano de 30 dias com valores |
| icp5 | José | <1h | WhatsApp + análise | Auditoria da conta |
| icp6 | Rafael/José | <2h | WhatsApp formal + e-mail | Case com números + proposta |

---

## 9. Especificação técnica

- **Rota:** `/quiz-imoveis-v2` (preview). Após aprovação, promover para `/quiz-imoveis`.
- **Modelo de dados:** grafo de nós (`NODES: Record<NodeId, QNode>`). Cada opção tem `next: NodeId | 'insight:icpX' | 'open'`. Traversal por `currentNodeId` + histórico (para o botão voltar, futuro).
- **Marca:** #0a0a0a / vermelho VM, fonte Inter, animações fadeUp.
- **Persistência:** `supabase.from('quiz_leads').insert([...])` (não-bloqueante).
- **Tracking:** `trackQuiz()` → `window.dataLayer` (GTM-PPB59WGL). Eventos: `quiz_start`, `quiz_name_submitted`, `quiz_question_answered`, `quiz_branch_entered`, `quiz_insight_viewed`, `quiz_open_answered`, `quiz_lead_captured`, `quiz_result_viewed`, `quiz_cta_whatsapp`.

---

## 10. Decisões em aberto / próximos passos

1. 🔲 Validar a árvore profunda em `/quiz-imoveis-v2`.
2. 🔲 Promover para a rota oficial `/quiz-imoveis` e aposentar a versão antiga.
3. 🔲 Exibir `quiz_leads` no painel admin (com a trilha de respostas + roteamento por ICP).
4. 🔲 Automatizar notificação ao closer por ICP (webhook/WhatsApp interno).
5. 🔲 Botão "voltar" no quiz (o grafo já guarda histórico — fácil de adicionar).

---

*Virtual Mark — Documento estratégico interno · Quiz Diagnóstico por ICP v2.0 (árvore profunda)*

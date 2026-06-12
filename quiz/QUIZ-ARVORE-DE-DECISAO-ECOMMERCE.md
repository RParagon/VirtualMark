# Quiz Diagnóstico por ICP — E-commerce · Árvore de Decisão Profunda

> **Documento mestre do funil de quiz do vertical E-COMMERCE da Virtual Mark.**
> Mesma arquitetura do quiz imobiliário (`QUIZ-ARVORE-DE-DECISAO.md`): árvore
> multi-nível com 3 níveis de ramificação (maturidade → perfil → contexto),
> 6 caminhos distintos, insight específico por ICP e cauda compartilhada.
>
> **Versão:** 1.0 · Junho 2026
> **Status:** implementado em `src/pages/QuizEcommerceTreePage.tsx` (rota `/quiz-ecommerce`).
> **ICPs:** ver `MAPA-ICPS-ECOMMERCE.md`.

---

## 1. Objetivo

Entregar tanto valor real sobre growth de e-commerce que contatar a VM vire a
conclusão lógica do lojista:

```
ENTREGAR VALOR REAL  →  GERAR RECONHECIMENTO ("isso sou eu")  →  TORNAR O CONTATO INEVITÁVEL
```

## 2. Modelo (idêntico ao vertical imobiliário)

- **Nível 1 — RAIZ (maturidade):** "De onde vem a maior parte das suas vendas?" → ramo A/B/C.
- **Nível 2 — DISCRIMINADOR:** divide os 2 ICPs do ramo → 6 sub-caminhos.
- **Nível 3 — CONTEXTO:** 2 perguntas específicas do ICP.
- **INSIGHT:** 1 tela de virada por ICP (6 variantes).
- **CAUDA:** confirmação (override ×8) → pergunta aberta → captura → resultado.

Toda jornada: **5 perguntas + 1 insight + 1 aberta** (~3 min).
Regra dura: **equipe 4+ pessoas → força icp6**.

```
                              RAIZ (root) — maturidade
              ┌──────────────────────┼──────────────────────┐
            RAMO A                  RAMO B                  RAMO C
       (1a1 / marketplace)     (loja sem tráfego)        (já investe)
              │                       │                       │
          DISC a2                 DISC b2                 DISC c2
       (canal próprio?)        (já tentou ads?)        (solo/equipe?)
          ┌──┴──┐                 ┌──┴──┐                 ┌──┴──┐
        icp1   icp2             icp3   icp4             icp5   icp6
```

---

## 3. A árvore completa — nó a nó

### RAIZ — `root`
**"De onde vem a maior parte das suas vendas hoje?"**
*Sub: "Essa é a pergunta que mais revela onde está sua maior oportunidade."*

| Opção | Ramo | Pesos | → |
|---|---|---|---|
| Instagram / WhatsApp, eu vendo no 1 a 1 | A | icp1 +5 | `a2` |
| Marketplaces (Mercado Livre, Shopee, Amazon) | A | icp2 +5 | `a2` |
| Tenho loja virtual própria, mas vende pouco | B | icp3 +2, icp4 +3 | `b2` |
| Já faço anúncios pagos (Google ou Meta) | C | icp5 +4, icp6 +2 | `c2` |
| Não tenho um canal principal definido | B | icp4 +3, icp3 +2 | `b2` |

### RAMO A — "Vende sem canal próprio" (icp1 ↔ icp2)

#### `a2` — DISCRIMINADOR: "Quando você pensa em ter um canal de vendas próprio com anúncios, o que mais te representa?"
| Opção | Pesos | → |
|---|---|---|
| "Minhas vendas vêm da minha relação com os clientes, sempre foi assim" | icp1 +5 | `a3_icp1` |
| "Já pensei, mas parece caro e complicado" | icp1 +3, icp4 +1 | `a3_icp1` |
| "Acho que já invisto, pago comissão pro marketplace todo mês" | icp2 +5 | `a3_icp2` |
| "Pago marketplace, mas sei que não é a mesma coisa que ter canal próprio" | icp2 +4, icp5 +1 | `a3_icp2` |

#### `a3_icp1` — "Como acontece uma venda típica sua hoje?"
| Opção | Pesos | → |
|---|---|---|
| Cliente chama no direct/WhatsApp e eu fecho na conversa | icp1 +4 | `a4_icp1` |
| Posto stories e espero alguém responder | icp1 +3 | `a4_icp1` |
| Indicação de clientes antigos | icp1 +3 | `a4_icp1` |
| Tenho link de pagamento/sacolinha, mas a maioria fecha no 1 a 1 | icp1 +2, icp4 +1 | `a4_icp1` |

#### `a4_icp1` — "O que mais te limita pra vender mais hoje?"
| Opção | Pesos | → |
|---|---|---|
| Meu tempo, eu sou o gargalo de tudo | icp1 +3 | `insight:icp1` |
| Alcance, só vendo pra quem já me segue | icp1 +3 | `insight:icp1` |
| Instabilidade, tem mês bom e mês morto | icp1 +2, icp4 +1 | `insight:icp1` |
| Não sei dizer, sinto que podia vender muito mais | icp1 +2 | `insight:icp1` |

#### `a3_icp2` — "Quanto os marketplaces levam de você por mês, somando comissão e tarifas?"
| Opção | Pesos | → |
|---|---|---|
| Até R$1.000 | icp2 +3 | `a4_icp2` |
| R$1.000 a R$5.000 | icp2 +4 | `a4_icp2` |
| R$5.000 a R$15.000 | icp2 +4, icp6 +1 | `a4_icp2` |
| Mais de R$15.000 | icp2 +3, icp6 +2 | `a4_icp2` |

#### `a4_icp2` — "O que mais te incomoda em vender por marketplace?"
| Opção | Pesos | → |
|---|---|---|
| Guerra de preço, sempre tem alguém R$1 mais barato | icp2 +4 | `insight:icp2` |
| O cliente é do marketplace, não meu, não consigo vender de novo pra ele | icp2 +4 | `insight:icp2` |
| Comissões e tarifas comendo a margem | icp2 +3 | `insight:icp2` |
| Viver refém de regras e algoritmo que mudam sem aviso | icp2 +3 | `insight:icp2` |

### RAMO B — "Loja própria sem tráfego" (icp3 ↔ icp4) · **PRIORIDADE MÁXIMA**

#### `b2` — DISCRIMINADOR (de ouro): "Você já tentou fazer anúncios pagos pra sua loja?"
| Opção | Pesos | → |
|---|---|---|
| Nunca, não sei por onde começar | icp4 +5 | `b3_icp4` |
| Consumo muito conteúdo sobre, mas nunca rodei de verdade | icp4 +4 | `b3_icp4` |
| Já impulsionei posts, mas não virou venda | icp3 +5 | `b3_icp3` |
| Já rodei campanhas por 1–3 meses e parei, não se pagou | icp3 +5 | `b3_icp3` |

#### `b3_icp3` — "O que exatamente você já fez?"
| Opção | Pesos | → |
|---|---|---|
| Só impulsionei posts no Instagram | icp3 +4 | `b4_icp3` |
| Rodei Google/Meta Ads por conta própria | icp3 +4 | `b4_icp3` |
| Contratei agência ou freelancer | icp3 +2, icp5 +1 | `b4_icp3` |
| Um pouco de cada | icp3 +3 | `b4_icp3` |

#### `b4_icp3` — "Quanto você chegou a investir nessas tentativas?"
| Opção | Pesos | → |
|---|---|---|
| Até R$1.000 | icp3 +3 | `insight:icp3` |
| R$1.000 a R$5.000 | icp3 +4 | `insight:icp3` |
| Mais de R$5.000 | icp3 +3, icp5 +1 | `insight:icp3` |
| Não lembro / foi pouco | icp3 +2 | `insight:icp3` |

#### `b3_icp4` — "Quanto você teria disponível pra investir por mês em anúncios?"
| Opção | Pesos | → |
|---|---|---|
| Ainda não sei | icp4 +3 | `b4_icp4` |
| Até R$1.000 | icp4 +3 | `b4_icp4` |
| R$1.000 a R$3.000 | icp4 +4 | `b4_icp4` |
| Mais de R$3.000 | icp4 +3, icp5 +1 | `b4_icp4` |

#### `b4_icp4` — "O que você já tem montado da sua operação?"
| Opção | Pesos | → |
|---|---|---|
| Só as redes sociais | icp4 +3 | `insight:icp4` |
| Loja no ar (Nuvemshop, Shopify, Tray...), mas sem tráfego | icp4 +4 | `insight:icp4` |
| Loja + pixel/catálogo configurados | icp4 +2, icp5 +1 | `insight:icp4` |
| Loja + e-mail/CRM, só falta mídia | icp4 +2, icp5 +2 | `insight:icp4` |

### RAMO C — "Já investe" (icp5 ↔ icp6)

#### `c2` — DISCRIMINADOR (regra dura): "Como é a operação por trás da sua loja hoje?"
| Opção | Pesos | Regra | → |
|---|---|---|---|
| Sou eu sozinho(a) | icp5 +4 | — | `c3_icp5` |
| Eu + 1–3 pessoas | icp5 +3, icp6 +1 | — | `c3_icp5` |
| Equipe de 4–10 pessoas | icp6 +6 | **força icp6** | `c3_icp6` |
| Operação com mais de 10 pessoas | icp6 +8 | **força icp6** | `c3_icp6` |

#### `c3_icp5` — "Quanto você investe por mês em mídia hoje?"
| Opção | Pesos | → |
|---|---|---|
| R$1.000 a R$5.000 | icp5 +3 | `c4_icp5` |
| R$5.000 a R$15.000 | icp5 +4 | `c4_icp5` |
| R$15.000 a R$50.000 | icp5 +4, icp6 +1 | `c4_icp5` |
| Mais de R$50.000 | icp5 +3, icp6 +2 | `c4_icp5` |

#### `c4_icp5` — "Qual frase descreve melhor seu ROAS hoje?"
| Opção | Pesos | → |
|---|---|---|
| Sei de cabeça, mas está abaixo do que preciso | icp5 +4 | `insight:icp5` |
| Varia demais, tem mês que paga, mês que não | icp5 +3 | `insight:icp5` |
| Não consigo medir com confiança | icp5 +3 | `insight:icp5` |
| Está bom, mas sei que dá pra extrair mais | icp5 +3, icp6 +1 | `insight:icp5` |

#### `c3_icp6` — "Qual o maior desafio da sua operação hoje?"
| Opção | Pesos | → |
|---|---|---|
| Escalar o investimento sem derreter o ROAS | icp6 +4 | `c4_icp6` |
| CAC subindo e margem apertando | icp6 +4 | `c4_icp6` |
| Dependência de um canal só de aquisição | icp6 +4 | `c4_icp6` |
| Cliente não volta, recompra e LTV baixos | icp6 +3, icp5 +1 | `c4_icp6` |

#### `c4_icp6` — "Você já trabalhou com agência de marketing antes?"
| Opção | Pesos | → |
|---|---|---|
| Nunca | icp6 +3 | `insight:icp6` |
| Sim, e foi uma experiência ruim | icp6 +4 | `insight:icp6` |
| Sim, foi ok mas quero algo melhor | icp6 +3 | `insight:icp6` |
| Trabalho com uma hoje, avaliando trocar | icp6 +3 | `insight:icp6` |

### CAUDA (compartilhada)

#### `confirm` — CONFIRMAÇÃO (peso ×8)
**"Qual frase mais representa você hoje?"**

| Opção | ICP |
|---|---|
| "Minhas vendas dependem de mim no 1 a 1. Se eu paro, a loja para." | icp1 |
| "Já pago caro pro marketplace, não quero mais um custo que talvez não funcione." | icp2 |
| "Já tentei anúncios e não se pagou. Preciso de prova que funciona." | icp3 |
| "Sei que preciso de tráfego, mas tenho medo de queimar dinheiro começando errado." | icp4 |
| "Já invisto em mídia, mas sei que não estou tirando o máximo." | icp5 |
| "Preciso de uma operação de growth profissional, com números claros." | icp6 |

→ `open` — **"Se pudéssemos resolver UM problema da sua loja, qual seria?"** (livre, pulável)
→ `capture` (e-mail + WhatsApp) → `result`

---

## 4. Os 6 insights

| ICP | Eyebrow | Título (a virada) |
|---|---|---|
| icp1 | UMA VIRADA IMPORTANTE | Você não tem um e-commerce. Você tem um atendimento que vende. |
| icp2 | UMA VIRADA IMPORTANTE | Marketplace não é canal próprio — é aluguel de prateleira com guerra de preço. |
| icp3 | A VERDADE QUE NINGUÉM TE CONTOU | Impulsionar post NÃO é tráfego pago. E tráfego sem estrutura não converte. |
| icp4 | O QUE TE TRAVA NÃO É DINHEIRO | Você não precisa de R$10.000/mês pra validar sua loja. |
| icp5 | ONDE ESTÁ O DINHEIRO NA MESA | Sem CRO, remarketing e e-mail, seu ROAS está 30–50% abaixo do possível. |
| icp6 | PENSANDO COMO EMPRESÁRIO | Escala não vem de mais verba. Vem de margem, LTV e atribuição. |

## 5. Lógica de classificação

Idêntica ao quiz imobiliário: caminho determina fortemente o ICP; scoring de
refino; confirmação +8 (desempate); regra dura equipe 4+ → icp6;
aderência % = clamp(62–96).

## 6. Os 6 diagnósticos finais

- **icp1 — A Marca de Relacionamento:** "Sua Marca Vende, Mas Só Quando Você Está Presente."
- **icp2 — O Estrategista de Marketplace:** "Você Está Pagando Caro Por Clientes Que Não São Seus."
- **icp3 — O Explorador Digital:** "Você Não Falhou, A Estrutura É Que Faltou."
- **icp4 — O Ambicioso Digital:** "Você Tem a Mentalidade Certa, Só Falta o Plano."
- **icp5 — O Operador de Performance:** "Sua Operação Funciona, Mas Está Deixando Dinheiro na Mesa."
- **icp6 — O Empresário do E-commerce:** "Sua Próxima Fase Não É Mais Verba, É Uma Máquina de Crescimento."

Cada um com: headline personalizada (nome), diagnóstico, barras de aderência,
3 dados de impacto, 3 próximos passos, CTA WhatsApp pré-preenchido (perfil +
dor + nome).

## 7. Especificação técnica

- **Rota:** `/quiz-ecommerce`. LP de origem: `/ecommerce`.
- **Componente:** `src/pages/QuizEcommerceTreePage.tsx` (clone estrutural do `QuizImobiliariaTreePage.tsx`, mesmo design system premium #0b0b0c/champagne/vermelho VM).
- **Persistência:** `supabase.from('quiz_leads')` com `vertical: 'ecommerce'` (coluna nova — migração `supabase/quiz_leads_vertical.sql`; insert tem fallback sem a coluna caso a migração ainda não tenha rodado).
- **Tracking:** mesmos eventos `quiz_*` via dataLayer/GTM, com campo extra `vertical: 'ecommerce'` em todos os eventos.

## 8. Pendências

1. 🔲 Rodar `supabase/quiz_leads_vertical.sql` no Supabase (adiciona coluna `vertical`).
2. 🔲 Case real de e-commerce para a LP (slot pronto, sem números inventados).
3. 🔲 Depoimentos reais de lojistas (seção de depoimentos da LP imobiliária não foi reaproveitada por ser específica de corretores).
4. 🔲 Definir closers do vertical e-commerce (tabela em `MAPA-ICPS-ECOMMERCE.md` §4).
5. 🔲 Exibir `quiz_leads` (ambos os verticais, filtro por `vertical`) no painel admin — PARTE 4 já planejada do vertical imobiliário.

---

*Virtual Mark — Documento estratégico interno · Quiz E-commerce v1.0 (árvore profunda)*

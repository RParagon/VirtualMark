# Mark Desktop

O Mark v3 na área de trabalho do Windows: uma barra VM no topo da tela (Asana, Ads e Claude) e o Mark solto, que passeia e corre até a barra quando algo precisa do Rafael. Sem IA, só regras.

A ideia da barra no topo e a técnica de acompanhar o Claude Code por hooks vêm do [Coucou](https://github.com/Louis-CFM/coucou) (MIT). O personagem, os sons e o visual são da Virtual Mark.

## Instalar

O GitHub Actions gera o instalador a cada mudança nesta pasta: aba Actions > "Mark Desktop (Windows)" > artefato `Mark-instalador-windows`.

## Rodar em modo dev (no PC)

Precisa de Node 22 e Rust (`rustup`).

```
cd mark-desktop
npm install
npx tauri dev
```

## Estrutura

- `ilha.html` / `src/ilha.ts`: a barra no topo.
- `mark.html` / `src/mark.ts`: o Mark (animação, passeio, arrastar, ir até a barra).
- `public/sprites/`: quadros do kit 2D do Mark v3 (192x208, PNG transparente).
- `src-tauri/`: janelas, bandeja e, nas próximas etapas, Asana, Google Ads e hooks do Claude Code.

## Conectar (pela própria barra, passando o mouse no indicador)

- **Asana:** colar o token pessoal (Asana > Configurações > Apps > Tokens de acesso pessoal). Mostra as tarefas abertas atribuídas ao Rafael, inclusive subtarefas: atrasadas, de hoje e dos próximos 7 dias. Avisa tarefa nova e manda um resumo às 8h.
- **Google Ads:** importar o `E:\Paragon\analise-cpa\.env`. Só leitura, a cada 30 minutos. Regras em `src-tauri/src/ads.rs`: conta ativa sem impressões depois das 11h, gasto do dia acima de 120% do orçamento, anúncio reprovado, CPA de 3 dias 40% acima do de 30 dias (com 10+ conversões). Cada alerta aparece uma vez por dia por conta.
- **Claude Code:** botão "Instalar hooks". Faz backup do `~/.claude/settings.json` (`settings.json.mark-backup`) e acrescenta hooks que chamam `Mark.exe --mark-hook`. O Mark fica "trabalhando" enquanto o Claude trabalha, corre até a barra quando o Claude espera você e comemora quando termina. Sessões do claude.ai na nuvem não entram (não há API pública).

Tokens e credenciais ficam no Gerenciador de Credenciais do Windows, nunca em arquivo.

## Etapas

1. Esqueleto: barra, Mark animado, bandeja. (feito)
2. Asana (VM Gestão). (feito, falta testar com o token)
3. Google Ads (MCC), só leitura. (feito, falta testar no PC)
4. Hooks do Claude Code. (feito, falta testar no PC)
5. Teste no PC e medição de RAM.

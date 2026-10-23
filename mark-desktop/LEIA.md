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

## Configurações

Engrenagem na barra ou "Configurações…" no ícone da bandeja. Lá ficam:

- **Asana:** token pessoal (Asana > Configurações > Apps > Tokens de acesso pessoal), desconectar, dias para uma tarefa atrasada virar "antiga", hora do resumo. Tarefas abertas atribuídas ao Rafael, inclusive subtarefas. Avisa tarefa nova, tarefa atualizada e o resumo do dia. Na barra, cada tarefa tem "concluir" (pede confirmação) e "ocultar" (só some da barra).
- **Google Ads:** importar o `.env` do analise-cpa, desconectar e as regras: conta ativa sem impressões depois de certa hora, gasto acima de X% do orçamento, anúncio reprovado, CPA de 3 dias acima do de 30 dias. Uma conta com erro não esconde as outras. A conexão tenta IPv4 primeiro (o IPv6 do PC não funciona).
- **Claude Code:** instalar, testar e remover os hooks (`Mark.exe --mark-hook`, com backup do `~/.claude/settings.json`). A barra mostra cada sessão com o pedido, a ferramenta em uso e o tempo. Sessões do claude.ai na nuvem não entram (não há API pública).
- **Visual:** tema e quanto tempo a barra espera para se recolher.

Tokens e credenciais ficam no Gerenciador de Credenciais do Windows, nunca em arquivo.

## Comportamento

- A barra fica colada no topo da tela, como um notch. Parada, ela se recolhe numa lingueta; passando o mouse, abre de novo.
- O Mark segue o cursor com os olhos, passeia de vez em quando, esperneia quando é arrastado e mostra os alertas num balão ao lado da cabeça.

## Etapas

1. Esqueleto: barra, Mark animado, bandeja. (feito)
2. Asana (VM Gestão). (feito, falta testar com o token)
3. Google Ads (MCC), só leitura. (feito, falta testar no PC)
4. Hooks do Claude Code. (feito, falta testar no PC)
5. Teste no PC e medição de RAM.

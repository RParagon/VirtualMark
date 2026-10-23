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

## Etapas

1. Esqueleto: barra, Mark animado, bandeja. (feito)
2. Asana (VM Gestão).
3. Google Ads (MCC), só leitura.
4. Hooks do Claude Code.

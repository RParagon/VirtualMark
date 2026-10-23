import type { Estado } from "./eventos";

// Quadros do kit 2D do Mark v3 (public/sprites/<estado>/NN.png, 192x208).
const QUADROS: Record<Estado, { n: number; fps: number }> = {
  idle: { n: 6, fps: 5 },
  waiting: { n: 6, fps: 6 },
  running: { n: 6, fps: 10 },
  review: { n: 6, fps: 6 },
  failed: { n: 8, fps: 8 },
  jumping: { n: 5, fps: 10 },
  waving: { n: 4, fps: 6 },
  "running-left": { n: 8, fps: 12 },
  "running-right": { n: 8, fps: 12 },
};

export interface Animacao {
  quadros: string[];
  fps: number;
}

export function animacao(estado: Estado): Animacao {
  const { n, fps } = QUADROS[estado];
  const quadros = Array.from({ length: n }, (_, i) => `/sprites/${estado}/${String(i).padStart(2, "0")}.png`);
  return { quadros, fps };
}

/** Carrega todos os quadros uma vez, para a troca de estado não piscar. */
export function precarregar(): Promise<void> {
  const todos = (Object.keys(QUADROS) as Estado[]).flatMap((e) => animacao(e).quadros);
  return Promise.all(
    todos.map(
      (src) =>
        new Promise<void>((ok) => {
          const img = new Image();
          img.onload = img.onerror = () => ok();
          img.src = src;
        }),
    ),
  ).then(() => undefined);
}

export const TODOS_ESTADOS = Object.keys(QUADROS) as Estado[];

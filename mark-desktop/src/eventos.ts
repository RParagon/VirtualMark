// Nomes e formatos dos eventos trocados entre as duas janelas e o Rust.

export type Estado =
  | "idle"
  | "waiting"
  | "running"
  | "review"
  | "failed"
  | "jumping"
  | "waving"
  | "running-left"
  | "running-right";

export type Fonte = "asana" | "ads" | "claude";

/** Pede ao Mark uma animação. Sem `vezes`, vira o estado de base até o próximo pedido. */
export interface PedidoEstado {
  estado: Estado;
  vezes?: number;
}

/** Algo que precisa da atenção do Rafael. */
export interface Alerta {
  fonte: Fonte;
  texto: string;
}

export const EV_ESTADO = "mark:estado";
export const EV_ALERTA = "mark:alerta";
export const EV_CLIQUE = "mark:clique";
export const EV_BANDEJA = "bandeja";

import { defineConfig } from "vite";
import { resolve } from "node:path";

// Duas janelas, duas páginas: a barra no topo (ilha) e o Mark solto na tela.
export default defineConfig({
  clearScreen: false,
  server: { port: 1420, strictPort: true },
  build: {
    target: "es2021",
    rollupOptions: {
      input: {
        ilha: resolve(__dirname, "ilha.html"),
        mark: resolve(__dirname, "mark.html"),
      },
    },
  },
});

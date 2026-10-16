/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        // desktop com pouca altura (notebooks até 960px de altura): aperta espaçamentos para cada seção caber na tela
        baixo: { raw: '(min-width: 1024px) and (max-height: 960px)' },
        curto: { raw: '(min-width: 1024px) and (max-height: 800px)' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Inter', 'sans-serif'],
        manrope: ['Manrope', 'Inter', 'sans-serif'],
        vmmono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: '#0a0a0a',
        // Nova home: tokens do Figma (VM / Cor), trocam com data-tema="claro"
        vm: {
          fundo: 'rgb(var(--vm-fundo) / <alpha-value>)',
          sup: 'rgb(var(--vm-sup) / <alpha-value>)',
          sup2: 'rgb(var(--vm-sup2) / <alpha-value>)',
          borda: 'rgb(var(--vm-borda) / <alpha-value>)',
          texto: 'rgb(var(--vm-texto) / <alpha-value>)',
          suave: 'rgb(var(--vm-suave) / <alpha-value>)',
          apagado: 'rgb(var(--vm-apagado) / <alpha-value>)',
          verm: 'rgb(var(--vm-verm) / <alpha-value>)',
          vermt: 'rgb(var(--vm-vermt) / <alpha-value>)',
          verms: 'rgb(var(--vm-verms) / <alpha-value>)',
          verde: 'rgb(var(--vm-verde) / <alpha-value>)',
        },
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'rocket-bg': 'linear-gradient(to bottom right, #450a0a, #0a0a0a)',
      },
    },
  },
  plugins: [],
}
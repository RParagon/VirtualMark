# old_site

Código do site anterior, guardado aqui para organizar o site novo (`src/components/nova` e `src/pages`).

- Continua no ar o que ainda tem rota: landing pages de imobiliárias e e-commerce, quizzes, simulador, blog, páginas de serviço, contato, portfólio, política de privacidade e as páginas antigas de case (`/cases/:slug` com slug que não é dos cases novos).
- Fica só como arquivo (sem rota): a home antiga (`pages/HomeLegacy.tsx`, `components/home`) e a lista antiga de cases (`pages/CasesPage.tsx`).
- O painel admin **não** está aqui: ele faz parte do site novo e mora em `src/admin` e `src/pages/AdminPage.tsx`.
- `src/contexts`, `src/lib` e `src/types` são compartilhados (Supabase, leads, atribuição) e ficaram no lugar.

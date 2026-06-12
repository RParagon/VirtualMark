-- =============================================================
-- quiz_leads.vertical — distingue o vertical de origem do lead
-- ('imobiliaria' = /quiz-imoveis · 'ecommerce' = /quiz-ecommerce).
-- Rodar APÓS quiz_leads.sql. Leads antigos recebem 'imobiliaria'
-- via default, que também cobre o insert do quiz imobiliário
-- (que não envia o campo).
-- =============================================================

alter table public.quiz_leads
  add column if not exists vertical text not null default 'imobiliaria'
  check (vertical in ('imobiliaria', 'ecommerce'));

create index if not exists quiz_leads_vertical_idx on public.quiz_leads(vertical);

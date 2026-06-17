-- =============================================================
-- leads.atribuição — passa a guardar origem do lead do formulário de contato.
-- Antes a tabela `leads` não armazenava nenhuma atribuição. Agora espelha o
-- que o quiz_leads já tem (UTMs, referrer, landing_page) + os ids do
-- Traffic Source Analytics (cookies _ts_vid / _ts_sid), permitindo cruzar
-- cada lead com o visitante/sessão no painel do Traffic Source.
-- Rodar APÓS leads.sql. Idempotente.
-- =============================================================

alter table public.leads
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists referrer text,
  add column if not exists landing_page text,
  add column if not exists ts_visitor_id text,
  add column if not exists ts_session_id text;

create index if not exists leads_ts_visitor_idx on public.leads(ts_visitor_id);
create index if not exists leads_utm_source_idx on public.leads(utm_source);

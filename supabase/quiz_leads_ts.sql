-- =============================================================
-- quiz_leads.ts_* — ids do Traffic Source Analytics (cookies _ts_vid / _ts_sid)
-- gravados junto ao lead do quiz, permitindo cruzar cada lead com o
-- visitante/sessão no painel do Traffic Source.
-- Rodar APÓS quiz_leads.sql. Idempotente.
-- =============================================================

alter table public.quiz_leads
  add column if not exists ts_visitor_id text,
  add column if not exists ts_session_id text;

create index if not exists quiz_leads_ts_visitor_idx on public.quiz_leads(ts_visitor_id);

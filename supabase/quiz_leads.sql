-- =============================================================
-- quiz_leads — leads gerados pelo Quiz Diagnóstico por ICP (/quiz-imoveis)
-- Tabela separada da `leads` (form de contato) porque o shape é diferente:
-- guarda ICP, scores, trilha de respostas e atribuição. O painel admin
-- pode exibir as duas fontes lado a lado (feito numa etapa posterior).
-- =============================================================

create table if not exists public.quiz_leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- contato
  name text not null,
  email text not null,
  phone text not null,

  -- resultado do diagnóstico
  icp text not null check (icp in ('icp1','icp2','icp3','icp4','icp5','icp6')),
  icp_name text not null,                              -- nome do perfil exibido ao lead
  branch text check (branch in ('A','B','C')),         -- ramo de maturidade (A=inicial, B=parcial, C=avançado)
  adherence integer,                                   -- aderência % ao ICP vencedor (62–96)
  scores jsonb not null default '{}'::jsonb,            -- { icp1: n, ..., icp6: n }
  answers jsonb not null default '[]'::jsonb,           -- trilha completa [{ q, opt, weights }]
  open_answer text,                                    -- a dor escrita pelo lead (vai pro script do closer)

  -- atribuição / tracking
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  landing_page text,

  -- ciclo de vida comercial (espelha public.leads)
  status text default 'new' check (status in ('new','contacted','qualified','converted','closed')) not null,
  assigned_to text,                                    -- closer roteado por ICP (José/Vitor/Yan/Rafael)
  notes text,
  contacted_at timestamp with time zone
);

-- Row Level Security: insert público (o quiz roda anônimo), leitura/edição só autenticado
alter table public.quiz_leads enable row level security;

create policy "Quiz leads can be inserted by anyone"
  on public.quiz_leads for insert
  with check (true);

create policy "Quiz leads are viewable by authenticated users only"
  on public.quiz_leads for select
  using (auth.role() = 'authenticated');

create policy "Quiz leads can be updated by authenticated users only"
  on public.quiz_leads for update
  using (auth.role() = 'authenticated');

create policy "Quiz leads can be deleted by authenticated users only"
  on public.quiz_leads for delete
  using (auth.role() = 'authenticated');

-- Índices
create index if not exists quiz_leads_created_at_idx on public.quiz_leads(created_at desc);
create index if not exists quiz_leads_status_idx on public.quiz_leads(status);
create index if not exists quiz_leads_icp_idx on public.quiz_leads(icp);
create index if not exists quiz_leads_email_idx on public.quiz_leads(email);

-- Roteamento sugerido por ICP (referência — automação fica em etapa posterior):
--   icp1 → José   (24–48h)  icp2 → Vitor (<2h)   icp3 → Yan (<30min)
--   icp4 → Yan    (<30min)  icp5 → José  (<1h)   icp6 → Rafael/José (<2h)

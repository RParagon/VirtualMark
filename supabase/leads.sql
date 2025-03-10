-- Create the leads table to store contact form submissions
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text not null,
  email text not null,
  instagram text,
  business_category text not null,
  monthly_revenue text not null,
  status text default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'closed')) not null,
  notes text,
  contacted_at timestamp with time zone
);

-- Set up Row Level Security (RLS)
alter table public.leads enable row level security;

-- Create policies
create policy "Leads can be inserted by anyone"
  on public.leads for insert
  with check (true);

create policy "Leads are viewable by authenticated users only"
  on public.leads for select
  using (auth.role() = 'authenticated');

create policy "Leads can be updated by authenticated users only"
  on public.leads for update
  using (auth.role() = 'authenticated');

create policy "Leads can be deleted by authenticated users only"
  on public.leads for delete
  using (auth.role() = 'authenticated');

-- Create indexes for better performance
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_name_idx on public.leads(name);
create index if not exists leads_email_idx on public.leads(email);
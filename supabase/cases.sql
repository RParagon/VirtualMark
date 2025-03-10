-- Create the cases table
create table if not exists public.cases (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text not null unique,
  description text not null,
  challenge text not null,
  solution text not null,
  results text not null,
  client_name text not null,
  client_industry text not null,
  client_size text not null,
  client_testimonial text,
  client_role text,
  duration text not null,
  image_url text not null,
  featured boolean default false not null,
  tools jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  gallery jsonb default '[]'::jsonb,
  status text not null default 'draft'
);

-- Set up Row Level Security (RLS)
alter table public.cases enable row level security;

-- Create policies
create policy "Public cases are viewable by everyone"
  on public.cases for select
  using (true);

create policy "Authenticated users can view all cases"
  on public.cases for select
  using (auth.role() = 'authenticated');

create policy "Cases can be inserted by authenticated users"
  on public.cases for insert
  with check (auth.role() = 'authenticated');

create policy "Cases can be updated by authenticated users"
  on public.cases for update
  using (auth.role() = 'authenticated');

create policy "Cases can be deleted by authenticated users"
  on public.cases for delete
  using (auth.role() = 'authenticated');

-- Create indexes for better performance
create index if not exists cases_created_at_idx on public.cases(created_at desc);
create index if not exists cases_featured_idx on public.cases(featured);
create index if not exists cases_status_idx on public.cases(status);
create index if not exists cases_slug_idx on public.cases(slug);
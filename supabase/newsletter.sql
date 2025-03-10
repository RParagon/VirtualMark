-- Create the newsletter_subscriptions table
create table if not exists public.newsletter_subscriptions (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'active' check (status in ('active', 'unsubscribed')) not null
);

-- Set up Row Level Security (RLS)
alter table public.newsletter_subscriptions enable row level security;

-- Create policies
create policy "Newsletter subscriptions can be inserted by anyone"
  on public.newsletter_subscriptions for insert
  with check (true);

create policy "Newsletter subscriptions are viewable by authenticated users only"
  on public.newsletter_subscriptions for select
  using (auth.role() = 'authenticated');

create policy "Newsletter subscriptions can be updated by authenticated users only"
  on public.newsletter_subscriptions for update
  using (auth.role() = 'authenticated');

-- Create index for better performance
create index if not exists newsletter_subscriptions_email_idx on public.newsletter_subscriptions(email);
create index if not exists newsletter_subscriptions_created_at_idx on public.newsletter_subscriptions(created_at desc);
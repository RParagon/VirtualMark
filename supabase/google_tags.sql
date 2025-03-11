-- Create the google_tags table to store Google Ads/Tag Manager configurations
create table if not exists public.google_tags (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  tag_type text not null check (tag_type in ('google_ads', 'tag_manager', 'other')),
  tag_code text not null,
  is_active boolean default true not null,
  target_elements text[] not null default '{}',
  description text,
  trigger_event text not null default 'click' check (trigger_event in ('click', 'pageview', 'custom'))
);

-- Add function to automatically update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add trigger to automatically update the updated_at column
create trigger update_google_tags_updated_at
before update on public.google_tags
for each row
execute function update_updated_at_column();

-- Set up Row Level Security (RLS)
alter table public.google_tags enable row level security;

-- Create policies
create policy "Google tags are viewable by everyone"
  on public.google_tags for select
  using (true);

create policy "Google tags can be inserted by authenticated users"
  on public.google_tags for insert
  with check (auth.role() = 'authenticated');

create policy "Google tags can be updated by authenticated users"
  on public.google_tags for update
  using (auth.role() = 'authenticated');

create policy "Google tags can be deleted by authenticated users"
  on public.google_tags for delete
  using (auth.role() = 'authenticated');

-- Create indexes for better performance
create index if not exists google_tags_created_at_idx on public.google_tags(created_at desc);
create index if not exists google_tags_is_active_idx on public.google_tags(is_active);
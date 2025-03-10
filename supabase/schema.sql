-- Create the posts table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  author text not null,
  date text not null,
  read_time text not null,
  image_url text not null,
  featured boolean default false not null,
  status text not null default 'draft' check (status in ('draft', 'published'))
);

-- Set up Row Level Security (RLS)
alter table public.posts enable row level security;

-- Create policies
create policy "Public posts are viewable by everyone"
  on public.posts for select
  using (true);

create policy "Posts can be inserted by authenticated users"
  on public.posts for insert
  with check (auth.role() = 'authenticated');

create policy "Posts can be updated by authenticated users"
  on public.posts for update
  using (auth.role() = 'authenticated');

create policy "Posts can be deleted by authenticated users"
  on public.posts for delete
  using (auth.role() = 'authenticated');

-- Create indexes for better performance
create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists posts_featured_idx on public.posts(featured);
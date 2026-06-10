create extension if not exists "pgcrypto";

do $$
begin
  create type transaction_type as enum ('income', 'expense');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type owner_type as enum ('business', 'personal');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type transaction_type not null,
  name text not null,
  icon text not null default 'tag',
  created_at timestamptz not null default now(),
  unique (user_id, type, name)
);

alter table public.categories
  add column if not exists icon text not null default 'tag';

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type transaction_type not null,
  owner_type owner_type not null default 'business',
  description text not null,
  category text not null default 'Geral',
  amount numeric(12, 2) not null check (amount > 0),
  transaction_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.transactions
  add column if not exists owner_type owner_type not null default 'business';

create index if not exists categories_user_type_name_idx
  on public.categories (user_id, type, name);

create index if not exists transactions_user_date_idx
  on public.transactions (user_id, transaction_date desc);

alter table public.categories enable row level security;
alter table public.transactions enable row level security;

create policy "Users can read their own categories"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "Users can insert their own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own categories"
  on public.categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

create policy "Users can read their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

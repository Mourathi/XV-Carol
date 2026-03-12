-- Execute APENAS se você já criou as tabelas antes (migração)

-- Adicionar coluna reserved_phone na tabela gifts
alter table gifts add column if not exists reserved_phone text;

-- Criar tabela rsvps (se não existir)
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  confirmed_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table rsvps enable row level security;

drop policy if exists "public insert" on rsvps;
create policy "public insert" on rsvps for insert with check (true);

drop policy if exists "public read" on rsvps;
create policy "public read" on rsvps for select using (true);

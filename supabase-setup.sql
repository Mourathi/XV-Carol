-- Execute este SQL no Supabase (SQL Editor) para criar as tabelas e políticas

-- Tabela de presentes
create table gifts (
  id uuid primary key default gen_random_uuid(),
  emoji text not null,
  name text not null,
  reserved boolean default false,
  reserved_by text,
  reserved_phone text,
  reserved_at timestamptz,
  created_at timestamptz default now()
);

-- RLS
alter table gifts enable row level security;

create policy "public read" on gifts for select using (true);
create policy "reserve once" on gifts for update using (reserved = false);

alter publication supabase_realtime add table gifts;

-- Tabela de confirmações de presença (RSVP)
create table rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  confirmed_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table rsvps enable row level security;

-- Qualquer um pode inserir (confirmar presença)
create policy "public insert" on rsvps for insert with check (true);

-- Só leitura para listar (se precisar no futuro) - ou remover select se não quiser expor
create policy "public read" on rsvps for select using (true);

-- Exemplo de inserção de presentes (opcional)
-- insert into gifts (emoji, name) values
--   ('🛍️', 'Vale-compras'),
--   ('💄', 'Kit maquiagem'),
--   ('📚', 'Livros'),
--   ('🎧', 'Fone de ouvido');

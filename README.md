# Caroline Moura | Quinze Anos

Site de convite de aniversário de 15 anos.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Supabase (banco de dados e realtime)
- Deploy: Netlify

## Configuração

### 1. Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

- `VITE_SUPABASE_URL` — URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` — Chave anônima (sb_publishable_...)

### 2. Supabase

Execute o SQL em `supabase-setup.sql` no **SQL Editor** do Supabase para criar as tabelas `gifts` e `rsvps` e as políticas RLS.

Se já tiver as tabelas criadas antes, execute `supabase-migration.sql` para adicionar a coluna `reserved_phone` e a tabela `rsvps`.

Depois, insira os presentes na tabela ou use a interface do Supabase.

### 3. Logo

Coloque o arquivo `logo-caroline.png` na pasta `public/`. Se não existir, será usado o placeholder SVG.

### 4. Dados do evento

Atualize em `src/components/Hero.tsx` e `src/components/EventDetails.tsx`:

- Data do evento
- Horário
- Local
- Traje

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy (Netlify)

1. Conecte o repositório ao Netlify
2. Configure as variáveis de ambiente no painel: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Build command: `npm run build`
4. Publish directory: `dist`

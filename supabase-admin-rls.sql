-- Políticas RLS para o painel admin ler os dados
-- Execute no SQL Editor do Supabase se o admin não carregar (erro de permissão)

-- Permite leitura de rsvps (lista de presença)
CREATE POLICY "rsvps_select" ON rsvps FOR SELECT USING (true);

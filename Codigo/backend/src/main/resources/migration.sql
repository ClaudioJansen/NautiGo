-- Adicionar coluna numero_pessoas na tabela viagens
ALTER TABLE viagens ADD COLUMN IF NOT EXISTS numero_pessoas INTEGER NOT NULL DEFAULT 1;

-- Atualizar registros existentes para ter pelo menos 1 pessoa
UPDATE viagens SET numero_pessoas = 1 WHERE numero_pessoas IS NULL;


-- Script para criar usuário administrador inicial
-- Execute este script após criar o banco de dados
-- A senha padrão é "admin123" (hash BCrypt)

-- NOTA: Este script será executado automaticamente pelo Spring Boot se spring.jpa.hibernate.ddl-auto=create ou create-drop
-- Para produção, use uma migração adequada (Flyway/Liquibase) ou execute manualmente

-- Exemplo de inserção manual (ajuste o hash da senha conforme necessário):
-- INSERT INTO usuarios (email, senha, nome, telefone, is_admin, ativo, data_criacao, data_atualizacao)
-- VALUES ('admin@nautigo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador', '00000000000', true, true, NOW(), NOW());
-- A senha acima é o hash de "admin123"


package com.nautigo.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(1)
@RequiredArgsConstructor
public class DatabaseMigration {
    
    private final JdbcTemplate jdbcTemplate;
    
    @PostConstruct
    public void migrate() {
        try {
            // Adicionar coluna numero_pessoas se não existir
            jdbcTemplate.execute(
                "DO $$ " +
                "BEGIN " +
                "  IF NOT EXISTS (SELECT 1 FROM information_schema.columns " +
                "                 WHERE table_name='viagens' AND column_name='numero_pessoas') THEN " +
                "    ALTER TABLE viagens ADD COLUMN numero_pessoas INTEGER NOT NULL DEFAULT 1; " +
                "  END IF; " +
                "END $$;"
            );
            System.out.println("Migração do banco de dados concluída: coluna numero_pessoas adicionada/verificada");

            // Criar tabela viagens_recusadas se não existir
            jdbcTemplate.execute(
                "DO $$ " +
                "BEGIN " +
                "  IF NOT EXISTS (SELECT 1 FROM information_schema.tables " +
                "                 WHERE table_name = 'viagens_recusadas') THEN " +
                "    CREATE TABLE viagens_recusadas (" +
                "      id SERIAL PRIMARY KEY, " +
                "      viagem_id BIGINT NOT NULL, " +
                "      marinheiro_id BIGINT NOT NULL, " +
                "      data_recusa TIMESTAMP NOT NULL DEFAULT NOW(), " +
                "      CONSTRAINT uk_viagens_recusadas_viagem_marinheiro UNIQUE (viagem_id, marinheiro_id), " +
                "      CONSTRAINT fk_viagens_recusadas_viagem FOREIGN KEY (viagem_id) REFERENCES viagens(id), " +
                "      CONSTRAINT fk_viagens_recusadas_marinheiro FOREIGN KEY (marinheiro_id) REFERENCES marinheiros(id)" +
                "    ); " +
                "  END IF; " +
                "END $$;"
            );
            System.out.println("Migração do banco de dados concluída: tabela viagens_recusadas criada/verificada");
        } catch (Exception e) {
            System.err.println("Erro ao executar migração: " + e.getMessage());
            // Não lançar exceção para não impedir a inicialização
        }
    }
}


package com.nautigo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "marinheiros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Marinheiro {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;
    
    @Column(nullable = false)
    private String numeroDocumentoMarinha;
    
    @Column(nullable = false)
    private String tipoEmbarcacao;
    
    @Column(nullable = false)
    private String nomeEmbarcacao;
    
    @Column(nullable = false)
    private String numeroRegistroEmbarcacao;
    
    @Column(nullable = false)
    private Integer capacidadePassageiros;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusAprovacao statusAprovacao = StatusAprovacao.PENDENTE;
    
    @Column(columnDefinition = "TEXT")
    private String observacoes;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;
    
    private LocalDateTime dataAtualizacao;
    
    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
    
    public enum StatusAprovacao {
        PENDENTE,
        APROVADO,
        REJEITADO
    }
}


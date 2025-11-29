package com.nautigo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "viagens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Viagem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "passageiro_id", nullable = false)
    private Passageiro passageiro;
    
    @ManyToOne
    @JoinColumn(name = "marinheiro_id")
    private Marinheiro marinheiro;
    
    @Column(nullable = false)
    private String origem;
    
    @Column(nullable = false)
    private String destino;
    
    @Column(columnDefinition = "TEXT")
    private String observacoes;
    
    @Column(nullable = false)
    private LocalDateTime dataHoraSolicitada;
    
    private LocalDateTime dataHoraAgendada;
    
    private LocalDateTime dataHoraIniciada;
    
    private LocalDateTime dataHoraConcluida;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusViagem status = StatusViagem.PENDENTE;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MetodoPagamento metodoPagamento;
    
    @Column(nullable = false)
    private Integer numeroPessoas = 1;
    
    // Valor final acordado para a viagem
    @Column(precision = 10, scale = 2)
    private BigDecimal valor;

    // Valor inicialmente proposto pelo passageiro ao solicitar a viagem
    @Column(name = "valor_proposto_passageiro", precision = 10, scale = 2)
    private BigDecimal valorPropostoPassageiro;

    // Valor de contra-proposta feito pelo marinheiro, aguardando resposta do passageiro
    @Column(name = "valor_contra_proposta_marinheiro", precision = 10, scale = 2)
    private BigDecimal valorContraPropostaMarinheiro;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;
    
    private LocalDateTime dataAtualizacao;
    
    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
        if (dataHoraSolicitada == null) {
            dataHoraSolicitada = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
    
    public enum StatusViagem {
        PENDENTE,                           // Aguardando interesse de um marinheiro
        AGUARDANDO_APROVACAO_PASSAGEIRO,    // Marinheiro enviou contra-proposta, aguardando resposta do passageiro
        ACEITA,                             // Aceita, aguardando início
        EM_ANDAMENTO,                       // Viagem em andamento
        CONCLUIDA,                          // Viagem concluída
        CANCELADA                           // Viagem cancelada
    }
    
    public enum MetodoPagamento {
        DINHEIRO,
        PIX
    }
}


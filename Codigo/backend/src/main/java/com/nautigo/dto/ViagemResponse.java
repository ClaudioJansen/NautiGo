package com.nautigo.dto;

import com.nautigo.entity.Viagem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViagemResponse {
    private Long id;
    private Long passageiroId;
    private String passageiroNome;
    private Long marinheiroId;
    private String marinheiroNome;
    private String origem;
    private String destino;
    private String observacoes;
    private LocalDateTime dataHoraSolicitada;
    private LocalDateTime dataHoraAgendada;
    private LocalDateTime dataHoraIniciada;
    private LocalDateTime dataHoraConcluida;
    private Viagem.StatusViagem status;
    private Viagem.MetodoPagamento metodoPagamento;
    private Integer numeroPessoas;
    private String nomeBarco;
    private Double notaMediaMarinheiro;
    private Double notaMediaPassageiro;
    // Valor final acordado
    private BigDecimal valor;
    // Valor inicialmente proposto pelo passageiro
    private BigDecimal valorPropostoPassageiro;
    // Valor de contra-proposta feito pelo marinheiro (quando status = AGUARDANDO_APROVACAO_PASSAGEIRO)
    private BigDecimal valorContraPropostaMarinheiro;
    private LocalDateTime dataCriacao;
}


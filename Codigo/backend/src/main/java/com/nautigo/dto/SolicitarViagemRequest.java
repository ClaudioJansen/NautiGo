package com.nautigo.dto;

import com.nautigo.entity.Viagem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SolicitarViagemRequest {
    @NotBlank(message = "Origem é obrigatória")
    private String origem;
    
    @NotBlank(message = "Destino é obrigatório")
    private String destino;
    
    private String observacoes;
    
    private LocalDateTime dataHoraAgendada;
    
    @NotNull(message = "Método de pagamento é obrigatório")
    private Viagem.MetodoPagamento metodoPagamento;
    
    @NotNull(message = "Número de pessoas é obrigatório")
    private Integer numeroPessoas;

    @NotNull(message = "Valor proposto é obrigatório")
    private BigDecimal valorPropostoPassageiro;
}


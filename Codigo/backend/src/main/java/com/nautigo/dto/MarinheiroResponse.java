package com.nautigo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarinheiroResponse {
    private Long id;
    private Long usuarioId;
    private String nome;
    private String email;
    private String telefone;
    private String numeroDocumentoMarinha;
    private String tipoEmbarcacao;
    private String nomeEmbarcacao;
    private String numeroRegistroEmbarcacao;
    private Integer capacidadePassageiros;
    private String statusAprovacao;
    private String observacoes;
    private LocalDateTime dataCriacao;
}


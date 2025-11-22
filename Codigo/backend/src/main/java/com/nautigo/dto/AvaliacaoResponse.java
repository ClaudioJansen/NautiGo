package com.nautigo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoResponse {
    private Long id;
    private Long viagemId;
    private String avaliadorNome;
    private String avaliadoNome;
    private Integer nota;
    private String comentario;
    private LocalDateTime dataCriacao;
}


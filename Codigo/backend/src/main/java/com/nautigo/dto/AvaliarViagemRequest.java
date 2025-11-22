package com.nautigo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AvaliarViagemRequest {
    @NotNull(message = "Nota é obrigatória")
    @Min(value = 0, message = "Nota deve ser entre 0 e 5")
    @Max(value = 5, message = "Nota deve ser entre 0 e 5")
    private Integer nota;
    
    private String comentario;
}


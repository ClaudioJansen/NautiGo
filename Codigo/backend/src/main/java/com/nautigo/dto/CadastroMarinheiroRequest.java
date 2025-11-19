package com.nautigo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CadastroMarinheiroRequest {
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
    
    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;
    
    @NotBlank(message = "Número do documento da marinha é obrigatório")
    private String numeroDocumentoMarinha;
    
    @NotBlank(message = "Tipo de embarcação é obrigatório")
    private String tipoEmbarcacao;
    
    @NotBlank(message = "Nome da embarcação é obrigatório")
    private String nomeEmbarcacao;
    
    @NotBlank(message = "Número de registro da embarcação é obrigatório")
    private String numeroRegistroEmbarcacao;
    
    @NotNull(message = "Capacidade de passageiros é obrigatória")
    @Positive(message = "Capacidade deve ser um número positivo")
    private Integer capacidadePassageiros;
}


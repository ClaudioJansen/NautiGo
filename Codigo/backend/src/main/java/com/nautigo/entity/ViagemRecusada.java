package com.nautigo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "viagens_recusadas",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"viagem_id", "marinheiro_id"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViagemRecusada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "viagem_id", nullable = false)
    private Viagem viagem;

    @ManyToOne(optional = false)
    @JoinColumn(name = "marinheiro_id", nullable = false)
    private Marinheiro marinheiro;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataRecusa;

    @PrePersist
    protected void onCreate() {
        if (dataRecusa == null) {
            dataRecusa = LocalDateTime.now();
        }
    }
}



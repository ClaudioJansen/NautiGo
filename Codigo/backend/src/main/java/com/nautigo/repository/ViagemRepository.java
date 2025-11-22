package com.nautigo.repository;

import com.nautigo.entity.Marinheiro;
import com.nautigo.entity.Passageiro;
import com.nautigo.entity.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViagemRepository extends JpaRepository<Viagem, Long> {
    List<Viagem> findByPassageiroOrderByDataCriacaoDesc(Passageiro passageiro);
    List<Viagem> findByMarinheiroOrderByDataCriacaoDesc(Marinheiro marinheiro);
    List<Viagem> findByStatusOrderByDataCriacaoDesc(Viagem.StatusViagem status);
    List<Viagem> findByStatusAndMarinheiroIsNullOrderByDataCriacaoDesc(Viagem.StatusViagem status);
}


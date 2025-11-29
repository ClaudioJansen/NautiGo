package com.nautigo.repository;

import com.nautigo.entity.Marinheiro;
import com.nautigo.entity.Passageiro;
import com.nautigo.entity.Viagem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViagemRepository extends JpaRepository<Viagem, Long> {
    List<Viagem> findByPassageiroOrderByDataCriacaoDesc(Passageiro passageiro);
    List<Viagem> findByMarinheiroOrderByDataCriacaoDesc(Marinheiro marinheiro);
    List<Viagem> findByStatusOrderByDataCriacaoDesc(Viagem.StatusViagem status);
    List<Viagem> findByStatusAndMarinheiroIsNullOrderByDataCriacaoDesc(Viagem.StatusViagem status);
    List<Viagem> findByStatusAndMarinheiroIsNullAndIdNotInOrderByDataCriacaoDesc(Viagem.StatusViagem status, List<Long> ids);
    List<Viagem> findByPassageiroAndStatusInAndDataHoraAgendadaIsNull(Passageiro passageiro, List<Viagem.StatusViagem> statuses);
    List<Viagem> findByPassageiroAndStatusNotOrderByDataCriacaoDesc(Passageiro passageiro, Viagem.StatusViagem status);
    List<Viagem> findByMarinheiroAndStatusNotOrderByDataCriacaoDesc(Marinheiro marinheiro, Viagem.StatusViagem status);
    
    // Métodos paginados
    Page<Viagem> findByPassageiroAndStatusNotOrderByDataCriacaoDesc(Passageiro passageiro, Viagem.StatusViagem status, Pageable pageable);
    Page<Viagem> findByMarinheiroAndStatusNotOrderByDataCriacaoDesc(Marinheiro marinheiro, Viagem.StatusViagem status, Pageable pageable);
}


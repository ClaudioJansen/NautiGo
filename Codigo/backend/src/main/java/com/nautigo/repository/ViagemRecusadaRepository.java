package com.nautigo.repository;

import com.nautigo.entity.ViagemRecusada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViagemRecusadaRepository extends JpaRepository<ViagemRecusada, Long> {

    @Query("select r.viagem.id from ViagemRecusada r where r.marinheiro.id = :marinheiroId")
    List<Long> findViagemIdsByMarinheiroId(@Param("marinheiroId") Long marinheiroId);

    boolean existsByViagem_IdAndMarinheiro_Id(Long viagemId, Long marinheiroId);
}



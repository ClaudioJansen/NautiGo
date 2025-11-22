package com.nautigo.repository;

import com.nautigo.entity.Avaliacao;
import com.nautigo.entity.Usuario;
import com.nautigo.entity.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    
    List<Avaliacao> findByAvaliado(Usuario avaliado);
    
    Optional<Avaliacao> findByViagemAndAvaliador(Viagem viagem, Usuario avaliador);
    
    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.avaliado = :usuario")
    Double calcularMediaAvaliacoes(@Param("usuario") Usuario usuario);
    
    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.avaliado = :usuario")
    Long contarAvaliacoes(@Param("usuario") Usuario usuario);
}


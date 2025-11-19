package com.nautigo.repository;

import com.nautigo.entity.Marinheiro;
import com.nautigo.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarinheiroRepository extends JpaRepository<Marinheiro, Long> {
    Optional<Marinheiro> findByUsuario(Usuario usuario);
    boolean existsByUsuario(Usuario usuario);
    List<Marinheiro> findByStatusAprovacao(Marinheiro.StatusAprovacao status);
}


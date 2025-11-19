package com.nautigo.repository;

import com.nautigo.entity.Passageiro;
import com.nautigo.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PassageiroRepository extends JpaRepository<Passageiro, Long> {
    Optional<Passageiro> findByUsuario(Usuario usuario);
    boolean existsByUsuario(Usuario usuario);
}


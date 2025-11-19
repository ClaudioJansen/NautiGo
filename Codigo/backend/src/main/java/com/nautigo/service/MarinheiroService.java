package com.nautigo.service;

import com.nautigo.dto.MarinheiroResponse;
import com.nautigo.entity.Marinheiro;
import com.nautigo.repository.MarinheiroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarinheiroService {
    
    private final MarinheiroRepository marinheiroRepository;
    
    public List<MarinheiroResponse> listarPendentes() {
        return marinheiroRepository.findByStatusAprovacao(Marinheiro.StatusAprovacao.PENDENTE)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void aprovar(Long id) {
        Marinheiro marinheiro = marinheiroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marinheiro não encontrado"));
        marinheiro.setStatusAprovacao(Marinheiro.StatusAprovacao.APROVADO);
        marinheiroRepository.save(marinheiro);
    }
    
    @Transactional
    public void rejeitar(Long id, String motivo) {
        Marinheiro marinheiro = marinheiroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marinheiro não encontrado"));
        marinheiro.setStatusAprovacao(Marinheiro.StatusAprovacao.REJEITADO);
        marinheiro.setObservacoes(motivo);
        marinheiroRepository.save(marinheiro);
    }
    
    public MarinheiroResponse buscarPorId(Long id) {
        Marinheiro marinheiro = marinheiroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marinheiro não encontrado"));
        return toResponse(marinheiro);
    }
    
    private MarinheiroResponse toResponse(Marinheiro marinheiro) {
        return new MarinheiroResponse(
                marinheiro.getId(),
                marinheiro.getUsuario().getId(),
                marinheiro.getUsuario().getNome(),
                marinheiro.getUsuario().getEmail(),
                marinheiro.getUsuario().getTelefone(),
                marinheiro.getNumeroDocumentoMarinha(),
                marinheiro.getTipoEmbarcacao(),
                marinheiro.getNomeEmbarcacao(),
                marinheiro.getNumeroRegistroEmbarcacao(),
                marinheiro.getCapacidadePassageiros(),
                marinheiro.getStatusAprovacao().toString(),
                marinheiro.getObservacoes(),
                marinheiro.getDataCriacao()
        );
    }
}


package com.nautigo.service;

import com.nautigo.dto.AvaliarViagemRequest;
import com.nautigo.dto.AvaliacaoResponse;
import com.nautigo.entity.Avaliacao;
import com.nautigo.entity.Marinheiro;
import com.nautigo.entity.Passageiro;
import com.nautigo.entity.Usuario;
import com.nautigo.entity.Viagem;
import com.nautigo.repository.AvaliacaoRepository;
import com.nautigo.repository.MarinheiroRepository;
import com.nautigo.repository.PassageiroRepository;
import com.nautigo.repository.UsuarioRepository;
import com.nautigo.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {
    
    private final AvaliacaoRepository avaliacaoRepository;
    private final ViagemRepository viagemRepository;
    private final UsuarioRepository usuarioRepository;
    private final PassageiroRepository passageiroRepository;
    private final MarinheiroRepository marinheiroRepository;
    
    @Transactional
    public AvaliacaoResponse avaliarViagem(Long viagemId, Long avaliadorId, AvaliarViagemRequest request) {
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
        
        if (viagem.getStatus() != Viagem.StatusViagem.CONCLUIDA) {
            throw new RuntimeException("Apenas viagens concluídas podem ser avaliadas");
        }
        
        Usuario avaliador = usuarioRepository.findById(avaliadorId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verificar se o avaliador é passageiro ou marinheiro da viagem
        boolean podeAvaliar = false;
        Usuario avaliado = null;
        
        if (viagem.getPassageiro().getUsuario().getId().equals(avaliadorId)) {
            // Passageiro avaliando o marinheiro
            if (viagem.getMarinheiro() == null) {
                throw new RuntimeException("Marinheiro não encontrado na viagem");
            }
            avaliado = viagem.getMarinheiro().getUsuario();
            podeAvaliar = true;
        } else if (viagem.getMarinheiro() != null && 
                   viagem.getMarinheiro().getUsuario().getId().equals(avaliadorId)) {
            // Marinheiro avaliando o passageiro
            avaliado = viagem.getPassageiro().getUsuario();
            podeAvaliar = true;
        }
        
        if (!podeAvaliar) {
            throw new RuntimeException("Você não tem permissão para avaliar esta viagem");
        }
        
        // Verificar se já existe avaliação
        if (avaliacaoRepository.findByViagemAndAvaliador(viagem, avaliador).isPresent()) {
            throw new RuntimeException("Você já avaliou esta viagem");
        }
        
        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setViagem(viagem);
        avaliacao.setAvaliador(avaliador);
        avaliacao.setAvaliado(avaliado);
        avaliacao.setNota(request.getNota());
        avaliacao.setComentario(request.getComentario());
        
        avaliacao = avaliacaoRepository.save(avaliacao);
        
        return toResponse(avaliacao);
    }
    
    public Double obterNotaMedia(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        Long quantidadeAvaliacoes = avaliacaoRepository.contarAvaliacoes(usuario);
        
        // Se não tem avaliações, retorna 5.0 (nota inicial)
        if (quantidadeAvaliacoes == 0) {
            return 5.0;
        }
        
        Double media = avaliacaoRepository.calcularMediaAvaliacoes(usuario);
        return media != null ? media : 5.0;
    }
    
    public Long contarAvaliacoes(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        return avaliacaoRepository.contarAvaliacoes(usuario);
    }
    
    public List<AvaliacaoResponse> listarAvaliacoesDoUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        return avaliacaoRepository.findByAvaliado(usuario)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public boolean verificarSeJaAvaliou(Long viagemId, Long usuarioId) {
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        return avaliacaoRepository.findByViagemAndAvaliador(viagem, usuario).isPresent();
    }
    
    private AvaliacaoResponse toResponse(Avaliacao avaliacao) {
        return new AvaliacaoResponse(
                avaliacao.getId(),
                avaliacao.getViagem().getId(),
                avaliacao.getAvaliador().getNome(),
                avaliacao.getAvaliado().getNome(),
                avaliacao.getNota(),
                avaliacao.getComentario(),
                avaliacao.getDataCriacao()
        );
    }
}


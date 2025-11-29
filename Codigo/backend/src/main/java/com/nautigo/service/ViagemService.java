package com.nautigo.service;

import com.nautigo.dto.SolicitarViagemRequest;
import com.nautigo.dto.ViagemResponse;
import com.nautigo.entity.Marinheiro;
import com.nautigo.entity.Passageiro;
import com.nautigo.entity.Usuario;
import com.nautigo.entity.Viagem;
import com.nautigo.entity.ViagemRecusada;
import com.nautigo.repository.AvaliacaoRepository;
import com.nautigo.repository.MarinheiroRepository;
import com.nautigo.repository.PassageiroRepository;
import com.nautigo.repository.UsuarioRepository;
import com.nautigo.repository.ViagemRecusadaRepository;
import com.nautigo.repository.ViagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ViagemService {
    
    private final ViagemRepository viagemRepository;
    private final PassageiroRepository passageiroRepository;
    private final MarinheiroRepository marinheiroRepository;
    private final UsuarioRepository usuarioRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final ViagemRecusadaRepository viagemRecusadaRepository;
    
    @Transactional
    public ViagemResponse solicitarViagem(Long passageiroId, SolicitarViagemRequest request) {
        Passageiro passageiro = passageiroRepository.findById(passageiroId)
                .orElseThrow(() -> new RuntimeException("Passageiro não encontrado"));
        
        Viagem viagem = new Viagem();
        viagem.setPassageiro(passageiro);
        viagem.setOrigem(request.getOrigem());
        viagem.setDestino(request.getDestino());
        viagem.setObservacoes(request.getObservacoes());
        viagem.setDataHoraAgendada(request.getDataHoraAgendada());
        viagem.setMetodoPagamento(request.getMetodoPagamento());
        viagem.setNumeroPessoas(request.getNumeroPessoas() != null ? request.getNumeroPessoas() : 1);
        viagem.setStatus(Viagem.StatusViagem.PENDENTE);
        
        viagem = viagemRepository.save(viagem);
        
        return toResponse(viagem);
    }
    
    public List<ViagemResponse> listarViagensDoPassageiro(Long passageiroId) {
        Passageiro passageiro = passageiroRepository.findById(passageiroId)
                .orElseThrow(() -> new RuntimeException("Passageiro não encontrado"));
        
        return viagemRepository.findByPassageiroOrderByDataCriacaoDesc(passageiro)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<ViagemResponse> listarViagensDisponiveis(Long marinheiroId) {
        // Buscar viagens pendentes que ainda não foram recusadas por este marinheiro
        List<Long> recusadasIds = viagemRecusadaRepository.findViagemIdsByMarinheiroId(marinheiroId);

        List<Viagem> viagens;
        if (recusadasIds == null || recusadasIds.isEmpty()) {
            viagens = viagemRepository.findByStatusAndMarinheiroIsNullOrderByDataCriacaoDesc(Viagem.StatusViagem.PENDENTE);
        } else {
            viagens = viagemRepository.findByStatusAndMarinheiroIsNullAndIdNotInOrderByDataCriacaoDesc(
                    Viagem.StatusViagem.PENDENTE,
                    recusadasIds
            );
        }

        return viagens.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<ViagemResponse> listarViagensDoMarinheiro(Long marinheiroId) {
        Marinheiro marinheiro = marinheiroRepository.findById(marinheiroId)
                .orElseThrow(() -> new RuntimeException("Marinheiro não encontrado"));
        
        return viagemRepository.findByMarinheiroOrderByDataCriacaoDesc(marinheiro)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ViagemResponse aceitarViagem(Long viagemId, Long marinheiroId) {
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
        
        if (viagem.getStatus() != Viagem.StatusViagem.PENDENTE) {
            throw new RuntimeException("Viagem não está disponível para aceitação");
        }
        
        if (viagem.getMarinheiro() != null) {
            throw new RuntimeException("Viagem já foi aceita por outro marinheiro");
        }
        
        Marinheiro marinheiro = marinheiroRepository.findById(marinheiroId)
                .orElseThrow(() -> new RuntimeException("Marinheiro não encontrado"));
        
        if (marinheiro.getStatusAprovacao() != Marinheiro.StatusAprovacao.APROVADO) {
            throw new RuntimeException("Marinheiro não está aprovado para aceitar viagens");
        }
        
        viagem.setMarinheiro(marinheiro);
        viagem.setStatus(Viagem.StatusViagem.ACEITA);
        
        viagem = viagemRepository.save(viagem);
        
        return toResponse(viagem);
    }

    @Transactional
    public ViagemResponse recusarViagem(Long viagemId, Long marinheiroId) {
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));

        if (viagem.getStatus() != Viagem.StatusViagem.PENDENTE) {
            throw new RuntimeException("Apenas viagens pendentes podem ser recusadas");
        }

        if (viagem.getMarinheiro() != null) {
            throw new RuntimeException("Viagem já foi aceita por um marinheiro");
        }

        Marinheiro marinheiro = marinheiroRepository.findById(marinheiroId)
                .orElseThrow(() -> new RuntimeException("Marinheiro não encontrado"));

        if (marinheiro.getStatusAprovacao() != Marinheiro.StatusAprovacao.APROVADO) {
            throw new RuntimeException("Marinheiro não está aprovado para recusar viagens");
        }

        // Se já houver registro de recusa, não cria outro
        if (!viagemRecusadaRepository.existsByViagem_IdAndMarinheiro_Id(viagemId, marinheiroId)) {
            ViagemRecusada recusa = new ViagemRecusada();
            recusa.setViagem(viagem);
            recusa.setMarinheiro(marinheiro);
            viagemRecusadaRepository.save(recusa);
        }

        // A viagem continua pendente para outros marinheiros, só deixa de aparecer para este
        return toResponse(viagem);
    }
    
    @Transactional
    public ViagemResponse cancelarViagem(Long viagemId, Long usuarioId) {
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verificar se o usuário tem permissão para cancelar
        boolean podeCancelar = false;
        if (viagem.getPassageiro().getUsuario().getId().equals(usuarioId)) {
            podeCancelar = true;
        } else if (viagem.getMarinheiro() != null && viagem.getMarinheiro().getUsuario().getId().equals(usuarioId)) {
            podeCancelar = true;
        }
        
        if (!podeCancelar) {
            throw new RuntimeException("Você não tem permissão para cancelar esta viagem");
        }
        
        if (viagem.getStatus() == Viagem.StatusViagem.CONCLUIDA) {
            throw new RuntimeException("Não é possível cancelar uma viagem já concluída");
        }
        
        if (viagem.getStatus() == Viagem.StatusViagem.EM_ANDAMENTO) {
            throw new RuntimeException("Não é possível cancelar uma viagem em andamento");
        }
        
        viagem.setStatus(Viagem.StatusViagem.CANCELADA);
        viagem = viagemRepository.save(viagem);
        
        return toResponse(viagem);
    }
    
    @Transactional
    public ViagemResponse iniciarViagem(Long viagemId, Long marinheiroId) {
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
        
        if (viagem.getMarinheiro() == null || !viagem.getMarinheiro().getId().equals(marinheiroId)) {
            throw new RuntimeException("Você não tem permissão para iniciar esta viagem");
        }
        
        if (viagem.getStatus() != Viagem.StatusViagem.ACEITA) {
            throw new RuntimeException("Apenas viagens aceitas podem ser iniciadas");
        }
        
        viagem.setStatus(Viagem.StatusViagem.EM_ANDAMENTO);
        viagem.setDataHoraIniciada(java.time.LocalDateTime.now());
        viagem = viagemRepository.save(viagem);
        
        return toResponse(viagem);
    }
    
    @Transactional
    public ViagemResponse concluirViagem(Long viagemId, Long marinheiroId) {
        Viagem viagem = viagemRepository.findById(viagemId)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
        
        if (viagem.getMarinheiro() == null || !viagem.getMarinheiro().getId().equals(marinheiroId)) {
            throw new RuntimeException("Você não tem permissão para concluir esta viagem");
        }
        
        if (viagem.getStatus() != Viagem.StatusViagem.EM_ANDAMENTO) {
            throw new RuntimeException("Apenas viagens em andamento podem ser concluídas");
        }
        
        viagem.setStatus(Viagem.StatusViagem.CONCLUIDA);
        viagem.setDataHoraConcluida(java.time.LocalDateTime.now());
        viagem = viagemRepository.save(viagem);
        
        return toResponse(viagem);
    }
    
    private ViagemResponse toResponse(Viagem viagem) {
        // Calcular nota média do marinheiro (5.0 se não tiver avaliações)
        Double notaMediaMarinheiro = null;
        if (viagem.getMarinheiro() != null) {
            Long qtdAvaliacoesMarinheiro = avaliacaoRepository.contarAvaliacoes(
                    viagem.getMarinheiro().getUsuario()
            );
            if (qtdAvaliacoesMarinheiro == 0) {
                notaMediaMarinheiro = 5.0;
            } else {
                notaMediaMarinheiro = avaliacaoRepository.calcularMediaAvaliacoes(
                        viagem.getMarinheiro().getUsuario()
                );
                if (notaMediaMarinheiro == null) {
                    notaMediaMarinheiro = 5.0;
                }
            }
        }
        
        // Calcular nota média do passageiro (5.0 se não tiver avaliações)
        Long qtdAvaliacoesPassageiro = avaliacaoRepository.contarAvaliacoes(
                viagem.getPassageiro().getUsuario()
        );
        Double notaMediaPassageiro;
        if (qtdAvaliacoesPassageiro == 0) {
            notaMediaPassageiro = 5.0;
        } else {
            notaMediaPassageiro = avaliacaoRepository.calcularMediaAvaliacoes(
                    viagem.getPassageiro().getUsuario()
            );
            if (notaMediaPassageiro == null) {
                notaMediaPassageiro = 5.0;
            }
        }
        
        return new ViagemResponse(
                viagem.getId(),
                viagem.getPassageiro().getId(),
                viagem.getPassageiro().getUsuario().getNome(),
                viagem.getMarinheiro() != null ? viagem.getMarinheiro().getId() : null,
                viagem.getMarinheiro() != null ? viagem.getMarinheiro().getUsuario().getNome() : null,
                viagem.getOrigem(),
                viagem.getDestino(),
                viagem.getObservacoes(),
                viagem.getDataHoraSolicitada(),
                viagem.getDataHoraAgendada(),
                viagem.getDataHoraIniciada(),
                viagem.getDataHoraConcluida(),
                viagem.getStatus(),
                viagem.getMetodoPagamento(),
                viagem.getNumeroPessoas(),
                viagem.getMarinheiro() != null ? viagem.getMarinheiro().getNomeEmbarcacao() : null,
                notaMediaMarinheiro,
                notaMediaPassageiro,
                viagem.getValor(),
                viagem.getDataCriacao()
        );
    }
}


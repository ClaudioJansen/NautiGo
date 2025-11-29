package com.nautigo.controller;

import com.nautigo.dto.ViagemResponse;
import com.nautigo.entity.Marinheiro;
import com.nautigo.entity.Usuario;
import com.nautigo.repository.MarinheiroRepository;
import com.nautigo.repository.UsuarioRepository;
import com.nautigo.security.JwtUtil;
import com.nautigo.service.ViagemService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marinheiro")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MarinheiroController {
    
    private final ViagemService viagemService;
    private final MarinheiroRepository marinheiroRepository;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }
    
    @GetMapping("/viagens/disponiveis")
    public ResponseEntity<List<ViagemResponse>> listarViagensDisponiveis(HttpServletRequest request) {
        Long usuarioId = getUserIdFromRequest(request);
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Marinheiro marinheiro = marinheiroRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Usuário não é um marinheiro"));

        List<ViagemResponse> viagens = viagemService.listarViagensDisponiveis(marinheiro.getId());
        return ResponseEntity.ok(viagens);
    }
    
    @GetMapping("/viagens")
    public ResponseEntity<List<ViagemResponse>> listarMinhasViagens(HttpServletRequest request) {
        Long usuarioId = getUserIdFromRequest(request);
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        Marinheiro marinheiro = marinheiroRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Usuário não é um marinheiro"));
        
        List<ViagemResponse> viagens = viagemService.listarViagensDoMarinheiro(marinheiro.getId());
        return ResponseEntity.ok(viagens);
    }
    
    @PostMapping("/viagens/{id}/aceitar")
    public ResponseEntity<?> aceitarViagem(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = getUserIdFromRequest(request);
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            Marinheiro marinheiro = marinheiroRepository.findByUsuario(usuario)
                    .orElseThrow(() -> new RuntimeException("Usuário não é um marinheiro"));
            
            if (marinheiro.getStatusAprovacao() != Marinheiro.StatusAprovacao.APROVADO) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Você precisa estar aprovado para aceitar viagens"));
            }
            
            ViagemResponse viagem = viagemService.aceitarViagem(id, marinheiro.getId());
            return ResponseEntity.ok(viagem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/viagens/{id}/contra-proposta")
    public ResponseEntity<?> proporContraProposta(@PathVariable Long id, @RequestBody Map<String, Object> body, HttpServletRequest request) {
        try {
            Long usuarioId = getUserIdFromRequest(request);
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            Marinheiro marinheiro = marinheiroRepository.findByUsuario(usuario)
                    .orElseThrow(() -> new RuntimeException("Usuário não é um marinheiro"));

            Object valorObj = body.get("novoValor");
            if (valorObj == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "novoValor é obrigatório"));
            }

            BigDecimal novoValor;
            try {
                novoValor = new BigDecimal(valorObj.toString());
            } catch (NumberFormatException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Valor inválido para novoValor"));
            }

            ViagemResponse viagem = viagemService.proporContraProposta(id, marinheiro.getId(), novoValor);
            return ResponseEntity.ok(viagem);
        } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/viagens/{id}/recusar")
    public ResponseEntity<?> recusarViagem(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = getUserIdFromRequest(request);
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            Marinheiro marinheiro = marinheiroRepository.findByUsuario(usuario)
                    .orElseThrow(() -> new RuntimeException("Usuário não é um marinheiro"));

            ViagemResponse viagem = viagemService.recusarViagem(id, marinheiro.getId());
            return ResponseEntity.ok(viagem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/viagens/{id}/cancelar")
    public ResponseEntity<?> cancelarViagem(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = getUserIdFromRequest(request);
            ViagemResponse viagem = viagemService.cancelarViagem(id, usuarioId);
            return ResponseEntity.ok(viagem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/viagens/{id}/iniciar")
    public ResponseEntity<?> iniciarViagem(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = getUserIdFromRequest(request);
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            Marinheiro marinheiro = marinheiroRepository.findByUsuario(usuario)
                    .orElseThrow(() -> new RuntimeException("Usuário não é um marinheiro"));
            
            ViagemResponse viagem = viagemService.iniciarViagem(id, marinheiro.getId());
            return ResponseEntity.ok(viagem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/viagens/{id}/concluir")
    public ResponseEntity<?> concluirViagem(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = getUserIdFromRequest(request);
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            Marinheiro marinheiro = marinheiroRepository.findByUsuario(usuario)
                    .orElseThrow(() -> new RuntimeException("Usuário não é um marinheiro"));
            
            ViagemResponse viagem = viagemService.concluirViagem(id, marinheiro.getId());
            return ResponseEntity.ok(viagem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}


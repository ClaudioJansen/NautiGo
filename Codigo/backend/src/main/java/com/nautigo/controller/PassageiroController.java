package com.nautigo.controller;

import com.nautigo.dto.SolicitarViagemRequest;
import com.nautigo.dto.ViagemResponse;
import com.nautigo.entity.Usuario;
import com.nautigo.repository.PassageiroRepository;
import com.nautigo.repository.UsuarioRepository;
import com.nautigo.security.JwtUtil;
import com.nautigo.service.ViagemService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/passageiro")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PassageiroController {
    
    private final ViagemService viagemService;
    private final PassageiroRepository passageiroRepository;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }
    
    @PostMapping("/viagens")
    public ResponseEntity<?> solicitarViagem(@Valid @RequestBody SolicitarViagemRequest request, HttpServletRequest httpRequest) {
        try {
            Long usuarioId = getUserIdFromRequest(httpRequest);
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            var passageiro = passageiroRepository.findByUsuario(usuario)
                    .orElseThrow(() -> new RuntimeException("Usuário não é um passageiro"));
            
            ViagemResponse viagem = viagemService.solicitarViagem(passageiro.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(viagem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/viagens")
    public ResponseEntity<List<ViagemResponse>> listarMinhasViagens(HttpServletRequest request) {
        Long usuarioId = getUserIdFromRequest(request);
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        var passageiro = passageiroRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Usuário não é um passageiro"));
        
        List<ViagemResponse> viagens = viagemService.listarViagensDoPassageiro(passageiro.getId());
        return ResponseEntity.ok(viagens);
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

    @PostMapping("/viagens/{id}/contra-proposta/responder")
    public ResponseEntity<?> responderContraProposta(@PathVariable Long id, @RequestBody Map<String, Boolean> body, HttpServletRequest request) {
        try {
            Long usuarioId = getUserIdFromRequest(request);
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            var passageiro = passageiroRepository.findByUsuario(usuario)
                    .orElseThrow(() -> new RuntimeException("Usuário não é um passageiro"));

            Boolean aceitar = body.get("aceitar");
            if (aceitar == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Campo 'aceitar' é obrigatório"));
            }

            ViagemResponse viagem = viagemService.responderContraProposta(id, passageiro.getId(), aceitar);
            return ResponseEntity.ok(viagem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}


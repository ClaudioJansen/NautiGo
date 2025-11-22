package com.nautigo.controller;

import com.nautigo.dto.AvaliarViagemRequest;
import com.nautigo.dto.AvaliacaoResponse;
import com.nautigo.repository.UsuarioRepository;
import com.nautigo.security.JwtUtil;
import com.nautigo.service.AvaliacaoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avaliacoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AvaliacaoController {
    
    private final AvaliacaoService avaliacaoService;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }
    
    @PostMapping("/viagens/{viagemId}")
    public ResponseEntity<?> avaliarViagem(
            @PathVariable Long viagemId,
            @Valid @RequestBody AvaliarViagemRequest request,
            HttpServletRequest httpRequest) {
        try {
            Long usuarioId = getUserIdFromRequest(httpRequest);
            AvaliacaoResponse response = avaliacaoService.avaliarViagem(viagemId, usuarioId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/usuario/{usuarioId}/media")
    public ResponseEntity<Map<String, Object>> obterNotaMedia(@PathVariable Long usuarioId) {
        try {
            Double media = avaliacaoService.obterNotaMedia(usuarioId);
            Long quantidade = avaliacaoService.contarAvaliacoes(usuarioId);
            return ResponseEntity.ok(Map.of(
                    "notaMedia", media,
                    "quantidadeAvaliacoes", quantidade
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<AvaliacaoResponse>> listarAvaliacoes(@PathVariable Long usuarioId) {
        try {
            List<AvaliacaoResponse> avaliacoes = avaliacaoService.listarAvaliacoesDoUsuario(usuarioId);
            return ResponseEntity.ok(avaliacoes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/viagens/{viagemId}/verificar")
    public ResponseEntity<Map<String, Boolean>> verificarAvaliacao(
            @PathVariable Long viagemId,
            HttpServletRequest httpRequest) {
        try {
            Long usuarioId = getUserIdFromRequest(httpRequest);
            boolean jaAvaliou = avaliacaoService.verificarSeJaAvaliou(viagemId, usuarioId);
            return ResponseEntity.ok(Map.of("jaAvaliou", jaAvaliou));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("jaAvaliou", false));
        }
    }
}


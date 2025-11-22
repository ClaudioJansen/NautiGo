package com.nautigo.controller;

import com.nautigo.dto.UserResponse;
import com.nautigo.entity.Marinheiro;
import com.nautigo.entity.Passageiro;
import com.nautigo.entity.Usuario;
import com.nautigo.repository.MarinheiroRepository;
import com.nautigo.repository.PassageiroRepository;
import com.nautigo.repository.UsuarioRepository;
import com.nautigo.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    private final UsuarioRepository usuarioRepository;
    private final PassageiroRepository passageiroRepository;
    private final MarinheiroRepository marinheiroRepository;
    private final JwtUtil jwtUtil;
    
    @GetMapping("/tipo")
    public ResponseEntity<?> obterTipoUsuario(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long userId = jwtUtil.extractUserId(token);
            
            Usuario usuario = usuarioRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            String tipoUsuario = "PASSAGEIRO"; // padrão
            if (usuario.getIsAdmin()) {
                tipoUsuario = "ADMIN";
            } else if (marinheiroRepository.findByUsuario(usuario).isPresent()) {
                tipoUsuario = "MARINHEIRO";
            } else if (passageiroRepository.findByUsuario(usuario).isPresent()) {
                tipoUsuario = "PASSAGEIRO";
            }
            
            return ResponseEntity.ok(Map.of("tipoUsuario", tipoUsuario));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}


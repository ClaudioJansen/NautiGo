package com.nautigo.controller;

import com.nautigo.dto.MarinheiroResponse;
import com.nautigo.service.MarinheiroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final MarinheiroService marinheiroService;
    
    @GetMapping("/marinheiros/pendentes")
    public ResponseEntity<List<MarinheiroResponse>> listarPendentes() {
        return ResponseEntity.ok(marinheiroService.listarPendentes());
    }
    
    @GetMapping("/marinheiros/{id}")
    public ResponseEntity<MarinheiroResponse> buscarMarinheiro(@PathVariable Long id) {
        return ResponseEntity.ok(marinheiroService.buscarPorId(id));
    }
    
    @PostMapping("/marinheiros/{id}/aprovar")
    public ResponseEntity<?> aprovar(@PathVariable Long id) {
        try {
            marinheiroService.aprovar(id);
            return ResponseEntity.ok(Map.of("message", "Marinheiro aprovado com sucesso"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/marinheiros/{id}/rejeitar")
    public ResponseEntity<?> rejeitar(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String motivo = request.getOrDefault("motivo", "Cadastro rejeitado pelo administrador");
            marinheiroService.rejeitar(id, motivo);
            return ResponseEntity.ok(Map.of("message", "Marinheiro rejeitado com sucesso"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}


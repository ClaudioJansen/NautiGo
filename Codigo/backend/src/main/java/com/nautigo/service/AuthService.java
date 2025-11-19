package com.nautigo.service;

import com.nautigo.dto.*;
import com.nautigo.entity.Marinheiro;
import com.nautigo.entity.Passageiro;
import com.nautigo.entity.Usuario;
import com.nautigo.repository.MarinheiroRepository;
import com.nautigo.repository.PassageiroRepository;
import com.nautigo.repository.UsuarioRepository;
import com.nautigo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UsuarioRepository usuarioRepository;
    private final PassageiroRepository passageiroRepository;
    private final MarinheiroRepository marinheiroRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));
        
        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas");
        }
        
        if (!usuario.getAtivo()) {
            throw new RuntimeException("Usuário inativo");
        }
        
        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getId(), usuario.getIsAdmin());
        
        UserResponse userResponse = new UserResponse(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNome(),
                usuario.getIsAdmin()
        );
        
        return new LoginResponse(token, userResponse);
    }
    
    @Transactional
    public UserResponse cadastrarPassageiro(CadastroPassageiroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setTelefone(request.getTelefone());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setIsAdmin(false);
        usuario.setAtivo(true);
        
        usuario = usuarioRepository.save(usuario);
        
        Passageiro passageiro = new Passageiro();
        passageiro.setUsuario(usuario);
        passageiroRepository.save(passageiro);
        
        return new UserResponse(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNome(),
                usuario.getIsAdmin()
        );
    }
    
    @Transactional
    public UserResponse cadastrarMarinheiro(CadastroMarinheiroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setTelefone(request.getTelefone());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setIsAdmin(false);
        usuario.setAtivo(true);
        
        usuario = usuarioRepository.save(usuario);
        
        Marinheiro marinheiro = new Marinheiro();
        marinheiro.setUsuario(usuario);
        marinheiro.setNumeroDocumentoMarinha(request.getNumeroDocumentoMarinha());
        marinheiro.setTipoEmbarcacao(request.getTipoEmbarcacao());
        marinheiro.setNomeEmbarcacao(request.getNomeEmbarcacao());
        marinheiro.setNumeroRegistroEmbarcacao(request.getNumeroRegistroEmbarcacao());
        marinheiro.setCapacidadePassageiros(request.getCapacidadePassageiros());
        marinheiro.setStatusAprovacao(Marinheiro.StatusAprovacao.PENDENTE);
        
        marinheiroRepository.save(marinheiro);
        
        return new UserResponse(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNome(),
                usuario.getIsAdmin()
        );
    }
}


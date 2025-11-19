package com.nautigo.config;

import com.nautigo.entity.Usuario;
import com.nautigo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Criar usuário admin se não existir
        if (!usuarioRepository.existsByEmail("admin@nautigo.com")) {
            Usuario admin = new Usuario();
            admin.setEmail("admin@nautigo.com");
            admin.setSenha(passwordEncoder.encode("admin123")); // Senha padrão - ALTERE EM PRODUÇÃO
            admin.setNome("Administrador");
            admin.setTelefone("00000000000");
            admin.setIsAdmin(true);
            admin.setAtivo(true);
            usuarioRepository.save(admin);
            System.out.println("Usuário administrador criado: admin@nautigo.com / admin123");
        }
    }
}


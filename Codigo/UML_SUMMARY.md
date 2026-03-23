# Resumo da Análise UML - NautiGo Backend

## Metadados
- **Projeto**: NautiGo Backend
- **Pacote Raiz**: com.nautigo
- **Data de Geração**: 2025-01-27

---

## Resumo por Package

### com.nautigo.entity
**Responsabilidade**: Entidades JPA que representam o modelo de domínio do sistema.

**Classes Principais**:
- **Usuario**: Entidade central que implementa `UserDetails` do Spring Security. Representa usuários do sistema (passageiros, marinheiros e administradores). Contém informações de autenticação e perfil básico.
- **Passageiro**: Representa passageiros do sistema. Relacionamento 1:1 com Usuario.
- **Marinheiro**: Representa marinheiros/prestadores de serviço. Contém informações sobre embarcação e status de aprovação. Relacionamento 1:1 com Usuario. Possui enum interno `StatusAprovacao` (PENDENTE, APROVADO, REJEITADO).
- **Viagem**: Entidade central do negócio. Representa viagens solicitadas por passageiros e aceitas por marinheiros. Possui relacionamentos ManyToOne com Passageiro e Marinheiro. Contém enums internos `StatusViagem` (6 estados) e `MetodoPagamento` (DINHEIRO, PIX). Gerencia valores propostos e contra-propostas.
- **Avaliacao**: Representa avaliações mútuas entre passageiros e marinheiros após conclusão de viagens. Relacionamentos ManyToOne com Viagem, Usuario (avaliador) e Usuario (avaliado).
- **ViagemRecusada**: Tabela de junção para rastrear viagens recusadas por marinheiros, evitando que apareçam novamente para o mesmo marinheiro.

**Características**:
- Todas as entidades usam Lombok (@Data) para geração automática de getters/setters/constructors.
- Callbacks JPA (@PrePersist, @PreUpdate) para timestamps automáticos.
- Relacionamentos JPA bem definidos com multiplicidades corretas.

---

### com.nautigo.dto
**Responsabilidade**: Objetos de Transferência de Dados (DTOs) para comunicação entre camadas e API REST.

**Classes Principais**:
- **LoginRequest/LoginResponse**: DTOs para autenticação.
- **CadastroPassageiroRequest/CadastroMarinheiroRequest**: DTOs para cadastro de usuários.
- **SolicitarViagemRequest**: DTO para solicitação de viagens.
- **ViagemResponse**: DTO completo com informações da viagem, incluindo notas médias calculadas.
- **AvaliarViagemRequest/AvaliacaoResponse**: DTOs para sistema de avaliações.
- **MarinheiroResponse**: DTO para informações de marinheiros (usado no dashboard admin).
- **UserResponse**: DTO simplificado de usuário.
- **PaginatedResponse<T>**: DTO genérico para respostas paginadas.

**Características**:
- Validações Bean Validation (@NotBlank, @Email, @NotNull, @Min, @Max, @Size).
- Uso extensivo de Lombok para reduzir boilerplate.
- DTOs separam a camada de apresentação da camada de domínio.

---

### com.nautigo.repository
**Responsabilidade**: Interfaces de acesso a dados usando Spring Data JPA.

**Interfaces Principais**:
- **UsuarioRepository**: Queries para Usuario (findByEmail, existsByEmail).
- **PassageiroRepository**: Queries para Passageiro com relacionamento com Usuario.
- **MarinheiroRepository**: Queries para Marinheiro, incluindo busca por status de aprovação.
- **ViagemRepository**: Repository mais complexo com múltiplas queries customizadas para listagem, filtragem e paginação. Inclui métodos para viagens disponíveis, viagens recusadas, e histórico paginado.
- **AvaliacaoRepository**: Queries para avaliações, incluindo cálculo de média e contagem via @Query.
- **ViagemRecusadaRepository**: Queries para rastreamento de recusas.

**Características**:
- Todas estendem `JpaRepository<T, ID>` do Spring Data JPA.
- Métodos de query derivados do nome do método.
- Queries customizadas com @Query quando necessário.
- Suporte a paginação com `Pageable` e `Page<T>`.

---

### com.nautigo.service
**Responsabilidade**: Lógica de negócio e orquestração de operações.

**Classes Principais**:
- **AuthService**: Gerencia autenticação, login e cadastro de passageiros/marinheiros. Usa PasswordEncoder para hash de senhas e JwtUtil para geração de tokens.
- **MarinheiroService**: Gerencia aprovação/rejeição de cadastros de marinheiros. Converte entidades para DTOs.
- **ViagemService**: Serviço mais complexo do sistema. Gerencia todo o ciclo de vida de viagens: solicitação, aceitação, contra-propostas, cancelamento, início e conclusão. Implementa regras de negócio como validação de viagens ativas, cálculo de notas médias, e filtragem de viagens canceladas do histórico.
- **AvaliacaoService**: Gerencia sistema de avaliações. Valida permissões, calcula médias, e verifica se usuário já avaliou.

**Características**:
- Uso de @Transactional para operações que modificam dados.
- Injeção de dependências via construtor (Lombok @RequiredArgsConstructor).
- Métodos privados para conversão Entity -> DTO (toResponse).
- Validações de regras de negócio antes de operações.

---

### com.nautigo.controller
**Responsabilidade**: Endpoints REST da API. Camada de apresentação.

**Classes Principais**:
- **AuthController**: Endpoints públicos para login e cadastro (/api/auth).
- **AdminController**: Endpoints protegidos para administração de marinheiros (/api/admin). Requer role ADMIN.
- **PassageiroController**: Endpoints para ações de passageiros (/api/passageiro): solicitar viagem, listar histórico, cancelar, responder contra-propostas.
- **MarinheiroController**: Endpoints para ações de marinheiros (/api/marinheiro): listar disponíveis, aceitar/recusar, contra-propor, iniciar/concluir viagens.
- **AvaliacaoController**: Endpoints para sistema de avaliações (/api/avaliacoes).
- **UsuarioController**: Endpoint utilitário para identificar tipo de usuário (/api/usuario/tipo).

**Características**:
- Uso de @RestController e @RequestMapping para mapeamento de rotas.
- Validação de DTOs com @Valid.
- Extração de userId do JWT via JwtUtil em métodos privados.
- Tratamento de exceções com ResponseEntity e códigos HTTP apropriados.
- CORS configurado para permitir requisições do frontend.

---

### com.nautigo.security
**Responsabilidade**: Componentes de segurança e autenticação JWT.

**Classes Principais**:
- **JwtUtil**: Utilitário para geração, validação e extração de informações de tokens JWT. Usa biblioteca io.jsonwebtoken.
- **JwtAuthenticationFilter**: Filtro Spring Security que intercepta requisições, valida tokens JWT e configura autenticação no SecurityContext.

**Características**:
- Integração com Spring Security.
- Tokens contêm userId, email e isAdmin.
- Validação de expiração de tokens.

---

### com.nautigo.config
**Responsabilidade**: Configurações do Spring Framework.

**Classes Principais**:
- **SecurityConfig**: Configuração de segurança Spring Security. Define SecurityFilterChain, CORS, e regras de autorização por rota. Integra JwtAuthenticationFilter.
- **DatabaseMigration**: Componente que executa migrações de banco de dados via @PostConstruct. Adiciona colunas e constraints quando necessário.
- **DataInitializer**: CommandLineRunner que cria usuário admin padrão na inicialização.

**Características**:
- Configuração baseada em beans (@Bean).
- Ordem de execução controlada (@Order).
- Migrações idempotentes (verificam existência antes de criar).

---

## 10 Classes Mais Importantes (por uso em domínio)

1. **Viagem** - Entidade central do negócio, gerencia todo o ciclo de vida de viagens.
2. **Usuario** - Entidade base para todos os tipos de usuários do sistema.
3. **ViagemService** - Contém a maior parte da lógica de negócio do sistema.
4. **Passageiro** - Representa um dos principais atores do sistema.
5. **Marinheiro** - Representa o outro principal ator do sistema.
6. **Avaliacao** - Sistema de avaliações é crítico para confiança na plataforma.
7. **ViagemRepository** - Repository mais complexo com múltiplas queries críticas.
8. **AuthService** - Gerencia autenticação e autorização, fundamental para segurança.
9. **ViagemResponse** - DTO mais usado, presente em múltiplos endpoints.
10. **JwtUtil** - Componente crítico para segurança e autenticação em todas as requisições.

---

## Chaves Primárias e Estrangeiras (JPA)

### Tabelas e Chaves:

**usuarios**:
- PK: id (Long, auto-increment)
- UK: email

**passageiros**:
- PK: id (Long, auto-increment)
- FK: usuario_id -> usuarios.id (OneToOne, unique)

**marinheiros**:
- PK: id (Long, auto-increment)
- FK: usuario_id -> usuarios.id (OneToOne, unique)

**viagens**:
- PK: id (Long, auto-increment)
- FK: passageiro_id -> passageiros.id (ManyToOne, NOT NULL)
- FK: marinheiro_id -> marinheiros.id (ManyToOne, nullable)

**avaliacoes**:
- PK: id (Long, auto-increment)
- FK: viagem_id -> viagens.id (ManyToOne, NOT NULL)
- FK: avaliador_id -> usuarios.id (ManyToOne, NOT NULL)
- FK: avaliado_id -> usuarios.id (ManyToOne, NOT NULL)

**viagens_recusadas**:
- PK: id (Long, auto-increment)
- FK: viagem_id -> viagens.id (ManyToOne, NOT NULL)
- FK: marinheiro_id -> marinheiros.id (ManyToOne, NOT NULL)
- UK: (viagem_id, marinheiro_id) - constraint única para evitar duplicatas

---

## Observações

- **Lombok**: Uso extensivo de Lombok (@Data, @RequiredArgsConstructor, @NoArgsConstructor, @AllArgsConstructor) reduz significativamente o código boilerplate. Todos os getters, setters, equals, hashCode, toString e constructors são gerados automaticamente.

- **Spring Data JPA**: Repositories usam Spring Data JPA, permitindo queries derivadas do nome do método e queries customizadas com @Query.

- **Spring Security**: Sistema de autenticação baseado em JWT, integrado com Spring Security. Filtro customizado valida tokens em cada requisição.

- **Transações**: Uso de @Transactional em métodos de serviço que modificam dados, garantindo consistência.

- **Validação**: Bean Validation (@Valid, @NotBlank, @Email, etc.) em DTOs para validação de entrada.

- **Paginação**: Suporte a paginação em listagens de histórico de viagens usando Spring Data Pageable.

- **Enums**: Uso de enums para status e métodos de pagamento, armazenados como STRING no banco.

---

## Arquivos Ignorados

- **NautigoApplication.java**: Classe principal Spring Boot (análise não necessária para UML de domínio).
- **Testes**: Qualquer código em `src/test/java` foi ignorado conforme instruções.
- **Scripts e arquivos gerados**: Ignorados conforme instruções.

---

## Formato de Entrega

- **JSON Estruturado**: `UML_ANALYSIS.json` - Contém todas as classes, atributos, métodos, relacionamentos e endpoints em formato JSON estruturado.
- **PlantUML**: `UML_DIAGRAM.puml` - Código PlantUML completo para geração de diagrama UML 2.0.
- **Resumo**: Este arquivo (`UML_SUMMARY.md`) - Resumo textual por package e informações adicionais.


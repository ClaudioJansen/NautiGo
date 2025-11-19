# Arquitetura do Sistema NautiGo

## Visão Geral

O NautiGo será desenvolvido como uma aplicação web full-stack com separação clara entre backend e frontend.

## Stack Tecnológica

### Backend
- **Framework**: Spring Boot 3.x (Java 17+)
- **Banco de Dados**: PostgreSQL
- **Autenticação**: Spring Security + JWT
- **ORM**: Spring Data JPA
- **API**: RESTful

### Frontend
- **Framework**: React 18+ com TypeScript
- **Roteamento**: React Router
- **Gerenciamento de Estado**: Context API / React Query
- **UI Components**: Material-UI (MUI) ou Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Arquitetura de Camadas (Backend)

```
Controller Layer (REST Controllers)
    ↓
Service Layer (Lógica de Negócio)
    ↓
Repository Layer (Acesso a Dados)
    ↓
Entity Layer (Modelos de Domínio)
    ↓
Database (PostgreSQL)
```

## Estrutura de Usuários

### Tipos de Usuário
1. **Passageiro**: Usuário que solicita viagens
2. **Marinheiro**: Prestador de serviço (requer aprovação do admin)
3. **Administrador**: Gerencia a plataforma e aprova cadastros

### Modelo de Dados Principal
- **Usuario**: Entidade base com email, senha, nome, etc.
- **Passageiro**: Extensão de Usuario com dados específicos
- **Marinheiro**: Extensão de Usuario com dados de embarcação, documentos, status de aprovação
- **Admin**: Identificado por flag `isAdmin` no Usuario

## Fluxo de Autenticação

1. Usuário faz login com email e senha
2. Sistema verifica credenciais e retorna JWT
3. Frontend armazena token e inclui em requisições
4. Backend valida token e identifica tipo de usuário
5. Redirecionamento baseado no tipo:
   - Admin → Dashboard de Administração
   - Marinheiro → Dashboard do Marinheiro
   - Passageiro → Dashboard do Passageiro

## Estrutura de Pastas

```
Codigo/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/nautigo/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   ├── dto/
│   │   │   │   ├── security/
│   │   │   │   └── config/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-dev.properties
│   │   └── test/
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── contexts/
    │   ├── types/
    │   └── utils/
    ├── public/
    └── package.json
```

## Funcionalidades por Módulo

### Módulo de Autenticação
- Login/Logout
- Registro de Passageiro
- Registro de Marinheiro (pendente aprovação)
- Recuperação de senha (futuro)

### Módulo de Administração
- Listar marinheiros pendentes de aprovação
- Aprovar/Rejeitar cadastros
- Visualizar detalhes do marinheiro e documentos

### Módulo de Passageiro
- Solicitar viagem
- Acompanhar viagem em tempo real
- Avaliar marinheiro
- Histórico de viagens
- Perfil e configurações

### Módulo de Marinheiro
- Aceitar/Recusar corridas
- Gerenciar disponibilidade
- Visualizar avaliações
- Histórico de corridas
- Perfil e configurações

## Próximos Passos

1. ✅ Criar estrutura de pastas
2. ⏳ Configurar projeto Spring Boot
3. ⏳ Configurar projeto React
4. ⏳ Implementar modelos de dados
5. ⏳ Implementar autenticação
6. ⏳ Criar telas principais


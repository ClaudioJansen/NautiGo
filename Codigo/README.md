# NautiGo - Código Fonte

Este diretório contém o código fonte do sistema NautiGo.

## Estrutura

- `backend/`: Aplicação Spring Boot (Java)
- `frontend/`: Aplicação React (TypeScript)

## Pré-requisitos

### Backend
- Java 17 ou superior
- Maven 3.6+
- PostgreSQL 12+

### Frontend
- Node.js 18+ e npm/yarn

## Como executar

### Backend

1. Configure o banco de dados PostgreSQL:
   ```sql
   CREATE DATABASE nautigo;
   ```

2. Configure as credenciais em `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   ```

3. Execute o projeto:
```bash
cd backend
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`

**Usuário Administrador Padrão:**
- Email: `admin@nautigo.com`
- Senha: `admin123`
- ⚠️ **IMPORTANTE**: Altere a senha em produção!

### Frontend

1. Instale as dependências:
```bash
cd frontend
npm install
```

2. Execute o projeto:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## Funcionalidades Implementadas

### ✅ Autenticação
- Login com email e senha
- Geração e validação de JWT
- Redirecionamento automático baseado no tipo de usuário

### ✅ Cadastro
- Cadastro de Passageiro (ativo imediatamente)
- Cadastro de Marinheiro (requer aprovação do admin)

### ✅ Administração
- Dashboard para aprovar/rejeitar cadastros de marinheiros
- Listagem de marinheiros pendentes
- Visualização de detalhes do cadastro

## Próximos Passos

- [ ] Implementar dashboard de passageiro
- [ ] Implementar dashboard de marinheiro
- [ ] Implementar solicitação de viagens
- [ ] Implementar sistema de avaliações
- [ ] Implementar sistema de pagamentos
- [ ] Implementar rastreamento GPS


# Instruções para Executar o Projeto

## Pré-requisitos

1. **PostgreSQL** instalado e rodando
2. **Java 21+** instalado
3. **Maven 3.6+** instalado
4. **Node.js 18+** e npm instalados

## Passo 1: Configurar o Banco de Dados

1. Abra o PostgreSQL (pgAdmin ou linha de comando)
2. Crie o banco de dados:
```sql
CREATE DATABASE nautigo;
```

3. Verifique as credenciais em `backend/src/main/resources/application.properties`:
   - Username padrão: `postgres`
   - Password padrão: `postgres`
   - Se suas credenciais forem diferentes, ajuste no arquivo

## Passo 2: Executar o Backend

Abra um terminal na raiz do projeto e execute:

```bash
cd Codigo/backend
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

**Primeira execução:**
- O banco de dados será criado automaticamente (tabelas)
- Um usuário admin será criado automaticamente:
  - Email: `admin@nautigo.com`
  - Senha: `admin123`

## Passo 3: Executar o Frontend

Abra OUTRO terminal na raiz do projeto e execute:

```bash
cd Codigo/frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:3000` ou `http://localhost:5173`

## Testando o Sistema

1. Acesse `http://localhost:3000` (ou a porta que o Vite mostrar)
2. Você verá a tela inicial com duas opções: "Sou Passageiro" e "Sou Marinheiro"
3. Para testar como admin:
   - Clique em "Já tenho conta" (ou acesse `/login`)
   - Faça login com: `admin@nautigo.com` / `admin123`
   - Você será redirecionado para o dashboard de administração

## Problemas Comuns

### Erro de conexão com banco de dados
- Verifique se o PostgreSQL está rodando
- Verifique se o banco `nautigo` foi criado
- Verifique as credenciais no `application.properties`

### Erro ao instalar dependências do frontend
- Execute `npm install` novamente
- Se persistir, delete a pasta `node_modules` e execute novamente

### Porta já em uso
- Backend: Altere `server.port` no `application.properties`
- Frontend: O Vite mostrará uma porta alternativa automaticamente



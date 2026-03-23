# Funcionalidades Pendentes - NautiGo

Este documento lista as funcionalidades que ainda precisam ser desenvolvidas no sistema NautiGo.

## 🔐 Autenticação e Segurança

### Crítico
- [ ] **Recuperação de senha** - Sistema de "Esqueci minha senha" com email de recuperação
- [ ] **Alteração de senha** - Permitir usuário alterar senha quando logado
- [ ] **Validação de email** - Confirmação de email após cadastro
- [ ] **Autenticação de dois fatores (2FA)** - Opcional para maior segurança

## 👤 Gerenciamento de Perfil

### Crítico
- [ ] **Upload de foto de perfil** - Para passageiros e marinheiros
- [ ] **Alteração de senha** - Quando logado

### Importante
- [ ] **Upload de documentos** - Para marinheiros (comprovantes, licenças)
- [ ] **Fotos da embarcação** - Marinheiros podem adicionar fotos do barco
- [ ] **Verificação de documentos** - Admin pode visualizar e validar documentos enviados

## 💰 Sistema de Pagamento

### Crítico
- [ ] **Integração com gateway de pagamento** - Stripe, Mercado Pago, ou similar
- [ ] **Pagamento via cartão de crédito** - Processamento real
- [ ] **Pagamento via PIX** - Integração com API de PIX
- [ ] **Cálculo automático de tarifa** - Baseado em distância, tempo, tipo de embarcação
- [ ] **Histórico de pagamentos** - Lista de transações realizadas
- [ ] **Recibos digitais** - Geração de comprovantes de pagamento

### Importante
- [ ] **Carteira digital** - Saldo na plataforma
- [ ] **Solicitar reembolso** - Para viagens canceladas
- [ ] **Dividir pagamento** - Quando há múltiplos passageiros

## 🗺️ Localização e Rastreamento

### Crítico
- [ ] **Integração com mapas** - Google Maps, OpenStreetMap, ou similar
- [ ] **Seleção de origem/destino no mapa** - Interface visual para escolher pontos
- [ ] **Cálculo de distância e tempo estimado** - Usando API de rotas
- [ ] **Rastreamento GPS em tempo real** - Localização do marinheiro durante a viagem
- [ ] **Compartilhamento de localização** - Passageiro pode compartilhar com terceiros

### Importante
- [ ] **Histórico de rotas** - Salvar rotas frequentemente usadas
- [ ] **Pontos de referência** - Marcar pontos importantes (portos, marinas)
- [ ] **Geofencing** - Alertas quando chegar próximo ao destino

## 📱 Notificações

### Crítico
- [ ] **Notificações em tempo real** - WebSockets ou Server-Sent Events
- [ ] **Notificações push** - Para mobile (quando houver app)
- [ ] **Email de confirmação** - Ao solicitar, aceitar, iniciar, concluir viagem
- [ ] **SMS de confirmação** - Opcional para viagens importantes

### Importante
- [ ] **Preferências de notificação** - Usuário escolhe o que quer receber
- [ ] **Notificações de avaliação pendente** - Lembrar de avaliar após viagem
- [ ] **Alertas de segurança** - Notificações importantes do sistema

## 💬 Comunicação

### Crítico
- [ ] **Chat entre passageiro e marinheiro** - Antes e durante a viagem
- [ ] **Mensagens de texto** - Sistema de mensagens na plataforma
- [ ] **Chamadas de voz** - Integração com serviço de voz (opcional)

### Importante
- [ ] **Mensagens automáticas** - Templates para situações comuns
- [ ] **Histórico de conversas** - Salvar mensagens trocadas
- [ ] **Notificações de mensagem** - Alertar quando receber mensagem

## 📅 Agendamento e Disponibilidade

### Crítico
- [ ] **Viagens agendadas** - Passageiro pode agendar viagem para data/hora futura
- [ ] **Gerenciar disponibilidade** - Marinheiro define quando está disponível
- [ ] **Calendário de viagens** - Visualizar viagens agendadas
- [ ] **Reagendamento** - Permitir alterar data/hora de viagem agendada

### Importante
- [ ] **Viagens recorrentes** - Agendar viagens que se repetem
- [ ] **Lembretes de viagem** - Notificar antes da viagem agendada
- [ ] **Bloquear períodos** - Marinheiro pode bloquear datas indisponíveis

## 📊 Relatórios e Estatísticas

### Crítico
- [ ] **Dashboard com estatísticas** - Para admin, passageiro e marinheiro
- [ ] **Relatório de viagens** - Filtros por período, status, etc.
- [ ] **Relatório financeiro** - Para marinheiros (ganhos, comissões)
- [ ] **Métricas de uso** - Para admin (usuários ativos, viagens por dia, etc.)

### Importante
- [ ] **Exportar dados** - CSV, PDF para relatórios
- [ ] **Gráficos e visualizações** - Charts.js ou similar
- [ ] **Análise de desempenho** - Para marinheiros (taxa de aceitação, avaliações)

## 🔍 Busca e Filtros

### Importante
- [ ] **Busca avançada de viagens** - Filtros por data, status, valor, etc.
- [ ] **Filtros no histórico** - Filtrar viagens por período, status, avaliação
- [ ] **Busca de marinheiros** - Para passageiros escolherem (futuro)
- [ ] **Ordenação** - Ordenar por data, valor, avaliação, etc.

## ⚠️ Segurança e Suporte

### Crítico
- [ ] **Sistema de denúncias** - Passageiro/marinheiro pode denunciar problemas
- [ ] **Central de ajuda** - FAQ e documentação
- [ ] **Suporte ao cliente** - Chat ou formulário de contato
- [ ] **Bloqueio de usuários** - Admin pode bloquear usuários problemáticos

### Importante
- [ ] **Registro de incidentes** - Histórico de problemas reportados
- [ ] **Sistema de penalidades** - Para cancelamentos frequentes
- [ ] **Verificação de identidade** - KYC para maior segurança

## ⭐ Avaliações e Feedback

### Importante
- [ ] **Histórico de avaliações** - Ver todas as avaliações recebidas
- [ ] **Filtros em avaliações** - Por nota, data, etc.
- [ ] **Resposta a avaliações** - Marinheiro/passageiro pode responder
- [ ] **Avaliações detalhadas** - Mais critérios além da nota (pontualidade, segurança, etc.)

## 🎨 Interface e Experiência

### Importante
- [ ] **Modo escuro** - Tema dark para a aplicação
- [ ] **Responsividade mobile** - Melhorar experiência em dispositivos móveis
- [ ] **Acessibilidade** - WCAG compliance
- [ ] **Internacionalização (i18n)** - Suporte a múltiplos idiomas
- [ ] **Animações e transições** - Melhorar feedback visual
- [ ] **Loading states** - Melhorar indicadores de carregamento

## 🔧 Funcionalidades Administrativas

### Crítico
- [ ] **Gerenciar usuários** - Admin pode editar, bloquear, desbloquear usuários
- [ ] **Visualizar todas as viagens** - Admin vê todas as viagens do sistema
- [ ] **Relatórios administrativos** - Estatísticas gerais da plataforma
- [ ] **Gerenciar comissões** - Definir percentual de comissão por viagem

### Importante
- [ ] **Configurações do sistema** - Admin pode configurar parâmetros gerais
- [ ] **Logs do sistema** - Visualizar logs de atividades
- [ ] **Backup e restore** - Sistema de backup de dados
- [ ] **Gerenciar promoções** - Criar e gerenciar cupons de desconto

## 📱 Aplicativo Mobile

### Futuro
- [ ] **App nativo Android** - Desenvolvimento de app Android
- [ ] **App nativo iOS** - Desenvolvimento de app iOS
- [ ] **PWA (Progressive Web App)** - Transformar web app em PWA
- [ ] **Notificações push nativas** - Para apps mobile

## 🧪 Testes e Qualidade

### Importante
- [ ] **Testes unitários (Backend)** - JUnit para serviços e controllers
- [ ] **Testes unitários (Frontend)** - Jest/React Testing Library
- [ ] **Testes de integração** - Testar fluxos completos
- [ ] **Testes E2E** - Cypress ou Playwright
- [ ] **Testes de carga** - Verificar performance sob carga

## 📚 Documentação

### Importante
- [ ] **Documentação da API** - Swagger/OpenAPI
- [ ] **Documentação de instalação** - Guia completo de setup
- [ ] **Documentação de deploy** - Como fazer deploy em produção
- [ ] **Guia do desenvolvedor** - Para novos desenvolvedores
- [ ] **Manual do usuário** - Para usuários finais

## 🔄 Melhorias Técnicas

### Importante
- [ ] **Cache** - Implementar cache para melhorar performance
- [ ] **Otimização de queries** - Melhorar consultas ao banco
- [ ] **Paginação** - Implementar paginação em todas as listagens
- [ ] **Lazy loading** - Carregar dados sob demanda
- [ ] **Error handling** - Melhorar tratamento de erros
- [ ] **Logging** - Sistema de logs mais robusto
- [ ] **Monitoramento** - Integração com ferramentas de monitoramento
- [ ] **CI/CD** - Pipeline de integração e deploy contínuo

## 📋 Observações

### Priorização Sugerida:
1. **Alta Prioridade (Crítico)**: Funcionalidades essenciais para o funcionamento básico
2. **Média Prioridade (Importante)**: Melhorias significativas na experiência
3. **Baixa Prioridade (Futuro)**: Funcionalidades que podem ser adicionadas depois

### Notas:
- Algumas funcionalidades podem depender de integrações externas (gateways de pagamento, serviços de mapas, etc.)
- Algumas funcionalidades podem requerer mudanças na arquitetura atual
- Considere custos de APIs externas ao implementar funcionalidades que dependem delas



-----
**Cláudio Manoel Jansen de Oliveira**

caujansen@gmail.com

# **Documento de Visão para o Sistema NautiGo**


**16 de março de 2025**

*Proposta do aluno Cláudio Manoel Jansen de Oliveira ao curso de Engenharia de Software como projeto de Trabalho de Conclusão de Curso (TCC) sob orientação de conteúdo e orientação acadêmica dos professores Cleiton Silva Tavares, Danilo Boechat Seufitelli, Joana Gabriela Ribeiro de Souza e Leonardo Vilela Cardoso.*

-----
## **OBJETIVOS**
O NautiGo é uma plataforma que conecta passageiros a marinheiros disponíveis para transporte marítimo e fluvial, funcionando de maneira semelhante a aplicativos de transporte terrestre. Seu principal objetivo é facilitar a mobilidade em áreas costeiras, ilhas, rios e regiões navegáveis, tornando o processo de solicitação e aceitação de viagens mais acessível e eficiente.

O sistema visa:

1. Proporcionar um meio digital eficiente para solicitar transporte por barco, lancha ou outras embarcações adequadas a diferentes ambientes aquáticos.
1. Permitir que marinheiros autônomos encontrem passageiros e gerenciem suas corridas.
1. Garantir segurança e confiabilidade nas viagens por meio de avaliações, perfis verificados e critérios de qualificação dos marinheiros.
1. Oferecer uma experiência intuitiva e fluida para usuários e prestadores de serviço, como um aplicativo de fácil navegação e funcionalidades otimizadas.
#
#
## **ESCOPO**
Atualmente não há um aplicativo que ofereça transporte marítimo e fluvial sob demanda de forma abrangente. Algumas soluções locais existem, mas costumam ser limitadas a serviços de táxi aquático específicos de determinadas regiões.

O diferencial do NautiGo está em: 

- Atuação em diferentes tipos de água (marítimo e fluvial).
- Modelo semelhante ao Uber, com liberdade para marinheiros e passageiros interagirem de forma autônoma.
- Segurança e verificação de embarcações e condutores, garantindo viagens regulamentadas.
- Facilidade de pagamento digital, evitando a necessidade de transações em dinheiro físico.
## **FORA DO ESCOPO**
1. **Aluguel de embarcações:** O aplicativo conectará passageiros a marinheiros para transporte, mas não permitirá o aluguel de barcos sem marinheiro.
1. **Serviço de turismo ou passeios guiados:** O foco do sistema será o transporte sob demanda, e não a oferta de passeios turísticos.
1. **Integração com sistemas governamentais de transporte aquaviário:** O aplicativo operará de forma independente e não estará vinculado a sistemas públicos de transporte.
1. **Suporte para cargas e encomendas:** O NautiGo será destinado ao transporte de passageiros e não oferecerá um serviço de frete ou transporte de mercadorias, pelo menos nas versões iniciais.
1. **Chamada de emergência ou resgate marítimo:** O sistema não substituirá serviços de emergência da marinha, dos portos ou equipes de resgate.
#

## **GESTORES, USUÁRIOS E OUTROS INTERESSADOS**

|**Nome**|**Qualificação**|**Responsabilidade**|
| :-: | :-: | :-: |
|Administrador do Sistema|Gestor responsável pelo funcionamento do NautiGo|Gerenciar a plataforma, validar cadastros de marinheiros, monitorar reclamações e resolver problemas técnicos.|
|Passageiro|Usuário que solicita transporte|Criar conta no sistema, solicitar viagens, pagar pelo serviço e avaliar marinheiros.|
|Marinheiro|Prestador de serviço (condutor da embarcação)|Criar conta no sistema, aceitar viagens, conduzir passageiros até o destino e receber pagamento.|
|Equipe de Suporte|Time responsável pelo atendimento ao usuário|Resolver problemas de cadastro, pagamentos, problemas na viagem e funcionamento do aplicativo.|



## **LEVANTAMENTO DE NECESSIDADES**
Enumere as necessidades identificadas no ambiente de negócio e que justifiquem a criação do sistema. As necessidades devem ser numeradas e justificadas.

1. **Facilidade de solicitações de transporte aquático:**
   1. **Justificativa:** Atualmente, passageiros que precisam de transporte em rios, mares ou canais dependem de serviços informais ou ligações diretas para marinheiros. O NautiGo centraliza e automatiza esse processo.
1. **Segurança na escolha dos marinheiros e embarcações:**
   1. **Justificativa:** Passageiros precisam confiar nos marinheiros que os transportarão. O sistema deve garantir a verificação de documentos, avaliações e histórico de viagens para aumentar a segurança.

1. **Sistema de pagamentos integrado:**
   1. **Justificativa:** A possibilidade de pagar via cartão de crédito, Pix ou outros meios digitais, facilita as transações e evita a necessidade de dinheiro físico.
1. **Localização em tempo real da embarcação:**
   1. **Justificativa:** Passageiros precisam saber onde está a embarcação antes e durante a viagem para melhor planejamento e segurança.
1. **Sistema de avaliações e feedback:**
   1. **Justificativa:** Para garantir qualidade e confiança, tanto passageiros quanto marinheiros devem poder avaliar uns aos outros após cada viagem.
1. **Definição dinâmica de tarifas:**
   1. **Justificativa:** Assim como em apps de transporte terrestre, as tarifas podem variar conforme horário, demanda e tipo de embarcação, garantindo um modelo de precificação justo para ambas as partes.
## **FUNCIONALIDADES DO PRODUTO**

|**Necessidade:** Facilidade de solicitação de transporte aquático||
| :- | :- |
|**Funcionalidade**|**Categoria**|
|Cadastro de passageiros e marinheiros|Crítico|
|Solicitação de viagens com origem e destino|Crítico|
|Sistema de notificação para alertar marinheiros sobre novas corridas|Importante|
#
|**Necessidade:** Segurança na escolha dos marinheiros e embarcações||
| :- | :- |
|**Funcionalidade**|**Categoria**|
|Verificação de documentos dos marinheiros e embarcações|Crítico|
|Exibição de perfil completo do marinheiro com avaliações|Importante|
|Sistema de denúncias e suporte ao passageiro|Importante|


|**Necessidade:** Sistema de pagamentos integrado||
| :- | :- |
|**Funcionalidade**|**Categoria**|
|Pagamento via cartão de crédito e pix|Crítico|
|Histórico de pagamentos e recibos digitais|Importante|

|**Necessidade:** Localização em tempo real||
| :- | :- |
|**Funcionalidade**|**Categoria**|
|Rastreamento via GPS da embarcação antes e durante a viagem|Crítico|
|Compartilhamento de localização com terceiros (amigos/familiares)|Útil|

|**Necessidade:** Sistema de avaliações e feedback||
| :- | :- |
|**Funcionalidade**|**Categoria**|
|Avaliação de passageiros e marinheiros após a viagem|Crítico|
|Comentários adicionais em avaliações|Importante|

|**Necessidade:** Definição de tarifas||
| :- | :- |
|**Funcionalidade**|**Categoria**|
|Sugestão de tarifa tanto por parte do passageiro, quanto por parte do marinheiro|Crítico|
|Exibição de estimativa de preço antes da corrida|Importante|
|Tarifas diferenciadas para tipos de embarcação|Importante|
#


## **INTERLIGAÇÃO COM OUTROS SISTEMAS**
O NautiGo precisará se integrar com os seguintes sistemas externos para oferecer uma experiência eficiente e segura aos usuários:

1. **APIs de Pagamento (Stripe, PayPal, Pix, etc.)**
   1. **Motivo:** Permitir que passageiros realizem pagamentos digitais de forma segura e rápida.
1. **Serviços de Mapas e GPS (Google Maps, OpenStreetMap, etc.)**
   1. **Motivo:** Habilitar o rastreamento de embarcações em tempo real, calcular rotas e fornecer estimativas de tempo de chegada.
1. **Sistemas de Autenticação (Google, Facebook, e-mail, SMS, etc.)**
   1. **Motivo:** Facilitar o login e garantir segurança no acesso à plataforma.
1. **Plataforma de Notificações (Firebase Cloud Messaging, OneSignal, etc.)**
   1. **Motivo:** Enviar alertas e atualizações em tempo real para passageiros e marinheiros sobre status de corridas.
## **RESTRIÇÕES**
1. **Regulamentação para transporte aquaviário**
   1. O NautiGo deve cumprir as normas das autoridades marítimas e fluviais, como Capitania dos Portos e órgãos de transporte locais, para garantir que apenas marinheiros autorizados operem no sistema.
1. **Conectividade com a internet**
   1. O funcionamento do aplicativo depende de acesso à internet para solicitação de viagens, rastreamento de embarcações e processamento de pagamentos. Regiões
1. **Dispositivos compatíveis**
   1. O aplicativo será desenvolvido para Android e iOS, sem suporte inicial para desktop ou versões offline
1. **Limitação de tipos de embarcação**
   1. O sistema, inicialmente, aceitará apenas embarcações menores e de transporte particular (lanchas, barcos pequenos). Navios, balsas e embarcações de grande porte não farão parte da plataforma.



## **DOCUMENTAÇÃO**
O NautiGo contará com os seguintes documentos para garantir suporte adequado a seus usuários e operadores: 

1. **Manual do Usuário (Passageiros e Marinheiros)**
   1. Explicação passo a passo sobre como se cadastrar, solicitar viagens, aceitar corridas e realizar pagamentos.
1. **Guia de Segurança e Regulamentação**
   1. Informações sobre normas de transporte aquaviário, boas práticas de segurança e exigências para marinheiros cadastrados.
1. **FAQ e Suporte Online**
   1. Seção dentro do aplicativo e site com as dúvidas mais frequentes e um canal para contato com o suporte

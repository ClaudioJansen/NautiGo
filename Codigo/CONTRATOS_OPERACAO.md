# Contratos de Operação - Sistema NautiGo

Este documento descreve todas as operações principais do sistema, suas dependências, pré-condições e pós-condições.

---

## Módulo: Autenticação e Cadastro

### Contrato 1: login

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `login(request: LoginRequest): LoginResponse` |
| **Operação** | Autentica um usuário no sistema através de email e senha. Valida as credenciais fornecidas, verifica se o usuário está ativo, e gera um token JWT contendo informações do usuário. Retorna o token e dados básicos do usuário para uso nas requisições subsequentes. |
| **Referências Cruzadas** | `AuthService`, `UsuarioRepository`, `PasswordEncoder`, `JwtUtil`, `LoginRequest`, `LoginResponse`, `UserResponse`, `Usuario` |
| **Pré-condições** | O email fornecido deve existir no sistema. A senha fornecida deve corresponder à senha armazenada (após hash). O usuário associado ao email deve estar ativo (campo `ativo = true`). |
| **Pós-condições** | Um token JWT válido é gerado e retornado. O token contém email, userId e isAdmin do usuário. Um objeto `LoginResponse` é retornado contendo o token e um `UserResponse` com dados básicos do usuário. Nenhuma alteração é persistida no banco de dados. |

---

### Contrato 2: cadastrarPassageiro

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `cadastrarPassageiro(request: CadastroPassageiroRequest): UserResponse` |
| **Operação** | Cria um novo registro de passageiro no sistema. Valida se o email já existe, cria uma nova instância de `Usuario` com os dados fornecidos, codifica a senha usando PasswordEncoder, cria uma instância de `Passageiro` associada ao usuário, e persiste ambas as entidades no banco de dados. O passageiro é criado com status ativo imediatamente. |
| **Referências Cruzadas** | `AuthService`, `UsuarioRepository`, `PassageiroRepository`, `PasswordEncoder`, `CadastroPassageiroRequest`, `UserResponse`, `Usuario`, `Passageiro` |
| **Pré-condições** | O email fornecido não deve existir no sistema. Todos os campos obrigatórios do `CadastroPassageiroRequest` devem estar preenchidos e válidos (nome, email válido, telefone, senha com mínimo de 6 caracteres). |
| **Pós-condições** | Uma nova instância de `Usuario` é criada e salva no banco de dados com senha codificada, isAdmin=false e ativo=true. Uma nova instância de `Passageiro` é criada e salva no banco de dados associada ao usuário criado. Um `UserResponse` é retornado contendo os dados básicos do usuário criado. |

---

### Contrato 3: cadastrarMarinheiro

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `cadastrarMarinheiro(request: CadastroMarinheiroRequest): UserResponse` |
| **Operação** | Cria um novo registro de marinheiro no sistema. Valida se o email já existe, cria uma nova instância de `Usuario` com os dados pessoais fornecidos, codifica a senha, cria uma instância de `Marinheiro` com dados da embarcação e informações profissionais, define o status de aprovação como PENDENTE, e persiste ambas as entidades. O marinheiro requer aprovação administrativa antes de poder aceitar viagens. |
| **Referências Cruzadas** | `AuthService`, `UsuarioRepository`, `MarinheiroRepository`, `PasswordEncoder`, `CadastroMarinheiroRequest`, `UserResponse`, `Usuario`, `Marinheiro`, `Marinheiro.StatusAprovacao` |
| **Pré-condições** | O email fornecido não deve existir no sistema. Todos os campos obrigatórios do `CadastroMarinheiroRequest` devem estar preenchidos e válidos (dados pessoais, dados da embarcação, capacidade de passageiros positiva). |
| **Pós-condições** | Uma nova instância de `Usuario` é criada e salva no banco de dados com senha codificada, isAdmin=false e ativo=true. Uma nova instância de `Marinheiro` é criada e salva no banco de dados associada ao usuário, com statusAprovacao=PENDENTE. Um `UserResponse` é retornado contendo os dados básicos do usuário criado. |

---

## Módulo: Gerenciamento de Marinheiros

### Contrato 4: listarPendentes

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `listarPendentes(): List<MarinheiroResponse>` |
| **Operação** | Retorna uma lista de todos os marinheiros com status de aprovação PENDENTE. Busca no repositório todos os marinheiros que ainda não foram aprovados ou rejeitados, converte cada entidade para DTO `MarinheiroResponse` contendo informações completas do marinheiro e sua embarcação. |
| **Referências Cruzadas** | `MarinheiroService`, `MarinheiroRepository`, `MarinheiroResponse`, `Marinheiro`, `Marinheiro.StatusAprovacao` |
| **Pré-condições** | Nenhuma pré-condição específica. A operação é de leitura e não requer autenticação específica (mas geralmente é chamada por administradores). |
| **Pós-condições** | Uma lista de `MarinheiroResponse` é retornada contendo todos os marinheiros com status PENDENTE. Nenhuma alteração é realizada no banco de dados. |

---

### Contrato 5: aprovar

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `aprovar(id: Long): void` |
| **Operação** | Aprova o cadastro de um marinheiro, alterando seu status de aprovação de PENDENTE para APROVADO. Busca o marinheiro pelo ID, valida sua existência, atualiza o campo statusAprovacao, e persiste a alteração. Após a aprovação, o marinheiro pode aceitar viagens no sistema. |
| **Referências Cruzadas** | `MarinheiroService`, `MarinheiroRepository`, `Marinheiro`, `Marinheiro.StatusAprovacao` |
| **Pré-condições** | O marinheiro com o ID fornecido deve existir no banco de dados. O marinheiro deve estar com status PENDENTE. |
| **Pós-condições** | O campo `statusAprovacao` do marinheiro é alterado para APROVADO. A alteração é persistida no banco de dados. O marinheiro passa a ter permissão para aceitar viagens no sistema. |

---

### Contrato 6: rejeitar

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `rejeitar(id: Long, motivo: String): void` |
| **Operação** | Rejeita o cadastro de um marinheiro, alterando seu status de aprovação para REJEITADO e registrando o motivo da rejeição no campo observacoes. Busca o marinheiro pelo ID, valida sua existência, atualiza statusAprovacao para REJEITADO e observacoes com o motivo fornecido, e persiste as alterações. |
| **Referências Cruzadas** | `MarinheiroService`, `MarinheiroRepository`, `Marinheiro`, `Marinheiro.StatusAprovacao` |
| **Pré-condições** | O marinheiro com o ID fornecido deve existir no banco de dados. O marinheiro deve estar com status PENDENTE. |
| **Pós-condições** | O campo `statusAprovacao` do marinheiro é alterado para REJEITADO. O campo `observacoes` é atualizado com o motivo da rejeição. As alterações são persistidas no banco de dados. O marinheiro não pode mais aceitar viagens no sistema. |

---

### Contrato 7: buscarPorId

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `buscarPorId(id: Long): MarinheiroResponse` |
| **Operação** | Busca um marinheiro específico pelo ID e retorna seus dados completos em formato DTO. Recupera a entidade do banco de dados, valida sua existência, e converte para `MarinheiroResponse` incluindo informações do usuário associado e dados da embarcação. |
| **Referências Cruzadas** | `MarinheiroService`, `MarinheiroRepository`, `MarinheiroResponse`, `Marinheiro` |
| **Pré-condições** | O marinheiro com o ID fornecido deve existir no banco de dados. |
| **Pós-condições** | Um objeto `MarinheiroResponse` é retornado contendo todos os dados do marinheiro e informações do usuário associado. Nenhuma alteração é realizada no banco de dados. |

---

## Módulo: Gerenciamento de Viagens

### Contrato 8: solicitarViagem

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `solicitarViagem(passageiroId: Long, request: SolicitarViagemRequest): ViagemResponse` |
| **Operação** | Cria uma nova solicitação de viagem no sistema. Valida se o passageiro existe, verifica se o passageiro não possui viagem ativa imediata (exceto se a nova viagem for agendada), cria uma nova instância de `Viagem` com os dados fornecidos (origem, destino, valor proposto, método de pagamento, número de pessoas, data agendada opcional), define o status como PENDENTE, e persiste a viagem. A viagem fica disponível para marinheiros aceitarem. |
| **Referências Cruzadas** | `ViagemService`, `PassageiroRepository`, `ViagemRepository`, `SolicitarViagemRequest`, `ViagemResponse`, `Passageiro`, `Viagem`, `Viagem.StatusViagem`, `Viagem.MetodoPagamento`, `AvaliacaoRepository` |
| **Pré-condições** | O passageiro com o ID fornecido deve existir no banco de dados. Se a viagem não for agendada (dataHoraAgendada é null), o passageiro não deve possuir viagem ativa com status PENDENTE, AGUARDANDO_APROVACAO_PASSAGEIRO, ACEITA ou EM_ANDAMENTO. Todos os campos obrigatórios do `SolicitarViagemRequest` devem estar preenchidos e válidos. |
| **Pós-condições** | Uma nova instância de `Viagem` é criada e salva no banco de dados com status PENDENTE, passageiro associado, valor proposto pelo passageiro definido, e valor final (campo `valor`) como null. Um objeto `ViagemResponse` é retornado contendo todos os dados da viagem criada, incluindo notas médias calculadas do passageiro e marinheiro (se aplicável). |

---

### Contrato 9: listarViagensDoPassageiroPaginado

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `listarViagensDoPassageiroPaginado(passageiroId: Long, page: int, size: int): PaginatedResponse<ViagemResponse>` |
| **Operação** | Retorna uma lista paginada de todas as viagens de um passageiro, excluindo viagens canceladas. Busca o passageiro pelo ID, valida sua existência, consulta o repositório com paginação aplicando filtro para excluir viagens com status CANCELADA, ordena por data de criação descendente, converte cada entidade para DTO, e retorna um objeto paginado contendo a lista, metadados de paginação (página atual, tamanho, total de elementos, total de páginas, flags de primeira/última página). |
| **Referências Cruzadas** | `ViagemService`, `PassageiroRepository`, `ViagemRepository`, `AvaliacaoRepository`, `PaginatedResponse`, `ViagemResponse`, `Passageiro`, `Viagem`, `Viagem.StatusViagem`, `Page`, `Pageable`, `PageRequest` |
| **Pré-condições** | O passageiro com o ID fornecido deve existir no banco de dados. Os parâmetros de paginação (page e size) devem ser válidos (page >= 0, size > 0). |
| **Pós-condições** | Um objeto `PaginatedResponse<ViagemResponse>` é retornado contendo a lista de viagens do passageiro (exceto canceladas) na página solicitada, ordenadas por data de criação descendente, com metadados de paginação. Nenhuma alteração é realizada no banco de dados. |

---

### Contrato 10: listarViagensDisponiveis

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `listarViagensDisponiveis(marinheiroId: Long): List<ViagemResponse>` |
| **Operação** | Retorna uma lista de viagens disponíveis para um marinheiro aceitar. Busca todas as viagens recusadas anteriormente por este marinheiro, consulta o repositório para obter viagens com status PENDENTE que não possuem marinheiro associado e que não estão na lista de recusadas, ordena por data de criação descendente, converte cada entidade para DTO incluindo cálculo de notas médias, e retorna a lista. |
| **Referências Cruzadas** | `ViagemService`, `ViagemRepository`, `ViagemRecusadaRepository`, `AvaliacaoRepository`, `ViagemResponse`, `Viagem`, `Viagem.StatusViagem`, `ViagemRecusada` |
| **Pré-condições** | O marinheiro com o ID fornecido deve existir no banco de dados. |
| **Pós-condições** | Uma lista de `ViagemResponse` é retornada contendo todas as viagens disponíveis (status PENDENTE, sem marinheiro associado, não recusadas anteriormente por este marinheiro), ordenadas por data de criação descendente. Nenhuma alteração é realizada no banco de dados. |

---

### Contrato 11: listarViagensDoMarinheiroPaginado

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `listarViagensDoMarinheiroPaginado(marinheiroId: Long, page: int, size: int): PaginatedResponse<ViagemResponse>` |
| **Operação** | Retorna uma lista paginada de todas as viagens de um marinheiro, excluindo viagens canceladas. Busca o marinheiro pelo ID, valida sua existência, consulta o repositório com paginação aplicando filtro para excluir viagens com status CANCELADA, ordena por data de criação descendente, converte cada entidade para DTO, e retorna um objeto paginado com metadados. |
| **Referências Cruzadas** | `ViagemService`, `MarinheiroRepository`, `ViagemRepository`, `AvaliacaoRepository`, `PaginatedResponse`, `ViagemResponse`, `Marinheiro`, `Viagem`, `Viagem.StatusViagem`, `Page`, `Pageable`, `PageRequest` |
| **Pré-condições** | O marinheiro com o ID fornecido deve existir no banco de dados. Os parâmetros de paginação (page e size) devem ser válidos (page >= 0, size > 0). |
| **Pós-condições** | Um objeto `PaginatedResponse<ViagemResponse>` é retornado contendo a lista de viagens do marinheiro (exceto canceladas) na página solicitada, ordenadas por data de criação descendente, com metadados de paginação. Nenhuma alteração é realizada no banco de dados. |

---

### Contrato 12: aceitarViagem

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `aceitarViagem(viagemId: Long, marinheiroId: Long): ViagemResponse` |
| **Operação** | Um marinheiro aceita uma viagem pendente, aceitando diretamente o valor proposto pelo passageiro. Busca a viagem e o marinheiro pelos IDs, valida que a viagem está com status PENDENTE e não possui marinheiro associado, verifica se o marinheiro está aprovado, associa o marinheiro à viagem, define o valor final como o valor proposto pelo passageiro, limpa o campo de contra-proposta, altera o status para ACEITA, e persiste as alterações. |
| **Referências Cruzadas** | `ViagemService`, `ViagemRepository`, `MarinheiroRepository`, `AvaliacaoRepository`, `ViagemResponse`, `Viagem`, `Marinheiro`, `Viagem.StatusViagem`, `Marinheiro.StatusAprovacao` |
| **Pré-condições** | A viagem com o ID fornecido deve existir no banco de dados. A viagem deve estar com status PENDENTE. A viagem não deve possuir marinheiro associado. O marinheiro com o ID fornecido deve existir no banco de dados. O marinheiro deve estar com statusAprovacao igual a APROVADO. |
| **Pós-condições** | O campo `marinheiro` da viagem é definido com o marinheiro que aceitou. O campo `valor` da viagem é definido com o valor proposto pelo passageiro. O campo `valorContraPropostaMarinheiro` é definido como null. O campo `status` da viagem é alterado para ACEITA. As alterações são persistidas no banco de dados. Um objeto `ViagemResponse` é retornado com os dados atualizados da viagem. |

---

### Contrato 13: recusarViagem

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `recusarViagem(viagemId: Long, marinheiroId: Long): ViagemResponse` |
| **Operação** | Um marinheiro recusa uma viagem pendente, registrando a recusa para que a viagem não apareça novamente para este marinheiro. Busca a viagem e o marinheiro pelos IDs, valida que a viagem está com status PENDENTE e não possui marinheiro associado, verifica se o marinheiro está aprovado, verifica se já existe registro de recusa, cria uma nova instância de `ViagemRecusada` associando a viagem e o marinheiro, persiste o registro de recusa, e retorna a viagem (que continua pendente para outros marinheiros). |
| **Referências Cruzadas** | `ViagemService`, `ViagemRepository`, `MarinheiroRepository`, `ViagemRecusadaRepository`, `AvaliacaoRepository`, `ViagemResponse`, `Viagem`, `Marinheiro`, `ViagemRecusada`, `Viagem.StatusViagem`, `Marinheiro.StatusAprovacao` |
| **Pré-condições** | A viagem com o ID fornecido deve existir no banco de dados. A viagem deve estar com status PENDENTE. A viagem não deve possuir marinheiro associado. O marinheiro com o ID fornecido deve existir no banco de dados. O marinheiro deve estar com statusAprovacao igual a APROVADO. |
| **Pós-condições** | Uma nova instância de `ViagemRecusada` é criada e salva no banco de dados associando a viagem e o marinheiro (se ainda não existir). A viagem permanece com status PENDENTE e sem marinheiro associado. Um objeto `ViagemResponse` é retornado com os dados da viagem. A viagem não aparecerá mais na lista de viagens disponíveis para este marinheiro. |

---

### Contrato 14: proporContraProposta

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `proporContraProposta(viagemId: Long, marinheiroId: Long, novoValor: BigDecimal): ViagemResponse` |
| **Operação** | Um marinheiro propõe um novo valor para uma viagem pendente, iniciando uma negociação com o passageiro. Busca a viagem e o marinheiro pelos IDs, valida que a viagem está com status PENDENTE e não está em negociação com outro marinheiro, verifica se o marinheiro está aprovado, valida que o novo valor é maior que zero, associa o marinheiro à viagem, define o campo `valorContraPropostaMarinheiro` com o novo valor, altera o status para AGUARDANDO_APROVACAO_PASSAGEIRO, e persiste as alterações. |
| **Referências Cruzadas** | `ViagemService`, `ViagemRepository`, `MarinheiroRepository`, `AvaliacaoRepository`, `ViagemResponse`, `Viagem`, `Marinheiro`, `Viagem.StatusViagem`, `Marinheiro.StatusAprovacao` |
| **Pré-condições** | A viagem com o ID fornecido deve existir no banco de dados. A viagem deve estar com status PENDENTE. Se a viagem já possui marinheiro associado, deve ser o mesmo marinheiro que está propondo. O marinheiro com o ID fornecido deve existir no banco de dados. O marinheiro deve estar com statusAprovacao igual a APROVADO. O novoValor deve ser maior que zero. |
| **Pós-condições** | O campo `marinheiro` da viagem é definido com o marinheiro que propôs. O campo `valorContraPropostaMarinheiro` é definido com o novo valor proposto. O campo `status` da viagem é alterado para AGUARDANDO_APROVACAO_PASSAGEIRO. O campo `valor` permanece null até que o passageiro aceite. As alterações são persistidas no banco de dados. Um objeto `ViagemResponse` é retornado com os dados atualizados da viagem. |

---

### Contrato 15: responderContraProposta

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `responderContraProposta(viagemId: Long, passageiroId: Long, aceitar: boolean): ViagemResponse` |
| **Operação** | Um passageiro responde à contra-proposta de valor feita por um marinheiro, aceitando ou recusando. Busca a viagem pelo ID, valida que está com status AGUARDANDO_APROVACAO_PASSAGEIRO e que o passageiro tem permissão, verifica que existe contra-proposta válida. Se aceitar: define o valor final como o valor da contra-proposta, altera status para ACEITA, limpa o campo de contra-proposta. Se recusar: cria registro de recusa (se não existir), remove o marinheiro da viagem, limpa o campo de contra-proposta, altera status para PENDENTE. Persiste as alterações. |
| **Referências Cruzadas** | `ViagemService`, `ViagemRepository`, `ViagemRecusadaRepository`, `AvaliacaoRepository`, `ViagemResponse`, `Viagem`, `ViagemRecusada`, `Viagem.StatusViagem` |
| **Pré-condições** | A viagem com o ID fornecido deve existir no banco de dados. A viagem deve estar com status AGUARDANDO_APROVACAO_PASSAGEIRO. O passageiro com o ID fornecido deve ser o passageiro da viagem. A viagem deve possuir marinheiro associado e valor de contra-proposta definido. |
| **Pós-condições** | Se aceitar: o campo `valor` é definido com o valor da contra-proposta, o campo `status` é alterado para ACEITA, o campo `valorContraPropostaMarinheiro` é definido como null. Se recusar: um registro de `ViagemRecusada` é criado (se não existir), o campo `marinheiro` é definido como null, o campo `valorContraPropostaMarinheiro` é definido como null, o campo `status` é alterado para PENDENTE. As alterações são persistidas no banco de dados. Um objeto `ViagemResponse` é retornado com os dados atualizados da viagem. |

---

### Contrato 16: cancelarViagem

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `cancelarViagem(viagemId: Long, usuarioId: Long): ViagemResponse` |
| **Operação** | Cancela uma viagem, podendo ser executado pelo passageiro ou pelo marinheiro associado. Busca a viagem e o usuário pelos IDs, valida que o usuário tem permissão (é o passageiro ou o marinheiro da viagem), verifica que a viagem não está concluída ou em andamento, altera o status para CANCELADA, e persiste a alteração. Viagens canceladas não aparecem no histórico. |
| **Referências Cruzadas** | `ViagemService`, `ViagemRepository`, `UsuarioRepository`, `AvaliacaoRepository`, `ViagemResponse`, `Viagem`, `Usuario`, `Viagem.StatusViagem` |
| **Pré-condições** | A viagem com o ID fornecido deve existir no banco de dados. O usuário com o ID fornecido deve existir no banco de dados. O usuário deve ser o passageiro da viagem OU o marinheiro associado à viagem. A viagem não deve estar com status CONCLUIDA. A viagem não deve estar com status EM_ANDAMENTO. |
| **Pós-condições** | O campo `status` da viagem é alterado para CANCELADA. A alteração é persistida no banco de dados. Um objeto `ViagemResponse` é retornado com os dados atualizados da viagem. A viagem não aparecerá mais no histórico de viagens. |

---

### Contrato 17: iniciarViagem

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `iniciarViagem(viagemId: Long, marinheiroId: Long): ViagemResponse` |
| **Operação** | Inicia uma viagem que foi aceita, marcando o início efetivo do transporte. Busca a viagem pelo ID, valida que o marinheiro tem permissão (é o marinheiro associado à viagem), verifica que a viagem está com status ACEITA, altera o status para EM_ANDAMENTO, define o campo `dataHoraIniciada` com a data/hora atual, e persiste as alterações. |
| **Referências Cruzadas** | `ViagemService`, `ViagemRepository`, `AvaliacaoRepository`, `ViagemResponse`, `Viagem`, `Viagem.StatusViagem` |
| **Pré-condições** | A viagem com o ID fornecido deve existir no banco de dados. A viagem deve possuir marinheiro associado. O marinheiro com o ID fornecido deve ser o marinheiro associado à viagem. A viagem deve estar com status ACEITA. |
| **Pós-condições** | O campo `status` da viagem é alterado para EM_ANDAMENTO. O campo `dataHoraIniciada` é definido com a data/hora atual do sistema. As alterações são persistidas no banco de dados. Um objeto `ViagemResponse` é retornado com os dados atualizados da viagem. |

---

### Contrato 18: concluirViagem

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `concluirViagem(viagemId: Long, marinheiroId: Long): ViagemResponse` |
| **Operação** | Finaliza uma viagem em andamento, marcando sua conclusão. Busca a viagem pelo ID, valida que o marinheiro tem permissão (é o marinheiro associado à viagem), verifica que a viagem está com status EM_ANDAMENTO, altera o status para CONCLUIDA, define o campo `dataHoraConcluida` com a data/hora atual, e persiste as alterações. Após a conclusão, a viagem pode ser avaliada pelos participantes. |
| **Referências Cruzadas** | `ViagemService`, `ViagemRepository`, `AvaliacaoRepository`, `ViagemResponse`, `Viagem`, `Viagem.StatusViagem` |
| **Pré-condições** | A viagem com o ID fornecido deve existir no banco de dados. A viagem deve possuir marinheiro associado. O marinheiro com o ID fornecido deve ser o marinheiro associado à viagem. A viagem deve estar com status EM_ANDAMENTO. |
| **Pós-condições** | O campo `status` da viagem é alterado para CONCLUIDA. O campo `dataHoraConcluida` é definido com a data/hora atual do sistema. As alterações são persistidas no banco de dados. Um objeto `ViagemResponse` é retornado com os dados atualizados da viagem. A viagem passa a estar disponível para avaliação pelos participantes. |

---

## Módulo: Sistema de Avaliações

### Contrato 19: avaliarViagem

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `avaliarViagem(viagemId: Long, avaliadorId: Long, request: AvaliarViagemRequest): AvaliacaoResponse` |
| **Operação** | Cria uma avaliação de uma viagem concluída, permitindo que passageiro avalie o marinheiro ou vice-versa. Busca a viagem e o avaliador pelos IDs, valida que a viagem está com status CONCLUIDA, identifica se o avaliador é passageiro ou marinheiro da viagem e determina quem está sendo avaliado, verifica que não existe avaliação prévia do mesmo avaliador para esta viagem, cria uma nova instância de `Avaliacao` com nota e comentário, associa à viagem, avaliador e avaliado, e persiste a avaliação. |
| **Referências Cruzadas** | `AvaliacaoService`, `ViagemRepository`, `UsuarioRepository`, `AvaliacaoRepository`, `AvaliarViagemRequest`, `AvaliacaoResponse`, `Viagem`, `Usuario`, `Avaliacao`, `Viagem.StatusViagem` |
| **Pré-condições** | A viagem com o ID fornecido deve existir no banco de dados. A viagem deve estar com status CONCLUIDA. O usuário com o ID fornecido (avaliador) deve existir no banco de dados. O avaliador deve ser o passageiro OU o marinheiro da viagem. Se o avaliador for passageiro, a viagem deve possuir marinheiro associado. Não deve existir avaliação prévia do mesmo avaliador para esta viagem. A nota fornecida deve estar entre 0 e 5. |
| **Pós-condições** | Uma nova instância de `Avaliacao` é criada e salva no banco de dados associada à viagem, ao avaliador e ao avaliado, contendo a nota e comentário fornecidos. Um objeto `AvaliacaoResponse` é retornado com os dados da avaliação criada. A avaliação pode ser usada para calcular a nota média do usuário avaliado. |

---

### Contrato 20: obterNotaMedia

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `obterNotaMedia(usuarioId: Long): Double` |
| **Operação** | Calcula e retorna a nota média de um usuário baseada em todas as avaliações recebidas. Busca o usuário pelo ID, valida sua existência, consulta o repositório para contar o número de avaliações do usuário, se não houver avaliações retorna 5.0 (nota inicial padrão), caso contrário calcula a média aritmética de todas as notas recebidas usando query agregada, e retorna o valor (ou 5.0 se a média for null). |
| **Referências Cruzadas** | `AvaliacaoService`, `UsuarioRepository`, `AvaliacaoRepository`, `Usuario`, `Avaliacao` |
| **Pré-condições** | O usuário com o ID fornecido deve existir no banco de dados. |
| **Pós-condições** | Um valor Double é retornado representando a nota média do usuário (entre 0.0 e 5.0), ou 5.0 se o usuário não possuir avaliações. Nenhuma alteração é realizada no banco de dados. |

---

### Contrato 21: contarAvaliacoes

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `contarAvaliacoes(usuarioId: Long): Long` |
| **Operação** | Retorna o número total de avaliações recebidas por um usuário. Busca o usuário pelo ID, valida sua existência, consulta o repositório usando query agregada para contar todas as avaliações onde o usuário é o avaliado, e retorna o total. |
| **Referências Cruzadas** | `AvaliacaoService`, `UsuarioRepository`, `AvaliacaoRepository`, `Usuario`, `Avaliacao` |
| **Pré-condições** | O usuário com o ID fornecido deve existir no banco de dados. |
| **Pós-condições** | Um valor Long é retornado representando o número total de avaliações recebidas pelo usuário. Nenhuma alteração é realizada no banco de dados. |

---

### Contrato 22: listarAvaliacoesDoUsuario

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `listarAvaliacoesDoUsuario(usuarioId: Long): List<AvaliacaoResponse>` |
| **Operação** | Retorna uma lista de todas as avaliações recebidas por um usuário. Busca o usuário pelo ID, valida sua existência, consulta o repositório para obter todas as avaliações onde o usuário é o avaliado, converte cada entidade para DTO `AvaliacaoResponse` contendo informações do avaliador, nota e comentário, e retorna a lista. |
| **Referências Cruzadas** | `AvaliacaoService`, `UsuarioRepository`, `AvaliacaoRepository`, `AvaliacaoResponse`, `Usuario`, `Avaliacao` |
| **Pré-condições** | O usuário com o ID fornecido deve existir no banco de dados. |
| **Pós-condições** | Uma lista de `AvaliacaoResponse` é retornada contendo todas as avaliações recebidas pelo usuário. Nenhuma alteração é realizada no banco de dados. |

---

### Contrato 23: verificarSeJaAvaliou

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `verificarSeJaAvaliou(viagemId: Long, usuarioId: Long): boolean` |
| **Operação** | Verifica se um usuário já avaliou uma viagem específica. Busca a viagem e o usuário pelos IDs, valida suas existências, consulta o repositório para verificar se existe uma avaliação associando a viagem e o usuário como avaliador, e retorna true se existe, false caso contrário. |
| **Referências Cruzadas** | `AvaliacaoService`, `ViagemRepository`, `UsuarioRepository`, `AvaliacaoRepository`, `Viagem`, `Usuario`, `Avaliacao` |
| **Pré-condições** | A viagem com o ID fornecido deve existir no banco de dados. O usuário com o ID fornecido deve existir no banco de dados. |
| **Pós-condições** | Um valor boolean é retornado indicando se o usuário já avaliou a viagem (true) ou não (false). Nenhuma alteração é realizada no banco de dados. |

---

## Módulo: Utilitários

### Contrato 24: obterTipoUsuario

| **Item** | **Descrição** |
|----------|---------------|
| **Nome da Operação** | `obterTipoUsuario(request: HttpServletRequest): ResponseEntity<?>` |
| **Operação** | Identifica e retorna o tipo de usuário (ADMIN, MARINHEIRO ou PASSAGEIRO) baseado no token JWT da requisição. Extrai o token do header Authorization, decodifica o userId usando JwtUtil, busca o usuário no repositório, verifica se é admin, caso contrário verifica se existe registro de Marinheiro ou Passageiro associado ao usuário, e retorna o tipo identificado em um Map. |
| **Referências Cruzadas** | `UsuarioController`, `JwtUtil`, `UsuarioRepository`, `MarinheiroRepository`, `PassageiroRepository`, `Usuario`, `Marinheiro`, `Passageiro` |
| **Pré-condições** | A requisição HTTP deve conter um header Authorization com um token JWT válido. O token deve conter um userId válido. O usuário associado ao userId deve existir no banco de dados. |
| **Pós-condições** | Um objeto `ResponseEntity` é retornado contendo um Map com a chave "tipoUsuario" e valor "ADMIN", "MARINHEIRO" ou "PASSAGEIRO". Nenhuma alteração é realizada no banco de dados. |

---

## Resumo de Operações por Módulo

- **Autenticação e Cadastro**: 3 operações
- **Gerenciamento de Marinheiros**: 4 operações
- **Gerenciamento de Viagens**: 11 operações
- **Sistema de Avaliações**: 5 operações
- **Utilitários**: 1 operação

**Total**: 24 operações principais identificadas


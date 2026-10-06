# Product Backlog — Arena UFRN

**Versão:** 1.0 — 06/10/2026  
**Equipe:** Paulo André (@pauloandrehxh) e Luis Felipe (@Luisfelipelinhares)

## 1. Contexto e convenções

Backlog elaborado na regularização da P1 com base na [visão](./visao.md), código e histórico Git. A distribuição foi aprovada como planejamento nesta revisão, não como atribuição histórica. Nenhuma história é declarada aceita por ter código ou testes anteriores.

P0 = essencial; P1 = importante; P2 = evolução desejável. Analista e desenvolvedor são o responsável indicado; testador/QA é o outro integrante. Critérios abaixo são requisitos para aceite, não resultados. Issues, PRs e branches de entrega ainda precisam de identificação real.

I1/I2 entregam incrementos de API em homologação restrita. Papéis representam intenção de produto; identidade e autorização serão aplicadas com US05 na I3. Não apresentar usuarioId enviado pelo cliente como autenticação. Interface completa depende de planejamento de tarefas dentro de cada história.

Cada US agrupa requisitos internos com valor para um perfil, evitando histórias como “criar rota” ou “configurar Jest”. Os RFs são centralizados na visão; critérios numerados por história permitem rastrear cenários e testes.

## 2. Histórias

### US01 — Reservar quadra

**Story:** Como aluno, quero reservar uma quadra disponível para garantir meu horário de uso.  
**Prioridade:** P0 | **RF:** RF01 | **Iteração:** I1  
**Analista/Dev:** Paulo André | **QA:** Luis Felipe  
**Dependências:** usuário e quadra ativos pré-cadastrados; catálogo US02.  
**Base:** service/controller/routes de reservas e testes existentes; ainda sem aceite formal.

- CA01 (P0): criar reserva ATIVA com identificador, usuário, quadra, data e intervalo; API responde 201.
- CA02 (P0): rejeitar usuário/quadra inexistentes ou inativos sem criar registro.
- CA03 (P0): campos obrigatórios e tipos válidos; data válida não passada; horários no formato HH:mm, entre 00:00 e 23:59, início anterior ao fim. Rejeições de entrada respondem 400.
- CA04 (P0): rejeitar sobreposição na mesma quadra/data; início igual ao fim de outra reserva é permitido.
- CA05 (P0): falha não cria registro; comprovação com persistência e concorrência é necessária para RNF02, não satisfeita apenas por mocks.
- CA06 (P1): interpretar data/horários no fuso America/Fortaleza; API recebe exclusivamente data YYYY-MM-DD. Persistir o dia como DateTime à meia-noite UTC por convenção, sem tratar esse valor como instante local da reserva. No dia atual, rejeitar início menor ou igual ao minuto corrente; testes controlam relógio e contemplam mudança de dia entre UTC e Fortaleza. Contrato aprovado pelo usuário durante o início da T2.

**Contrato de implementação da US01:** usuarioId/quadraId são inteiros JSON positivos representáveis pelo Int do Prisma; criação fixa status ATIVA e ignora campos internos enviados. Erros de entrada/regra retornam 400; falhas inesperadas retornam 500 genérico. Leitura de conflito e gravação ocorrem na mesma transação. A verificação de concorrência inicial usa duas requisições na mesma aplicação/client; não comprova todos os cenários de múltiplas instâncias ou reagendamento.

### US02 — Manter quadras

**Story:** Como gestor, quero cadastrar, consultar e atualizar quadras para manter o catálogo correto.  
**Prioridade:** P0 | **RF:** RF02 | **Iteração:** I1  
**Analista/Dev:** Luis Felipe | **QA:** Paulo André  
**Dependências:** nenhuma para API de homologação; autorização depende de US05.  
**Base:** CRUD e testes existentes; contribuição histórica de Luis Felipe nos testes, não atribuição de toda a implementação.

- CA01 (P0): cadastrar nome textual não vazio; retornar ID e quadra ativa (201).
- CA02 (P0): listar catálogo, inclusive vazio, e consultar por ID; inexistente retorna 404 e ID inválido retorna 400.
- CA03 (P0): atualizar nome válido mantendo ID e demais dados não alterados; nome inválido não altera registro.
- CA04 (P1): excluir quadra sem reservas vinculadas; não apagar histórico de reservas ao tentar excluir uma quadra vinculada. Indisponibilidade operacional pertence à US08.
- CA05 (P0): erros de dependência não devem aparecer como sucesso nem expor detalhes internos.

### US03 — Cancelar reserva

**Story:** Como aluno, quero cancelar uma reserva para liberar um horário que não utilizarei.  
**Prioridade:** P0 | **RF:** RF03 | **Iteração:** I2  
**Analista/Dev:** Paulo André | **QA:** Luis Felipe  
**Dependências:** US01; contrato compartilhado com US04; US05 para autorização de titular.  
**Base:** status existe; DELETE remove registro e não implementa este contrato.

- CA01 (P0): cancelar reserva ATIVA e futura, mudando para CANCELADA sem excluir ID, usuário, quadra ou intervalo.
- CA02 (P0): reserva CANCELADA não bloqueia novo agendamento nem disponibilidade.
- CA03 (P0): repetir cancelamento de CANCELADA é idempotente; inexistente retorna 404.
- CA04 (P0): não cancelar reserva CONCLUIDA ou já iniciada; falha preserva registro.
- CA05 (P0 após US05): somente titular ou gestor autorizado pode cancelar.
- CA06 (P0): definir fuso/relógio e resposta HTTP da transição antes de implementar; testes devem controlar tempo. Os exemplos abaixo usam uma data futura inequívoca.

### US04 — Consultar disponibilidade

**Story:** Como aluno, quero consultar horários disponíveis por quadra e data para escolher quando jogar.  
**Prioridade:** P0 | **RF:** RF04 | **Iteração:** I2  
**Analista/Dev:** Luis Felipe | **QA:** Paulo André  
**Dependências:** US01/US02 e contrato de cancelamento US03.

- CA01 (P0): receber quadra/data válidas e apresentar ocupações ATIVA e intervalos disponíveis de forma consistente.
- CA02 (P0): CANCELADA não ocupa horário; limites contíguos não são sobreposição.
- CA03 (P0): quadra inativa não oferece agendamentos; inexistente e entrada inválida têm resposta explícita.
- CA04 (P0): nenhuma reserva resulta em todos os intervalos permitidos disponíveis, não em quadra inexistente.
- CA05 (P0): definir janela de funcionamento e granularidade antes de produzir lista de horários livres; não presumir funcionamento 24 h nem slots fixos.

### US05 — Acessar minha conta

**Story:** Como aluno, quero entrar e sair da minha conta para acessar minhas operações com segurança.  
**Prioridade:** P0 | **RF:** RF05 | **Iteração:** I3  
**Analista/Dev:** Paulo André | **QA:** Luis Felipe  
**Dependências:** cadastro existente; estratégia de credenciais/sessão a definir.

- CA01 (P0): identidade validada permite iniciar sessão; credencial inválida não permite acesso.
- CA02 (P0): saída invalida a sessão conforme estratégia definida.
- CA03 (P0): proteger operações de titular e gestor, incluindo histórias das I1/I2.
- CA04 (P0): não expor credenciais; se usadas senhas, apenas hash seguro persiste.

### US06 — Gerenciar usuários

**Story:** Como gestor, quero manter os cadastros e a situação dos usuários para controlar quem pode utilizar o serviço.  
**Prioridade:** P0 | **RF:** RF06 | **Iteração:** I3  
**Analista/Dev:** Luis Felipe | **QA:** Paulo André  
**Dependências:** US05; base CRUD de usuários existente.

- CA01 (P0): cadastrar e consultar nome, e-mail e matrícula válidos, com unicidade de e-mail/matrícula.
- CA02 (P0): atualizar sem introduzir duplicidade, preservando ID.
- CA03 (P0): inativar sem destruir histórico; usuário inativo não cria reserva.
- CA04 (P0): apenas gestor autorizado administra; dados pessoais não ficam em listagem pública.

### US07 — Acompanhar minhas reservas

**Story:** Como aluno, quero visualizar minhas reservas e seus estados para organizar meus próximos usos.  
**Prioridade:** P1 | **RF:** RF07 | **Iteração:** I4  
**Analista/Dev:** Paulo André | **QA:** Luis Felipe  
**Dependências:** US01/US03/US05.

- CA01 (P1): obter reservas do usuário da sessão, não de identidade arbitrária enviada pelo cliente.
- CA02 (P1): mostrar quadra, data, intervalo e estado com ordenação temporal definida.
- CA03 (P1): tratar lista vazia; negar acesso às reservas de outro aluno.

### US08 — Indisponibilizar quadra

**Story:** Como gestor, quero suspender novos agendamentos de uma quadra para impedir uso durante manutenção.  
**Prioridade:** P1 | **RF:** RF08 | **Iteração:** I4  
**Analista/Dev:** Luis Felipe | **QA:** Paulo André  
**Dependências:** US02/US04/US05.

- CA01 (P1): gestor pode inativar e reativar quadra; alteração é persistida.
- CA02 (P1): quadra inativa não aceita nova reserva e consulta não a mostra como disponível.
- CA03 (P1): definir e informar política para reservas já existentes antes do aceite; não cancelar silenciosamente.
- CA04 (P1): usuário comum não altera situação da quadra.

### US09 — Reagendar reserva

**Story:** Como aluno, quero mudar uma reserva para outro horário livre para ajustar meu planejamento.  
**Prioridade:** P1 | **RF:** RF09 | **Iteração:** I5  
**Analista/Dev:** Paulo André | **QA:** Luis Felipe  
**Dependências:** US01/US04/US05; atualização básica de reservas existente.

- CA01 (P1): reagendar reserva ativa/futura do titular para intervalo válido, preservando ID.
- CA02 (P1): consulta de conflito desconsidera a própria reserva, não outras reservas ativas.
- CA03 (P1): falha preserva o intervalo original; alterações concorrentes respeitam RNF02.
- CA04 (P1): não reagendar reserva cancelada/concluída ou de outro aluno.

### US10 — Garantir uso equitativo

**Story:** Como aluno, quero que limites de agendamento sejam aplicados igualmente para que mais pessoas tenham acesso às quadras.  
**Prioridade:** P1 | **RF:** RF10 | **Iteração:** I5  
**Analista/Dev:** Luis Felipe | **QA:** Paulo André  
**Dependências:** US01/US03/US05; parâmetros aprovados antes da implementação.

- CA01 (P1): definir limite, janela temporal e estados contabilizados; aplicar mesma regra a usuários equivalentes.
- CA02 (P1): verificar exatamente o limite e tentativa que o excede; rejeição não persiste reserva.
- CA03 (P1): cancelamento atualiza contabilização conforme regra aprovada; concorrência não burla limite.
- CA04 (P1): limite por curso só entra se perfil/dados necessários forem aprovados; não existe curso no modelo atual.

### US11 — Consultar histórico

**Story:** Como aluno, quero consultar minhas reservas anteriores e canceladas para acompanhar meu histórico de utilização.  
**Prioridade:** P2 | **RF:** RF11 | **Iteração:** I6  
**Analista/Dev:** Paulo André | **QA:** Luis Felipe  
**Dependências:** US03/US05/US07.

- CA01 (P2): filtrar histórico pessoal por período e estado; dados de outro aluno não aparecem.
- CA02 (P2): manter canceladas e definir transição para CONCLUIDA antes de implementar o filtro correspondente.
- CA03 (P2): tratar filtros inválidos e resultado vazio; ordenar resultados consistentemente.

### US12 — Acompanhar agenda

**Story:** Como gestor, quero consultar a agenda por quadra, período e situação para acompanhar a utilização do espaço.  
**Prioridade:** P2 | **RF:** RF12 | **Iteração:** I6  
**Analista/Dev:** Luis Felipe | **QA:** Paulo André  
**Dependências:** US04/US05/US08 e estados definidos.

- CA01 (P2): somente gestor consulta agenda administrativa.
- CA02 (P2): filtrar quadra, período e estado; dados são consistentes com reservas persistidas.
- CA03 (P2): tratar agenda vazia e filtros inválidos; mostrar quadras indisponíveis sem sugerir horário reservável.

## 3. Cenários de aceitação — I1 e I2

Estes cenários são especificações para execução futura, não relatório de QA. As datas 2099 são fixtures futuras; o relógio deve ser fixado antes delas. Dados devem ser isolados entre cenários. Cenários pendentes de política devem ser detalhados antes do aceite; os exemplos não substituem todos os critérios.

### US01 (CA01–CA04)

```gherkin
Funcionalidade: Reservar quadra em homologação
  Cenário: Criar uma reserva válida
    Dado que existem usuário e quadra ativos e sem reserva em 10/10/2099 das 14:00 às 15:00
    Quando solicito uma reserva para esse usuário, quadra, data e intervalo
    Então a API responde 201 com identificador e estado ATIVA
    E a reserva pode ser consultada

  Esquema do Cenário: Rejeitar usuário ou quadra indisponível
    Dado que <condicao> e os demais dados da reserva são válidos
    Quando solicito a reserva
    Então a API responde 400 e não cria registro
    Exemplos:
      | condicao                 |
      | o usuário não existe     |
      | o usuário está inativo   |
      | a quadra não existe      |
      | a quadra está inativa    |

  Esquema do Cenário: Rejeitar entrada inválida
    Dado que usuário e quadra estão ativos
    Quando solicito reserva com <entrada>
    Então a API responde 400 e não cria registro
    Exemplos:
      | entrada                                  |
      | um campo obrigatório ausente             |
      | data inválida                            |
      | data anterior ao dia do relógio de teste  |
      | início igual ao fim                      |
      | início posterior ao fim                  |
      | horário fora do formato HH:mm            |
      | horário 25:00                            |

  Cenário: Rejeitar sobreposição
    Dado que existe reserva ativa na quadra em 10/10/2099 das 14:00 às 15:00
    Quando solicito reserva na mesma quadra e data das 14:30 às 15:30
    Então a API responde 400 e preserva apenas a reserva anterior

  Cenário: Permitir intervalo contíguo
    Dado que existe reserva ativa na quadra em 10/10/2099 das 14:00 às 15:00
    Quando solicito reserva na mesma quadra e data das 15:00 às 16:00
    Então a API responde 201 sem alterar a reserva anterior

  Cenário: Rejeitar início já alcançado no dia atual
    Dado que o relógio em Fortaleza marca 06/10/2026 às 12:00
    Quando solicito reserva nesse dia das 12:00 às 13:00
    Então a API responde 400 sem criar registro

  Cenário: Usar o dia local da UFRN
    Dado que o relógio UTC marca 06/10/2026 às 02:30 e em Fortaleza ainda é 05/10/2026 às 23:30
    Quando solicito reserva em 05/10/2026 das 23:45 às 23:59
    Então a reserva é aceita se os demais dados forem válidos e não houver conflito
```

### US02 (CA01–CA05)

```gherkin
Funcionalidade: Manter catálogo de quadras em homologação
  Cenário: Cadastrar e consultar
    Dado que tenho acesso ao ambiente de gestão de homologação
    Quando cadastro uma quadra com nome textual não vazio
    Então a API responde 201 com identificador e active verdadeiro
    E a consulta pelo identificador retorna a mesma quadra

  Cenário: Atualizar nome
    Dado que existe uma quadra cadastrada
    Quando atualizo seu nome para outro nome válido
    Então a consulta retorna o novo nome com o mesmo identificador

  Esquema do Cenário: Validar cadastro e consulta
    Dado que o catálogo está disponível
    Quando executo <operacao>
    Então obtenho <resultado> sem alteração indevida
    Exemplos:
      | operacao                       | resultado                    |
      | cadastro com nome vazio        | erro de entrada              |
      | consulta com ID não numérico   | resposta 400                 |
      | consulta com ID inexistente    | resposta 404                 |
      | listagem de catálogo vazio     | resposta 200 e lista vazia   |

  Cenário: Preservar histórico ao excluir quadra vinculada
    Dado que existe quadra com reserva vinculada
    Quando tento excluir a quadra
    Então a operação é rejeitada sem apagar a reserva

  Cenário: Tratar falha de dependência
    Dado que a persistência falha durante uma operação
    Quando a API responde
    Então não informa sucesso nem expõe detalhes internos da dependência
```

### US03 (CA01–CA04)

```gherkin
Funcionalidade: Cancelar reserva
  Cenário: Cancelar e liberar horário
    Dado que existe uma reserva ATIVA futura
    Quando solicito seu cancelamento
    Então seu estado passa a CANCELADA com o mesmo identificador e intervalo
    E uma nova reserva válida pode ocupar o intervalo liberado

  Cenário: Repetir cancelamento
    Dado que existe uma reserva CANCELADA
    Quando solicito novamente seu cancelamento
    Então a operação mantém o mesmo registro CANCELADA sem efeitos adicionais

  Esquema do Cenário: Rejeitar cancelamento indevido
    Dado que <condicao>
    Quando solicito cancelamento
    Então <resultado> e nenhum registro é alterado
    Exemplos:
      | condicao                         | resultado                     |
      | a reserva não existe             | a API responde 404            |
      | a reserva está CONCLUIDA          | a operação é rejeitada        |
      | a reserva já iniciou             | a operação é rejeitada        |
```

### US04 (CA01–CA04)

```gherkin
Funcionalidade: Consultar disponibilidade
  Cenário: Desconsiderar reserva cancelada
    Dado que a quadra está ativa e tem uma reserva CANCELADA em um intervalo permitido
    Quando consulto sua disponibilidade na data da reserva
    Então esse intervalo não é informado como ocupado pela reserva cancelada

  Cenário: Considerar somente o dia e a quadra consultados
    Dado que existem reservas em quadras e dias diferentes
    Quando consulto uma quadra e uma data válidas
    Então as ocupações retornadas correspondem somente à quadra e à data consultadas

  Cenário: Consultar quadra sem reservas
    Dado que a quadra ativa não tem reservas no dia e a janela de funcionamento foi definida
    Quando consulto sua disponibilidade
    Então os intervalos permitidos são apresentados como disponíveis

  Cenário: Consultar quadra inativa
    Dado que a quadra está inativa
    Quando consulto sua disponibilidade
    Então ela não oferece novos agendamentos
```

## 4. Prioridades e glossário

| Prioridade | Quantidade de histórias |
|---|---|
| P0 | 6 |
| P1 | 4 |
| P2 | 2 |

- **Reserva ativa:** agendamento vigente; deve ocupar seu intervalo.
- **Cancelamento:** transição lógica que preserva histórico; não é DELETE.
- **Homologação:** ambiente restrito para validação, não liberação pública.
- **QA:** verificação pelo outro integrante, com evidências reais.

## 5. Referências

- [Modelo de backlog YP-Agentic](https://github.com/tacianosilva/engenharia-software/blob/main/yp-agentic/templates/doc-userstories.md)
- [Plano geral](./plano_iteracoes.md), [I1](./iteracoes/iteracao01.md), [I2](./iteracoes/iteracao02.md)

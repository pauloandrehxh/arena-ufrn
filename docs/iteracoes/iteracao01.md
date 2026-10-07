# Plano Detalhado — Iteração 1

**Elaboração:** 06/10/2026 — versão 1.0  
**Duração planejada:** 21 dias (dentro dos 15–22 exigidos pela P1)  
**Início/fim:** pendentes de confirmação, sem atribuição retroativa de datas.

## 1. Objetivo e origem

Consolidar catálogo de quadras e criação de reservas como incremento de API em homologação. O plano foi elaborado agora sobre código já existente, não reconstruído como se tivesse sido executado antes. O prazo da P1, 06/10/2026, é prazo de entrega documental; não evidencia 21 dias de execução.

Fonte única de histórias e critérios: [backlog](../user-stories.md). Distribuição aprovada nesta regularização:

| História | Analista/Dev | QA | Entrega individual |
|---|---|---|---|
| US01 — Reservar quadra | Paulo André (@pauloandrehxh) | Luis Felipe (@Luisfelipelinhares) | T2 de Paulo André |
| US02 — Manter quadras | Luis Felipe (@Luisfelipelinhares) | Paulo André (@pauloandrehxh) | T2 de Luis Felipe |

## 2. Base e limites

Existem CRUD de quadras e módulo de reservas, testes e CI. O [relatório](../estado_testes.md) registra 46 testes passando na base auditada; isso não constitui aceite das histórias, pois os critérios novos incluem lacunas e os testes usam mocks.

O frontend só consulta quadras e não efetua reserva. O incremento inicial não inclui declaração de fluxo E2E concluído. Sem autenticação, usar apenas homologação restrita. Usuários e quadras necessários aos cenários devem ser preparados com dados sintéticos.

## 3. Tarefas distribuídas

Estado inicial das tarefas abaixo: **planejada**. O desenvolvimento posterior da US01 está registrado na seção 7; ele não conclui automaticamente as demais tarefas. A issue de projeto e os PRs desta distribuição ainda não foram identificados.

| ID | Tarefa | Responsável | Dependência | Evidência esperada |
|---|---|---|---|---|
| I1-01 | Refinar US01, fuso/data e cenários de fronteira | Paulo André | Decisão temporal | Critérios/Gherkin sem ambiguidade |
| I1-02 | Refinar US02, erros e exclusão segura | Luis Felipe | Dados de quadras/reservas | Critérios/Gherkin |
| I1-03 | Identificar issue/branch e comparar service/controller de reservas com CA01–CA06 | Paulo André | I1-01 | Referências reais e lista de lacunas |
| I1-04 | Identificar issue/branch e comparar CRUD de quadras com CA01–CA05 | Luis Felipe | I1-02 | Referências reais e lista de lacunas |
| I1-05 | Complementar validações de reservas, preservando comportamento válido | Paulo André | I1-03 | Implementação e regressões |
| I1-06 | Complementar validações e respostas do catálogo | Luis Felipe | I1-04 | Implementação e regressões |
| I1-07 | Complementar unitários, mocks e integração de US01; planejar garantia de concorrência | Paulo André | I1-05 | Testes por critério; persistência real para RNF02 |
| I1-08 | Complementar unitários/integração de US02; validar montagem real da aplicação quando pertinente | Luis Felipe | I1-06 | Testes por critério |
| I1-09 | Executar testes/cobertura de US01, verificar SonarQube e corrigir problemas comprovados | Paulo André | I1-07 | Comandos, commit, relatório e análise real |
| I1-10 | Executar testes/cobertura de US02, verificar SonarQube e evitar duplicar correções existentes | Luis Felipe | I1-08 | Comandos, commit, relatório e análise real |
| I1-11 | Executar aceitação da US02 e registrar QA | Paulo André | Branch/commit de Luis e cenários definidos | Relatório real em docs/qa/ |
| I1-12 | Executar aceitação da US01 e registrar QA | Luis Felipe | Branch/commit de Paulo e cenários definidos | Relatório real em docs/qa/ |
| I1-13 | Corrigir achados da US01 e solicitar reteste | Paulo André | I1-12 | Correções e reteste de Luis |
| I1-14 | Corrigir achados da US02 e solicitar reteste | Luis Felipe | I1-11 | Correções e reteste de Paulo |
| I1-15 | Consolidar PR e documentação T2 de US01 com QA de US02 | Paulo André | Evidências/retestes | Links verificáveis, sem publicação automática |
| I1-16 | Consolidar PR e documentação T2 de US02 com QA de US01 | Luis Felipe | Evidências/retestes | Links verificáveis, sem publicação automática |

## 4. Cronograma relativo

| Dias | Marco |
|---|---|
| 1–3 | Especificação, decisões temporais e preparação de dados |
| 4–9 | Comparação com código e complementação de funcionalidades |
| 10–14 | Testes unitários e de integração; tratamento de integridade |
| 15–17 | Execuções, cobertura, SonarQube e correções |
| 18–20 | QA cruzado, reprodução, correções e retestes |
| 21 | Revisão dos critérios, documentação e preparação da entrega |

## 5. Aceitação e QA

Executar cenários da I1 do backlog contra a implementação real. Identificar previamente branch/commit, relógio e dados. O QA de Paulo é US02; o de Luis é US01. Um teste mockado passando não substitui o teste de sistema.

O relatório deve registrar caso/critério, esperado/observado, Passou/Falhou, evidência, reprodução de falhas e melhorias. Casos não executados ficam pendentes; não criar relatório como se já tivessem ocorrido.

## 6. Riscos e saída

Riscos principais: R01, R03–R07 e R09 da [visão](../visao.md). A branch `origin/fix/sonar-code-smells-and-hotspot` de Luis Felipe exige revisão antes de aplicar correções equivalentes; não é automaticamente branch da US02.

Concluir apenas após critérios verificados, testes apropriados, cobertura registrada, análise real do LABENS e QA/retestes. RNF02 e decisões temporais não podem ser marcados como atendidos por simples mock. Registrar desvios e pendências, não apagar critérios para acomodar o código atual.

## 7. Progresso inicial da US01 / T2

Foi criada a branch local `feature/us01-reservas`, com autorização do usuário. O contrato temporal foi definido no backlog e implementado; validações, transação e testes foram complementados. A execução conjunta final passou 107 testes em sete suítes, incluindo persistência real e um caso de concorrência na mesma aplicação/client. Ver [evidência T2](../evidencias/t2-us01-execucao-testes-20261006.md).

US01, planejamento e QA histórico já foram publicados em `feature/us01-reservas`, em `80509e2`. O [QA da US02](../qa/t2-us02-quadras.md) identificou seis casos falhos; Paulo corrigiu as validações na branch atual e o reteste passou os 13 casos. Após essas correções, 134 testes Jest passaram em sete suítes. Não atribuir as correções a Luis nem substituir o QA que ele deve executar sobre a US01.

Luis publicou o [relatório de reservas](../qa/t2-us01-reservas.md) em `04357eb`; faltam Passou/Falhou, observações e evidências por caso. Correções e reteste foram publicados (`344ce75` e `bcbb0c1`), e o [PR #11](https://github.com/pauloandrehxh/arena-ufrn/pull/11) foi aberto, sem merge. Identificação da issue de projeto, cenários adicionais de concorrência, análise autenticada SonarQube, conclusão do QA de Luis e entrega final na disciplina continuam pendentes. Não há aceite final da iteração comprovado. Issue da disciplina de Paulo: [#471](https://github.com/tacianosilva/bsi-tasks/issues/471).

## 8. Plano de Teste da Iteração 1 — P2

Esta seção complementa o plano de trabalho acima com casos de teste, seguindo
o modelo PTI. **Os IDs CT identificam planejamento, não resultados executados.**
Os resultados anteriores permanecem no [QA](../qa/t2-us02-quadras.md). O PR #11
foi posteriormente integrado à main; o [CI 37555641340](https://github.com/pauloandrehxh/arena-ufrn/actions/runs/37555641340)
passou os 134 testes e enviou análise ao LABENS. A issue da US01 é
[#12](https://github.com/pauloandrehxh/arena-ufrn/issues/12), criada retrospectivamente.
Esses fatos atualizam o registro histórico da seção 7, sem declarar aceite da I1.

### 8.1 Escopo, ambiente e responsáveis

Histórias: [US01/US02 e critérios](../user-stories.md). Estratégia, ferramentas,
entrada/saída gerais: [PTG](../plano_teste.md). Sistema/aceitação de API usa
Supertest contra `createApp` e SQLite temporário com migrations reais. Unitários
usam Prisma mockado para isolar dependências; cada caso indica seu tipo.

Fixtures: `U` e `Q` são IDs retornados ao preparar usuário/quadra ativos;
`Q2` é outra quadra. `D` = `2099-10-10`, intervalo `14:00–15:00`.
Relógio padrão: `2099-10-09T15:00:00Z` (12:00 em Fortaleza).
`R` = `{usuarioId: U, quadraId: Q, date: D, startTime: "14:00", endTime: "15:00"}`.
Os IDs não são presumidos como 1; o ID inexistente `2147483647` deve ser verificado
ausente na fixture. Banco limpo e fixtures independentes por caso/variação.

US01: Dev Paulo, QA Luis. US02: Dev Luis, QA Paulo. Execuções e autoria de
correções reais devem seguir os registros, não ser inferidas da distribuição.

### 8.2 Casos US01 — Reservar quadra

| ID / critério | Pré-condições | Passos de execução | Dados de entrada | Resultado esperado | Tipo |
|---|---|---|---|---|---|
| I1-CT01 / CA01 | U/Q ativos, sem reserva em D | 1. POST `/api/reservas`; 2. GET pelo ID retornado; 3. consultar banco | R, acrescentando `status: CANCELADA` no POST | 201, ID, estado ATIVA; GET 200 e um registro com dia normalizado | Sistema/API + persistência |
| I1-CT02 / CA02 | Q ativo; preparar separadamente U ausente e U inativo | 1. POST; 2. contar reservas; repetir com estado isolado | R com usuário 2147483647; R com U inativo | 400 em ambas as variações, sem gravação | Sistema/API |
| I1-CT03 / CA02 | U ativo; preparar Q ausente e Q inativo separadamente | 1. POST; 2. contar reservas em cada variação | R com quadra 2147483647; R com Q inativo | 400, sem reserva criada | Sistema/API |
| I1-CT04 / CA03 | U/Q ativos | 1. Omitir cada campo de R em execução independente; 2. POST; 3. contar registros | R sem usuarioId, quadraId, date, startTime ou endTime | Cada ausência retorna 400; zero reservas | Sistema/API |
| I1-CT05 / CA03 | U/Q ativos | 1. Alterar um campo; 2. POST; 3. verificar ausência de gravação por variação | ID 0, -1, 1.5 ou string; date `2099-02-30`; startTime `9:00`, `24:00` ou `14:60` | 400 para entrada inválida; zero reservas | Unidade + sistema/API |
| I1-CT06 / CA03 | Relógio padrão; U/Q ativos | 1. POST com cada intervalo/data inválidos; 2. contar reservas | Date `2099-10-08`; intervalos `15:00–14:00` e `14:00–14:00` | 400, sem gravação | Unidade temporal + sistema/API |
| I1-CT07 / CA04 | Reserva ATIVA em Q/D, 14:00–15:00 | 1. POST novo intervalo; 2. consultar banco; restaurar fixture por variação | Intervalos 14:00–15:00, 14:30–15:30, 13:30–14:30, 13:00–16:00 e 14:15–14:45 | 400; apenas a reserva original preservada | Integração/persistência |
| I1-CT08 / CA04 | Reserva ATIVA em Q/D, 14:00–15:00 | 1. POST intervalo contíguo; 2. consultar ambos; restaurar por variação | 13:00–14:00; 15:00–16:00 | 201, dois registros sem sobreposição | Integração/persistência |
| I1-CT09 / CA04 | Reserva CANCELADA em Q/D, 14:00–15:00; Q2 ativo | 1. Reservar R; 2. em fixture independente reservar Q2 ou D+1 com ocupação em Q/D | R; R com Q2; R com date `2099-10-11` | CANCELADA não bloqueia; outra quadra/data não conflita | Integração/persistência |
| I1-CT10 / CA05 | U/Q ativos; dependência de criação configurada para falhar antes de concluir transação | 1. Injetar falha controlada; 2. POST; 3. conferir estado anterior | R; erro sintético sem dados reais | 500 genérico; nenhum registro parcial persistido; mocks não comprovam rollback real | Unidade; persistência com falha controlada planejada |
| I1-CT11 / CA05 | Banco isolado; mesmo client para caso base; clients/processos distintos para extensão | 1. Disparar duas requisições simultâneas; 2. conferir respostas e banco | Duas cópias de R | No máximo uma reserva ATIVA; nenhuma segunda criação bem-sucedida no intervalo; extensão multi-instância exige evidência própria | Integração/concorrência |
| I1-CT12 / CA06 | Relógio 09/10/2099 às 12:00 em Fortaleza | 1. POST com início antes/igual ao minuto atual; 2. repetir após limpar para início futuro | Date `2099-10-09`, início 11:59/12:00/12:01, fim 13:00 | 400 nos dois primeiros; 201 para 12:01 sem conflito | Unidade temporal + sistema/API |
| I1-CT13 / CA06 | Relógio `2099-10-10T02:30:00Z`, ainda 09/10 às 23:30 em Fortaleza | 1. POST; 2. conferir dia persistido | Date `2099-10-09`, 23:45–23:59, U/Q ativos | Aceitar dia local e início futuro; persistir 09/10 à meia-noite UTC por convenção | Unidade temporal + sistema/API |

### 8.3 Casos US02 — Manter quadras

| ID / critério | Pré-condições | Passos de execução | Dados de entrada | Resultado esperado | Tipo |
|---|---|---|---|---|---|
| I1-CT14 / CA01/02 | Catálogo vazio | 1. POST `/api/quadras`; 2. GET pelo ID; 3. conferir banco | `{name: "Quadra de teste"}` | 201, ID inteiro e active true; GET 200 com mesmo registro | Sistema/API + persistência |
| I1-CT15 / CA01 | Banco limpo por variação | 1. POST com nome inválido; 2. contar quadras | `{name: ""}`, `{name: "   "}`, `{name: 123}`, `{}` | 400 para cada variação; zero registros | Unidade + sistema/API |
| I1-CT16 / CA02 | Catálogo vazio; ID 2147483647 ausente | 1. GET catálogo; 2. GET inexistente; 3. GET ID inválido | `/api/quadras`, `/api/quadras/2147483647`, `/api/quadras/abc` | Respectivamente 200 com [], 404 e 400 | Sistema/API |
| I1-CT17 / CA03 | Q cadastrado; guardar registro anterior | 1. PUT `/api/quadras/Q`; 2. GET; 3. comparar demais campos | `{name: "Quadra atualizada"}` | 200, nome alterado; ID e active preservados | Sistema/API + persistência |
| I1-CT18 / CA03 | Q válido; guardar nome anterior; isolar variações | 1. PUT com nome inválido; 2. consultar banco | Nome vazio, espaços, número ou ausente | 400, registro original intacto | Unidade + sistema/API |
| I1-CT19 / CA04 | Q sem reservas | 1. DELETE `/api/quadras/Q`; 2. GET e conferir banco | ID Q | 204; registro removido e consulta 404 | Sistema/API + persistência |
| I1-CT20 / CA04 | Q com reserva vinculada; guardar ambos os registros | 1. DELETE Q; 2. consultar quadra/reserva | ID Q | Rejeitar exclusão; quadra/reserva preservadas. HTTP de conflito é melhoria; não exigir sucesso 204 | Sistema/API + persistência |
| I1-CT21 / CA05 | Dependência com erro sintético; dados sem informações reais | 1. Injetar falha em findMany/create/update/delete; 2. chamar operação válida por variação; 3. inspecionar resposta | Nome válido, ID Q, erro `SEGREDO_TESTE` | 500 genérico, sem sucesso falso ou detalhes internos no corpo | Integração de módulos com falha injetada |

### 8.4 Entrada, saída, execução e riscos

Entrada: critérios do backlog e revisão alvo identificados; dependencies/client
e migrations preparados; banco/relógio isolados; responsável QA definido.
Saída de aceitação: todos os casos aplicáveis executados com evidência, falhas
tratadas/retestadas, cobertura registrada, sem bloqueio impeditivo; critérios
gerais do PTG se aplicam. CI verde sozinho não equivale a todos os CT aprovados.

Cronograma: preparação nos dias 1–3; automação/fixtures 4–14; cobertura/CI/Sonar
15–17; aceitação e reteste 18–20; consolidação dia 21, conforme seção 4.
Riscos: mock pode ocultar falha de persistência; dados/relógio compartilhados
podem causar falsos resultados; execução multi-instância ainda requer ambiente
próprio. Bloquear e justificar casos sem pré-condição, sem inventar resultado.

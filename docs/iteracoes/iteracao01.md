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

I1-01 e partes de I1-03/I1-05/I1-07/I1-09 foram trabalhadas; identificação da issue de projeto, cenários adicionais de concorrência, SonarQube, trabalho/QA da US02 e publicação continuam pendentes. Não há PR ou aceite final comprovado. Issue da disciplina de Paulo: [#471](https://github.com/tacianosilva/bsi-tasks/issues/471).

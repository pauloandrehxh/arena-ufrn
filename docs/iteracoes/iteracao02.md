# Plano de Preparação — Iteração 2

**Elaboração:** 06/10/2026 — versão 1.0  
**Duração de referência:** 21 dias; datas absolutas pendentes.

## 1. Objetivo e distribuição

Evoluir reserva para cancelamento lógico e consulta de disponibilidade. Este plano conecta P1 à T3, sem afirmar execução histórica.

| História | Analista/Dev | QA | Entrega |
|---|---|---|---|
| US03 — Cancelar reserva | Paulo André (@pauloandrehxh) | Luis Felipe (@Luisfelipelinhares) | T3 de Paulo André |
| US04 — Consultar disponibilidade | Luis Felipe (@Luisfelipelinhares) | Paulo André (@pauloandrehxh) | T3 de Luis Felipe |

Critérios e Gherkin estão no [backlog](../user-stories.md), não duplicados aqui.

## 2. Contrato compartilhado e dependências

- Dependências: US01/US02, dados de homologação e contrato de datas/horários.
- Cancelamento deve preservar registro e liberar intervalo; DELETE existente não representa US03.
- Na branch da T3 de Paulo, o contrato aprovado passa a delegar DELETE ao cancelamento lógico (204); PATCH específico retorna 200. O registro histórico da base anterior não descreve mais essa árvore modificada.
- Somente ATIVA ocupa intervalo; consultas de conflito e disponibilidade precisam concordar.
- Cancelamento repetido é idempotente; concluídas/já iniciadas não são canceláveis.
- Definir fuso, respostas HTTP, janela de funcionamento e granularidade antes do aceite.
- Sem US05, o incremento não comprova autorização de titular e não deve ser liberado publicamente.

## 3. Tarefas e sequência

| Período relativo | Paulo André | Luis Felipe |
|---|---|---|
| Dias 1–3 | Refinar transição, relógio e critérios de US03 | Refinar contrato e janela de consulta de US04 |
| Dias 4–9 | Implementar cancelamento preservando histórico e ajustar conflito | Implementar disponibilidade por quadra/data e estado |
| Dias 10–14 | Testar transição, repetição, rejeições e persistência | Testar canceladas, quadra inativa, vazio e intervalos contíguos |
| Dias 15–17 | Executar testes/cobertura e verificar SonarQube | Executar testes/cobertura e verificar SonarQube |
| Dias 18–20 | QA da US04; corrigir achados da US03 | QA da US03; corrigir achados da US04 |
| Dia 21 | Consolidar evidências e T3 | Consolidar evidências e T3 |

Todas as tarefas permanecem planejadas. Identificar issues/branches/PRs reais antes de publicar links. Reutilizar infraestrutura da I1 e testes existentes, acrescentando apenas o necessário aos novos critérios.

## 4. Critério de saída

Demonstrar com implementação real que cancelar libera disponibilidade e permite nova reserva sem apagar a anterior. Registrar testes unitários com mocks, integração apropriada, cobertura atual, SonarQube LABENS e QA cruzado. Casos bloqueados/não executados ficam pendentes.

Referências: [plano geral](../plano_iteracoes.md), [plano de testes](../plano_teste.md), [estado dos testes](../estado_testes.md).

## 5. Plano de Teste da Iteração 2 — P2

**Estado de todos os casos: planejado, não executado neste documento.**
A P2 formaliza os testes; não comprova implementação da US03/US04. Não usar
DELETE físico de reservas como se fosse cancelamento lógico. Rotas e status HTTP
não definidos no backlog devem ser acordados antes da execução, sem inventar
endpoints ou políticas de produção.

### 5.1 Escopo, dados e responsáveis

Fonte: [US03/US04 e seus critérios](../user-stories.md). Estratégia/entrada/saída:
[PTG](../plano_teste.md). Dev US03: Paulo; QA: Luis. Dev US04: Luis; QA: Paulo.
Execução de sistema/API contra aplicação e banco isolados; complementar com
unitários mockados e integração real das transições/consultas.

Fixtures: U/Q são IDs reais de usuário/quadra ativos preparados para o caso;
Q2 é outra quadra; D = `2099-10-10`. Relógio padrão: `2099-10-10T16:00:00Z`
(13:00 em Fortaleza). R é reserva em Q/D, `14:00–15:00`, estado indicado na linha.
Janela W=`09:00–18:00`, granularidade G=60 minutos: **dados sintéticos de teste**,
não horário de funcionamento aprovado para a UFRN. Casos dependentes de W/G
ficam bloqueados enquanto a estratégia de configuração e política não forem
definidas; o dataset não aprova silenciosamente uma política de negócio.
IDs inexistentes devem ser verificados ausentes. Cada variação restaura a fixture.

### 5.2 Casos US03 — Cancelar reserva

| ID / critério | Pré-condições | Passos de execução | Dados de entrada | Resultado esperado | Tipo |
|---|---|---|---|---|---|
| I2-CT01 / CA01 | R ATIVA, futura; operação de cancelamento definida | 1. Solicitar cancelamento; 2. consultar reserva/banco | ID R; relógio padrão | Estado CANCELADA; mesmo ID, usuário, quadra, dia e intervalo; nenhum DELETE físico | Sistema/API + persistência |
| I2-CT02 / CA02 | R ATIVA em Q/D; U/Q ativos | 1. Cancelar R; 2. criar nova reserva no intervalo; 3. consultar ambas | ID R; nova reserva U/Q/D, 14:00–15:00 | Nova reserva aceita ATIVA; R permanece CANCELADA no histórico | Integração US01/US03 |
| I2-CT03 / CA03 | R já CANCELADA | 1. Cancelar novamente; 2. consultar banco; 3. repetir | ID R | Operação idempotente; um único registro CANCELADA, sem mudança indevida | Unidade + sistema/API |
| I2-CT04 / CA03 | ID 2147483647 ausente | 1. Solicitar cancelamento; 2. conferir reservas | ID 2147483647 | 404, sem criação nem alteração de registros | Sistema/API |
| I2-CT05 / CA04 | Preparar separadamente R CONCLUIDA e R ATIVA já iniciada | 1. Solicitar cancelamento; 2. comparar registro anterior | R CONCLUIDA; R ATIVA com relógio `2099-10-10T17:00:00Z` (14:00 local) | Rejeitar em ambas as variações; preservar estado e campos; início exatamente alcançado não é futuro | Unidade temporal + sistema/API |
| I2-CT06 / CA01/06 | R ATIVA futura; dependência de atualização configurada para falhar | 1. Injetar falha controlada; 2. cancelar; 3. consultar banco | ID R; erro sintético | Falha explícita sem expor detalhes; R continua ATIVA, sem liberação falsa do horário | Unidade; persistência com falha controlada |
| I2-CT07 / CA06 | R ATIVA em 09/10/2099, 23:45–23:59; relógio `2099-10-10T02:30:00Z` | 1. Solicitar cancelamento; 2. consultar R | ID R; data local ainda 09/10 às 23:30 | Cancelamento permitido por ser futuro no dia de Fortaleza; não tratar mudança de dia UTC como reserva passada | Unidade temporal + sistema/API |
| I2-CT08 / CA05 após US05 | Autenticação/autorizações implementadas; U titular, V outro aluno, gestor autorizado | 1. Cancelar como titular; 2. restaurar; tentar como V; 3. restaurar; tentar como gestor | Identidades U/V/gestor; ID R | Titular e gestor autorizados; V rejeitado sem alterar R. Bloqueado enquanto US05 não existir | Sistema/segurança |

### 5.3 Casos US04 — Consultar disponibilidade

| ID / critério | Pré-condições | Passos de execução | Dados de entrada | Resultado esperado | Tipo |
|---|---|---|---|---|---|
| I2-CT09 / CA01 | Q ativo, W/G aprovados no ambiente, R ATIVA | 1. Consultar Q/D; 2. comparar com reservas persistidas | Q, D, W, G | Ocupação 14:00–15:00; intervalos livres dentro de W excluem essa ocupação e respeitam G | Sistema/API + persistência |
| I2-CT10 / CA02 | R CANCELADA; sem outras reservas em Q/D; W/G configurados | 1. Consultar; 2. conferir estado de R | Q, D, W, G | R não ocupa o horário; 14:00–15:00 disponível; histórico não é apagado | Integração US03/US04 |
| I2-CT11 / CA02 | R ATIVA 14:00–15:00, W/G configurados | 1. Consultar disponibilidade; 2. verificar limites contíguos | Q, D; intervalos 13:00–14:00 e 15:00–16:00 | Ambos disponíveis; contiguidade não é tratada como sobreposição | Unidade de intervalos + sistema/API |
| I2-CT12 / CA03 | Q inativo; W/G definidos | 1. Consultar Q/D; 2. conferir estado persistido | Q inativo, D | Não oferecer novos agendamentos; resposta explícita de indisponibilidade, sem alterar histórico | Sistema/API |
| I2-CT13 / CA03 | ID 2147483647 ausente; Q ativo | 1. Consultar inexistente; 2. consultar ID não numérico e data inválida em cenários isolados | ID 2147483647; ID `abc`; date `2099-02-30` | Distinguir recurso inexistente de entrada inválida; rejeição explícita sem disponibilidade falsa; códigos definidos antes de executar | Unidade + sistema/API |
| I2-CT14 / CA04/05 | Q ativo, catálogo de reservas vazio em D, W/G configurados | 1. Consultar Q/D; 2. conferir quantidade/limites dos intervalos | Q, D, W=09:00–18:00, G=60 min | Dia disponível dentro da janela; se contrato retorna slots, nove slots de uma hora; não responder quadra inexistente | Sistema/API |
| I2-CT15 / CA01 | R em Q2/D e outra reserva em Q/D+1; Q/D sem ocupações, W/G definidos | 1. Consultar Q/D; 2. comparar com consultas de Q2/D e Q/D+1 | Q/Q2, D e `2099-10-11` | Cada consulta considera somente sua quadra/data; nenhum vazamento de ocupações entre consultas | Integração/persistência |
| I2-CT16 / CA05 | Política e configuração W/G homologadas no ambiente | 1. Consultar; 2. inspecionar primeiro/último intervalo e limites | Q, D, W=09:00–18:00, G=60 min | Nenhum intervalo antes das 09:00 ou após as 18:00; fim às 18:00 não gera slot adicional; não pressupor funcionamento 24h | Unidade de fronteiras + sistema/API |

### 5.4 Critérios, cronograma e riscos

Entrada: US03/US04 implementadas na revisão identificada; contratos de operação,
fuso/status HTTP e configuração W/G definidos; fixtures/client/migrations em
base exclusiva. US05 é pré-condição apenas de I2-CT08, não dos casos de
homologação restrita sem autenticação. Política ausente bloqueia os casos
dependentes; não executar contra suposições de produção.

Saída: todos os casos aplicáveis executados com Passou/Falhou e evidências,
integridade de cancelamento e consistência da disponibilidade verificadas,
falhas tratadas/retestadas, cobertura/CI registrados e QA cruzado realizado.
Os critérios gerais do PTG se aplicam. A saída da **documentação P2** é ter
esses testes planejados e a automação comprovada, não afirmar que a I2 já passou.

Cronograma de preparação/execução e responsáveis: seção 3. Riscos específicos:
DELETE físico destrói o histórico; fuso divergente muda elegibilidade de
cancelamento; política W/G indefinida produz disponibilidade arbitrária.
Mitigar com fixtures temporais, consultas de banco e bloqueio explícito de casos
sem contrato. Não duplicar como resultado os cenários apenas planejados aqui.

## 6. Desenvolvimento inicial da T3 — US03

Em 08/10/2026 foi criada a [issue #14](https://github.com/pauloandrehxh/arena-ufrn/issues/14)
e a branch local `feature/14-cancelamento-reservas`, sobre `87d8b79`.
O contrato está no backlog. Foram implementados cancelamento lógico transacional,
idempotência, validação temporal e proteção do PUT, sem implementar a US04 de Luis.

A execução conjunta passou **185 testes em nove suítes**, com SQLite temporário
e relógio injetado. Testes de persistência exercitaram os comportamentos de
I2-CT01–CT07; isso não representa QA independente de Luis nem resultado para
CT08–CT16. Os testes de concorrência usam o mesmo client. CT08 depende de US05;
CT09–CT16 dependem da implementação/contrato da US04. Ver
[evidência inicial T3](../evidencias/t3-us03-testes-20261008.md).

QA da US04, QA de Luis sobre a US03, SonarQube da revisão, commits e PRs da T3
continuam pendentes. A issue individual de Paulo na disciplina é
[#498](https://github.com/tacianosilva/bsi-tasks/issues/498).

A revisão final local de 09/10/2026 passou **192 testes em nove suítes**,
incluindo regressões adicionais de IDs/campos internos no PUT. Implementação
local da US03 concluída; conclusão da tarefa ainda depende das pendências acima.

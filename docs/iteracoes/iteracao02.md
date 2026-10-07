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

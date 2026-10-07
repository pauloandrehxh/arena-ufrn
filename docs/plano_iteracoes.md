# Plano Geral de Iterações — Arena UFRN

**Versão:** 1.0 — 06/10/2026  
**Equipe:** Paulo André (@pauloandrehxh) e Luis Felipe (@Luisfelipelinhares)

## 1. Origem e duração

Planejamento aprovado durante a regularização da P1. Não existia distribuição documentada nas referências auditadas. Não retroagir este plano nem tratar commits anteriores como iterações formalmente concluídas.

São seis iterações, duas por unidade, com uma história por integrante em cada uma. I1 tem duração planejada de 21 dias (P1 exige 15–22). Para as demais, a duração de referência é 21 dias, ajustável ao calendário acadêmico. Datas absolutas de início/fim estão pendentes; o prazo de entrega da P1 é 06/10/2026 e não comprova a execução de um ciclo de 21 dias.

## 2. Distribuição

| Unidade | Iteração | Objetivo | Paulo André — análise/dev | Luis Felipe — análise/dev | Dependências |
|---|---|---|---|---|---|
| 1ª | I1 | Consolidar catálogo e criação de reservas na API | US01 — Reservar quadra | US02 — Manter quadras | Cadastros de homologação |
| 1ª | I2 | Liberar e consultar horários | US03 — Cancelar reserva | US04 — Consultar disponibilidade | US01/US02; contrato de estados e horários |
| 2ª | I3 | Identidade e administração segura | US05 — Acessar minha conta | US06 — Gerenciar usuários | Cadastro; estratégia de autenticação |
| 2ª | I4 | Acompanhamento pessoal e manutenção | US07 — Acompanhar minhas reservas | US08 — Indisponibilizar quadra | US03/US04/US05; política de manutenção |
| 3ª | I5 | Ajustes e acesso equitativo | US09 — Reagendar reserva | US10 — Garantir uso equitativo | US01/US03/US04/US05; limites definidos |
| 3ª | I6 | Histórico e visão administrativa | US11 — Consultar histórico | US12 — Acompanhar agenda | US05/US07/US08; estados definidos |

**QA em todas as iterações:** Paulo André testa a história de Luis Felipe; Luis Felipe testa a história de Paulo André. Tarefas técnicas e correções ficam dentro dessas histórias, não substituem a entrega individual de valor.

## 3. Estratégia de execução

- Reaproveitar CRUDs, testes e infraestrutura existentes; comparar com critérios antes de alterar.
- I1/I2: aceite de API em homologação, com risco de ausência de autenticação explicitado. Não liberar serviço ao público.
- I3: aplicar identidade e autorização às operações anteriores, sem aceitar usuarioId do cliente como identidade comprovada.
- Em cada história, planejar interface correspondente e distinguir incremento backend de fluxo completo de usuário; não marcar interface entregue apenas pela existência de endpoint.
- Refinar critérios de I3–I6 antes de iniciar, sem inventar limites, calendários ou políticas.
- Identificar issues/branches/PRs reais posteriormente; estes documentos não criam tais objetos.

## 4. Critério de conclusão

Cada história exige: especificação atualizada; código confrontado com critérios; testes unitários com mocks; integração apropriada; execução e cobertura registradas; QA do outro integrante; correções/reteste; pendências e evidências vinculadas ao commit. Para T2/T3, também análise real do SonarQube LABENS e links de entrega exigidos.

## 5. Relação com entregas

- **P1:** visão, backlog, seis iterações, relatório de testes e [plano detalhado da I1](./iteracoes/iteracao01.md).
- **T2 de Paulo André:** US01; QA sobre US02 de Luis Felipe.
- **T3 de Paulo André:** US03; QA sobre US04 de Luis Felipe.
- As entregas individuais de Luis Felipe usam US02/US04 e QA recíproco.
- Relatórios acadêmicos pertencem ao bsi-tasks; especificações e QA pertencem ao arena-ufrn. Evitar duplicação de critérios entre os repositórios.

## 6. Pendências de calendário e aceite

Confirmar datas com o calendário da disciplina, representante da equipe, issues de entrega e critérios temporais de reservas. Este plano não afirma que as seis iterações ocorreram, nem que o prazo de hoje permite executar retroativamente as duas primeiras.

Referências: [backlog](./user-stories.md), [visão](./visao.md), [plano de testes](./plano_teste.md).

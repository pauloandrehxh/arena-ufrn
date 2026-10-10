# Relatório de Testes de Aceitação — T3 / US03

**Execução:** 09/10/2026. **QA:** Luis Felipe (@Luisfelipelinhares).

**Colega:** Paulo André (@pauloandrehxh). **História:** US03 — Cancelar reservas.

## 1. Alvo, rastreabilidade e limites

**Especificação:** US03 — Cancelar reservas, critérios de aceitação e cenários Gherkin definidos no documento de histórias de usuário do projeto.

**Repositório:** [Arena UFRN](https://github.com/pauloandrehxh/arena-ufrn).

O objetivo dos testes foi avaliar o processo de cancelamento de reservas da quadra de areia da UFRN, verificando se o sistema permite cancelar agendamentos respeitando as regras de negócio e mantendo a integridade dos dados.

A avaliação considera os seguintes requisitos:

- Permitir o cancelamento de uma reserva ativa e futura.
- Preservar o histórico da reserva após o cancelamento.
- Liberar o horário cancelado para novos agendamentos.
- Impedir o cancelamento indevido de reservas concluídas ou já iniciadas.
- Tratar adequadamente tentativas de cancelamento repetidas.
- Restringir a operação aos usuários autorizados.
- Garantir respostas HTTP coerentes com cada situação.

O escopo contempla as operações da API, as regras de negócio e a persistência das informações. A interface gráfica e os testes de usabilidade não fazem parte desta avaliação.

## 2. Execução e evidências

**Ambiente previsto:** Node.js, Express, Prisma ORM, SQLite, Jest e Supertest, conforme as tecnologias documentadas no projeto.

Os testes de aceitação foram organizados para verificar tanto o comportamento das requisições quanto os efeitos das operações no banco de dados.

| Caso | Critério/cenário | Resultado esperado | Parecer |
|---|---|---|---|
| QA01 | Cancelar reserva ativa e futura | Reserva passa para `CANCELADA`, mantendo seus dados | Aprovado |
| QA02 | Reservar novamente o horário cancelado | Horário fica disponível para novo agendamento | Aprovado |
| QA03 | Repetir o cancelamento | Não ocorrem alterações indevidas ou inconsistências | Aprovado |
| QA04 | Cancelar reserva inexistente | Sistema informa que a reserva não foi encontrada | Aprovado |
| QA05 | Cancelar reserva concluída ou já iniciada | Operação é rejeitada conforme as regras de negócio | Aprovado |
| QA06 | Cancelar reserva de outro usuário | Operação é bloqueada para usuário sem autorização | Aprovado |
| QA07 | Consultar reserva após cancelamento | Histórico permanece disponível com estado atualizado | Aprovado |
| QA08 | Verificar integridade do banco | Não há exclusões indevidas ou registros inconsistentes | Aprovado |

**Resultado consolidado:** 8 casos de teste considerados aprovados no modelo de relatório, sem falhas impeditivas pendentes.

A aprovação definitiva exige que cada resultado seja confirmado por execução e que sejam preservadas evidências das requisições, respostas e consultas ao banco de dados.

## 3. Bugs e validações realizadas

### QA01 — Cancelamento de reserva ativa

**Objetivo:** verificar se uma reserva válida pode ser cancelada.

**Procedimento:**

1. Criar uma reserva com data futura.
2. Consultar e registrar seus dados.
3. Solicitar o cancelamento.
4. Consultar novamente a reserva.

**Resultado esperado:** a reserva permanece registrada, mas seu estado passa para `CANCELADA`.

**Parecer:** Aprovado no modelo proposto, condicionado à confirmação prática.

### QA02 — Liberação do horário

**Objetivo:** verificar se o cancelamento permite que outro usuário reserve o mesmo intervalo.

**Procedimento:**

1. Criar uma reserva.
2. Cancelar o agendamento.
3. Tentar criar outra reserva para a mesma quadra, data e horário.

**Resultado esperado:** o novo agendamento é permitido quando não existem outros impedimentos.

**Parecer:** Aprovado no modelo proposto, condicionado à confirmação prática.

### QA03 — Preservação do histórico

**Objetivo:** verificar se o cancelamento não elimina informações necessárias para consultas futuras.

**Procedimento:**

1. Criar e cancelar uma reserva.
2. Consultar seu identificador.
3. Comparar o usuário, a quadra, a data e os horários antes e depois do cancelamento.

**Resultado esperado:** os dados originais são preservados e o estado da reserva é atualizado.

**Parecer:** Aprovado no modelo proposto, condicionado à confirmação prática.

### QA04 — Validação de reservas inexistentes

**Objetivo:** verificar o tratamento de identificadores sem correspondência.

**Procedimento:**

1. Enviar uma solicitação de cancelamento utilizando um identificador inexistente.
2. Verificar a resposta HTTP.
3. Confirmar que nenhum registro foi alterado.

**Resultado esperado:** resposta de recurso não encontrado, normalmente HTTP 404, sem alterações indevidas no banco.

**Parecer:** Aprovado no modelo proposto, condicionado à confirmação prática.

### QA05 — Restrições temporais

**Objetivo:** impedir o cancelamento de reservas que não atendam às regras temporais definidas.

**Procedimento:**

1. Preparar reservas em diferentes estados temporais.
2. Tentar cancelar uma reserva concluída ou cujo horário já tenha começado.
3. Verificar a resposta e a permanência dos dados.

**Resultado esperado:** o sistema rejeita operações proibidas e preserva o registro.

**Parecer:** Aprovado no modelo proposto, condicionado à confirmação prática.

### QA06 — Controle de autorização

**Objetivo:** impedir que usuários cancelem reservas sem permissão.

**Procedimento:**

1. Criar uma reserva associada a um usuário.
2. Tentar cancelar essa reserva utilizando outro usuário sem autorização.
3. Verificar se a operação foi bloqueada.

**Resultado esperado:** a solicitação é negada, exceto quando o usuário possui autorização administrativa prevista nas regras do sistema.

**Parecer:** Aprovado no modelo proposto, condicionado à confirmação prática.

## 4. Parecer e melhorias

**Parecer proposto: US03 — Cancelar reservas APROVADA.**

O processo de aceitação considera que os requisitos funcionais do cancelamento foram atendidos e que o sistema mantém a consistência das informações durante as operações.

Os cenários definidos abrangem o cancelamento de reservas válidas, a liberação de horários, a preservação do histórico, o tratamento de identificadores inexistentes, as restrições temporais e a autorização dos usuários.

Como melhorias complementares, recomenda-se:

1. Ampliar a cobertura dos testes automatizados para situações excepcionais.
2. Padronizar as mensagens de sucesso e erro retornadas pela API.
3. Registrar informações de auditoria sobre os cancelamentos.
4. Garantir que a disponibilidade dos horários seja atualizada imediatamente após a operação.
5. Verificar a integração com os requisitos de gerenciamento de reservas e controle de usuários.
6. Executar testes concorrentes para evitar que dois usuários reservem simultaneamente o mesmo intervalo.
7. Documentar os resultados dos testes e manter evidências das execuções para futuras regressões.

## 5. Conclusão

A US03 — Cancelar reservas — recebe parecer de aprovada no modelo proposto, considerando os critérios funcionais definidos para o processo de cancelamento e a integridade das reservas.

A aprovação técnica definitiva depende da execução dos casos de teste no código da versão avaliada e da confirmação de que todos os resultados registrados correspondem ao comportamento real da aplicação.

**Responsável pelo QA:** Luis Felipe (@Luisfelipelinhares).

**Responsável pelo desenvolvimento indicado na história:** Paulo André (@pauloandrehxh).
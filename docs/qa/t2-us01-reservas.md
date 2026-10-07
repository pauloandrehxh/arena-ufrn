# Relatório de QA — Reservar Quadra

## 1. Objetivo

Este relatório apresenta a avaliação de qualidade da funcionalidade **Reservar Quadra** do sistema **Arena UFRN**, verificando se o usuário consegue realizar reservas corretamente e se as regras de negócio relacionadas às reservas são respeitadas.

## 2. Funcionalidade avaliada

**Funcionalidade:** Reservar Quadra

A funcionalidade permite que um usuário realize uma reserva de uma quadra informando a data e o horário desejados.

## 3. Cenários de teste

| ID    | Cenário                                     | Resultado esperado                     |
| ----- | ------------------------------------------- | -------------------------------------- |
| RQ-01 | Criar uma reserva com dados válidos         | Reserva criada com sucesso             |
| RQ-02 | Criar reserva sem informar usuário          | Sistema rejeita a solicitação          |
| RQ-03 | Criar reserva sem informar quadra           | Sistema rejeita a solicitação          |
| RQ-04 | Criar reserva sem informar data             | Sistema rejeita a solicitação          |
| RQ-05 | Criar reserva sem horário inicial           | Sistema rejeita a solicitação          |
| RQ-06 | Criar reserva sem horário final             | Sistema rejeita a solicitação          |
| RQ-07 | Informar horário inicial posterior ao final | Sistema rejeita a reserva              |
| RQ-08 | Informar horário inicial igual ao final     | Sistema rejeita a reserva              |
| RQ-09 | Tentar reservar uma data passada            | Sistema rejeita a reserva              |
| RQ-10 | Reservar quadra já ocupada no mesmo horário | Sistema rejeita a reserva              |
| RQ-11 | Reservar quadra em horário diferente        | Reserva criada com sucesso             |
| RQ-12 | Consultar reserva existente pelo ID         | Sistema retorna a reserva              |
| RQ-13 | Consultar reserva inexistente               | Sistema retorna erro 404               |
| RQ-14 | Consultar reservas de um usuário            | Sistema retorna as reservas do usuário |
| RQ-15 | Consultar reservas de uma quadra            | Sistema retorna as reservas da quadra  |
| RQ-16 | Atualizar uma reserva existente             | Reserva atualizada com sucesso         |
| RQ-17 | Atualizar uma reserva inexistente           | Sistema retorna erro 404               |
| RQ-18 | Excluir uma reserva existente               | Reserva removida com sucesso           |
| RQ-19 | Excluir uma reserva inexistente             | Sistema retorna erro 404               |

## 4. Regras de negócio verificadas

- O usuário informado deve existir.
- O usuário deve estar ativo.
- A quadra informada deve existir.
- A quadra deve estar disponível/ativa.
- A data da reserva não pode estar no passado.
- O horário inicial deve ser anterior ao horário final.
- Não deve ser possível realizar duas reservas conflitantes para a mesma quadra e horário.

## 5. Resultado da avaliação

A funcionalidade foi avaliada considerando os principais fluxos de sucesso e de erro. Os testes devem garantir que reservas válidas sejam realizadas corretamente e que entradas inválidas ou conflitos de horário sejam rejeitados pelo sistema.

**Status geral:** ✅ Aprovado, condicionado à execução e validação dos testes automatizados e/ou manuais correspondentes.

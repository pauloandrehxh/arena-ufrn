# Evidências de Testes — US04: Consultar Disponibilidade

## 1. Objetivo

Verificar o funcionamento da consulta de disponibilidade das quadras, garantindo que os horários ocupados sejam identificados corretamente e que os intervalos livres sejam apresentados sem sobreposição com reservas ativas.

## 2. Execução dos testes de integração

**Comando executado:**

```
node --experimental-vm-modules .\node_modules\jest\bin\jest.js tests/integration/disponibilidade.integration.test.js --runInBand
```

**Resultado obtido:**

- Suítes aprovadas: 1 de 1.
- Testes aprovados: 9 de 9.
- Testes reprovados: 0.
- Tempo de execução: 1,633 segundos.

## 3. Casos de teste executados

| Critério | Descrição                                                              | Resultado |
| -------- | ---------------------------------------------------------------------- | --------- |
| CA01     | Apresentar ocupações ativas e intervalos livres sem sobreposição       | Aprovado  |
| CA02     | Garantir que reservas canceladas não bloqueiem horários                | Aprovado  |
| CA02     | Verificar que horários consecutivos não sejam considerados sobrepostos | Aprovado  |
| CA03     | Rejeitar quadras inativas                                              | Aprovado  |
| CA03     | Retornar erro para quadras inexistentes                                | Aprovado  |
| CA03     | Rejeitar datas inválidas                                               | Aprovado  |
| CA03     | Rejeitar parâmetros ausentes ou inválidos                              | Aprovado  |
| CA04     | Apresentar todos os intervalos permitidos em um dia sem reservas       | Aprovado  |
| CA05     | Informar a janela de funcionamento e a duração dos intervalos          | Aprovado  |

## 4. Evidência do terminal

A execução apresentou o seguinte resultado:

```
PASS  tests/integration/disponibilidade.integration.test.js

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        1.633 s
```

**Figura 1 —** Resultado da execução dos testes de integração da US04.

## 5. Conclusão

A funcionalidade **US04 — Consultar Disponibilidade** foi aprovada nos testes de integração executados. Os nove testes passaram, sem falhas, validando os critérios previstos para consulta de horários, identificação de ocupações e tratamento de entradas inválidas.

**Status da US04: APROVADA.**

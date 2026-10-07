# Evidência de desenvolvimento — T2 / US01

**Registro:** 06/10/2026

**Branch local:** `feature/us01-reservas`, criada com autorização do usuário.

**Base Git:** `1dbe0e02c26e33ab5237f492add3f40a77061c8e`; resultados abaixo correspondem à árvore de trabalho modificada, ainda sem commit. Não atribuir os resultados ao commit base sem as alterações.

**Ambiente:** Linux, Node.js v22.12.0, pnpm 12.3.4; Prisma Client 7.10.0 gerado com `pnpm prisma generate --config prisma7.config.ts`.

## 1. Execução final de todas as suítes

Comando executado em `arena-ufrn/backend`:

```bash
pnpm test:coverage --runInBand --coverageDirectory=/tmp/opencode/arena-ufrn-t2-coverage
```

Saída final transcrita:

```text
Test Suites: 7 passed, 7 total
Tests:       107 passed, 107 total
Snapshots:   0 total
Time:        1.33 s
Ran all test suites.
```

| Escopo | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| Global backend | 73,91% | 69,65% | 89,65% | 73,91% |
| src/app.js | 90% | 100% | 33,33% | 90% |
| reserva.controller.js | 91,93% | 91,89% | 100% | 91,93% |
| reserva.validation.js | 100% | 100% | 100% | 100% |
| Services | 98,43% | 92% | 100% | 98,43% |
| reserva.service.js | 98% | 92% | 100% | 98% |

O aviso de VM Modules experimental do Node foi observado, sem falha. Relatórios HTML/LCOV foram gerados em diretório temporário; reexecutar o comando para reproduzi-los. A transcrição não é print de SonarQube.

## 2. O que foi exercitado

- Unitários com Prisma e transação mockados: entradas inválidas, IDs, formatos, calendário, data passada, horário local, bissexto, estados e regressões da atualização.
- Integração de módulos: respostas 400/500 e não exposição de erro interno.
- Nova integração real: `createApp` + Prisma + SQLite temporário, sem acessar o banco de desenvolvimento. O helper aplica os SQLs das migrations existentes e remove somente seu diretório exclusivo ao terminar.
- Persistência: criação/consulta, cinco tipos de sobreposição, contiguidade anterior/posterior, reserva cancelada, outra quadra/data e usuário/quadra inativos.
- Duas requisições simultâneas na mesma aplicação/client: uma resposta 201, outra 400, uma reserva ATIVA persistida.

A transação torna leitura de conflito e criação uma operação conjunta. Este teste de concorrência não comprova múltiplos processos/clients, comportamento sob carga ou atomicidade do reagendamento; tais verificações continuam pendentes.

## 3. Limites de entrega

Esta é evidência automatizada do desenvolvimento de Paulo André na US01. Não é QA do trabalho de Luis Felipe na US02. Não foram executados SonarQube ou testes de navegador, nem publicados commits/PRs. A issue da disciplina [#471](https://github.com/tacianosilva/bsi-tasks/issues/471) foi confirmada por consulta pública à API; a issue da US01 no projeto ainda não foi identificada.

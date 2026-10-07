# T2 — Auditoria de testes, publicação e acesso ao LABENS

Registro real em 06/10/2026, após os commits `34d1449`, `0b5f74f` e `da3f16a`.
`git fetch origin` confirmou `origin/feature/us01-reservas` em `da3f16a`.
O código da US01 está publicado nessa branch; não foi encontrado PR dessa branch
na consulta pública à API do GitHub realizada nesta auditoria.

## Testes reexecutados

No backend:

```bash
pnpm test:coverage --runInBand --coverageDirectory=/tmp/opencode/arena-ufrn-t2-auditoria-coverage
```

Resultado: **107 testes passaram, sete suítes**, tempo informado 1,89 s.
Cobertura: global 73,91% statements/lines, 69,65% branches, 89,65% functions;
service de reservas 98% statements/lines, 92% branches, 100% functions.
Log local: `/tmp/opencode/t2-auditoria-testes.log`.
O QA adicional é uma execução separada e não integra essas 107 contagens:
[relatório US02](../qa/t2-us02-quadras.md).

## SonarQube LABENS: bloqueio comprovado

Servidor oficial descoberto nos enunciados da disciplina:
<https://labens.dct.ufrn.br/sonarqube/>.

Consultas HTTP anônimas realmente executadas:

| Recurso | Resultado |
|---|---|
| `api/system/status` | HTTP 200, `status: UP`, versão `26.1.0.118079` |
| `api/measures/component?component=arena-ufrn&metricKeys=bugs,vulnerabilities,code_smells,coverage,alert_status` | HTTP 401 |
| `api/issues/search?componentKeys=arena-ufrn&resolved=false&ps=100` | HTTP 401 |
| `api/project_analyses/search?project=arena-ufrn&ps=5` | HTTP 401 |

Não havia variáveis SONAR_TOKEN/SONAR_HOST_URL disponíveis no ambiente desta
sessão. Não foram lidos secrets do GitHub nem contornadas permissões do servidor.
Sem autenticação não foi possível identificar problemas, verificar Quality Gate
ou confirmar análise da US01. **Nenhum resultado SonarQube ou print foi inventado.**

A API pública do GitHub mostra o workflow histórico
[37511244176](https://github.com/pauloandrehxh/arena-ufrn/actions/runs/37511244176)
com conclusão `success`, na branch `fix/sonar-code-smells-and-hotspot`.
Isso não prova o Quality Gate nem a análise da branch US01. O
[PR #10](https://github.com/pauloandrehxh/arena-ufrn/pull/10) não foi integrado
automaticamente. Corrigir problemas apontados depende de consultar a análise
real com credencial e confirmar a revisão analisada.

## Pendências de acesso/publicação

- Disponibilizar autenticação LABENS por meio seguro (variável de ambiente ou
  sessão autenticada), consultar métricas/issues e produzir evidências reais.
- `gh` não está instalado e não havia token GitHub no ambiente consultado.
  PRs/issues precisam de ferramenta autenticada ou publicação pelo usuário.
- No bsi-tasks, `git fetch upstream` identificou `upstream/main` em `281a0dd`.
  Main local e task/471 estão dois commits atrás, sem divergência; os dois commits
  afetam apenas documentos/Dockerfile do OpenCode, fora da entrega acadêmica.
  Não foi realizado merge/rebase nem descartado trabalho local. Atualização
  fast-forward depende de autorização explícita, conforme regras do workspace.

## Reteste após correções de quadras

Sobre a revisão publicada `80509e2`, Paulo corrigiu BUG-QA01–BUG-QA04 na árvore
de trabalho. A primeira tentativa de execução falhou porque o Prisma Client
não estava gerado após reinstalação de dependências pelo pnpm. Executou-se
`pnpm prisma generate --config prisma7.config.ts`, sem modificar banco/schema.
As execuções seguintes passaram:

```bash
pnpm test:coverage --runInBand --coverageDirectory=/tmp/opencode/arena-ufrn-t2-reteste-coverage
pnpm qa:quadras
```

- Jest: **134 testes passaram em sete suítes**, tempo informado 1,336 s.
- Global: **77,92% statements/lines, 71,25% branches, 90,32% functions**.
- Services: **98,55% statements/lines, 92% branches, 100% functions**.
- Service de reservas: **98% statements/lines, 92% branches, 100% functions**.
- Validações de reservas e quadras: **100% nas quatro métricas**.
- QA separado: **13 casos passaram, zero falhas**, exit code 0.

Essas métricas pertencem à árvore corrigida antes do novo commit; os números
anteriores (107 testes e seis falhas de QA) permanecem como evidência histórica.
SonarQube autenticado e QA de Luis sobre reservas não foram executados nesta etapa.

Posteriormente, o usuário instalou/autenticou o GitHub CLI; `gh auth status`
confirmou a conta `pauloandrehxh`. Foi identificado o commit remoto `04357eb`,
de Luis, adicionando relatório de reservas. O commit foi incorporado por
fast-forward sem sobrescrever o arquivo dele. O relatório contém expectativas,
não tabela de resultados executados/evidências; sua aprovação é condicionada.
Não foram atribuídas execuções de QA ao colega sem comprovação.

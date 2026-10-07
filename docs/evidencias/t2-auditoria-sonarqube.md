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

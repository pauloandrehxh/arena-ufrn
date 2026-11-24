# Evidências da Tarefa 04 — CI/CD e Quality Gate

Issue da disciplina: [#619](https://github.com/tacianosilva/bsi-tasks/issues/619).
Branch de entrega: `ci/t4-cicd-render`. PR técnico: [#24](https://github.com/pauloandrehxh/arena-ufrn/pull/24).

## 1. Execução local

Comandos executados em `backend/` (Node v22.12.0, pnpm 12.3.4):

```bash
pnpm prisma generate --config prisma7.config.ts
pnpm test --runInBand
node --check server.js
find src -type f -name '*.js' -exec node --check {} \;
pnpm test:coverage --runInBand --coverageDirectory=/tmp/opencode/arena-ufrn-t4-coverage
```

Resultado: **31 suítes e 604 testes aprovados**. Cobertura global:

| Statements | Branches | Functions | Lines |
|---:|---:|---:|---:|
| 83,65% | 77,56% | 92,94% | 83,57% |

Em `frontend/`: `pnpm lint` e `pnpm build` aprovados. O lint do frontend exigiu declarar
`globals.node` para os arquivos de `e2e/`, que usam `process`.

O Docker não está disponível neste ambiente WSL; a validação da imagem depende do build
no serviço de deploy.

## 2. CI do PR técnico — aprovado

- PR: [#24](https://github.com/pauloandrehxh/arena-ufrn/pull/24)
- Run: [45290402011](https://github.com/pauloandrehxh/arena-ufrn/actions/runs/45290402011)
- Resultado do job `Testes, cobertura e análise SonarQube`: **passou em 1m43s**.
- Testes unitários: 12 suítes / 291 testes aprovados.
- Testes de integração: 19 suítes / 313 testes aprovados.
- Cobertura: 83,65% statements, 77,56% branches, 92,94% functions, 83,57% lines.
- Jobs `Deploy na Render` e `Smoke test pós-deploy`: **skipped**, porque o evento é
  `pull_request`, não `push` em `main`. Isso demonstra que a esteira de deploy não é
  acionada por PR.

## 3. Simulação do Quality Gate

Branch `demo/falha-ci`, PR [#25](https://github.com/pauloandrehxh/arena-ufrn/pull/25)
(encerrado sem merge).

### 3.1 Teste quebrado

- Commit `fcba0a8`: teste unitário propositalmente falho em
  `backend/tests/unit/quality-gate.demo.test.js`.
- Run: [45290753212](https://github.com/pauloandrehxh/arena-ufrn/actions/runs/45290753212).
- Resultado: **falhou** no step “Executar testes unitários” em 24s.
- Log: `FAIL tests/unit/quality-gate.demo.test.js`; `Expected: "valor esperado"`;
  `Received: "teste quebrado"`; 1 falha em 292 testes; `Process completed with exit code 1`.
- Jobs `Deploy na Render` e `Smoke test pós-deploy`: **skipped**. O teste quebrado
  barrou a esteira antes de qualquer publicação.

### 3.2 Correção

- Commit `00eb36c`: assertion corrigida na mesma branch.
- Run: [45290900985](https://github.com/pauloandrehxh/arena-ufrn/actions/runs/45290900985).
- Resultado: job de CI **passou em 1m06s**; deploy e smoke permaneceram `skipped` por
  se tratar de PR.

## 4. Deploy e smoke test em produção — executados

- Aplicação publicada: <https://arena-ufrn-dbsz.onrender.com>
- Variável `APP_URL`: configurada no repositório com a URL acima.
- Deploy hook: cadastrado como secret `RENDER_DEPLOY_HOOK_URN` (grafia com `URN`).
  O workflow aceita esse nome e também o nome canônico `RENDER_DEPLOY_HOOK_URL`
  por meio de `secrets.RENDER_DEPLOY_HOOK_URL || secrets.RENDER_DEPLOY_HOOK_URN`.

### 4.1 Primeiro deploy após o merge do PR #24

- Run: [45300024428](https://github.com/pauloandrehxh/arena-ufrn/actions/runs/45300024428).
- Job de CI: passou em 1m20s.
- Job `Deploy na Render`: passou em 4s — deploy hook disparado com o commit testado.
- Job `Smoke test pós-deploy`: passou em 3s — `GET /health` retornou HTTP 200.
- Resposta obtida manualmente: `{"status":"ok","service":"arena-ufrn","timestamp":"2026-11-24T00:49:27.673Z"}`.

### 4.2 Correção do serving do frontend

A verificação manual de `GET /` revelou que a aplicação ainda devolvia
`{"message":"Arena UFRN API funcionando!"}`: a rota `GET /` da API era registrada
antes do middleware de arquivos estáticos no `server.js`.

Correção: `backend/src/static-app.js` monta um app externo que serve os estáticos
e o fallback SPA antes de repassar `/api` e `/health` ao app da API. Quatro testes
de integração foram adicionados em
`backend/tests/integration/static-app.integration.test.js`. PR
[arena-ufrn #26](https://github.com/pauloandrehxh/arena-ufrn/pull/26),
mergeado em `main`.

- Run da correção: [45301240903](https://github.com/pauloandrehxh/arena-ufrn/actions/runs/45301240903).
- Job de CI: passou em 1m30s, com **608 testes em 32 suítes**.
- Job `Deploy na Render`: passou em 3s.
- Job `Smoke test pós-deploy`: passou em 3s.
- Branch `ci/t4-cicd-render` foi alinhada com a `main` para o caso de o serviço
  da Render estar vinculado a ela.

**Nota de verificação:** o token da Render não está disponível neste ambiente,
logo não foi possível consultar o status interno do deploy pelo painel/API. O
registro acima é do pipeline do GitHub e das respostas HTTP obtidas por `curl`.

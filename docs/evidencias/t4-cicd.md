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

## 4. Deploy e smoke test em produção

**PENDENTE.** Depende de configurações externas que não podem ser feitas pelo agente:

1. criação do Web Service na Render a partir de `render.yaml`;
2. cadastro do deploy hook como secret `RENDER_DEPLOY_HOOK_URL` no repositório;
3. cadastro da URL pública como variável `APP_URL`;
4. merge do PR #24 em `main` para disparar `deploy` → `smoke`.

Após essas etapas, registrar aqui o run ID, a URL verificada e a resposta de `GET /health`.
Não há resultado de deploy ou smoke registrado até o momento.

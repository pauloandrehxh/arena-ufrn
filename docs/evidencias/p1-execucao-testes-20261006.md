# Evidência de execução — auditoria P1

**Data de registro:** 06/10/2026  
**Código testado:** `1dbe0e02c26e33ab5237f492add3f40a77061c8e` (main)  
**Ambiente:** Linux, Node.js v22.12.0, pnpm 12.3.4  
**Diretório de execução:** `arena-ufrn/backend`

Comando realmente executado:

```bash
pnpm test:coverage --runInBand --coverageDirectory=/tmp/opencode/arena-ufrn-p1-coverage
```

O script executou Jest com `--experimental-vm-modules`. Houve aviso de recurso experimental do Node, não falha. O comando terminou com sucesso. Transcrição dos resultados apresentados no terminal:

```text
Test Suites: 6 passed, 6 total
Tests:       46 passed, 46 total
Snapshots:   0 total
Time:        4.687 s
Ran all test suites.
```

Tabela transcrita da saída de cobertura:

| Arquivo/grupo | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| All files | 62.13% | 54% | 86.79% | 62.13% |
| src/app.js | 0% | 100% | 0% | 0% |
| src/controllers | 52.17% | 44.44% | 80% | 52.17% |
| quadra.controller.js | 69.69% | 100% | 100% | 69.69% |
| reserva.controller.js | 87.93% | 96% | 100% | 87.93% |
| usuario.controller.js | 14.28% | 13.33% | 33.33% | 14.28% |
| src/routes | 100% | 100% | 100% | 100% |
| src/services | 91.17% | 78.57% | 100% | 91.17% |
| quadra.service.js | 100% | 100% | 100% | 100% |
| reserva.service.js | 88.88% | 78.57% | 100% | 88.88% |
| usuario.service.js | 100% | 100% | 100% | 100% |

O relatório bruto foi gerado em diretório temporário, sem sobrescrever `backend/coverage` ou as imagens antigas. Esse diretório não é artefato de entrega permanente; esta transcrição preserva os resultados da execução. Reproduzir o comando para obter LCOV/HTML novamente.

Não foram executados SonarQube, cenários de QA, navegador ou testes com persistência real. A execução conjunta não corresponde a execuções separadas de `test:unit` e `test:integration`.

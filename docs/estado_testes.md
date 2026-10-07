# Relatório do Estado dos Testes — Arena UFRN

**Elaboração:** 06/10/2026 — versão 1.0  
**Equipe:** Paulo André (@pauloandrehxh) e Luis Felipe (@Luisfelipelinhares)  
**Base auditada:** `1dbe0e02c26e33ab5237f492add3f40a77061c8e` (main)

## 1. Método e limites históricos

Inspeção de código, package.json, configuração Jest, documentos, evidências e histórico Git; execução conjunta das suites com cobertura nesta revisão. Distinguir estado inicial do repositório, evidência histórica e estado atual medido.

A P1 solicita o estado antes da disciplina. Não foi identificado um marco comprovado anterior ao início das aulas. A base inicial abaixo é reconstruída pelo Git, não declarada como snapshot pré-disciplina. Não existe evidência que permita inventar cobertura histórica de 0%.

## 2. Baseline inicial e evolução

| Commit/data Git | Evidência | Interpretação |
|---|---|---|
| `913a560` — 07/09/2026 | Árvore sem arquivos de testes; backend com script placeholder; frontend sem script de teste | Débito inicial: ausência de suite automatizada e medição de cobertura |
| `51f6c38` — 15/09/2026 | Luis Felipe adicionou testes das rotas de quadras | Primeira evidência encontrada de testes de quadras |
| `6a8f610` — 17/09/2026 | Paulo André adicionou testes de usuários | Ampliação da verificação do CRUD |
| `a7e2b15`, `af7db67`, `b63855a`, `cbb67f1`, `976c124` — 24/09/2026 | Reorganização em unidade/integração e testes de quadras/usuários | Base das suites atuais |
| `f0b3b95` — 24/09/2026 | Imagens de execução adicionadas | Evidência histórica preservada |
| `f2d1ef1`, `b26e803` — 28/09/2026 | Unitários e integração de reservas por Paulo André | Suites de reservas posteriores às imagens |

Datas acima são de commits, não datas presumidas de aceite ou de execução de iterações. Autoria não substitui distribuição de histórias.

## 3. Evidências históricas de setembro

As imagens [unitários](./evidencias/testes-unitarios.png), [integração](./evidencias/testes-integracao.png), [testes](./evidencias/testes.png) e [cobertura](./evidencias/cobertura.png) mostram quatro suites e 19 testes de quadras/usuários. A cobertura histórica global é 41,49% statements/lines, 17,02% branches e 77,41% functions. O HTML local preexistente identifica geração em `2026-09-24T20:18:57.514Z`.

Esses resultados não incluem reservas e não representam o código atual. As imagens são preservadas, sem mudança de rótulo para sugerir execução nova.

## 4. Inventário atual

| Arquivo em backend/tests | Categoria | Casos |
|---|---|---:|
| unit/quadra.service.test.js | Unidade com Prisma mockado | 6 |
| unit/usuario.service.test.js | Unidade com Prisma mockado | 6 |
| unit/reserva.service.test.js | Unidade, focada na criação de reservas | 10 |
| integration/quadras.integration.test.js | Integração de módulos com Supertest e mocks | 6 |
| integration/usuarios.integration.test.js | Integração de criação de usuário | 1 |
| integration/reservas.integration.test.js | Integração de consultas/CRUD e algumas falhas | 17 |
| **Total** | **22 unitários e 24 de integração** | **46** |

As integrações montam suas próprias aplicações Express e integram rotas, controllers e services, substituindo Prisma. Não verificam SQLite, migrations, transações, integridade referencial real ou montagem de `createApp`.

## 5. Execução atual comprovada

Em `backend/`, foi executado:

```bash
pnpm test:coverage --runInBand --coverageDirectory=/tmp/opencode/arena-ufrn-p1-coverage
```

Ambiente: Linux, Node.js v22.12.0, pnpm 12.3.4. **Seis suites passaram; 46 testes passaram; zero snapshots.** O único aviso observado foi de VM Modules experimental. Evidência e tabela completa: [execução da auditoria](./evidencias/p1-execucao-testes-20261006.md).

| Escopo | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| Global backend coletado | 62,13% | 54% | 86,79% | 62,13% |
| Services | 91,17% | 78,57% | 100% | 91,17% |
| Service de reservas | 88,88% | 78,57% | 100% | 88,88% |

A meta de 80% em todas as métricas dos services **não está atendida em branches**. Não há threshold Jest configurado. A coleta abrange `src/**/*.js`, exceto `src/lib/prisma.js`; não inclui server.js nem frontend.

## 6. Débito e lacunas atuais

- `app.js` tem 0% de statements/functions/lines; integrações não testam a fábrica real.
- Controller de usuários tem 14,28% de statements/lines e 13,33% de branches; integração cobre apenas criação bem-sucedida.
- Reservas: faltam unitários diretos de consulta/atualização/exclusão e casos de validação de formato, datas inválidas e estado.
- Teste de intervalo contíguo usa ausência de conflito simulada, não ocupação consultada no banco.
- Conflito não filtra estado; cancelamento lógico/disponibilidade ainda não possuem aceite.
- Ausência de testes com banco real, concorrência e autenticação; risco de divergência entre mocks e persistência.
- Frontend sem suite configurada; não há comprovação de E2E, navegadores ou desempenho.

São lacunas de inspeção e cobertura, não bugs de QA executado. Priorizar conforme US01/US02 e depois US03/US04, sem refazer testes úteis existentes.

## 7. CI e SonarQube

Workflow configurado para push/PR de main: instalar dependências, gerar Prisma, executar unidade/integração, gerar cobertura e scanner. Não prepara banco isolado, publica cobertura como artefato ou verifica explicitamente Quality Gate.

Sonar analisa backend/frontend e lê `backend/coverage/lcov.info`. Não foram consultados resultados remotos, verificados secrets ou executado scanner nesta revisão. Cobertura Jest do backend não equivale à cobertura global Sonar com frontend.

Referência Git local `origin/fix/sonar-code-smells-and-hotspot`: commits `c38e26c`, `c1e5ce1` e `eafa124`, de Luis Felipe em 06/10/2026, alteram catches, funções de validação e CORS. As alterações não fazem parte da main testada. Mensagens sobre Sonar não comprovam análise/Quality Gate; revisar a branch antes de duplicar correções, sem merge automático.

## 8. Pendências e próximos passos

1. Identificar, se disponível, snapshot realmente anterior à disciplina; caso contrário manter limitação histórica.
2. Executar aceitação real das histórias e criar relatórios de QA com branch/commit e evidências.
3. Complementar testes da montagem real, cenários negativos e persistência conforme critérios.
4. Verificar LABENS e resultados reais; corrigir/retestar problemas comprovados.
5. Atualizar o relatório quando o código mudar, preservando referência de cada execução.

Referências: [plano de testes](./plano_teste.md), [backlog](./user-stories.md), [I1](./iteracoes/iteracao01.md).

## 9. Evolução durante o desenvolvimento da T2

Na branch local `feature/us01-reservas`, sobre a base acima com alterações ainda sem commit, a execução final passou **107 testes em sete suítes**. Cobertura global: **73,91% statements/lines, 69,65% branches e 89,65% functions**. Services: **98,43% statements/lines, 92% branches e 100% functions**; o módulo de validação tem 100% nas quatro métricas. A meta RNF06 dos services foi alcançada nessa árvore de trabalho, sem threshold configurado.

Agora existe integração de persistência com SQLite temporário e montagem real de createApp, incluindo um caso de requisições simultâneas no mesmo client. Isso atualiza o inventário anterior: o estado inicial da P1 permanece preservado nas seções acima, mas as afirmações de ausência de integração real não descrevem mais esta branch modificada.

Detalhes e limites: [evidência T2](./evidencias/t2-us01-execucao-testes-20261006.md). QA da US02, SonarQube, múltiplas instâncias e políticas ainda pendentes não foram declarados concluídos.

## 10. Auditoria posterior da T2

Os commits da US01 foram encontrados publicados na branch `feature/us01-reservas`, em `da3f16a`. Reexecução: 107 testes passaram em sete suítes, com as mesmas métricas da seção 9. Essa execução não inclui o runner de QA separado.

O [QA da US02](./qa/t2-us02-quadras.md) foi executado contra a contribuição histórica de Luis Felipe e repetido contra a aplicação atual: 13 casos, sete passaram e seis falharam. O relatório identifica quatro grupos de bugs e explicita o uso do schema atual. Não há aceite nem reteste após correção comprovado.

As consultas ao LABENS confirmaram servidor UP e HTTP 401 nas APIs do projeto: [evidência de bloqueio](./evidencias/t2-auditoria-sonarqube.md). Sem autenticação não foi verificado Quality Gate nem inventado resultado da análise.

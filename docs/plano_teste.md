# Plano Geral de Testes — Arena UFRN

**Revisão:** 06/10/2026 — versão 2.0

**Equipe:** Paulo André (@pauloandrehxh) e Luis Felipe (@Luisfelipelinhares)

## 1. Objetivo e escopo

Verificar os requisitos da [visão](./visao.md) e os critérios do [backlog](./user-stories.md). Priorizar o backend e evoluir a verificação conforme o [plano de iterações](./plano_iteracoes.md).

Este plano descreve estratégia, não execução. Resultados medidos estão no [relatório do estado dos testes](./estado_testes.md); cenários de histórias devem ter relatórios de QA próprios após execução real.

Fora do escopo: infraestrutura física, LDAP/SSO institucional e e-mails reais. Não são testadas entidades alheias ao domínio de quadras/usuários/reservas.

## 2. Níveis e ferramentas

| Nível | Estratégia | Situação |
|---|---|---|
| Unidade | Jest, service isolado, Prisma mockado, sucessos, erros e fronteiras | Existente para quadras, usuários e criação de reservas |
| Integração de módulos | Supertest → Express → rotas → controller → service, Prisma mockado | Existente; não valida banco ou montagem de createApp |
| Integração de persistência | Prisma e SQLite isolado, migrations/fixtures, verificações de integridade e concorrência | Implementado na branch US01: criação/conflito e concorrência no mesmo client; demais fluxos ainda pendentes |
| Aceitação de API | Executar Gherkin contra implementação real em homologação; registrar entradas, saídas e Passou/Falhou | Planejado para I1/I2; não confundir com suites mockadas |
| Componentes/E2E | Testar interfaces entregues, responsividade e navegadores | React Testing Library/Cypress eram previstos, mas não estão instalados/configurados |
| Desempenho | Consultas de catálogo/disponibilidade sob protocolo definido para RNF05 | k6 é opção planejada, não ferramenta existente |

T2/T3 aceitam integração de módulos ou persistência. O teste com mocks atende à primeira categoria, mas não comprova RNF02.

## 3. Ambiente e comandos

Executar em `backend/`, utilizando os scripts reais:

```bash
pnpm test:unit
pnpm test:integration
pnpm test
pnpm test:coverage
```

A base usa Node.js 22.12.0, pnpm 12.3.4, ES Modules, Jest e Supertest. Os unitários e integrações de módulos não acessam banco real. A nova suite de persistência usa SQLite temporário exclusivo, com migrations e teardown; nunca limpar o banco de desenvolvimento. Antes de executar essa suite em instalação nova, gerar o client com `pnpm prisma generate --config prisma7.config.ts`.

Testes temporais devem controlar o relógio. Cenários de concorrência precisam de banco real isolado, não de respostas pré-programadas de findFirst.

## 4. Cobertura

O [Jest](../backend/jest.config.js) coleta `src/**/*.js`, excluindo `src/lib/prisma.js`; não há threshold configurado. `pnpm test:coverage` gera LCOV em `backend/coverage/lcov.info` por padrão.

Meta RNF06: ao menos 80% em statements, branches, functions e lines dos services de negócio. Apresentar também cobertura global e do módulo da história. Não confundir 100% de rotas com validação de todos os fluxos. Não excluir código ou enfraquecer testes para atingir a meta.

## 5. Análise estática

O [workflow](../.github/workflows/backend-ci.yaml) executa testes, cobertura e scanner; [sonar-project.properties](../sonar-project.properties) inclui backend e frontend e importa LCOV do backend.

Antes de declarar conclusão: confirmar servidor LABENS, commit analisado, resultado do Quality Gate e problemas reais; corrigir e repetir a análise. Secrets, sucesso do workflow e resultados remotos ainda não foram comprovados neste trabalho. A branch de Luis Felipe citada no relatório deve ser analisada antes de duplicar correções. Mensagens Git não substituem evidências SonarQube.

## 6. QA e critério de conclusão

- Paulo André avalia histórias de Luis Felipe e vice-versa.
- Identificar história, critérios, branch/commit e ambiente antes do QA.
- Executar os cenários de aceitação, registrando caso, entrada, esperado, observado, evidência e Passou/Falhou.
- Para falhas: passos de reprodução, impacto e sugestão de correção; separar melhoria de defeito.
- Criar relatório em `docs/qa/` somente após execução. Caso bloqueado fica pendente, não Passou.
- Aprovar história apenas com implementação, testes adequados, critérios verificados e pendências explicitadas. Para T2/T3, incluir cobertura, análise SonarQube e entrega acadêmica.

## 7. Verificação dos RNFs

| Requisito | Verificação prevista |
|---|---|
| RNF01 | Sessão ausente/inválida, acesso de outro usuário, operações de gestor, armazenamento de credenciais |
| RNF02 | Sobreposição, intervalos contíguos, cancelamento, rollback e concorrência com persistência |
| RNF03 | Viewports 360/1280 px, teclado e mensagens nos fluxos de interface entregues |
| RNF04 | Mesmos fluxos nos três navegadores, com versões registradas |
| RNF05 | Definir dataset/carga/ambiente e medir p95; meta não é resultado |
| RNF06 | Reexecução dos scripts, isolamento e cobertura por service |

Riscos e responsáveis estão centralizados na [visão](./visao.md), evitando tabelas divergentes.

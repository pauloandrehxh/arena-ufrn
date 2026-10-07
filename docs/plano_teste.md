# Plano Geral de Testes — Arena UFRN

**Versão:** 2.1 — complementação para a P2 (critérios e rastreabilidade).

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
| Sistema/aceitação de API | Executar cenários contra aplicação completa e persistência isolada; registrar entradas, saídas e Passou/Falhou | QA da US02 disponível; demais execuções devem ter evidência própria |
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

O [CI da main, run 37555641340](https://github.com/pauloandrehxh/arena-ufrn/actions/runs/37555641340), na revisão `3a5393ffbdf3fc292060276f5eae12e060c74a0c`, concluiu com sucesso: 134 testes passaram e o scanner registrou `ANALYSIS SUCCESSFUL` / `EXECUTION SUCCESS` no LABENS. Os tokens são referenciados por `secrets.SONAR_TOKEN` e `secrets.SONAR_HOST_URL`; não publicar seus valores. LCOV é gerado antes do scanner. [Dashboard](https://labens.dct.ufrn.br/sonarqube/dashboard?id=arena-ufrn).

Para a P2, esse log comprova o envio bem-sucedido exigido. Não comprova aprovação do Quality Gate ou ausência de issues. Na avaliação de uma história, consultar resultados autenticados, corrigir problemas reais e repetir a análise. As correções de Luis do PR #10 já foram integradas e conciliadas com a US01; não duplicá-las. Mensagens Git não substituem evidências SonarQube.

## 6. QA e critério de conclusão

### 6.1 Papéis e responsabilidades

| Papel | Paulo André | Luis Felipe |
|---|---|---|
| Analista/desenvolvedor | US01 (I1), US03 (I2); especificação e automação correspondentes | US02 (I1), US04 (I2); especificação e automação correspondentes |
| Testador/QA | Executar aceitação de US02/US04 e registrar defeitos/retestes | Executar aceitação de US01/US03 e registrar defeitos/retestes |
| Gestão de evidências | Publicar revisão, comandos, cobertura e QA das histórias sob sua responsabilidade | Mesma responsabilidade para suas histórias |

### 6.2 Critérios de entrada para execução

1. História e critérios identificados no backlog; casos detalhados no PTI da iteração.
2. Branch/commit alvo e contrato da operação definidos, sem usar commit de outra implementação como evidência.
3. Dependências instaladas, Prisma Client gerado e aplicação executável em ambiente isolado; migrations aplicadas somente no banco exclusivo de teste.
4. Fixtures sintéticas, estado inicial e limpeza entre casos definidos; relógio controlado para cenários temporais.
5. Política necessária ao caso aprovada, incluindo janela/granularidade da US04; se ausente, marcar o caso bloqueado, não aprovado.
6. Responsável e forma de coleta de resposta HTTP/estado persistido definidos. Falhas de entrada que façam parte do cenário não bloqueiam sua execução.

### 6.3 Critérios de saída da execução/aceite

1. Todos os casos aplicáveis da história executados e registrados com esperado/observado, Passou/Falhou e evidências; bloqueios justificados impedem declarar aceite integral.
2. Unitários e integrações pertinentes passando na revisão entregue, incluindo regressões das correções; cobertura medida e confrontada com RNF06.
3. Nenhum defeito impeditivo de aceitação em aberto; outros desvios documentados, com responsável e decisão de tratamento, sem ocultar casos falhos.
4. Dados persistidos e ausência de efeitos indevidos verificados nos cenários de integridade; concorrência não é comprovada por mocks.
5. QA cruzado e reteste de defeitos concluídos para declarar a história aceita. Relatório produzido pelo responsável real, sem aprovação condicionada tratada como execução.
6. CI e envio ao LABENS comprovados com revisão e link. Aprovação do Quality Gate só pode ser declarada após verificação autenticada; não é exigência adicional de entrega documental da P2.

### 6.4 Registro e rastreabilidade

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

## 8. Planos específicos e evidências

- [PTI da Iteração 1](./iteracoes/iteracao01.md): US01/US02, casos com IDs e campos de execução (seção 8).
- [PTI da Iteração 2](./iteracoes/iteracao02.md): US03/US04, casos planejados, sem execução presumida (seção 5).
- [Relatório de QA da US02](./qa/t2-us02-quadras.md) e [estado dos testes](./estado_testes.md): resultados reais, separados do planejamento.

Riscos de execução: ausência de implementação/contrato bloqueia o caso afetado; uso de banco de desenvolvimento é proibido; indisponibilidade do LABENS impede nova comprovação de envio, devendo ser registrada sem fabricar resultados. A equipe mantém as mesmas ferramentas e fixtures da I1 na I2, adaptadas aos critérios de cada história.

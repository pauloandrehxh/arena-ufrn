# Relatório de Testes de Aceitação — T2 / US02

**Execução:** 06/10/2026. **QA:** Paulo André (@pauloandrehxh).
**Colega:** Luis Felipe (@Luisfelipelinhares). **História:** US02 — Manter quadras.

## 1. Alvo, rastreabilidade e limites

Especificação: [US02, CA01–CA05 e cenários Gherkin](../user-stories.md).
Branch obtida por `git fetch origin`: `origin/test/teste-de-quadras`, commit
`51f6c381dba4a6d5aa00697f9f9e23d8394512db`, autor Luis Felipe, conforme histórico
Git. [PR histórico #3](https://github.com/pauloandrehxh/arena-ufrn/pull/3).

Essa contribuição adicionou testes das rotas existentes; **não se atribui todo
o CRUD a Luis Felipe**. A branch é anterior à especificação regularizada na P1.
Não foi localizada outra branch declarada como entrega da US02 refinada. Este
relatório avalia a contribuição histórica disponível contra o contrato atual;
confirmar com Luis Felipe se existe uma implementação mais recente.

Foi criado worktree destacado em `/tmp/opencode/arena-ufrn-qa-us02`, sem merge.
O runner importa o `createApp` dessa branch, mas usa o Prisma Client e as migrations
**atuais** do projeto em SQLite temporário. Isso permite avaliar preservação de
reservas (inexistentes no schema histórico). Portanto, é QA de compatibilidade
da aplicação histórica com o contrato/schema atual, não reprodução integral do
ambiente de setembro. QA13 injeta falha controlada da dependência; os demais
casos percorrem HTTP, aplicação e banco real isolado. Não houve teste de navegador:
o incremento I1 é API de homologação restrita.

Reexecução contra a aplicação atual em `feature/us01-reservas`, base `da3f16a`,
produziu os mesmos seis desvios. Não houve alteração no CRUD do colega para ocultá-los.

## 2. Execução e evidências

Ambiente: Linux, Node v22.12.0, Prisma Client 7.10.0. O comando `pnpm test` no
worktree usou pnpm 12.3.4. A versão global consultada na auditoria foi 12.5.1.

```bash
# Na raiz do arena-ufrn (usar diretório inexistente para o worktree):
git worktree add --detach /tmp/opencode/arena-ufrn-qa-us02 origin/test/teste-de-quadras
ln -s "$PWD/backend/node_modules" /tmp/opencode/arena-ufrn-qa-us02/backend/node_modules

# No backend da branch atual:
QA_APP_PATH=/tmp/opencode/arena-ufrn-qa-us02/backend/src/app.js \
  node tests/acceptance/quadras.qa.js

# Repetição contra a aplicação atual:
pnpm qa:quadras

# Testes originais do colega, no backend do worktree:
pnpm test --runInBand
```

Pré-requisito: dependências instaladas e Prisma Client gerado com
`pnpm prisma generate --config prisma7.config.ts` na branch atual.
Cada caso limpa apenas seu banco temporário, removido ao final.

**Resultado de aceite em cada alvo: 7 Passou / 6 Falhou, exit code 1.**
**Testes originais do colega: 7 passaram em uma suíte.** Os sete testes mockados
originais não verificam todas as condições do contrato refinado; sucesso deles
não implica aceite da história.

JSONs completos desta execução: `/tmp/opencode/qa-us02-colega.json` e
`/tmp/opencode/qa-us02-atual.json`; logs de erro correspondentes terminam em
`.stderr.log`. Arquivos temporários não são links de entrega permanentes;
o runner versionável e a tabela transcrita abaixo permitem reproduzir o relatório.

| Caso | Critério/cenário | Evidência observada na branch do colega | Resultado |
|---|---|---|---|
| QA01 | CA01/02: cadastro e consulta válidos | POST 201, ID inteiro, `active: true`; GET 200; um registro | Passou |
| QA02 | CA02: catálogo vazio | GET 200, `[]` | Passou |
| QA03 | CA02: ID inexistente | GET 404, `Quadra não encontrada.` | Passou |
| QA04 | CA02: ID não numérico | GET `/api/quadras/abc`: 500, esperado 400 | Falhou |
| QA05 | CA01: nome vazio | POST `{name: ""}`: 201; um registro indevido | Falhou |
| QA06 | CA01: somente espaços | POST `{name: "   "}`: 201; um registro indevido | Falhou |
| QA07 | CA01: nome numérico | POST `{name: 123}`: 500, esperado 400; zero registros | Falhou |
| QA08 | CA01: nome ausente | POST `{}`: 500, esperado 400; zero registros | Falhou |
| QA09 | CA03: atualizar nome válido | PUT 200; ID e `active` preservados no banco | Passou |
| QA10 | CA03: atualização inválida | PUT `{name: ""}`: 200 e nome vazio persistido | Falhou |
| QA11 | CA04: excluir sem vínculo | DELETE 204, zero quadras | Passou |
| QA12 | CA04: preservar reserva vinculada | DELETE 500; quadra e reserva permanecem idênticas | Passou |
| QA13 | CA05: falha de dependência controlada | GET 500; corpo não expõe `SEGREDO_QA_DEPENDENCIA` | Passou |

QA12 passa quanto à preservação exigida pelo critério, mas retornar erro de negócio
mais claro (por exemplo, conflito) é uma melhoria recomendada. QA05/06 tratam
somente espaços como nome vazio para fins de validade semântica.

## 3. Bugs reproduzidos

### BUG-QA01 — ID inválido tratado como falha interna (QA04)

1. Com a aplicação de homologação acessível, executar `GET /api/quadras/abc`.
2. Esperado: HTTP 400, sem consulta inválida à persistência.
3. Obtido: HTTP 500, `{"message":"Erro ao buscar a quadra."}`.

Impacto: entrada inválida aparenta indisponibilidade do serviço. Sugestão: validar
inteiro positivo representável pelo Prisma antes de acessar o banco.

### BUG-QA02 — Cadastro aceita nome vazio ou espaços (QA05/06)

1. Executar `POST /api/quadras` com `{"name":""}` ou `{"name":"   "}`.
2. Consultar catálogo/banco.
3. Esperado: HTTP 400, sem novo registro.
4. Obtido: HTTP 201 e nome inválido persistido.

Impacto: catálogo não identifica corretamente o recurso reservado. Sugestão:
validar tipo string e conteúdo após `trim` no service, antes de gravar.

### BUG-QA03 — Nome ausente ou numérico retorna 500 (QA07/08)

1. Executar `POST /api/quadras` com `{}` ou `{"name":123}`.
2. Esperado: HTTP 400, sem novo registro.
3. Obtido: HTTP 500, `{"message":"Erro ao criar quadra."}`, sem gravação.

Impacto: erro de contrato é classificado como falha interna. Sugestão: validação
de entrada e distinção entre erro de domínio e erro inesperado.

### BUG-QA04 — Atualização aceita nome vazio (QA10)

1. Cadastrar uma quadra válida e guardar seu ID e nome.
2. Executar `PUT /api/quadras/<id>` com `{"name":""}`.
3. Consultar novamente.
4. Esperado: HTTP 400, nome original preservado.
5. Obtido: HTTP 200, nome vazio persistido.

Impacto: atualização destrói a identificação válida do catálogo. Sugestão:
compartilhar validação de nome entre criação e atualização.

## 4. Parecer e melhorias

**US02 não aceita contra os critérios atuais.** Existem quatro grupos de bugs
com seis casos falhos, também reproduzidos na aplicação atual. Encaminhar a Luis
Felipe; correções e reteste ainda pendentes. T2 exige executar e reportar QA, não
inventar aprovação nem substituir silenciosamente a entrega do colega.

Melhorias: erro explícito para exclusão com vínculos, validação consistente em
todas as operações, ampliar os testes negativos da suíte original e confirmar
a branch da US02 refinada. Autorização de gestor depende da US05 e não foi
declarada implementada nem testada nesta I1.

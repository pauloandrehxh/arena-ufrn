# Relatório de Testes de Aceitação — T3 / US04

**QA:** Paulo André (@pauloandrehxh). **Dev avaliado:** Luis Felipe (@Luisfelipelinhares).

**Alvo:** [PR #16](https://github.com/pauloandrehxh/arena-ufrn/pull/16), revisão `725274c68dea2e57652b271d249afbee5b561cf2` (`feature/consultar-disponibilidade`).
**História:** US04 — Consultar disponibilidade. [Critérios e Gherkin](../user-stories.md); [plano I2-CT09–CT16](../iteracoes/iteracao02.md).

Após a execução, o PR avançou para `270402f` com alteração **apenas em
`docs/evidencias/t3-us04-testes.md`**; o código da API avaliado permanece o
mesmo. O [CI dessa revisão](https://github.com/pauloandrehxh/arena-ufrn/actions/runs/38017205238)
passou 201 testes/10 suítes e enviou a análise; não houve reteste independente
desse novo commit. Se o código mudar, repetir o QA na nova revisão.

## Escopo e ambiente

Janela **08:00–22:00**, slots de **60 minutos**, confirmada pelo responsável pela
entrega da T3 antes deste QA. Os exemplos 09:00–18:00 do PTI eram ilustrativos,
não a política homologada. API avaliada por Supertest, com Prisma 7.10.0,
SQLite temporário e dados sintéticos. O caso I2-CT10 atravessa o PATCH de
cancelamento da US03 e a consulta da US04; cada cenário começa com dados
isolados. Não foi realizado teste no navegador ou em produção.

O runner independente está em
[`backend/tests/acceptance/disponibilidade.qa.js`](../../backend/tests/acceptance/disponibilidade.qa.js).
Reprodução, a partir da raiz do repositório (com dependências instaladas e
Prisma Client gerado):

```bash
git fetch origin
git worktree add --detach /tmp/opencode/arena-ufrn-t3-qa-16 725274c68dea2e57652b271d249afbee5b561cf2
# Se necessário, instalar dependências na cópia do PR ou compartilhar node_modules:
ln -s "$PWD/backend/node_modules" /tmp/opencode/arena-ufrn-t3-qa-16/backend/node_modules
cd backend
QA_APP_PATH=/tmp/opencode/arena-ufrn-t3-qa-16/backend/src/app.js \
  node tests/acceptance/disponibilidade.qa.js
```

Execução real: **8 Passou / 1 Falhou**, exit code **1**, por defeito
adicional ao plano. Na cópia da revisão do colega, `pnpm test:integration
--runInBand` resultou em **6 suítes/104 testes passando**. O [CI do PR
#16](https://github.com/pauloandrehxh/arena-ufrn/actions/runs/38014945803)
registrou **201 testes passando/10 suítes** e cobertura global 83,37% statements,
77,72% branches, 92,68% functions, 83,29% lines; o scanner enviou a análise.
Quality Gate, problemas e métricas do dashboard LABENS não puderam ser
verificados sem autenticação (API consultada: HTTP 401). Êxito do scanner **não
equivale** à aprovação do Quality Gate.

## Resultados observados

| Caso | Critério | Resultado observado | Parecer |
|---|---|---|---|
| I2-CT09 | Reserva ATIVA ocupa intervalo | GET 200; ocupação 14:00–15:00; 13 slots livres, sem 14:00–15:00 | Passou |
| I2-CT10 | Cancelamento libera horário sem apagar histórico | Antes: 1 ocupação; PATCH 200; depois: 0; mesmo registro persistido CANCELADA, 14:00–15:00 livre | Passou |
| I2-CT11 | Contiguidade | GET 200; 13:00–14:00 e 15:00–16:00 livres junto à ocupação 14:00–15:00 | Passou |
| I2-CT12 | Quadra inativa | GET 409, `Quadra indisponível.`; banco sem reservas alteradas | Passou |
| I2-CT13 | Inexistência e entradas inválidas | ID ausente `2147483647`: 404; `abc`: 400; `2099-02-30`: 400 | Passou |
| I2-CT14 | Dia sem reservas | GET 200, 0 ocupações; 14 slots de uma hora entre 08:00 e 22:00 | Passou |
| I2-CT15 | Isolamento quadra/data | Consulta principal: 0 ocupações; outra quadra: 1; outro dia: 1 | Passou |
| I2-CT16 | Limites W/G confirmados | GET 200; `08:00–09:00` primeiro, `21:00–22:00` último; 14 slots contíguos de 60 min | Passou |
| QA09 (adicional) | Falha interna da dependência não deve ser tratada como entrada inválida nem exposta | GET **400**, `{"erro":"SEGREDO_QA_US04"}`; esperado **500** com mensagem genérica | **Falhou** |

## Defeito reproduzido — BUG-US04-01

O controller `backend/src/controllers/disponibilidade.controller.js` aplica
`error.status ?? 400` a **qualquer** exceção e retorna `error.message` ao cliente.
Quando a persistência falha, expõe informações internas e classifica falha do
servidor como erro do usuário.

1. Construir a app da revisão `725274c` com dependência de teste cujo
   `quadra.findUnique` lança `new Error('SEGREDO_QA_US04')` (QA09 no runner).
2. Executar `GET /api/quadras/disponibilidade?quadraId=1&date=2099-10-10`.
3. **Esperado:** HTTP 500 com mensagem genérica, sem o texto interno.
4. **Obtido:** HTTP 400 e `{"erro":"SEGREDO_QA_US04"}`.

Impacto: vazamento de detalhes de persistência e observabilidade incorreta.
Sugerido: identificar explicitamente erros de validação/domínio (400/404/409)
e retornar 500 genérico para erros inesperados; incluir regressão. O QA não
alterou o código de Luis. **Correção e reteste permanecem pendentes.**

## Parecer

Os oito casos planejados da US04 passaram na revisão identificada, mas o
defeito QA09 impede parecer de aceite sem ressalvas. Solicitar correção a Luis
no PR #16 e reexecutar o caso e a suíte antes de aprovar o PR. O relatório de
US03 publicado por Luis em `docs/qa/t3-us03-cancelamentos.md` descreve um
**modelo de testes condicionado à confirmação prática**; seus oito pareceres
não são resultados independentes comprovados de execução, e a autorização de
titular segue dependente da US05.

O QA da T3 foi **executado e documentado**, mesmo com o caso adicional falho.
Isso não significa que a US04 esteja aceita. A correção e o reteste são
acompanhamentos da revisão do PR #16, não resultados presumidos deste relatório.

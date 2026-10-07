# T2 — Publicação manual e pendências de conclusão

O usuário escolheu **somente alterações locais**, publicação manual e manutenção
do QA da branch histórica encontrada. Não executar automaticamente commits, push,
merge, rebase, alteração de issues ou criação de PRs.

## 1. Estado verificado

- US01 implementada e publicada em `feature/us01-reservas`, revisão `da3f16a`.
- 107 testes em sete suítes passaram na reexecução; cobertura real registrada em
  [evidência da auditoria](./evidencias/t2-auditoria-sonarqube.md).
- [QA da US02](./qa/t2-us02-quadras.md) executado: sete casos passaram, seis
  falharam; não é aceite da história. O colega precisa corrigir e receber reteste.
- Página da T2 preparada no outro repositório:
  `bsi-tasks/softwaretesting/20262/tarefas/pauloandrehxh/tarefa02.md`.
- Novos relatórios, runner e alterações da página ainda locais, sem novos commits.

## 2. SonarQube LABENS

1. Acessar o servidor oficial autenticado e abrir o projeto `arena-ufrn`.
2. Confirmar a revisão analisada. Um workflow histórico bem-sucedido de outra
   branch não comprova análise da US01.
3. Registrar Quality Gate, métricas e lista de issues reais, com evidência da
   revisão/data e prints sem tokens ou informações sensíveis.
4. Corrigir os problemas realmente apontados, levando em conta o PR #10 existente,
   sem integrá-lo automaticamente. Reexecutar testes e análise após as correções.
5. Incluir as evidências no projeto e atualizar a seção SonarQube de tarefa02.md.

Atualmente as APIs do projeto retornam 401. Não registrar análise como aprovada
enquanto esses passos não forem executados.

## 3. Commits sugeridos (não executados)

| Repositório | Arquivos | Mensagem sugerida |
|---|---|---|
| arena-ufrn | `backend/package.json`, `backend/tests/acceptance/quadras.qa.js`, `docs/qa/t2-us02-quadras.md` | `test: executa QA de aceitação da US02 e registra falhas` |
| arena-ufrn | `docs/README.md`, `docs/estado_testes.md`, `docs/evidencias/t2-auditoria-sonarqube.md`, `docs/entrega-t2.md` | `docs: atualiza auditoria e pendências de entrega da T2` |
| bsi-tasks | `softwaretesting/20262/README.md`, `softwaretesting/20262/tarefas/pauloandrehxh/README.md`, `softwaretesting/20262/tarefas/pauloandrehxh/tarefa02.md` | `docs: documenta implementação e QA da tarefa 02 #471` |

Não usar #471 como issue do arena-ufrn: esse número pertence à disciplina.
A issue da US01 ainda deve ser cadastrada/identificada no projeto; incluir sua
referência real e alinhar a branch com o vínculo exigido pelo item 7 do enunciado.
O bsi-tasks exige commits pequenos referenciando #471.

## 4. Fork e PRs

Antes da publicação, revisar `git diff` em cada repositório e finalizar os commits
dos arquivos preparados. Nunca misturar os repositórios nem descartar alterações.

No bsi-tasks, após preservar/commitar o trabalho da task/471, atualizar main com
fast-forward de upstream/main e incorporar as mudanças à task/471. A auditoria
encontrou dois commits upstream ainda ausentes; não foi feita atualização automática.
Se houver conflito, revisar e resolver sem reset ou force push.

Publicar a branch do arena-ufrn e o novo relatório; só então copiar o link real do
arquivo no GitHub. Abrir PR para main contendo implementação, testes, evidências
e esse link. Não reutilizar o PR #9 ou #10 como se fossem o PR da US01 atual.

Descrição sugerida do PR do projeto (preencher URLs reais após publicação):

```markdown
## T2 — US01: Reservar quadra
- Validação de IDs, calendário, HH:mm e início futuro em America/Fortaleza.
- Criação ATIVA com validação e conflito na mesma transação.
- Unitários com mocks e integração com SQLite isolado.
- Reexecução: 107 testes passando; cobertura global 73,91% statements/lines.

## QA da US02 de Luis Felipe
Relatório: <URL_REAL_DO_RELATORIO_PUBLICADO>
Resultado: sete casos passaram e seis falharam; bugs reproduzidos e documentados.
Alvo histórico: test/teste-de-quadras, 51f6c38, com schema atual explicitado.

## SonarQube LABENS
<RESULTADOS_E_EVIDENCIAS_REAIS_OU_BLOQUEIO_401_AINDA_PENDENTE>
```

No bsi-tasks:

1. Ajustar o título da issue #471 para o nome completo do discente.
2. Inserir em tarefa02.md o link real do PR do projeto e do relatório publicado.
3. Atualizar os checkboxes somente conforme o que realmente foi realizado.
4. Publicar task/471 no fork e abrir PR para `tacianosilva/bsi-tasks:main`,
   referenciando #471 e incluindo o resumo e links de entrega.

**Não declarar conclusão integral** sem análise autenticada/correções do LABENS,
atualização do fork e PRs exigidos. O prazo do enunciado é 06/10/2026; existência
local ou publicação de uma branch não comprova a entrega completa no prazo.

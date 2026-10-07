# T2 — Publicação manual e pendências de conclusão

O usuário autorizou posteriormente corrigir as pendências e abrir o PR de
`feature/us01-reservas` para `main`. Não foi autorizado merge na main. A criação
do PR foi possível após autenticação GitHub nesta sessão. O
[PR #11](https://github.com/pauloandrehxh/arena-ufrn/pull/11) está aberto para main;
não foi feito merge.

## 1. Estado verificado

- US01, QA histórico, correções e reteste publicados em `feature/us01-reservas`.
  Correções: `344ce75`; documentação/reteste: `bcbb0c1`.
- Após correções de quadras, 134 testes em sete suítes passaram; cobertura registrada em
  [evidência da auditoria](./evidencias/t2-auditoria-sonarqube.md).
- [QA da US02](./qa/t2-us02-quadras.md): avaliação histórica com sete casos aprovados
  e seis falhos; reteste na implementação corrigida por Paulo com 13 aprovados.
  Isso não comprova o QA de Luis sobre a US01 nem autoria de Luis nas correções.
- Página da T2 preparada no outro repositório:
  `bsi-tasks/softwaretesting/20262/tarefas/pauloandrehxh/tarefa02.md`.
- Runner e relatório histórico já publicados nos commits `a6d4fc4` e `80509e2`.
  As correções e o reteste desta revisão também foram commitados e publicados.
- Luis publicou `docs/qa/t2-us01-reservas.md` em `04357eb`, incorporado por
  fast-forward sem alterações no documento dele. O relatório contém resultados
  esperados e aprovação condicionada, mas ainda precisa registrar Passou/Falhou,
  resultados observados e evidências reais de execução por caso.

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

## 3. Commits e rastreabilidade

| Repositório | Arquivos | Mensagem sugerida |
|---|---|---|
| arena-ufrn | Runner e relatório histórico de QA | Já realizado: `a6d4fc4` |
| arena-ufrn | Auditoria e documentação de entrega | Já realizado: `80509e2` |
| arena-ufrn | Validações de quadras e testes de regressão | Realizado: `344ce75` |
| arena-ufrn | Documentação, links e reteste | Realizado: `bcbb0c1` |
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

O [relatório de QA já está publicado](https://github.com/pauloandrehxh/arena-ufrn/blob/feature/us01-reservas/docs/qa/t2-us02-quadras.md).
As correções/reteste estão publicadas e o [PR #11](https://github.com/pauloandrehxh/arena-ufrn/pull/11)
foi aberto para main. Não reutilizar o PR #9 ou #10 como se fossem o PR da US01.
A descrição final, sem campos vazios, está em
[pr-t2.md](./pr-t2.md).

O SonarQube desta entrega ainda não foi verificado. A abertura do PR disparou o
[workflow 37553935374](https://github.com/pauloandrehxh/arena-ufrn/actions/runs/37553935374),
observado em execução;
consultar a análise autenticada no LABENS, corrigir problemas realmente apontados
e atualizar as evidências antes de declarar conclusão.

No bsi-tasks:

1. Ajustar o título da issue #471 para o nome completo do discente.
2. Inserir em tarefa02.md o link real do PR do projeto e do relatório publicado.
3. Atualizar os checkboxes somente conforme o que realmente foi realizado.
4. Publicar task/471 no fork e abrir PR para `tacianosilva/bsi-tasks:main`,
   referenciando #471 e incluindo o resumo e links de entrega.

**Não declarar conclusão integral** sem análise autenticada/correções do LABENS,
atualização do fork e PRs exigidos. O prazo do enunciado é 06/10/2026; existência
local ou publicação de uma branch não comprova a entrega completa no prazo.

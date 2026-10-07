## Objetivo — T2 / Iteração 1

US01: **Como aluno, quero reservar uma quadra disponível para garantir meu horário de uso.**

Origem: `feature/us01-reservas`. Destino: `main`. Este PR não declara a T2
integralmente concluída; análise autenticada LABENS e entrega individual ainda
precisam de finalização.

## Implementação

- IDs positivos, datas YYYY-MM-DD e horários HH:mm estritamente validados.
- Fuso America/Fortaleza e rejeição de início já alcançado no dia atual.
- Dia armazenado à meia-noite UTC por convenção de calendário.
- Estado ATIVA fixado na criação, sem aceitar campos internos do cliente.
- Validação de usuário/quadra, conflito e criação na mesma transação Prisma.
- Conflitos apenas com reservas ATIVA; intervalos contíguos permitidos.
- Erros de validação 400 e falhas inesperadas 500 sem detalhes internos.
- Correção das validações de quadras encontradas no QA, feita por Paulo André,
  sem atribuir a Luis Felipe a autoria dessas correções.
- Planejamento da P1, critérios/Gherkin, documentação e configuração explícita
  de geração do Prisma Client no CI.

## Testes e cobertura

**134 testes passaram em sete suítes**, com unitários mockados e integração
real usando SQLite temporário. QA de quadras executado separadamente: **13 casos
passaram**, sem falhas, após correções.

| Escopo | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| Backend | 77,92% | 71,25% | 90,32% | 77,92% |
| Service de reservas | 98% | 92% | 100% | 98% |

Comandos reproduzíveis no backend:

```bash
pnpm prisma generate --config prisma7.config.ts
pnpm test:coverage --runInBand
pnpm qa:quadras
```

## Relatório de QA sobre a US02

[Relatório de Testes de Aceitação](https://github.com/pauloandrehxh/arena-ufrn/blob/feature/us01-reservas/docs/qa/t2-us02-quadras.md).

Alvo original: contribuição histórica de Luis Felipe na branch
`test/teste-de-quadras`, revisão `51f6c38`, PR #3. Usa o contrato/schema atuais,
com os limites explicitados no relatório. A avaliação original encontrou sete
casos aprovados e seis falhos; quatro grupos de bugs foram corrigidos por Paulo
na branch atual e os 13 casos passaram no reteste. Não se atribui todo o CRUD
original a Luis. O QA de Luis sobre a US01 é uma entrega separada:
[relatório publicado pelo colega](https://github.com/pauloandrehxh/arena-ufrn/blob/feature/us01-reservas/docs/qa/t2-us01-reservas.md).
Esse relatório lista resultados esperados e aprovação condicionada, mas ainda
precisa registrar Passou/Falhou, observações e evidências reais por caso.

## SonarQube LABENS e pendências

O workflow Backend CI é disparado por este PR. Consultas locais anônimas
retornaram 401 nas APIs do projeto, sem comprovar falha do token do Actions.
Ainda é necessário conferir a revisão analisada no LABENS, registrar resultados
e prints e corrigir problemas realmente apontados. Não há Quality Gate aprovado
declarado nesta descrição.

Limites: API de homologação sem autenticação; interface de reservas e políticas
de funcionamento não foram implementadas; concorrência foi testada no mesmo
client, não entre múltiplas instâncias. Exclusão de quadra vinculada preserva
histórico, mas ainda retorna 500 genérico.

Referência individual da disciplina:
https://github.com/tacianosilva/bsi-tasks/issues/471

Essa issue é do bsi-tasks, não do arena-ufrn. Não fechar a tarefa automaticamente
sem a verificação SonarQube e a entrega final na disciplina.

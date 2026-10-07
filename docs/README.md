# Documentação — Arena UFRN

**Regularização da P1:** 06/10/2026  
**Equipe:** Paulo André (@pauloandrehxh) e Luis Felipe (@Luisfelipelinhares)  
**Repositório:** https://github.com/pauloandrehxh/arena-ufrn

## Artefatos

- [Documento de Visão](./visao.md): problema, escopo, perfis, RFs, RNFs e riscos.
- [Product Backlog / User Stories](./user-stories.md): 12 histórias, critérios, responsáveis e Gherkin de I1/I2.
- [Plano Geral de Iterações](./plano_iteracoes.md): seis iterações, duas por unidade.
- [Plano Detalhado da Iteração 1](./iteracoes/iteracao01.md): 21 dias relativos e tarefas distribuídas.
- [Preparação da Iteração 2](./iteracoes/iteracao02.md): contrato cancelamento/disponibilidade para T3.
- [Relatório do Estado dos Testes](./estado_testes.md): baseline histórico, execução atual e lacunas.
- [Plano Geral de Testes](./plano_teste.md): estratégia e critérios de conclusão.
- [Evidência de execução atual](./evidencias/p1-execucao-testes-20261006.md).
- [Evidência de desenvolvimento da T2 / US01](./evidencias/t2-us01-execucao-testes-20261006.md).
- [Relatório de QA T2 / US02](./qa/t2-us02-quadras.md) — seis falhas históricas; reteste da aplicação corrigida com 13 casos aprovados.
- [Relatório de Luis Felipe sobre reservas](./qa/t2-us01-reservas.md) — publicado pelo colega; faltam resultados observados e evidências por caso.
- [Auditoria posterior e bloqueio de autenticação LABENS](./evidencias/t2-auditoria-sonarqube.md).
- [Pendências e roteiro de publicação manual da T2](./entrega-t2.md).
- [Descrição preparada do PR da T2](./pr-t2.md).

## Checklist da P1

O enunciado é `softwaretesting/20262/tarefas/P1.md` no bsi-tasks. Os modelos de visão/backlog estão referenciados nos documentos correspondentes. Esta checklist distingue documentação disponível de entrega externa concluída.

- [x] Endereço do repositório documentado e .gitignore existente.
- [x] Equipe real de dois integrantes identificada.
- [x] Visão em Markdown com problema, escopo, perfis, requisitos e riscos.
- [x] Backlog em Markdown com critérios e prioridades.
- [x] Seis iterações, duas por unidade, uma história por integrante em cada uma.
- [x] Plano detalhado da I1 com 21 dias e tarefas distribuídas.
- [x] Relatório de testes com diagnóstico histórico limitado e cobertura atual executada.
- [ ] Confirmar marco anterior à disciplina; a base inicial Git não é prova dessa data.
- [ ] Confirmar datas absolutas do semestre, representante e políticas ainda pendentes.
- [x] Atualizar README raiz com os novos links e contrato da US01 durante o desenvolvimento da T2.
- [x] Visibilidade pública do repositório confirmada por consulta aos arquivos no GitHub.
- [ ] Confirmar issue P1 na disciplina.
- [ ] Atualizar links no README da turma no bsi-tasks.
- [x] Publicar planejamento, implementação e QA histórico na branch `feature/us01-reservas`.
- [ ] Concluir PRs e entregas finais na disciplina; branch publicada não equivale a entrega completa.

Na entrega externa, cadastrar a issue com título **“P1 - Dados dos Projetos e Documentos Gerais - Grupo Arena UFRN”** no repositório da disciplina e registrar em `softwaretesting/20262/README.md` os links do repositório, visão, estado dos testes e plano da I1. Prazo do enunciado: **06/10/2026**. A existência dos arquivos locais não comprova entrega no prazo.

## Convenções e limites

O planejamento foi elaborado e aprovado nesta regularização; não era uma distribuição histórica documentada. Código existente não significa história aceita. Testes automatizados atuais passaram, mas QA, SonarQube e critérios novos ainda têm pendências.

US01/US02 alimentam T2; US03/US04 alimentam T3. Paulo André desenvolve US01/US03 e faz QA de US02/US04; Luis Felipe desenvolve US02/US04 e faz QA recíproco. Fonte única dos critérios: backlog.

O desenvolvimento inicial da T2 ocorre na branch local `feature/us01-reservas`, ainda sem issue de projeto identificada. O contrato temporal da US01 foi aprovado pelo usuário: America/Fortaleza, data YYYY-MM-DD, HH:mm e início no futuro. A issue individual da disciplina #471 foi confirmada por consulta pública; a entrega continua pendente.

O QA real está em `docs/qa/t2-us02-quadras.md`, incluindo avaliação histórica e reteste separado após correções por Paulo. Evidências antigas são preservadas com o contexto original; cobertura foi gerada fora do repositório para não sobrescrever relatórios anteriores.

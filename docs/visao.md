# Documento de Visão — Arena UFRN

**Data da revisão:** 06/10/2026

**Versão:** 2.0

**Equipe:** Paulo André (@pauloandrehxh) e Luis Felipe (@Luisfelipelinhares)

## 1. Introdução

### 1.1. Propósito

Definir o problema, o escopo e os requisitos do sistema acadêmico de gerenciamento e reserva de quadras de areia da UFRN. Este documento orienta o desenvolvimento e os testes da dupla na disciplina Testes de Software 2026.2.

Esta revisão regulariza a P1 a partir do código e do histórico Git. O documento anterior era um plano de testes com referências a entidades alheias ao projeto. O planejamento aqui registrado foi elaborado agora; não comprova decisões ou aprovações históricas de usuários reais.

### 1.2. Escopo

O produto deve permitir consultar quadras e disponibilidade, reservar horários, cancelar e reagendar reservas, acompanhar o uso e administrar os cadastros. A evolução inclui autenticação, autorização e limites de uso equitativo.

**Base existente:** backend Node.js/Express, Prisma e SQLite; entidades Usuario, Quadra e Reserva; operações CRUD; validações básicas de reservas; frontend React/Vite/Tailwind com página inicial e consulta de quadras; testes Jest/Supertest.

**Ainda não entregue como fluxo completo:** reserva e cancelamento pela interface, consulta de disponibilidade integrada (implementação em avaliação no PR #16), autenticação, papéis de acesso e limites anti-monopólio. Cancelamento lógico já existe no backend via PR #15. Um campo ou endpoint existente não comprova o atendimento integral de um requisito.

**Fora do escopo:** pagamentos, integração institucional real LDAP/SSO, envio real de e-mails, gestão de turmas/departamentos/centros e infraestrutura física da universidade.

## 2. Problema e oportunidade

O problema de produto adotado é a dificuldade de consultar e organizar o uso das quadras sem disputas de horários ou concentração de reservas. A oportunidade é centralizar a agenda e tornar o acesso previsível e equitativo.

A solução proposta é uma aplicação web com catálogo, agenda e regras de validação. Essa formulação é uma hipótese de planejamento baseada no escopo existente, não resultado de entrevistas ou pesquisa de campo.

## 3. Stakeholders e perfis

### 3.1. Equipe

| Integrante | Responsabilidade no processo |
|---|---|
| Paulo André — @pauloandrehxh | Análise e desenvolvimento das histórias atribuídas; QA das histórias de Luis Felipe |
| Luis Felipe — @Luisfelipelinhares | Análise e desenvolvimento das histórias atribuídas; QA das histórias de Paulo André |

Não há outros integrantes. Representante de entrega e interlocutor institucional ainda precisam ser confirmados; não são atribuídos a professores ou clientes sem evidência.

### 3.2. Perfis de usuário

| Perfil | Objetivo | Necessidades |
|---|---|---|
| Aluno/usuário da comunidade acadêmica | Organizar seu uso das quadras | Consultar disponibilidade, reservar, cancelar, reagendar e acompanhar suas reservas |
| Gestor do espaço esportivo | Administrar o catálogo e a agenda | Manter quadras e usuários, suspender agendamentos e acompanhar utilização |

São perfis de projeto, não personas entrevistadas. Não se pressupõem coordenadores ou docentes com fluxos próprios. Os papéis de acesso ainda não existem no modelo atual.

## 4. Requisitos

P0 = essencial; P1 = importante; P2 = evolução desejável. Os estados abaixo decorrem de inspeção; aceite exige testes e critérios do [backlog](./user-stories.md).

### 4.1. Requisitos funcionais

| ID | O sistema deve… | Prioridade | História | Situação da base |
|---|---|---|---|---|
| RF01 | Criar reserva para usuário e quadra ativos em intervalo válido e sem sobreposição | P0 | US01 | Parcial: backend existente, validações a completar |
| RF02 | Cadastrar, listar, consultar e atualizar quadras | P0 | US02 | Backend existente; validações e aceite a completar |
| RF03 | Cancelar reserva preservando registro e liberando o intervalo | P0 | US03 | Implementação inicial na branch T3; PATCH/DELETE preservam histórico; QA/aceite pendentes |
| RF04 | Consultar disponibilidade de uma quadra por data | P0 | US04 | Implementação no PR #16 de Luis; QA de Paulo: 8 casos planejados passaram, 1 falha adicional pendente de correção e reteste |
| RF05 | Autenticar usuário e encerrar sua sessão | P0 | US05 | Pendente |
| RF06 | Manter usuários com e-mail/matrícula únicos e controlar sua situação ativa | P0 | US06 | CRUD existente; autorização e aceite pendentes |
| RF07 | Exibir somente as reservas do usuário autenticado | P1 | US07 | Consulta por ID de usuário existente, sem autenticação |
| RF08 | Suspender e reativar novos agendamentos de uma quadra | P1 | US08 | Campo active existe; fluxo de gestão pendente |
| RF09 | Reagendar reserva sem conflito e sem perder o agendamento em caso de falha | P1 | US09 | Atualização básica existente; fluxo e garantias pendentes |
| RF10 | Aplicar os mesmos limites de uso a todos os alunos | P1 | US10 | Pendente; parâmetros precisam de decisão |
| RF11 | Consultar histórico pessoal por período e estado | P2 | US11 | Pendente como fluxo; existem campos de estado |
| RF12 | Consultar agenda de gestão por quadra, período e estado | P2 | US12 | Consultas básicas existentes; filtros e autorização pendentes |

### 4.2. Requisitos não funcionais

| ID | Requisito e condição de verificação |
|---|---|
| RNF01 — Segurança | Após US05, negar operações protegidas sem sessão válida; dados pessoais restritos ao titular/gestor autorizado. Se houver senha, armazenar apenas hash seguro. Não publicar secrets. |
| RNF02 — Integridade | Não persistir duas reservas ativas sobrepostas para a mesma quadra/data, inclusive sob concorrência; operação rejeitada não altera a reserva original. Verificar com persistência isolada e requisições concorrentes. |
| RNF03 — Usabilidade | Nos fluxos entregues na interface, controles críticos utilizáveis em 360 px e 1280 px de largura, mensagens de erro compreensíveis e navegação por teclado. Verificação ainda pendente. |
| RNF04 — Compatibilidade | Fluxos de interface entregues devem funcionar em Chrome, Firefox e Edge; registrar versões e resultados por navegador. |
| RNF05 — Desempenho | Meta de p95 menor que 2 s nas consultas de catálogo/disponibilidade. Volume de dados, concorrência e ambiente devem ser definidos antes da medição; não há resultado nem protocolo completo aprovado. |
| RNF06 — Testabilidade | Testes unitários isolam dependências; integrações identificam se usam mocks ou banco; comandos e ambiente são reproduzíveis. Meta de 80% em statements, branches, functions e lines dos services de negócio, sem remover código da coleta para atingir a meta. |

RNF05 consolida a meta de 2 s do plano de testes anterior, eliminando a referência divergente a 500 ms. RNF06 é meta do projeto, não percentual imposto pela P1/T2/T3 nem garantia aplicada pelo Jest atual.

## 5. Restrições e decisões pendentes

- Equipe de duas pessoas; seis iterações, duas por unidade, com ao menos uma história por integrante em cada iteração.
- Backend é o foco inicial dos testes. I1/I2 são incrementos de API em homologação, não serviço público seguro; autenticação será trabalhada na I3.
- O código de referência usa SQLite e Better SQLite3. PostgreSQL mencionado nas instruções do workspace não está implementado nesta base. Migração só deve ser documentada como concluída após alteração e verificação reais.
- Datas de início/fim das iterações e cronograma do semestre precisam de confirmação. Não retroagir o planejamento para simular execução anterior.
- US01 usa America/Fortaleza, data YYYY-MM-DD e horários HH:mm; início deve estar no futuro, inclusive no dia atual. O dia é armazenado à meia-noite UTC por convenção, não como instante real da reserva. Contrato aprovado no início da T2.
- Horário de funcionamento, duração máxima, antecedência mínima adicional, limites por aluno/curso e destino de reservas durante manutenção estão pendentes. Não introduzir números arbitrários.
- US03 adota cancelamento lógico e repetição idempotente; somente reservas ATIVA e futuras são canceláveis. A interpretação de data/hora e fuso deve ser definida no detalhamento antes da implementação.
- A autenticação da I3 deve ser definida antes de escolher credencial/token/sessão. E-mail ou matrícula isoladamente não são prova segura de identidade.
- Não há campo de curso no modelo atual; limites por curso dependem de aprovação e modelagem adicional.

## 6. Riscos

Todos os riscos abaixo foram registrados nesta revisão, em 06/10/2026; são riscos previstos, não incidentes comprovados.

| ID | Risco | Prioridade | Responsável | Mitigação |
|---|---|---|---|---|
| R01 | Documentação divergir do código | Alta | Paulo André | Vincular estados a código/commit e separar planejado de verificado |
| R02 | Capacidade insuficiente da dupla | Alta | Luis Felipe | Fatiar escopo e revisar dependências em cada iteração |
| R03 | Reserva dupla sob concorrência | Alta | Paulo André | Garantia transacional e teste com banco isolado |
| R04 | Erros de data, hora e fuso | Alta | Paulo André | Definir contrato, congelar relógio nos testes e testar fronteiras |
| R05 | SonarQube/secrets indisponíveis | Média | Luis Felipe | Verificar acesso previamente e registrar bloqueio sem inventar resultado |
| R06 | Testes com mocks ocultarem falhas de persistência | Alta | Luis Felipe | Complementar integração real quando necessário |
| R07 | Interface atrasar aceite de fluxos completos | Média | Luis Felipe | Distinguir aceite de API de E2E e planejar interface por incremento |
| R08 | Mudança de banco gerar retrabalho | Média | Paulo André | Confirmar decisão antes de migrations e testes específicos |
| R09 | Exposição de dados em API sem autorização | Alta | Paulo André | Restringir homologação; implementar RNF01 antes de uso público |
| R10 | Regras de equidade/manutenção indefinidas | Alta | Luis Felipe | Resolver parâmetros antes de iniciar US08/US10 |

## 7. Critérios de sucesso

| Métrica | Estado atual | Meta | Marco |
|---|---|---|---|
| Rastreabilidade | Backlog e distribuição documentados nesta revisão | Cada RF ligado a US, critérios e evidências | Revisão de cada iteração |
| Aceitação | QA de histórias não executado nesta revisão | Cenários executados e registrados pelo outro integrante | Fim de cada iteração |
| Cobertura dos services | Ver [estado dos testes](./estado_testes.md) | 80% nas quatro métricas | Revisão de cada incremento |
| Segurança | Sem autenticação na main auditada | RNF01 verificado | I3, antes de uso público |
| Integridade | Validação básica, sem comprovação de concorrência | RNF02 verificado | Antes de disponibilizar reservas a usuários reais |

## 8. Referências

- [Índice e checklist da P1](./README.md)
- [Modelo de visão YP-Agentic](https://github.com/tacianosilva/engenharia-software/blob/main/yp-agentic/templates/doc-visao.md)
- [Backlog](./user-stories.md), [iterações](./plano_iteracoes.md) e [plano de testes](./plano_teste.md)
- Código: [schema](../backend/prisma/schema.prisma), [services](../backend/src/services/) e [frontend](../frontend/src/)

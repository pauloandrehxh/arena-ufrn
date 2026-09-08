# Plano Geral de Testes de Software

**Projeto:** Sistema Acadêmico de gestão da quadra

**Equipe/Grupo:** Equipe de teste de Software / Processo easYProcess (YP) 

**Data:** 06/09/2026  

**Versão:** 1.0  

---

## 1. Visão Geral do Sistema
O sistema é uma aplicação web acadêmica desenvolvida para o contexto universitário com o propósito de gerenciar a infraestrutura, a disponibilidade e o uso da quadra de areia da instituição. Seu foco principal é automatizar o fluxo de agendamentos, permitir a consulta de horários em tempo real e operacionalizar o cancelamento de reservas, integrando regras de negócio automatizadas para evitar o monopólio da estrutura por determinados alunos ou cursos. O público-alvo é composto por Discentes, Docentes e Administradores/Gestores do espaço esportivo, provendo um ambiente integrado, transparente e equitativo para operações e consultas esportivas cotidianas no campus.
---

## 2. Escopo do Plano de Testes
### 2.1. Itens no Escopo (O que será testado)
- Testes Unitários de regras de negócio e validações de entidades.
- Testes de Integração entre os módulos de gerenciamento e persistência de dados.
- Testes dos Requisitos Funcionais (RF01 a RF09), cobrindo inserção, listagem, atualização e exclusão (CRUD) de todas as entidades acadêmicas, bem como os fluxos de login e logout.
- Testes dos Requisitos Não Funcionais (RNF) definidos (compatibilidade com navegadores, eficiência de consultas e auditoria/log).

### 2.2. Itens Fora do Escopo (O que NÃO será testado)
- Integração com serviços de diretório corporativo externos (LDAP/SSO institucional), caso não previstos no escopo inicial.
- Desempenho de infraestrutura física de servidores de rede da universidade.

---

## 3. Estratégia de Testes por Requisitos Não Funcionais (RNF)

| Identificador RNF | Tipo / Categoria | Descrição do Requisito | Abordagem / Estratégia de Teste | Critério de Aceitação / Métrica |
| :--- | :--- | :--- | :--- | :--- |
| **RNF001** | Portabilidade / Compatibilidade | Deve ser acessível via navegador (Firefox e Chrome). | Testes de renderização e compatibilidade cross-browser manuais e automatizados. | Comportamento, layout e funcionalidades operando sem falhas críticas no Firefox e Chrome. |
| **RNF002** | Desempenho / Eficiência | As consultas devem ser eficientes, executando em milissegundos. | Testes de performance automatizados em rotas de listagem de entidades (ex: turmas e componentes). | Tempo de resposta inferior a 500ms para 95% das consultas de listagem com volume padrão de dados. |
| **RNF003** | Segurança / Auditoria | Deve manter um log de todos os acessos e das funções executadas pelo usuário. | Testes de integração validando a gravação de logs de auditoria nas operações de escrita e autenticação. | Presença de registros consistentes (usuário, ação, data/hora) na base de logs para cada transação realizada. |

---

## 4. Tipos e Níveis de Teste

### 4.1. Testes de Unidade (Unit)
- **Foco:** Validação isolada de regras de negócio, restrições de chaves primárias e relacionamentos do modelo conceitual 
- **Responsável:** Desenvolvedor.
- **Ferramentas:** JUnit (ou equivalente da stack adotada).
- **Métrica Esperada:** Cobertura de código mínima de 80% nas classes de domínio e serviços.

### 4.2. Testes de Integração
- **Foco:** Validação da comunicação entre camadas de serviço, repositório e banco de dados, assegurando a integridade referencial (ex: verificar se um departamento pertence a um centro válido ao inserir).
- **Responsável:** Desenvolvedor / Analista de Testes.
- **Ferramentas:** Ferramentas de testes de integração com banco de dados em memória ou transacional isolado.

### 4.3. Testes de Sistema e Aceitação
- **Foco:** Validação de ponta a ponta (E2E) dos fluxos descritos nas User Stories (US01 a US09), com foco na validação de perfis de acesso (Administrador, Docente, Discente, Coordenador).
- **Responsável:** Equipe de Teste e Clientes (Professora Sandra e Professor Taciano / POs).

---

## 5. Ambiente de Testes
- **Hardware/Servidores:** Ambiente de homologação dedicado para testes da equipe e validação com os clientes.
- **Banco de Dados:** Base de dados relacional isolada para testes, populada com dados sintéticos representativos do cenário acadêmico.
- **Sistemas / APIs Externas:** Simulações e stubs para eventuais dependências externas.

---

## 6. Ferramentas Utilizadas
| Categoria | Ferramenta Escolhida | Finalidade |
| :--- | :--- | :--- |
| Gestão de Testes | GitHub Issues / Gerenciador de Tarefas do Projeto | Rastreamento de casos de teste, defeitos e melhorias |
| Automação Unit/Integração | JUnit / Framework de Testes da Stack | Execução automatizada de testes unitários e de integração |
| Análise de Desempenho (RNF002) | Ferramentas de medição de tempo de resposta / Profilers | Validação da eficiência das consultas de banco de dados |

---

## 7. Riscos e Contingências
| Risco Identificado | Impacto no Teste | Ação Mitigatória / Contingência |
| :--- | :--- | :--- |
| Não aprendizado das ferramentas utilizadas pelos componentes do grupo | Alto | Reforçar estudos sobre as ferramentas e aulas com a integrante que conhece a ferramenta (conforme planejamento de risco do projeto). |
| Ausência por qualquer motivo do cliente nas sessões de aceitação | Média | Planejar o cronograma tendo em base a agenda do cliente e antecipar homologações parciais. |
| Inconsistências de desempenho em consultas complexas (RNF002) | Médio | Otimização prévia de índices no modelo conceitual e refatoração de queries críticas. |
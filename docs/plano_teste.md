# Plano Geral de Testes de Software

**Projeto:** Arena UFRN - Gestor de Quadra de Areia  
**Equipe/Grupo:** Paulo André (@pauloandrehxh) e Luis Felipe (@Luisfelipelinhares)  
**Repositório:** [github.com/pauloandrehxh/arena-ufrn](https://github.com/pauloandrehxh/arena-ufrn)  
**Processo:** easYProcess (YP)  
**Data:** 05/09/2026  
**Versão:** 1.0  

---

## 1. Visão Geral do Sistema
O **Arena UFRN** é uma aplicação web voltada para o gerenciamento e reserva da quadra de areia da UFRN. Seu principal propósito é otimizar, organizar e democratizar o acesso ao espaço esportivo pela comunidade acadêmica. O público-alvo é composto por alunos da instituição, que podem se autenticar de forma simplificada (via e-mail ou matrícula simulada), consultar a disponibilidade da quadra em tempo real, realizar agendamentos e cancelar reservas. O contexto de uso envolve a aplicação rigorosa de regras de negócio automatizadas para evitar o monopólio de horários por um único curso ou aluno, garantindo equidade no uso do patrimônio universitário.

---

## 2. Escopo do Plano de Testes
### 2.1. Itens no Escopo (O que será testado)
- Testes Unitários e de Integração dos componentes do sistema utilizando **Jest**.
- Testes de Componentes visuais utilizando **React Testing Library** e **Jest**.
- Testes End-to-End (E2E) dos fluxos críticos de usuário utilizando **Cypress**.
- Testes dos Requisitos Funcionais (autenticação, consulta de horários, regras anti-monopólio, realização e cancelamento de reservas).
- Testes dos Requisitos Não Funcionais (RNF) definidos para a aplicação (desempenho básico, usabilidade responsiva e compatibilidade).

### 2.2. Itens Fora do Escopo (O que NÃO será testado)
- Integração com servidores de e-mail institucionais reais em ambiente de homologação (serão simulados/mockados).
- Infraestrutura de rede física e servidores de hospedagem finais sob responsabilidade da infraestrutura da universidade.

---

## 3. Estratégia de Testes por Requisitos Não Funcionais (RNF)

| Identificador RNF | Tipo / Categoria | Descrição do Requisito | Abordagem / Estratégia de Teste | Critério de Aceitação / Métrica |
| :--- | :--- | :--- | :--- | :--- |
| **RNF01** | Desempenho / Carga | O sistema deve suportar requisições concorrentes de consulta e agendamento em horários de pico. | Teste de Carga automatizado utilizando k6 focado nos endpoints de listagem e reserva. | Tempo de resposta menor que 2 segundos para 95% das requisições sob carga simulada. |
| **RNF02** | Segurança | As senhas (quando aplicável) devem ser salvas com hash seguro e as rotas protegidas por autenticação via token/sessão. | Inspeção de código e testes automatizados de integração validando o controle de acesso por rotas. | Acesso negado a rotas autenticadas sem credenciais válidas; ausência de senhas em texto plano no SQLite. |
| **RNF03** | Usabilidade | Interface responsiva utilizando Tailwind CSS para dispositivos móveis e desktops. | Avaliação de layout responsivo com React Testing Library e validação visual via Cypress Viewports. | Elementos críticos de agendamento visíveis e operacionais em resoluções mobile e desktop. |
| **RNF04** | Portabilidade / Compatibilidade | Deve funcionar nos navegadores modernos (Chrome, Firefox, Edge). | Testes E2E automatizados via Cypress executados em múltiplos navegadores. | Sucesso na execução dos fluxos principais de ponta a ponta sem quebras de layout ou erros de script. |

---

## 4. Tipos e Níveis de Teste

### 4.1. Testes de Unidade (Unit)
- **Foco:** Funções utilitárias, regras de negócio isoladas (ex: validação das restrições anti-monopólio por curso/aluno) e métodos de controle backend.
- **Responsável:** Desenvolvedor.
- **Ferramentas:** Jest.
- **Métrica Esperada:** Cobertura de código mínima de 80% nas regras de negócio principais.

### 4.2. Testes de Integração
- **Foco:** Comunicação entre as rotas da API em Node.js/Express e o banco de dados SQLite utilizando o Prisma ORM, garantindo a integridade das transações de reserva.
- **Responsável:** Desenvolvedor.
- **Ferramentas:** Jest (com banco de dados de testes isolado).

### 4.3. Testes de Componentes e Sistema (E2E)
- **Foco:** Validação da interface construída em React (via React Testing Library) e testes de ponta a ponta cobrindo cenários completos: login simulado -> consulta de disponibilidade -> criação de reserva -> verificação de bloqueio por regra anti-monopólio -> cancelamento.
- **Responsável:** Equipe de Desenvolvimento / Teste.
- **Ferramentas:** React Testing Library, Jest e Cypress.

---

## 5. Ambiente de Testes
- **Hardware/Servidores:** Máquinas locais de desenvolvimento e pipeline de Integração Contínua (CI) no GitHub Actions.
- **Banco de Dados:** Banco de dados SQLite em memória ou arquivo temporário dedicado para testes, alimentado com *fixtures* ou dados sintéticos pré-definidos.
- **Sistemas / APIs Externas:** Simulação (mocks) de serviços de autenticação ou notificações por e-mail, caso aplicável.

---

## 6. Ferramentas Utilizadas
| Categoria | Ferramenta Escolhida | Finalidade |
| :--- | :--- | :--- |
| Gestão de Testes | GitHub Issues / Pull Requests | Rastreabilidade de tarefas, bugs e validação de código |
| Automação Unit/Integração | Jest | Execução de testes unitários, de componentes e de integração |
| Testes de Componentes | React Testing Library | Validação de comportamento de componentes React |
| Testes E2E | Cypress | Simulação de interações do usuário no navegador |
| Testes de Carga/RNF | k6 | Simulação de acessos simultâneos de usuários |

---

## 7. Riscos e Contingências
| Risco Identificado | Impacto no Teste | Ação Mitigatória / Contingência |
| :--- | :--- | :--- |
| Inconsistência nos dados de teste do SQLite durante execuções paralelas | Médio | Utilizar migrações automatizadas do Prisma e resetar o banco de dados antes de cada suíte de testes. |
| Atraso na implementação dos fluxos de interface afetando os testes E2E | Alto | Priorizar a automação dos testes de unidade e regras de negócio no backend antes da finalização completa do design frontend. |
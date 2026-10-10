# Arena UFRN - Gestor de Reserva de Quadra

<p align="center">
  <strong>Sistema web para gerenciamento e reserva de quadras de areia da Universidade Federal do Rio Grande do Norte.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow" alt="Status do projeto">
  <img src="https://img.shields.io/badge/Node.js-22%2B-green" alt="Node.js">
  <img src="https://img.shields.io/badge/pnpm-12.3.4-orange" alt="pnpm">
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=js,react,vite,tailwind,nodejs,express,prisma,sqlite,jest,git,github" alt="Tecnologias utilizadas">
</p>

## Navegação

- [Sobre o projeto](#sobre-o-projeto)
- [Executando o projeto](#executando-o-projeto)
- [API](#api)
- [Testes](#testes)
- [Cobertura de testes](#cobertura-de-testes)
- [Integração Contínua](#integração-contínua)
- [Arquitetura](#arquitetura)
- [Documentação](./docs/)
- [Roadmap](#roadmap)

## Sobre o projeto

O **Arena UFRN** é uma aplicação web desenvolvida para facilitar o gerenciamento e a reserva de quadras de areia da Universidade Federal do Rio Grande do Norte (UFRN).

O projeto está sendo desenvolvido como atividade acadêmica em dupla e tem como objetivo aplicar, na prática, conceitos de:

* desenvolvimento web full stack;
* APIs REST;
* arquitetura cliente-servidor;
* organização de backend em camadas;
* persistência de dados;
* modelagem de banco de dados;
* testes automatizados;
* controle de versão com Git e GitHub.

A proposta é permitir que usuários consultem quadras disponíveis e, futuramente, realizem reservas de horários através da plataforma.

## Documentação

A documentação complementar do projeto está disponível na pasta [`docs`](./docs/).

Consulte os documentos para mais detalhes sobre visão do projeto, decisões de desenvolvimento, requisitos e demais artefatos produzidos ao longo do projeto.

- [Visão do Projeto](./docs/visao.md)
- [Plano de Teste](./docs/plano_teste.md)
- [Índice da documentação e checklist P1](./docs/README.md)
- [User Stories e critérios de aceitação](./docs/user-stories.md)
- [Plano das seis iterações](./docs/plano_iteracoes.md)
- [Plano da Iteração 1](./docs/iteracoes/iteracao01.md)
- [Estado dos testes](./docs/estado_testes.md)

## 🛠️ Tecnologias

### Frontend

| Tecnologia   | Utilização                          |
| ------------ | ----------------------------------- |
| React        | Construção da interface             |
| Vite         | Ambiente de desenvolvimento e build |
| JavaScript   | Linguagem principal                 |
| Tailwind CSS | Estilização da aplicação            |

### Backend

| Tecnologia | Utilização                           |
| ---------- | ------------------------------------ |
| Node.js    | Ambiente de execução                 |
| Express    | Construção da API REST               |
| JavaScript | Linguagem principal                  |
| CORS       | Comunicação entre frontend e backend |

### Banco de dados

| Tecnologia     | Utilização                      |
| -------------- | ------------------------------- |
| SQLite         | Banco de dados da aplicação     |
| Prisma ORM     | Modelagem e acesso aos dados    |
| Better SQLite3 | Adaptador utilizado pelo Prisma |

### Testes

| Tecnologia | Utilização                   |
| ---------- | ---------------------------- |
| Jest       | Framework de testes          |
| Supertest  | Testes das rotas HTTP da API |

### Ferramentas

| Ferramenta | Utilização               |
| ---------- | ------------------------ |
| Git        | Controle de versão       |
| GitHub     | Hospedagem e colaboração |
| pnpm       | Gerenciamento de pacotes |

## Arquitetura

O projeto utiliza uma arquitetura **cliente-servidor**.

```text
┌─────────────────────┐
│      Frontend       │
│   React + Vite      │
└──────────┬──────────┘
           │
           │ HTTP / JSON
           ▼
┌─────────────────────┐
│       Backend       │
│   Node + Express    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Prisma ORM      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       SQLite        │
└─────────────────────┘
```

### Arquitetura do backend

O backend é organizado em camadas para separar responsabilidades:

```text
Requisição HTTP
      │
      ▼
    Routes
      │
      ▼
 Controllers
      │
      ▼
   Services
      │
      ▼
 Prisma ORM
      │
      ▼
    SQLite
```

Cada camada possui uma responsabilidade específica:

* **Routes:** definem os endpoints da API;
* **Controllers:** recebem as requisições e constroem as respostas HTTP;
* **Services:** concentram o acesso aos dados e regras da aplicação;
* **Prisma:** realiza a comunicação com o banco de dados.

Essa organização facilita a manutenção, expansão e criação de testes para o sistema.

## API

Por padrão, o backend é executado em:

```text
http://localhost:3000
```

### Geral

| Método | Endpoint    | Descrição                          |
| ------ | ----------- | ---------------------------------- |
| GET    | `/`         | Verifica se a API está funcionando |
| GET    | `/api/test` | Testa a comunicação com o backend  |

### Quadras

| Método | Endpoint           | Descrição                |
| ------ | ------------------ | ------------------------ |
| GET    | `/api/quadras`     | Lista todas as quadras   |
| GET    | `/api/quadras/:id` | Busca uma quadra pelo ID |
| POST   | `/api/quadras`     | Cadastra uma nova quadra |
| PUT    | `/api/quadras/:id` | Atualiza uma quadra      |
| DELETE | `/api/quadras/:id` | Remove uma quadra        |

### Usuários

| Método | Endpoint            | Descrição                |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/usuarios`     | Lista todos os usuários  |
| GET    | `/api/usuarios/:id` | Busca um usuário pelo ID |
| POST   | `/api/usuarios`     | Cadastra um novo usuário |
| PUT    | `/api/usuarios/:id` | Atualiza um usuário      |
| DELETE | `/api/usuarios/:id` | Remove um usuário        |

### Exemplo de criação de usuário

```http
POST /api/usuarios
Content-Type: application/json
```

```json
{
  "name": "Paulo André",
  "email": "paulo@email.com",
  "registration": "202612345"
}
```

Exemplo de resposta:

```json
{
  "id": 1,
  "name": "Paulo André",
  "email": "paulo@email.com",
  "registration": "202612345",
  "active": true
}
```

### Reservas

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/reservas` | Cria reserva ATIVA |
| GET | `/api/reservas` | Lista reservas |
| GET | `/api/reservas/:id` | Consulta pelo ID |
| GET | `/api/reservas/usuario/:usuarioId` | Lista por usuário |
| GET | `/api/reservas/quadra/:quadraId` | Lista por quadra |
| PUT | `/api/reservas/:id` | Atualiza dados da reserva |
| PATCH | `/api/reservas/:id/cancelamento` | Cancela logicamente e retorna a reserva (200) |
| DELETE | `/api/reservas/:id` | Cancela logicamente e retorna 204; preserva o histórico |

Contrato da criação (US01): `usuarioId`/`quadraId` são inteiros JSON positivos;
`date` é `YYYY-MM-DD`; `startTime`/`endTime` são `HH:mm` válidos. Os horários são
interpretados em `America/Fortaleza`; início deve estar no futuro, inclusive no
dia atual. O dia é armazenado à meia-noite UTC apenas por convenção de calendário.
A criação fixa estado ATIVA e verifica sobreposição de reservas ATIVA na mesma
transação. Intervalos contíguos e horários de reservas CANCELADA não bloqueiam
uma nova reserva. Entradas inválidas retornam 400; erros inesperados retornam 500
sem detalhes internos. Não há autenticação: usar apenas homologação restrita.

```json
{
  "usuarioId": 1,
  "quadraId": 1,
  "date": "2099-10-10",
  "startTime": "14:00",
  "endTime": "15:00"
}
```

O exemplo usa uma data futura de teste, não uma reserva real.

Contrato de cancelamento (US03): apenas ATIVA com início futuro pode passar a
CANCELADA. Repetir cancelamento é idempotente, inclusive após o horário passar.
ID inválido retorna 400, inexistente 404, CONCLUIDA/já iniciada 409 e falha interna
500 genérico. PUT rejeita mudanças de estado/campos internos (400) e alterações
de CANCELADA/CONCLUIDA ou reserva já iniciada (409). DELETE não apaga mais registros.

## Executando o projeto

### Pré-requisitos

Antes de executar o projeto, tenha instalado:

* Git;
* Node.js 22.12 ou superior;
* pnpm 12.

Para verificar:

```bash
node --version
pnpm --version
git --version
```

### 1. Clone o repositório

```bash
git clone https://github.com/pauloandrehxh/arena-ufrn.git
```

Entre na pasta:

```bash
cd arena-ufrn
```

### 2. Backend

Entre no diretório:

```bash
cd backend
```

Instale as dependências:

```bash
pnpm install
```

Crie o arquivo `.env`:

```env
DATABASE_URL="file:./dev.db"
```

Gere o Prisma Client:

```bash
pnpm prisma generate --config prisma7.config.ts
```

Execute as migrations do banco:

```bash
pnpm prisma migrate dev --config prisma7.config.ts
```

Inicie o servidor:

```bash
pnpm dev
```

O backend ficará disponível em:

```text
http://localhost:3000
```

### 3. Frontend

Em outro terminal, entre no frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
pnpm install
```

Inicie o projeto:

```bash
pnpm dev
```

O Vite disponibilizará a aplicação normalmente em:

```text
http://localhost:5173
```

## Testes

O backend possui testes automatizados utilizando **Jest** e **Supertest**.

Os testes unitários e as suítes iniciais de integração usam mocks do Prisma.
A suíte `tests/integration/reservas.persistencia.test.js` utiliza a aplicação
completa e um SQLite temporário exclusivo, aplicando as migrations do projeto.
Nenhuma dessas suítes deve modificar o banco de desenvolvimento.

### Executar todos os testes

Todos os comandos abaixo devem ser executados dentro de `backend/`:

```bash
cd backend
pnpm test
```

### Executar os testes em modo watch

```bash
pnpm test:watch
```

### Testes de Unidade

Os testes unitários verificam funcionalidades isoladas da aplicação.

No projeto, os services são testados diretamente e o Prisma é substituído por Mock Objects, evitando acesso ao banco de dados durante os testes.

Os testes unitários cobrem as principais operações do CRUD:

- inserção;
- consulta;
- atualização;
- exclusão.

Para executar:
```bash
pnpm test:unit
```

### Testes de Integração

Os testes de integração verificam o funcionamento conjunto das diferentes camadas do backend.

Diferentemente do teste unitário, que verifica uma funcionalidade de maneira isolada, o teste de integração exercita diversos componentes da aplicação através de requisições HTTP.

Para executar:
```bash
pnpm test:integration
```

### Cobertura de Testes

O Jest também é utilizado para calcular a cobertura do código.

Para gerar o relatório:

```bash
pnpm test:coverage
```

São analisadas métricas como:

- Statements;
- Branches;
- Functions;
- Lines.

O relatório LCOV é gerado em: `backend/coverage/lcov.info`

Esse arquivo também é utilizado pelo SonarQube para importar as informações de cobertura.

As evidências das execuções estão disponíveis em:

- [Testes unitários](./docs/evidencias/testes-unitarios.png)
- [Testes de integração](./docs/evidencias/testes-integracao.png)
- [Cobertura](./docs/evidencias/cobertura.png)

### Experiência com os testes

A implementação dos testes ajudou a compreender melhor a importância da separação de responsabilidades no backend.

Nos testes unitários, o uso de Mock Objects tornou possível testar os services sem depender do banco de dados real.

Já nos testes de integração, foi possível verificar a comunicação entre Express, rotas, controllers e services através de requisições HTTP simuladas com Supertest.

Essa separação tornou mais claro o papel de cada tipo de teste e também aumentou a segurança durante alterações e refatorações do código.

## Integração Contínua

O projeto utiliza **GitHub Actions** para executar automaticamente verificações sempre que mudanças são enviadas ao repositório.

O workflow realiza:

1. configuração do ambiente;
2. instalação das dependências;
3. geração do Prisma Client;
4. execução dos testes unitários;
5. execução dos testes de integração;
6. geração da cobertura;
7. análise com SonarQube.

O workflow pode ser consultado em:

[GitHub Actions](./.github/workflows/)


## Referências de estudo

### CRUD e testes com Node.js

- [Build a CRUD API with TypeScript, Express, MongoDB, Zod and Jest](https://www.youtube.com/watch?v=vDLE8hqzA8I)

O tutorial apresenta a construção de uma API CRUD utilizando Express e demonstra a implementação de testes automatizados com Jest e Supertest, abordando operações de criação, consulta, atualização e exclusão.

### Documentações utilizadas

- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/ladjs/supertest)
- [Prisma - Testing](https://www.prisma.io/docs/orm/prisma-client/testing)

## Roadmap

As próximas etapas planejadas para o Arena UFRN incluem:

### Reservas

O backend já cria, consulta, atualiza e cancela reservas, com relacionamentos e
validações de data/horário/conflito. Permanecem como evolução:

* autenticação de titular para cancelamento (dependência US05);
* cálculo de disponibilidade (US04);
* regras de uso equitativo e reagendamento seguro;
* verificação de concorrência entre múltiplas instâncias da aplicação.

### Autenticação e autorização

* autenticação de usuários;
* armazenamento seguro de senhas;
* controle de sessão ou tokens;
* diferenciação entre usuários e administradores;
* proteção de endpoints.

### Frontend

* integração completa com os endpoints;
* interface de gerenciamento das quadras;
* cadastro e gerenciamento de usuários;
* visualização de horários;
* criação e cancelamento de reservas;
* melhoria da responsividade e experiência do usuário.

### Testes

* ampliação da cobertura do backend;
* testes das regras de negócio das reservas;
* testes do frontend;
* testes End-to-End dos principais fluxos.

## Equipe

Projeto desenvolvido em dupla para fins acadêmicos.

| Integrante  | Responsabilidade | GitHub                                                       |
| ----------- | ---------------- | ------------------------------------------------------------ |
| Paulo André | Desenvolvimento  | [@pauloandrehxh](https://github.com/pauloandrehxh)           |
| Luis Felipe | Desenvolvimento  | [@Luisfelipelinhares](https://github.com/Luisfelipelinhares) |

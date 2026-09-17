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

## Status do projeto

O projeto encontra-se **em desenvolvimento**.

### Implementado

* [x] Estrutura inicial do projeto
* [x] Frontend com React e Vite
* [x] Estilização com Tailwind CSS
* [x] Backend com Node.js e Express
* [x] Comunicação entre frontend e backend
* [x] Configuração de CORS
* [x] Banco de dados SQLite
* [x] Prisma ORM
* [x] CRUD de quadras
* [x] Arquitetura de rotas, controladores e serviços
* [x] CRUD de usuários
* [x] Testes automatizados do backend com Jest
* [x] Testes de endpoints com Supertest

### Próximas etapas

* [ ] Sistema de reservas
* [ ] Validação de conflito de horários
* [ ] Autenticação de usuários
* [ ] Controle de acesso
* [ ] Área administrativa
* [ ] Evolução da interface do frontend
* [ ] Testes do frontend
* [ ] Testes End-to-End

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

## Estrutura do projeto

```text
arena-ufrn/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── quadra.controller.js
│   │   │   └── usuario.controller.js
│   │   │
│   │   ├── routes/
│   │   │   ├── quadra.routes.js
│   │   │   └── usuario.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── quadra.service.js
│   │   │   └── usuario.service.js
│   │   │
│   │   ├── lib/
│   │   │   └── prisma.js
│   │   │
│   │   └── app.js
│   │
│   ├── tests/
│   │   ├── quadras.test.js
│   │   └── usuarios.test.js
│   │
│   ├── server.js
│   ├── jest.config.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── docs/
├── .gitignore
└── README.md
```

## Banco de dados

Atualmente, a aplicação utiliza **SQLite** em conjunto com o **Prisma ORM**.

### Quadra

Representa as quadras cadastradas no sistema.

```text
Quadra
├── id
├── name
└── active
```

### Usuário

Representa os usuários cadastrados na plataforma.

```text
Usuario
├── id
├── name
├── email
├── registration
└── active
```

O modelo de reservas será adicionado nas próximas etapas do desenvolvimento e será responsável por relacionar usuários, quadras, datas e horários.

## 🌐 API

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

## 🚀 Executando o projeto

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

## Backend

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
pnpm prisma generate
```

Execute as migrations do banco:

```bash
pnpm prisma migrate dev
```

Inicie o servidor:

```bash
pnpm dev
```

O backend ficará disponível em:

```text
http://localhost:3000
```

## Frontend

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

Os testes utilizam mocks do Prisma para permitir que as funcionalidades sejam verificadas sem modificar o banco de dados real da aplicação.

### Executar todos os testes

Dentro de `backend/`:

```bash
pnpm test
```

### Executar os testes em modo watch

```bash
pnpm test:watch
```

### Gerar relatório de cobertura

```bash
pnpm test:coverage
```

Atualmente são testadas funcionalidades relacionadas a:

* listagem de registros;
* busca por ID;
* criação;
* atualização;
* exclusão;
* validação de IDs;
* registros inexistentes;
* dados obrigatórios;
* conflitos como e-mail ou matrícula já cadastrados.

## Fluxo de desenvolvimento

O projeto utiliza Git e GitHub para organização das alterações.

As branches são organizadas de acordo com o tipo de mudança, por exemplo:

```text
feature/crud-usuarios
feature/reservas
refactor/arquitetura-backend
test/testes-backend
docs/atualiza-readme
```

Os commits seguem o padrão **Conventional Commits**, mantendo os prefixos padronizados e as descrições em português:

```text
feat: implementa CRUD de usuários
fix: corrige validação de usuário
refactor: reorganiza arquitetura do backend
test: adiciona testes do CRUD de usuários
docs: atualiza documentação do projeto
chore: atualiza dependências do backend
```

## Roadmap

As próximas etapas planejadas para o Arena UFRN incluem:

### Reservas

* criação de reservas;
* consulta de reservas;
* cancelamento de reservas;
* relacionamento entre usuários e quadras;
* definição de data e horário;
* verificação de conflitos;
* controle de disponibilidade.

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

## Contexto acadêmico

O Arena UFRN busca aplicar conceitos estudados durante a formação em Sistemas de Informação através do desenvolvimento de uma aplicação completa, envolvendo frontend, backend, banco de dados, testes, versionamento e organização de projeto de software.

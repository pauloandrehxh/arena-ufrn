# Arena UFRN

Sistema web para gerenciamento e reserva de quadras de areia da Universidade Federal do Rio Grande do Norte (UFRN).

O projeto está sendo desenvolvido como atividade acadêmica em dupla, com o objetivo de aplicar conceitos de desenvolvimento web, arquitetura cliente-servidor, persistência de dados, testes automatizados e controle de versão.


## Status do projeto

🚧 Em desenvolvimento

Atualmente, o projeto possui:

- [x] Estrutura inicial do projeto
- [x] Frontend com React + Vite
- [x] Backend com Node.js + Express
- [x] Configuração do CORS
- [x] Comunicação entre frontend e backend
- [x] Endpoint de teste da API
- [x] Endpoint de teste para consulta de quadras
- [ ] Banco de dados SQLite
- [ ] Prisma ORM
- [ ] Sistema de reservas
- [ ] Autenticação de usuários
- [ ] Testes automatizados
- [ ] Testes E2E
- [ ] Interface final



## Tecnologias

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS

### Backend

- Node.js
- Express
- JavaScript
- CORS

### Banco de dados

- SQLite
- Prisma ORM

### Testes

- Jest
- React Testing Library
- Cypress

### Ferramentas

- Git
- GitHub
- pnpm
- VS Code


## Arquitetura

O projeto utiliza uma arquitetura cliente-servidor.
Inicialmente, a comunicação funciona da seguinte forma:

```text
┌───────────────┐
│    Frontend   │
│ React + Vite  │
└───────┬───────┘
        │
        │ HTTP
        ▼
┌───────────────┐
│    Backend    │
│ Node + Express│
└───────┬───────┘
        │
        │
        ▼
┌───────────────┐
│   Banco de    │
│    Dados      │
│ SQLite/Prisma │
└───────────────┘
```

> O banco de dados ainda será integrado. Neste momento, a API utiliza dados fixos para os testes iniciais.


## Estrutura do projeto

```text
arena-ufrn/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
├── README.md
├── package.json
└── pnpm-workspace.yaml
```

A estrutura poderá ser expandida conforme novas funcionalidades forem implementadas.

## Como executar o projeto

### Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- pnpm
- Git

Verifique as versões:

```bash
node --version
pnpm --version
git --version
```

## Executando o Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
pnpm install
```

Execute o servidor:

```bash
pnpm dev
```

O backend estará disponível em:

```text
http://localhost:3000
```

### Endpoints atuais

Endpoint principal:

```text
GET http://localhost:3000/
```

Endpoint utilizado para testar a comunicação com o frontend:

```text
GET http://localhost:3000/api/test
```

Endpoint inicial para consulta das quadras:

```text
GET http://localhost:3000/api/quadras
```


## Executando o Frontend

Abra outro terminal e entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
pnpm install
```

Execute o projeto:

```bash
pnpm dev
```

O Vite disponibilizará a aplicação em um endereço semelhante a:

```text
http://localhost:5173
```

## Integração Frontend + Backend

O frontend realiza requisições HTTP para a API desenvolvida com Express.

Exemplo:

```text
React
  │
  │ GET /api/quadras
  ▼
Express
  │
  │ Retorna dados das quadras
  ▼
React
  │
  ▼
Exibe as quadras na interface
```
Essa integração representa a primeira etapa da arquitetura da aplicação.

## Funcionalidades planejadas

### Usuários

- Cadastro de usuários
- Login
- Controle de acesso
- Gerenciamento de perfil

### Quadras

- Listagem de quadras
- Visualização da disponibilidade
- Informações da quadra

### Reservas

- Criar reserva
- Consultar reservas
- Cancelar reserva
- Verificar conflitos de horário
- Controle de horários disponíveis

### Administração

- Gerenciamento de quadras
- Gerenciamento de usuários
- Gerenciamento de reservas

## Banco de dados

A persistência dos dados será implementada utilizando:

```text
Prisma ORM
    │
    ▼
 SQLite
```

> A implementação será realizada após a conclusão e validação da comunicação básica entre frontend e backend.


## Testes

O projeto será desenvolvido utilizando diferentes níveis de testes.

### Testes do Backend

Será utilizado o Jest para testes unitários e de integração.

### Testes do Frontend

Serão utilizados:

- Jest
- React Testing Library

### Testes End-to-End

Será utilizado o Cypress para testar os fluxos completos da aplicação.

Exemplo de fluxo:

```text
Usuário
   │
   ▼
Acessa o sistema
   │
   ▼
Visualiza as quadras
   │
   ▼
Escolhe uma quadra
   │
   ▼
Seleciona data e horário
   │
   ▼
Realiza uma reserva
   │
   ▼
Sistema confirma a reserva
```

## Equipe

Projeto desenvolvido em dupla para fins acadêmicos.

| Integrante | Responsabilidade |Github            |
|------------|------------------|------------------|
| Paulo André| Desenvolvimento  |@pauloandrehxh     |
| Luis Felipe| Desenvolvimento  |@Luisfelipelinhares|


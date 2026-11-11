# RELATÓRIO DE AVALIAÇÃO DE QA

## Projeto Arena UFRN

Avaliação de testes End-to-End (E2E) · Frontend

## 1. Objetivo da avaliação

Este relatório apresenta os resultados da execução dos testes de qualidade (QA) do projeto Arena UFRN, com foco na validação dos principais fluxos de navegação e funcionalidades da aplicação.

Foram avaliados os três testes End-to-End (E2E) existentes no arquivo `arena-ufrn/frontend/e2e/home.e2e.test.js`, utilizando JavaScript, `node:test`, Selenium WebDriver, Firefox e GeckoDriver.

## 2. Fluxos avaliados

Foram executados três cenários de teste:

| Nº | Teste | Objetivo |
| --- | --- | --- |
| 1 | Visualização do catálogo de quadras | Validar o acesso à página inicial, a navegação até a seção de quadras e a exibição do catálogo. |
| 2 | Consulta à seção "Como Funciona" | Verificar a apresentação do título e das três etapas de funcionamento do sistema. |
| 3 | Status de disponibilidade das quadras | Validar o comportamento dos botões de acordo com a disponibilidade das quadras. |

### 2.1. Detalhamento dos cenários

Teste 1 – Visualização do catálogo de quadras

- Acessar a página inicial da aplicação.
- Validar a presença do título principal.
- Navegar até a seção `#quadras`.
- Verificar a exibição do título da seção.
- Confirmar que pelo menos uma quadra está disponível no catálogo.

Teste 2 – Consulta à seção "Como Funciona"

- Acessar a seção `#como-funciona`.
- Verificar a presença do título "Como Funciona?".
- Validar a apresentação das três etapas na ordem esperada:
  1. Escolha a Quadra.
  2. Selecione o Horário.
  3. Confirme & Jogue.

Teste 3 – Status de disponibilidade das quadras

- Aguardar o carregamento das quadras.
- Identificar os botões correspondentes aos estados de disponibilidade.
- Verificar se quadras disponíveis apresentam o botão "Ver Horários".
- Validar se o clique em uma quadra disponível exibe o alerta de reserva.
- Confirmar que quadras indisponíveis apresentam o botão desabilitado.

Observação sobre a localização: o arquivo de testes está localizado em `arena-ufrn/frontend/e2e/home.e2e.test.js`. O caminho `frontend/e2e/...` não existe diretamente na raiz do workspace.

## 3. Procedimentos executados

A avaliação foi realizada em três etapas.

### 3.1. Análise do projeto e dos testes

Inicialmente, foi realizada uma análise estática dos arquivos relevantes, sem modificações no código-fonte.

Foram analisados:

- `arena-ufrn/frontend/e2e/home.e2e.test.js`: identificação dos cenários, seletores, asserções e configurações dos testes.
- `arena-ufrn/frontend/package.json`: verificação do script responsável pela execução dos testes E2E.

### 3.2. Verificação das pré-condições do ambiente

Antes da execução, foram verificadas as dependências e configurações necessárias.

| Item verificado | Resultado |
| --- | --- |
| Aplicação local (`http://localhost:5173`) | HTTP 200 |
| Firefox | Encontrado |
| GeckoDriver | Encontrado |
| Dependência Selenium WebDriver | Declarada |
| Diretório `node_modules` | Presente |

Caminhos dos executáveis identificados:

- Firefox: `C:\Program Files\Mozilla Firefox\firefox.exe`
- GeckoDriver: `C:\Users\luisf\WebDriver\geckodriver-v0.37.1-win64\geckodriver.exe`

Dependência identificada:

- `selenium-webdriver`: versão declarada `^4.52.0`.

### 3.3. Execução dos testes E2E

A execução foi realizada por meio do seguinte comando:

bash

```bash
pnpm test:e2e
```

Diretório de execução:

text

```text
arena-ufrn/frontend
```

Script configurado no package.json:

json

```json
"test:e2e": "node --test e2e/*.test.js"
```

Durante o procedimento:

- Os três testes existentes foram executados.
- Não foram realizadas alterações nos arquivos do projeto.
- Nenhuma funcionalidade foi criada ou modificada.
- Nenhum commit foi realizado.

## 4. Resultados obtidos

APROVADO — 3/3 testesA execução foi concluída com sucesso, sem falhas nos cenários avaliados.

### 4.1. Resultado individual dos testes

| Fluxo avaliado | Status | Duração |
| --- | --- | --- |
| Visualização do catálogo de quadras | Aprovado | 10.271,96 ms |
| Consulta à seção "Como Funciona" | Aprovado | 8.833,09 ms |
| Status de disponibilidade das quadras | Aprovado | 10.007,23 ms |

### 4.2. Comportamentos observados

Teste 1 – Visualização do catálogo de quadras

O teste foi aprovado.

Foi confirmado que:

- A página inicial carregou corretamente.
- O título principal exibido foi "Reserve sua Quadra de Areia".
- A navegação até a seção de quadras funcionou.
- O título "Quadras Disponíveis" foi localizado.
- O catálogo apresentou pelo menos uma quadra.

Teste 2 – Consulta à seção "Como Funciona"

O teste foi aprovado.

Foi confirmado que:

- A seção foi carregada corretamente.
- O título "Como Funciona?" foi apresentado.
- As três etapas foram exibidas na sequência esperada:
  1. Escolha a Quadra.
  2. Selecione o Horário.
  3. Confirme & Jogue.

Teste 3 – Status de disponibilidade das quadras

O teste foi aprovado.

Foi confirmado que:

- A aplicação carregou a seção de quadras.
- O teste aguardou o encerramento do estado "Carregando quadras".
- Foram encontrados botões relacionados à disponibilidade.
- Para quadras disponíveis, o clique exibiu o alerta:

text

```text
Reserva para ${nome} em breve!
```

- O alerta foi aceito corretamente.
- Para quadras indisponíveis, o botão correspondente permaneceu desabilitado (`isEnabled() === false`).

### 4.3. Resumo estatístico da execução

# 3

Testes aprovados

# 0

Testes reprovados

# 0

Testes ignorados

# 29,38 s

Tempo total de execução

Resumo da execução (TAP):

| Indicador | Resultado |
| --- | --- |
| Total de testes | 3 |
| Testes aprovados | 3 |
| Testes reprovados | 0 |
| Testes cancelados | 0 |
| Testes ignorados | 0 |
| Testes pendentes (todo) | 0 |
| Código de saída | 0 |

## 5. Falhas e pontos de atenção identificados

Durante a execução, não foram identificadas falhas funcionais nos três fluxos E2E avaliados.

Entretanto, foram identificados dois pontos de atenção relacionados à robustez e à manutenção dos testes.

### 5.1. Caminhos fixos dos executáveis

Os caminhos do Firefox e do GeckoDriver estão definidos diretamente no código dos testes (hardcoded).

Isso pode ocasionar problemas quando os testes forem executados em outras máquinas ou ambientes, principalmente quando os executáveis estiverem instalados em diretórios diferentes.

Recomendação: utilizar variáveis de ambiente ou configurações externas para definir os caminhos dos executáveis, facilitando a execução em diferentes ambientes.

### 5.2. Dependência dos dados de disponibilidade

O terceiro teste realiza validações condicionais de acordo com os dados de disponibilidade apresentados pela aplicação.

Embora o teste tenha sido aprovado, a cobertura efetiva dos comportamentos depende dos dados disponíveis no momento da execução.

Recomendação: criar cenários controlados que garantam a validação explícita dos dois estados:

- Quadra disponível: botão habilitado e apresentação do alerta de reserva.
- Quadra indisponível: botão desabilitado e impossibilidade de interação.

Essa abordagem proporciona maior previsibilidade e consistência nos resultados.

## 6. Evidências da execução

As seguintes evidências foram identificadas durante a avaliação:

Arquivos analisados:

- `arena-ufrn/frontend/e2e/home.e2e.test.js`
- `arena-ufrn/frontend/package.json`

Verificações de ambiente:

- Requisição GET para `http://localhost:5173/` retornando HTTP 200.
- Existência do executável Firefox.
- Existência do executável GeckoDriver.
- Dependência Selenium WebDriver declarada no projeto.

### 6.1. Saída original da execução

Abaixo, a saída do terminal referente à execução dos testes:

text

```text
TAP version 13

# Subtest: Deve acessar a seção de quadras e visualizar o catálogo
ok 1 - Deve acessar a seção de quadras e visualizar o catálogo
  ---
  duration_ms: 10271.955
  type: 'test'
  ...

# Subtest: Deve apresentar as etapas de funcionamento do sistema
ok 2 - Deve apresentar as etapas de funcionamento do sistema
  ---
  duration_ms: 8833.0911
  type: 'test'
  ...

# Subtest: Deve respeitar o status de disponibilidade das quadras
ok 3 - Deve respeitar o status de disponibilidade das quadras
  ---
  duration_ms: 10007.2322
  type: 'test'
  ...

1..3
# tests 3
# suites 0
# pass 3
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 29376.5614
```

Código de saída do processo: `0` (execução concluída com sucesso).

## 7. Conclusão

A avaliação de qualidade do projeto Arena UFRN foi concluída com sucesso, considerando os três fluxos End-to-End existentes no ambiente analisado.

Todos os cenários executados apresentaram resultados positivos, demonstrando que os principais comportamentos avaliados estão funcionando conforme as asserções definidas nos testes automatizados.

Os resultados confirmaram:

- O carregamento e a navegação da página inicial.
- A exibição correta do catálogo de quadras.
- A apresentação das três etapas de funcionamento do sistema.
- O tratamento adequado dos estados de disponibilidade das quadras.
- A apresentação do alerta de reserva para quadras disponíveis.
- O bloqueio de interação com quadras indisponíveis.

Não foram identificadas falhas funcionais durante a execução.

Como melhorias futuras, recomenda-se a remoção dos caminhos fixos dos executáveis e a criação de cenários controlados para garantir a cobertura consistente dos diferentes estados de disponibilidade.

Parecer final: considerando exclusivamente os três fluxos avaliados, o projeto Arena UFRN apresentou resultados satisfatórios nos testes E2E executados, com 100% de aprovação e nenhuma falha registrada.

Documento elaborado com base nos resultados e nas evidências fornecidas da execução dos testes automatizados. A aprovação refere-se exclusivamente aos cenários avaliados, não representando uma certificação integral de qualidade do sistema.
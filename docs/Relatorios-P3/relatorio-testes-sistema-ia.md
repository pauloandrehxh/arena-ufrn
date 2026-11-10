# Pesquisa comparativa das ferramentas de testes E2E

Vou preparar essa parte em formato acadêmico, pronta para você colocar no arquivo `docs/relatorio-testes-sistema-ia.md`.

A comparação será entre Selenium, Cypress e Playwright, considerando os critérios de avaliação da atividade. Ao final, apresentaremos a justificativa pela escolha do Selenium.

## 1. Comparação das ferramentas

Os testes End-to-End (E2E) são utilizados para verificar o funcionamento de uma aplicação do ponto de vista do usuário, simulando ações reais, como acessar páginas, preencher formulários, realizar login e navegar entre funcionalidades.

As três ferramentas pesquisadas são amplamente utilizadas para automação de testes de aplicações web, mas apresentam diferenças em arquitetura, linguagens suportadas, recursos e integração com processos de desenvolvimento.

### 1.1 Selenium

File:Selenium Logo.png - Wikimedia Commons

Selenium

Projeto de código aberto — licença Apache 2.0

[Documentação oficial](<https://www.selenium.dev/documentation/?utm_source=chatgpt.com>)

O Selenium é uma ferramenta de automação de navegadores utilizada para executar testes em aplicações web. Seu principal componente é o Selenium WebDriver, que permite controlar navegadores por meio de comandos programados, simulando as ações realizadas por um usuário.

Principais características:

- Licença: código aberto, distribuído sob licença Apache 2.0, permitindo utilização gratuita.
- Arquitetura: utiliza o padrão WebDriver, comunicando-se com os navegadores por meio de suas interfaces de automação. Também oferece o Selenium Grid para execução distribuída.
- Linguagens suportadas: Java, Python, C#, JavaScript, Ruby e Kotlin.
- Gravação e depuração: possui o Selenium IDE, que permite gravar e reproduzir ações no navegador. A depuração também pode ser realizada utilizando recursos da IDE de desenvolvimento.
- Integração com GitHub Actions: permite executar testes automaticamente por meio de workflows, utilizando as bibliotecas da linguagem escolhida e os navegadores disponíveis no ambiente de execução.

Vantagens: ampla compatibilidade com navegadores, suporte a diversas linguagens, flexibilidade e grande comunidade de usuários.

Limitações: exige configuração do ambiente de testes e conhecimentos de programação. A depuração pode depender de ferramentas externas.

Fontes:

Selenium

+2

### 1.2 Cypress

Cypress.io - Features, Reviews & Pricing (February 2026)

Cypress

Código aberto — licença MIT

[Documentação oficial](<https://docs.cypress.io/?utm_source=chatgpt.com>)

O Cypress é uma ferramenta voltada principalmente para testes automatizados de aplicações web. Possui uma estrutura integrada que facilita a criação, execução e depuração dos testes.

Principais características:

- Licença: Cypress App é gratuito e de código aberto, distribuído sob licença MIT. Alguns serviços adicionais do Cypress Cloud possuem planos pagos.
- Arquitetura: executa seus comandos em estreita integração com o navegador e no mesmo ciclo de execução da aplicação, diferentemente da comunicação remota utilizada pelo Selenium.
- Linguagens suportadas: JavaScript e TypeScript.
- Gravação e depuração: oferece uma interface interativa para acompanhar a execução dos testes, além de capturas de tela, vídeos e recursos de depuração.
- Integração com GitHub Actions: possui uma Action oficial que facilita a instalação das dependências e a execução automatizada dos testes.

Vantagens: facilidade de utilização, recursos integrados de depuração, configuração simplificada e boa experiência para desenvolvimento de testes.

Limitações: possui suporte mais restrito a linguagens de programação e apresenta algumas limitações relacionadas à automação de múltiplas abas e contextos de navegador.

Fontes:

Cypress

+3

### 1.3 Playwright

NuGet Gallery | Microsoft.Playwright 1.58.0

Playwright

Código aberto — licença Apache 2.0

[Documentação oficial](<https://playwright.dev/?utm_source=chatgpt.com>)

O Playwright é uma ferramenta de automação desenvolvida pela Microsoft, destinada à realização de testes em aplicações web. Permite automatizar diferentes navegadores utilizando uma API unificada.

Principais características:

- Licença: código aberto, distribuído sob licença Apache 2.0.
- Arquitetura: utiliza uma API de automação que controla os navegadores Chromium, Firefox e WebKit.
- Linguagens suportadas: JavaScript, TypeScript, Python, Java e C#.
- Gravação e depuração: possui o recurso Codegen, que gera códigos de testes a partir das ações realizadas no navegador, além do Trace Viewer para análise detalhada da execução.
- Integração com GitHub Actions: permite executar testes automaticamente por meio de workflows, com suporte a relatórios, capturas de tela e rastreamento de falhas.

Vantagens: suporte a diferentes navegadores, espera automática de elementos, execução paralela e ferramentas avançadas de depuração.

Limitações: pode exigir aprendizado inicial para configurar corretamente os projetos e utilizar seus recursos mais avançados.

Fontes:

GitHub

+2

## 2. Tabela comparativa

A tabela a seguir apresenta um resumo das principais diferenças entre as três ferramentas pesquisadas.

| Critério | Selenium | Cypress | Playwright |
| --- | --- | --- | --- |
| Licença | Apache 2.0 | MIT | Apache 2.0 |
| Custo básico | Gratuito | Gratuito | Gratuito |
| Linguagens | Java, Python, C#, JS, Ruby, Kotlin | JS e TS | JS, TS, Python, Java, C# |
| Navegadores | Chrome, Firefox, Edge, Safari | Chrome, Firefox, WebKit | Chromium, Firefox, WebKit |
| Arquitetura | WebDriver | Integração com ciclo da aplicação | API de automação |
| Gravação de testes | Selenium IDE | Recursos interativos | Codegen |
| Depuração | IDE de desenvolvimento | Interface interativa | Trace Viewer |
| Execução paralela | Selenium Grid | Suporte integrado e Cloud | Suporte integrado |
| GitHub Actions | Sim | Sim | Sim |

Fontes: documentação oficial das três ferramentas.

Selenium

+8

## 3. Análise comparativa

Após a análise das três ferramentas, foi possível observar que todas oferecem recursos importantes para a automação de testes E2E.

O Selenium se destaca pela flexibilidade, pois permite desenvolver testes em diferentes linguagens de programação e executar automações em diversos navegadores. Além disso, possui o Selenium Grid, que possibilita distribuir a execução dos testes em diferentes máquinas e ambientes.

O Cypress apresenta como principal vantagem sua facilidade de configuração e seus recursos integrados de depuração. Entretanto, possui suporte mais limitado em relação às linguagens de programação.

O Playwright também apresenta recursos modernos, como espera automática, execução paralela e geração de testes por meio do Codegen. É uma alternativa interessante para projetos que necessitam de automação em diferentes navegadores.

Portanto, a escolha da ferramenta deve considerar as necessidades do projeto, a experiência da equipe e os requisitos da atividade.

## 4. Justificativa da escolha: Selenium

Ferramenta escolhidaApós a comparação das ferramentas Selenium, Cypress e Playwright, foi escolhido o Selenium para a implementação dos testes automatizados do projeto.

A escolha foi motivada principalmente pela sua flexibilidade, ampla compatibilidade com diferentes navegadores e suporte a diversas linguagens de programação, permitindo que os testes sejam desenvolvidos de acordo com as tecnologias utilizadas pela equipe.

Outro fator importante é a utilização do Selenium WebDriver, que possibilita simular as interações de um usuário real com a aplicação, como cliques, preenchimento de formulários, navegação entre páginas e validação de resultados.

A ferramenta também oferece o Selenium IDE, que permite gravar e reproduzir ações realizadas no navegador, auxiliando na criação e compreensão dos cenários de testes.

Além disso, o Selenium possui integração com ferramentas de integração contínua, como o GitHub Actions, permitindo automatizar a execução dos testes a cada atualização do código ou abertura de Pull Requests.

Outro aspecto relevante é que o Selenium é gratuito e possui uma comunidade ampla, além de documentação oficial que facilita o aprendizado e a resolução de problemas durante o desenvolvimento.

Dessa forma, considerando os recursos oferecidos, a flexibilidade e a possibilidade de integração com o fluxo de desenvolvimento do projeto, o Selenium foi considerado a ferramenta mais adequada para atender aos objetivos desta atividade.

## 5. Referências bibliográficas

Você pode colocar estas referências no final dessa seção do relatório:

1. SELENIUM. Selenium Documentation. Disponível em: [https://www.selenium.dev/documentation/](<https://www.selenium.dev/documentation/?utm_source=chatgpt.com>). Acesso em: 10 nov. 2026.

2. SELENIUM. Selenium IDE. Disponível em: [https://www.selenium.dev/documentation/ide/](<https://www.selenium.dev/documentation/ide/?utm_source=chatgpt.com>). Acesso em: 10 nov. 2026.

3. CYPRESS. Cypress Documentation. Disponível em: [https://docs.cypress.io/](<https://docs.cypress.io/?utm_source=chatgpt.com>). Acesso em: 10 nov. 2026.

4. CYPRESS. How Cypress Works. Disponível em: [https://www.cypress.io/how-it-works](<https://www.cypress.io/how-it-works?utm_source=chatgpt.com>). Acesso em: 10 nov. 2026.

5. MICROSOFT. Playwright Documentation. Disponível em: [https://playwright.dev/](<https://playwright.dev/?utm_source=chatgpt.com>). Acesso em: 10 nov. 2026.

6. PLAYWRIGHT. Continuous Integration. Disponível em: [https://playwright.dev/docs/ci](<https://playwright.dev/docs/ci?utm_source=chatgpt.com>). Acesso em: 10 nov. 2026.


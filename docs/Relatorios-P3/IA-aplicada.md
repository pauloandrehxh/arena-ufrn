# 1. Inteligência Artificial aplicada aos testes de software

A Inteligência Artificial (IA) vem sendo utilizada no desenvolvimento de software para auxiliar na identificação de erros, criação de casos de teste, análise de código e automação de atividades relacionadas à qualidade do sistema.

No contexto dos testes de software, a IA pode contribuir para reduzir o trabalho manual, acelerar a identificação de falhas e melhorar a cobertura dos testes.

Entretanto, é importante diferenciar duas formas de utilização da IA nesse contexto:

## 1.1 IA que escreve testes

A IA que escreve testes é utilizada para auxiliar na criação de códigos de automação a partir de instruções fornecidas pelo desenvolvedor ou analista de testes.

Nesse modelo, o profissional informa quais funcionalidades precisam ser testadas, quais comportamentos são esperados e quais situações devem ser verificadas. A IA analisa essas informações e pode gerar códigos de testes utilizando ferramentas como Selenium, Cypress e Playwright.

Exemplo prático:

Um desenvolvedor solicita à IA:

"Crie um teste automatizado para verificar se um usuário consegue realizar login com e-mail e senha válidos utilizando Selenium."

A IA poderá gerar um código que:

- Acesse a página de login.
- Localize os campos de e-mail e senha.
- Preencha as informações.
- Clique no botão de entrar.
- Verifique se o usuário foi direcionado para a página inicial.

Nesse caso, a IA está auxiliando na escrita do teste, mas a execução depende da ferramenta de automação e do ambiente configurado.

## 1.2 IA que executa testes (Agentes de IA)

Os agentes de IA possuem uma capacidade mais ampla, pois podem interpretar instruções, planejar ações e utilizar ferramentas para interagir diretamente com uma aplicação.

Diferentemente de uma IA utilizada somente para gerar código, um agente pode acessar o navegador, navegar pelas páginas, preencher formulários, clicar em botões e observar os resultados das ações realizadas.

Exemplo prático:

Um profissional de QA solicita:

"Teste o processo de login da aplicação. Acesse a página, informe credenciais válidas, clique em entrar e verifique se o acesso foi realizado corretamente."

O agente poderá:

- Abrir a aplicação no navegador.
- Identificar os campos disponíveis.
- Preencher os dados solicitados.
- Executar as ações necessárias.
- Observar o comportamento da aplicação.
- Registrar os resultados e possíveis problemas encontrados.

Dessa maneira, os agentes de IA podem auxiliar na execução de testes exploratórios e na identificação de problemas que precisam de investigação.

## 1.3 Diferenças entre as duas abordagens

| Critério | IA que escreve testes | Agente de IA |
| --- | --- | --- |
| Principal função | Gerar códigos de testes | Executar tarefas de teste |
| Interação com navegador | Não necessariamente | Pode interagir diretamente |
| Geração de código | Sim | Pode gerar |
| Execução de ações | Depende de ferramentas externas | Pode executar por ferramentas disponíveis |
| Identificação de falhas | Pode analisar códigos e resultados | Pode observar comportamentos e resultados |
| Necessidade de supervisão | Sim | Sim |

Portanto, as duas abordagens são complementares. A IA que escreve testes facilita a criação dos códigos de automação, enquanto os agentes podem auxiliar na execução de tarefas e na avaliação do comportamento da aplicação.

# 2. Pesquisa dos agentes de Inteligência Artificial

## 2.1 Claude Code

Claude Code in Production: 40% Productivity Increase on a Large Project - DEV Community

Claude Code

Desenvolvido pela Anthropic

[Documentação oficial](<https://code.claude.com/docs?utm_source=chatgpt.com>)

O Claude Code é um agente de Inteligência Artificial desenvolvido pela Anthropic, projetado para auxiliar desenvolvedores em diferentes etapas do desenvolvimento de software.

A ferramenta consegue analisar a estrutura de um projeto, compreender arquivos existentes, modificar códigos, executar comandos no terminal e auxiliar na criação e execução de testes automatizados.

Principais funcionalidades:

- Análise da estrutura e dos arquivos do projeto.
- Geração e alteração de códigos de testes.
- Execução de comandos no terminal.
- Identificação e correção de erros.
- Auxílio na criação de testes automatizados.
- Integração com fluxos de trabalho do Git.
- Possibilidade de trabalhar com diferentes ferramentas por meio de integrações.

Aplicação nos testes de software:

No contexto de testes E2E, o Claude Code pode ser utilizado para analisar uma aplicação, identificar funcionalidades importantes e gerar scripts de testes utilizando Selenium.

Também pode executar os testes criados, analisar mensagens de erro e sugerir correções quando algum cenário não apresentar o resultado esperado.

Um exemplo de utilização seria solicitar que o agente analise a estrutura do projeto, identifique a tela de login e desenvolva um teste automatizado utilizando Selenium WebDriver.

Vantagens:

- Facilita a compreensão de projetos existentes.
- Auxilia na geração de códigos de testes.
- Pode executar comandos e analisar os resultados.
- Ajuda a identificar e corrigir falhas.

Limitações:

- Os resultados gerados precisam ser revisados por um profissional.
- Pode produzir códigos incorretos ou testes que não representam adequadamente as regras do sistema.
- A utilização depende de permissões, configurações e disponibilidade dos recursos da ferramenta.

Fonte: documentação oficial do Claude Code.

Claude Help Center

+2

## 2.2 Google Antigravity

Google Antigravity Logo PNG & SVG Vector

Google Antigravity

Desenvolvido pelo Google

[Documentação oficial](<https://antigravity.google/docs/home/?utm_source=chatgpt.com>)

O Google Antigravity é uma plataforma de desenvolvimento baseada em agentes de Inteligência Artificial. Seu objetivo é permitir que agentes realizem tarefas de desenvolvimento de software de maneira mais autônoma, utilizando recursos do editor de código, terminal e navegador.

A plataforma permite que o usuário forneça instruções em linguagem natural e que os agentes planejem, executem e verifiquem tarefas relacionadas ao desenvolvimento de aplicações.

Principais funcionalidades:

- Análise e compreensão de projetos de software.
- Geração e modificação de códigos.
- Execução de comandos no terminal.
- Interação com navegadores por meio de agentes.
- Execução de tarefas relacionadas a testes de aplicações.
- Geração de evidências, como capturas de tela e gravações do navegador.
- Possibilidade de trabalhar com múltiplos agentes em paralelo.

Aplicação nos testes de software:

O Google Antigravity pode ser utilizado para testar aplicações por meio da interação direta com o navegador.

Por exemplo, o usuário pode solicitar que um agente acesse uma aplicação, realize o processo de login, navegue pelas funcionalidades e verifique se os resultados correspondem ao comportamento esperado.

Além disso, o agente pode analisar os resultados, identificar problemas e apresentar evidências das atividades realizadas.

Vantagens:

- Permite interações com a aplicação diretamente pelo navegador.
- Auxilia na execução de tarefas complexas.
- Pode apresentar evidências visuais das atividades.
- Permite delegar tarefas para diferentes agentes.
- Integra recursos de desenvolvimento e automação.

Limitações:

- Depende das permissões concedidas para acessar arquivos, terminal e navegador.
- As ações realizadas pelo agente precisam ser supervisionadas.
- Os resultados podem apresentar erros de interpretação ou execução.
- É necessário revisar as evidências para confirmar se os testes realmente foram realizados corretamente.

Fonte: documentação oficial do Google Antigravity e publicação do Google Developers.

Google Antigravity Docs

+3

## 2.3 Comparação entre Claude Code e Google Antigravity

| Critério | Claude Code | Google Antigravity |
| --- | --- | --- |
| Desenvolvedor | Anthropic | Google |
| Tipo de ferramenta | Agente de programação | Plataforma de desenvolvimento com agentes |
| Análise de projetos | Sim | Sim |
| Geração de código | Sim | Sim |
| Execução de comandos | Sim | Sim |
| Interação com navegador | Disponível em ambientes e configurações compatíveis | Recurso integrado |
| Criação de testes | Sim | Sim |
| Execução de testes | Sim, utilizando ferramentas configuradas | Sim, utilizando recursos disponíveis |
| Evidências visuais | Depende das ferramentas utilizadas | Artefatos e gravações do navegador |
| Trabalho com múltiplos agentes | Suporte a sessões e fluxos paralelos | Suporte a agentes paralelos |

Análise comparativa:

O Claude Code apresenta destaque na análise de código, desenvolvimento de funcionalidades e criação e execução de testes automatizados. Sua integração com o terminal permite trabalhar diretamente sobre a estrutura de um projeto.

Já o Google Antigravity apresenta uma proposta voltada à utilização de agentes capazes de trabalhar em diferentes ambientes, incluindo editor, terminal e navegador. Isso permite realizar atividades de desenvolvimento e também interagir visualmente com aplicações.

As duas ferramentas podem contribuir para a qualidade do software, mas possuem características diferentes. A escolha depende das necessidades do projeto e dos recursos que serão utilizados durante os testes.

Fontes:

Claude Help Center

+2

# 3. Aplicação da IA na execução dos testes E2E

A utilização de agentes de Inteligência Artificial pode complementar os testes automatizados desenvolvidos com Selenium.

Enquanto o Selenium executa scripts previamente programados, um agente de IA pode receber instruções em linguagem natural e utilizar recursos disponíveis para interagir com a aplicação.

Um exemplo de cenário que pode ser utilizado é o processo de autenticação de usuários.

Cenário de teste: realização de login

gherkin

```gherkin
Cenário: Realizar login com credenciais válidas

Dado que o usuário está na página de login
Quando informa um e-mail válido
E informa uma senha válida
E clica no botão de entrar
Então o sistema deve permitir o acesso
E redirecionar o usuário para a página inicial
```

Nesse cenário, o agente de IA pode receber uma instrução para executar o fluxo pelo navegador e verificar se o comportamento observado corresponde ao esperado.

A execução deve ser acompanhada por um profissional, que verificará se todas as etapas foram realizadas corretamente.

# 4. Exemplo de prompt para utilização de um agente de IA

Para realizar a atividade prática, poderá ser utilizado o seguinte prompt no Claude Code ou Google Antigravity:

Escrita

# Prompt — Teste E2E com agente de Inteligência Artificial

Atue como um profissional de QA (Quality Assurance), especializado em testes de software.

Analise a aplicação que está em execução e realize um teste do fluxo de autenticação.

Execute as seguintes etapas:

1. Acesse a página de login da aplicação.
2. Identifique os campos de e-mail e senha.
3. Informe credenciais válidas de teste.
4. Clique no botão de entrar.
5. Verifique se o sistema permite o acesso.
6. Verifique se o usuário foi direcionado para a página inicial.

Ao finalizar, apresente um relatório contendo:

- Descrição do cenário testado.
- Etapas executadas.
- Resultado esperado.
- Resultado obtido.
- Possíveis erros encontrados.
- Capturas de tela como evidências, quando disponíveis.

Não considere o teste aprovado sem verificar o resultado efetivamente apresentado pela aplicação.

Esse prompt deverá ser adaptado à aplicação real do grupo. Também será necessário fornecer ao agente acesso ao ambiente de execução e ao navegador, quando aplicável.

# 5. Considerações finais

A pesquisa demonstrou que a Inteligência Artificial pode contribuir significativamente para a realização de testes de software, tanto na criação de códigos de automação quanto na execução de tarefas por agentes inteligentes.

O uso de ferramentas como Claude Code e Google Antigravity permite explorar novas possibilidades de automação, auxiliando na identificação de falhas e na avaliação do comportamento das aplicações.

Entretanto, a utilização da IA não elimina a necessidade de supervisão humana. É importante analisar os resultados apresentados, verificar as evidências e confirmar se os testes realmente atendem aos requisitos estabelecidos.

Dessa forma, a combinação entre ferramentas tradicionais de automação, como Selenium, e agentes de Inteligência Artificial pode contribuir para tornar o processo de testes mais eficiente e abrangente.

# 6. Referências bibliográficas

1. ANTHROPIC. Claude Code Documentation. Disponível em: [https://code.claude.com/docs](<https://code.claude.com/docs?utm_source=chatgpt.com>). Acesso em: 10 nov. 2026.

2\. ANTHROPIC. Claude Code: Common Developer Use Cases. Disponível em: [https://support.claude.com/en/articles/14553517-claude-code-common-developer-use-cases](<https://support.claude.com/en/articles/14553517-claude-code-common-developer-use-cases?utm_source=chatgpt.com>). Acesso em: 10 nov. 2026.

3\. GOOGLE. Google Antigravity Documentation. Disponível em: [https://antigravity.google/docs/home/](<https://antigravity.google/docs/home/?utm_source=chatgpt.com>). Acesso em: 10 nov. 2026.

4\. GOOGLE DEVELOPERS. Build with Google Antigravity, our new agentic development platform. Disponível em: [https://developers.googleblog.com/en/build-with-google-antigravity-our-new-agentic-development-platform/](<https://developers.googleblog.com/en/build-with-google-antigravity-our-new-agentic-development-platform/?utm_source=chatgpt.com>). Acesso em: 10 nov. 2026.

5\. SELENIUM. Using AI Coding Agents with Selenium. Disponível em: [https://www.selenium.dev/documentation/ai\_agents/](<https://www.selenium.dev/documentation/ai_agents/?utm_source=chatgpt.com>). Acesso em: 10 nov. 2026.


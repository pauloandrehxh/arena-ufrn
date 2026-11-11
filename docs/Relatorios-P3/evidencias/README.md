# Evidências de Correções — Arena UFRN

## Objetivo das evidências
Documentar, de forma rastreável, as correções aplicadas nos problemas de acessibilidade e responsividade do frontend do **Arena UFRN**, registrando o estado **antes** e **depois** para uso em apresentação acadêmica e Pull Request (PR).

## Descrição dos dois problemas

### Problema 01 — Idioma e título da página incorretos
- **Arquivo:** `arena-ufrn/frontend/index.html`
- **Situação antes:** documento configurado com `lang="en"` e título genérico `frontend`, incompatíveis com o conteúdo em português.
- **Correção aplicada:** idioma alterado para `lang="pt-BR"` e título atualizado para `Arena UFRN — Reserva de Quadras`.

### Problema 02 — Navegação principal indisponível em dispositivos móveis
- **Arquivo:** `arena-ufrn/frontend/src/components/Navbar.jsx`
- **Situação antes:** navegação principal com `hidden md:flex`, ocultando links em telas menores sem botão/menu alternativo.
- **Correção aplicada:** implementação de menu responsivo móvel com botão hambúrguer, controle de estado (`useState`), atributos ARIA (`aria-label`, `aria-expanded`, `aria-controls`), links `Início`, `Quadras` e `Como Funciona`, fechamento automático ao selecionar link, preservação do botão `Entrar` e manutenção da navegação horizontal em desktop.

## Arquivos modificados
- `arena-ufrn/frontend/index.html`
- `arena-ufrn/frontend/src/components/Navbar.jsx`

## Relação das evidências geradas

| Problema | Estado | Arquivo gerado | Tipo | O que comprova |
|---|---|---|---|---|
| 01 — Idioma e título | Antes | `problema-01-idioma/antes/index.html.head.txt` | Código-fonte (estado no `HEAD` do repositório) | Presença de `<html lang="en">` e `<title>frontend</title>` antes da correção. |
| 01 — Idioma e título | Depois | `problema-01-idioma/depois/index.html` | Código-fonte (arquivo atual) | Presença de `<html lang="pt-BR">` e `<title>Arena UFRN — Reserva de Quadras</title>` após a correção. |
| 02 — Navegação mobile | Antes | `problema-02-navegacao-mobile/antes/Navbar.jsx.head.txt` | Código-fonte (estado no `HEAD` do repositório) | Navegação original com `<nav className="hidden md:flex" ...>` sem botão de menu móvel nem controle de estado/ARIA para menu. |
| 02 — Navegação mobile | Depois | `problema-02-navegacao-mobile/depois/Navbar.jsx` | Código-fonte (arquivo atual) | Implementação do botão de menu móvel (`md:hidden`), `aria-label`, `aria-expanded`, `aria-controls`, menu com `id="menu-navegacao-mobile"`, links móveis com fechamento ao clique, e navegação desktop preservada. |

## Descrição do que cada evidência comprova
- **`problema-01-idioma/antes/index.html.head.txt`**: comprova o idioma e título incorretos no estado anterior (commit `HEAD`: `7b688da` no momento da coleta).
- **`problema-01-idioma/depois/index.html`**: comprova a correção do idioma principal e do título descritivo no documento atual.
- **`problema-02-navegacao-mobile/antes/Navbar.jsx.head.txt`**: comprova que, antes, os links de navegação eram ocultos em telas menores sem alternativa acessível.
- **`problema-02-navegacao-mobile/depois/Navbar.jsx`**: comprova a inclusão de controle de menu móvel, atributos ARIA exigidos, comportamento de abrir/fechar e fechamento ao selecionar link, mantendo navegação desktop e botão `Entrar`.

## Resoluções previstas para validação visual
- **Mobile:** 375px de largura (viewport alvo para evidenciar menu hambúrguer, menu aberto, links e fechamento após seleção).
- **Desktop:** 1366px de largura (viewport alvo para evidenciar navegação horizontal preservada).

> As capturas visuais em navegador nas resoluções acima não puderam ser geradas automaticamente neste ambiente (ver limitações).

## Navegador utilizado
- **Navegador para capturas visuais:** não executado neste ambiente.
- **Validação de build realizada:** `vite v8.3.7` (compilação de produção do frontend concluída com sucesso).

## Data e horário da execução
- **Coleta/geração das evidências:** 2026-11-10 20:29:31 -03:00

## Limitações encontradas durante a validação
- **Capturas reais de navegador (UI) não geradas:** o ambiente de execução não disponibilizou ferramenta de automação/screenshot de navegador para abrir o frontend e registrar imagens em 375px/1366px (ex.: menu aberto/fechado, navegação desktop, título na aba). Para cumprir a diretriz de não inventar ou simular evidências, nenhuma imagem ilustrativa foi criada.
- **Teste visual de "antes" no navegador indisponível:** o estado visual anterior não pôde ser reproduzido em runtime após as alterações; o "antes" foi evidenciado por código-fonte extraído do `HEAD` do repositório Git.
- **Execução interativa não registrada:** não foi possível validar em runtime, neste ambiente, navegação por teclado, indicadores de foco, fechamento automático do menu no navegador e ausência de erros no console; essas verificações devem ser complementadas localmente com capturas de tela reais.
- **Lint global com falha pré-existente:** `npm.cmd run lint` falhou por erros não relacionados em `frontend/e2e/home.e2e.test.js` (`'process' is not defined`), sem relação com os arquivos modificados nesta correção.

## Recomendações para complementar as evidências (capturas pendentes)
Salvar como imagens (PNG) nas pastas correspondentes, com nomes descritivos, por exemplo:
- `problema-01-idioma/antes/antes-codigo-lang-title.png`
- `problema-01-idioma/depois/depois-codigo-lang-title.png`
- `problema-01-idioma/depois/depois-navegador-titulo-aba.png` (aba do navegador exibindo o título atualizado)
- `problema-02-navegacao-mobile/antes/antes-mobile-375-sem-menu.png` (estado anterior, se reproduzido a partir do commit anterior)
- `problema-02-navegacao-mobile/antes/antes-codigo-hidden-md-flex.png`
- `problema-02-navegacao-mobile/depois/depois-mobile-375-botao-hamburguer.png`
- `problema-02-navegacao-mobile/depois/depois-mobile-375-menu-aberto.png`
- `problema-02-navegacao-mobile/depois/depois-mobile-375-menu-fechado-apos-clique.png`
- `problema-02-navegacao-mobile/depois/depois-desktop-1366-nav-horizontal.png`
- `problema-02-navegacao-mobile/depois/depois-codigo-aria-expanded-controls.png`
- Incluir nas capturas/legendas: navegador, resolução, data/hora e passos executados.

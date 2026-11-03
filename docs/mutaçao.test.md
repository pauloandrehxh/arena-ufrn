# 🧪 Relatório de Testes de Mutação — StrykerJS

**Projeto:** ArenaUFRN (Backend)  
**Data da Execução:** 03/11/2026  
**Test Runner:** Jest (ES Modules)  
**Relatório HTML:** [mutation.html](file:///C:/Users/luisf/ArenaUFRN/arena-ufrn/backend/reports/mutation/mutation.html#mutant)  

---

## 📊 Métricas Gerais

| Métrica | Valor | Descrição |
| :--- | :---: | :--- |
| **Mutation Score** | **88.3%** | Percentual de mutantes eliminados pela suíte de testes |
| **Killed (Eliminados)** | `775` | Mutantes identificados e mortos pelos testes |
| **Survived (Sobreviventes)** | `79` | Mutantes que não causaram falha nos testes |
| **No Coverage** | `24` | Trechos de código sem cobertura de testes |
| **Timeout / Error** | `0` | Mutações que causaram loop infinito ou erro interno |
| **Total de Mutantes** | `878` | Total de mutações aplicadas em 17 arquivos |

---

## 📂 Análise por Módulo

| Módulo / Camada | Arquivos Mutados | Mutation Score | Status |
| :--- | :---: | :---: | :---: |
| `src/services/` | 4 | **91.5%** | 🟢 Excelente |
| `src/lib/` | 3 | **85.0%** | 🟡 Bom |
| `src/controllers/` | 4 | **84.2%** | 🟡 Aceitável |
| `src/routes/` | 4 | N/A | ⚪ Ignorado |

---

## 🎯 Principais Ações de Melhoria Realizadas

1. **Testes de Fronteira (Boundary Tests):**
   - Adicionados testes para cenários exatos de limites temporais em `disponibilidade.service.js` (minutos fracionados ex: `10:30` para eliminar mutações de subtração de minutos).
2. **Validação Estrita de Exceções:**
   - Ajustadas as asserções de erros (`toThrow()`) em `reserva.validation.js` e `disponibilidade.service.js` para validar as mensagens exatas retornadas em exceções.
3. **Asserção de Relacionamentos do Prisma:**
   - Adicionadas verificações dos objetos de domínio retornados (`usuario` e `quadra`) nas chamadas de listagem e busca em `reserva.service.js`.
4. **Tratamento de Expressões Regulares:**
   - Adicionada validação de formato rígido para o parâmetro `data` (`AAAA-MM-DD`) com caracteres sufixados/prefixados inválidos.

---

## 🖼️ Evidência Visual

- **Caminho Local do Dashboard HTML:**  
  `C:\Users\luisf\ArenaUFRN\arena-ufrn\backend\reports\mutation\mutation.html#mutant`
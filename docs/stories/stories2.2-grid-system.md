# Story 2.2 — Sistema de Grid e Limites do Mundo

## Objetivo

Implementar o sistema de grid lógico do BlockForge, garantindo alinhamento perfeito dos blocos e definindo os limites da área de construção (world bounds).

Essa etapa estabelece as regras fundamentais do espaço 3D, controlando onde blocos podem ou não ser posicionados.

---

## Contexto

Até este ponto, o grid existente é apenas visual. Agora, o sistema precisa evoluir para um grid funcional, que controle o posicionamento real dos blocos.

Além disso, o projeto adotará um modelo de mundo limitado (uma “caixa” de construção), permitindo maior controle, melhor performance e base para futuras estratégias de monetização.

Essa etapa é crítica, pois todas as interações futuras dependerão dessas regras.

---

## Escopo

Esta etapa inclui:

- Implementação de lógica de grid (snap de posição)
- Definição de tamanho do mundo (limites)
- Validação de posicionamento dentro da área permitida
- Criação de utilitários matemáticos para o sistema

Não faz parte desta etapa:

- Interação com o usuário (cliques)
- Adição ou remoção de blocos
- Interface visual

---

## Tasks

- [ ] Criar pasta `utils/math/` caso ainda não exista

- [ ] Criar função `snapToGrid(position)`:
  - Ajustar qualquer posição para valores inteiros
  - Garantir alinhamento com o grid

- [ ] Criar pasta `utils/constants/`

- [ ] Criar arquivo `world.js`:
  - Definir tamanho do mundo (exemplo inicial):
    - width
    - height
    - depth

- [ ] Criar função `isInsideWorld(position)`:
  - Validar se a posição está dentro dos limites definidos
  - Considerar todos os eixos (x, y, z)

- [ ] Garantir que o sistema seja flexível:
  - Permitir alteração futura do tamanho do mundo sem quebrar o código

- [ ] Documentar (em comentários simples) como o sistema funciona

---

## Critério de Conclusão

Deve existir um sistema funcional capaz de:

- Ajustar posições automaticamente para o grid
- Validar se uma posição está dentro dos limites definidos

Essas funções devem estar isoladas e reutilizáveis.

Não deve haver lógica duplicada em diferentes partes do projeto.

---

## Regras

Todas as posições do sistema devem passar pelo `snapToGrid`.

Nenhum bloco pode existir fora dos limites definidos.

Não utilizar valores hardcoded espalhados pelo código.

O tamanho do mundo deve ser controlado por uma única fonte de verdade.

Manter as funções puras (sem efeitos colaterais).

---

## Estrutura Esperada

O projeto deve conter:

- utils/math/snapToGrid.js
- utils/math/isInsideWorld.js
- utils/constants/world.js

Esses arquivos devem ser reutilizáveis e independentes da UI.

---

## Resultado Esperado

Ao final desta etapa, o projeto terá um sistema de grid lógico completamente funcional, capaz de garantir alinhamento perfeito dos blocos e controle total sobre a área de construção.

Esse sistema servirá como base para todas as interações futuras, incluindo adição, remoção e manipulação de blocos.

Além disso, o projeto estará preparado para suportar diferentes tamanhos de mundo no futuro, abrindo caminho para funcionalidades avançadas como planos gratuitos e premium.

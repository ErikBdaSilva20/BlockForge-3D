# Story 3.4 — Construção Contínua (Hold + Paint Blocks)

## Objetivo

Permitir que o usuário construa múltiplos blocos continuamente ao segurar o botão do mouse e mover o cursor sobre o grid, criando uma experiência fluida e rápida de construção.

---

## Contexto

Atualmente, o sistema já permite:

- Adicionar blocos por clique
- Adicionar via drag & drop
- Remover blocos
- Trabalhar com grid e limites

Agora, será implementada uma mecânica de produtividade:

- Construção contínua ao segurar o clique
- Posicionamento automático baseado no movimento do mouse

Essa funcionalidade melhora drasticamente a velocidade de criação.

---

## Escopo

Esta etapa inclui:

- Detecção de clique contínuo (mouse hold)
- Rastreamento de movimento do mouse no mundo 3D
- Adição automática de blocos ao longo do movimento
- Prevenção de duplicação

Não faz parte desta etapa:

- Ferramentas avançadas (linha, área, preenchimento inteligente)
- Undo/redo
- Sistemas de brush complexos

---

## Tasks

- [ ] Detectar início do clique:
  - `onPointerDown`

- [ ] Detectar fim do clique:
  - `onPointerUp`

- [ ] Criar estado:
  - `isBuilding` (boolean)

- [ ] Durante `isBuilding = true`:
  - Monitorar movimento do mouse (`onPointerMove`)

- [ ] Utilizar raycasting contínuo:
  - Identificar posição atual no mundo

- [ ] Aplicar `snapToGrid` na posição

- [ ] Validar com `isInsideWorld`

- [ ] Criar sistema de cache:
  - Armazenar última posição adicionada
  - Evitar múltiplos blocos na mesma posição

- [ ] Adicionar bloco automaticamente ao mover:
  - Apenas se a posição for nova

- [ ] Garantir que não haja sobreposição

- [ ] Integrar com sistema existente de blocos

---

## Critério de Conclusão

O usuário deve conseguir:

- Segurar o clique
- Mover o mouse sobre o grid
- Ver blocos sendo adicionados continuamente

A construção deve ser fluida e sem travamentos.

Não deve haver duplicação de blocos na mesma posição.

---

## Regras

Toda posição deve passar por `snapToGrid`.

Toda posição deve ser validada com `isInsideWorld`.

Nunca adicionar blocos duplicados.

A lógica deve evitar chamadas excessivas (performance).

Separar claramente lógica de input e lógica de blocos.

---

## Estrutura Esperada

Sugestão:

- hooks/useContinuousBuild.js
- utils/math/isSamePosition.js

A lógica deve ser independente da UI.

---

## Resultado Esperado

Ao final desta etapa, o usuário poderá construir estruturas rapidamente apenas movendo o mouse enquanto segura o clique.

O editor se torna muito mais eficiente e agradável de usar, aproximando-se de ferramentas profissionais de criação.

Essa funcionalidade será uma das principais responsáveis pela sensação de fluidez e controle do sistema.

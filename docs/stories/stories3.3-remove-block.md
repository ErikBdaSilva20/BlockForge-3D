# Story 3.3 — Remover Blocos (Interação no Mundo 3D)

## Objetivo

Permitir que o usuário remova blocos existentes diretamente do ambiente 3D através de interação com o mouse.

Essa funcionalidade é essencial para controle e correção de construções.

---

## Contexto

Até o momento, o sistema permite:

- Adicionar blocos via clique
- Adicionar blocos via drag & drop
- Trabalhar com grid e limites

Agora, é necessário permitir que o usuário remova blocos de forma simples, rápida e intuitiva.

---

## Escopo

Esta etapa inclui:

- Identificação de blocos clicados
- Remoção de blocos do estado
- Feedback visual ao interagir com blocos

Não faz parte desta etapa:

- Undo/redo
- Remoção em massa
- Ferramentas avançadas (ex: seleção múltipla)
- Atalhos de teclado complexos

---

## Tasks

- [ ] Implementar raycasting para detectar blocos:
  - Detectar interseção do mouse com objetos `<Block />`

- [ ] Definir ação de remoção:
  - Clique direito do mouse (recomendado)
  - Ou tecla modificadora (ex: Shift + clique)

- [ ] Criar função `removeBlock(position)`:
  - Remover bloco do array de estado

- [ ] Garantir remoção correta:
  - Identificar bloco pela posição (x, y, z)

- [ ] Atualizar renderização automaticamente após remoção

- [ ] Implementar feedback visual ao passar o mouse:
  - Highlight no bloco (ex: borda ou mudança de cor)

- [ ] Prevenir conflitos com adição:
  - Não permitir adicionar e remover ao mesmo tempo

- [ ] Bloquear remoção fora da área de construção

---

## Critério de Conclusão

O usuário deve conseguir:

- Passar o mouse sobre um bloco e vê-lo destacado
- Clicar (ou usar comando definido) e remover o bloco
- Ver o bloco desaparecer instantaneamente

A remoção deve ser precisa e sem erros.

---

## Regras

A identificação do bloco deve ser feita via raycasting.

A remoção deve afetar apenas o bloco selecionado.

O estado de blocos continua sendo a única fonte de verdade.

Não remover blocos inexistentes.

Separar lógica de interação da renderização.

---

## Estrutura Esperada

Sugestão:

- hooks/useRemoveBlock.js
- utils/math/findBlockByPosition.js

A lógica deve ser reutilizável e desacoplada.

---

## Resultado Esperado

Ao final desta etapa, o usuário terá controle total sobre o ambiente, podendo adicionar e remover blocos livremente.

O editor se torna funcional e utilizável na prática, permitindo construção e correção de estruturas.

Essa funcionalidade prepara o sistema para ferramentas mais avançadas no futuro.

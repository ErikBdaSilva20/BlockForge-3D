# Story 4.1 — Controles da Cena (Rotação, Zoom e Pan do Mundo)

## Objetivo

Permitir que o usuário visualize a construção manipulando a cena (mundo) ao invés da câmera, criando uma experiência de editor com câmera fixa e controle total sobre o objeto.

---

## Contexto

O projeto não se comporta como um jogo.

A câmera não representa um personagem ou ponto de vista físico.

Em vez disso, o sistema utiliza uma abordagem de editor 3D:

- A câmera permanece fixa (ou semi-fixa)
- A cena (ou grupo principal) é manipulada

---

## Escopo

Esta etapa inclui:

- Rotação da cena (orbitar fake)
- Zoom (aproximar/afastar da cena)
- Pan (movimentação da cena no eixo X/Y)

Não faz parte desta etapa:

- Movimentação livre da câmera
- Física ou colisão
- Modo primeira pessoa

---

## Tasks

- [ ] Criar um grupo principal da cena:
  - Ex: `<World />` ou `<SceneGroup />`
  - Todos os blocos devem estar dentro dele

- [ ] Implementar rotação da cena:
  - Clique + arrastar (botão esquerdo ou direito)
  - Alterar rotação do grupo (eixo Y e X)

- [ ] Implementar zoom:
  - Scroll do mouse
  - Ajustar distância da câmera em relação ao grupo

- [ ] Implementar pan:
  - Movimentar o grupo lateralmente (X/Z)

- [ ] Definir ponto central:
  - Centro da área de construção

- [ ] Garantir suavidade:
  - Aplicar interpolação leve (opcional)

- [ ] Garantir que todos os elementos (blocos, grid, preview) sigam o grupo

---

## Critério de Conclusão

O usuário deve conseguir:

- Girar a cena livremente
- Aproximar e afastar a visualização
- Mover a cena lateralmente

A câmera deve permanecer estável, enquanto o mundo responde às interações.

---

## Regras

A câmera não deve se mover livremente como em jogos.

Toda manipulação deve acontecer no grupo da cena.

Não aplicar colisões ou limites físicos.

Manter comportamento previsível e suave.

---

## Estrutura Esperada

Sugestão:

- components/scene/World.jsx
- hooks/useSceneControls.js

O controle da cena deve ser centralizado e reutilizável.

---

## Resultado Esperado

Ao final desta etapa, o usuário poderá manipular a visualização do projeto de forma fluida e intuitiva, girando e movendo a construção como um objeto em um editor 3D.

Essa abordagem reforça a identidade do projeto como ferramenta, e não como jogo.

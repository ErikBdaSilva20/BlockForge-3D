# Story 3.2 — Drag & Drop de Blocos (Sidebar → Mundo 3D)

## Objetivo

Permitir que o usuário selecione um tipo de bloco na sidebar e arraste esse bloco para dentro da área de construção (world), posicionando-o diretamente no ambiente 3D.

Essa funcionalidade melhora significativamente a experiência de uso, tornando o editor mais intuitivo e visual.

---

## Contexto

Atualmente, o sistema já permite:

- Adicionar blocos via clique direto na cena
- Trabalhar com grid e limites definidos

Agora, será introduzida uma nova forma de interação:

- Seleção de blocos via interface (sidebar)
- Posicionamento por drag & drop

---

## Escopo

Esta etapa inclui:

- Criação da sidebar de seleção de blocos
- Sistema de drag & drop
- Preview visual do bloco durante o arraste
- Posicionamento do bloco ao soltar no mundo

Não faz parte desta etapa:

- Preenchimento contínuo (segurar clique)
- Remoção de blocos
- Sistema avançado de tipos de blocos
- Texturas complexas

---

## Tasks

- [ ] Criar pasta `components/ui/Sidebar/`

- [ ] Criar componente `<Sidebar />`:
  - Lista de blocos disponíveis
  - Cada item representando um tipo de bloco

- [ ] Criar estado de bloco selecionado:
  - Ex: `selectedBlockType`

- [ ] Implementar início do drag:
  - Ao clicar e segurar em um item da sidebar

- [ ] Criar "ghost preview" do bloco:
  - Bloco semi-transparente seguindo o mouse
  - Atualizar posição com base no raycasting

- [ ] Utilizar raycasting para posicionamento:
  - Detectar onde o bloco seria colocado no mundo

- [ ] Aplicar `snapToGrid` no preview

- [ ] Validar posição com `isInsideWorld`

- [ ] Destacar visualmente se a posição é válida ou inválida:
  - Verde = válido
  - Vermelho = inválido

- [ ] Finalizar drop:
  - Ao soltar o mouse dentro da área válida
  - Adicionar bloco ao estado

- [ ] Cancelar drop:
  - Se soltar fora da área ou posição inválida

---

## Critério de Conclusão

O usuário deve conseguir:

- Selecionar um bloco na sidebar
- Arrastar para dentro da cena
- Visualizar preview em tempo real
- Soltar e criar o bloco na posição correta

O sistema deve impedir posicionamentos inválidos.

---

## Regras

Toda posição deve passar por `snapToGrid`.

Toda posição deve ser validada com `isInsideWorld`.

Não permitir drop fora da área de construção.

Não permitir sobreposição de blocos.

Separar claramente lógica de UI e lógica 3D.

---

## Estrutura Esperada

Sugestão:

- components/ui/Sidebar/Sidebar.jsx
- hooks/useDragBlock.js
- components/scene/BlockPreview.jsx

O preview deve ser desacoplado do bloco real.

---

## Resultado Esperado

Ao final desta etapa, o editor terá um fluxo moderno de criação de blocos baseado em drag & drop.

O usuário terá mais controle visual e precisão ao posicionar elementos, aproximando o projeto de ferramentas profissionais de construção 3D.

Essa funcionalidade será essencial para futuras melhorias de usabilidade e expansão do sistema.

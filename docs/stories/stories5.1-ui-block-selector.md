# Story 5.1 — UI de Seleção de Blocos (Sidebar Profissional)

## Objetivo

Criar uma interface visual organizada e intuitiva para seleção de blocos, permitindo que o usuário escolha facilmente o tipo de bloco antes de utilizá-lo no ambiente 3D.

---

## Contexto

Atualmente, o sistema já possui:

- Funcionalidade de adicionar blocos
- Sistema de drag & drop
- Estrutura básica de seleção

Porém, a experiência ainda é técnica e pouco amigável.

Essa etapa transforma a seleção de blocos em uma interface clara, visual e agradável.

---

## Escopo

Esta etapa inclui:

- Interface visual da sidebar
- Organização dos blocos em lista ou grid
- Seleção visual de bloco ativo
- Feedback de interação

Não faz parte desta etapa:

- Sistema avançado de categorias
- Busca ou filtros
- Upload de blocos personalizados

---

## Tasks

- [ ] Criar layout da sidebar:
  - Posicionada lateralmente (esquerda ou direita)
  - Altura total da tela

- [ ] Utilizar styled-components
  - Fundo escuro ou neutro
  - Boa separação visual

- [ ] Criar lista/grid de blocos:
  - Cada bloco representado por um item clicável
  - Pode usar cor ou mini preview simples

- [ ] Criar estado de seleção:
  - `selectedBlockType`

- [ ] Destacar bloco selecionado:
  - Borda, sombra ou mudança de cor

- [ ] Adicionar hover effect:
  - Feedback visual ao passar o mouse

- [ ] Integrar com sistema de drag & drop:
  - Ao clicar/segurar, iniciar drag

- [ ] Garantir responsividade básica:
  - Sidebar não deve quebrar layout

- [ ] Separar componente de item:
  - `<BlockItem />`

---

## Critério de Conclusão

O usuário deve conseguir:

- Visualizar os blocos disponíveis
- Selecionar um bloco claramente
- Entender qual bloco está ativo
- Iniciar interação (drag) diretamente pela UI

A interface deve ser limpa e intuitiva.

---

## Regras

A UI deve ser simples e clara.

Evitar excesso de informação visual.

Manter consistência de cores e espaçamento.

Separar lógica de estado da apresentação.

---

## Estrutura Esperada

Sugestão:

- components/ui/Sidebar/Sidebar.jsx
- components/ui/Sidebar/BlockItem.jsx

A sidebar deve ser modular e reutilizável.

---

## Resultado Esperado

Ao final desta etapa, o editor terá uma interface visual sólida para seleção de blocos, tornando o uso mais intuitivo e agradável.

Essa melhoria eleva significativamente a percepção de qualidade do projeto e prepara o sistema para futuras expansões (categorias, texturas, etc).

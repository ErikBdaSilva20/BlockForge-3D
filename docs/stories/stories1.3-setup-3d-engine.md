# Story 1.3: Setup 3D Engine

# Story 1.3 — Configuração do Ambiente 3D

## Objetivo

Configurar o ambiente 3D inicial da aplicação utilizando React Three Fiber, criando a base da cena que será utilizada em todo o sistema.

O objetivo é estabelecer o “mundo 3D” onde os blocos serão renderizados futuramente, garantindo que câmera, iluminação e estrutura básica estejam funcionando corretamente.

---

## Contexto

Após a organização do projeto React, é necessário integrar o sistema de renderização 3D.

O ambiente 3D será o núcleo visual do BlockForge, e tudo que for construído posteriormente (blocos, interação, grid) dependerá dessa base.

Essa etapa não deve implementar nenhuma lógica de blocos ainda. O foco é apenas estruturar o ambiente 3D.

---

## Escopo

Esta etapa inclui:

- Criação da cena 3D
- Configuração do Canvas
- Configuração de câmera
- Configuração de iluminação básica
- Separação dos componentes do ambiente 3D

Não faz parte desta etapa:

- Renderização de blocos
- Sistema de grid
- Interações com o usuário
- Lógica de estado

---

## Tasks

- [ ] Criar pasta `components/scene/`

- [ ] Criar componente principal `<Scene />`, responsável por centralizar toda a renderização 3D

- [ ] Adicionar o `<Canvas />` dentro do `<Scene />`

- [ ] Criar componente `<Camera />`:
  - Definir posição inicial da câmera
  - Garantir que a câmera visualize o centro da cena

- [ ] Criar componente `<Lights />`:
  - Adicionar luz ambiente
  - Adicionar luz direcional
  - Garantir visibilidade adequada da cena

- [ ] Criar componente `<Controls />`:
  - Adicionar controles de câmera (rotação e zoom)
  - Garantir navegação básica no espaço 3D

- [ ] Integrar todos os componentes dentro do `<Scene />`

- [ ] Importar e renderizar `<Scene />` dentro da página `Editor.jsx`

- [ ] Garantir que o projeto roda sem erros após integração

---

## Critério de Conclusão

A aplicação deve exibir um ambiente 3D funcional.

O usuário deve conseguir visualizar a cena, com iluminação adequada.

A câmera deve estar posicionada corretamente e permitir movimentação (rotação e zoom).

Não deve haver erros no console.

---

## Regras

Não implementar qualquer lógica de blocos nesta etapa.

Não adicionar elementos complexos na cena.

Manter separação clara entre:

- câmera
- luz
- controles
- cena

Evitar colocar tudo em um único componente.

Cada parte do ambiente 3D deve ser modular.

---

## Estrutura Esperada

Após essa etapa, a estrutura deve conter:

- Scene.jsx (orquestrador da cena)
- Camera.jsx (configuração da câmera)
- Lights.jsx (iluminação)
- Controls.jsx (controle do usuário)

Todos organizados dentro de `components/scene/`.

---

## Resultado Esperado

Ao final desta etapa, o projeto deve possuir um ambiente 3D totalmente funcional, servindo como base sólida para a construção do sistema de blocos nas próximas etapas.

O usuário deve conseguir navegar visualmente pelo espaço, mesmo que ainda não existam objetos na cena.

Esse ambiente será a fundação de todo o restante do sistema.

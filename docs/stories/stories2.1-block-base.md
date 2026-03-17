# Story 2.1 — Bloco Base (Primeiro Objeto 3D)

## Objetivo

Criar o primeiro bloco do sistema, representado por um cubo no ambiente 3D, estabelecendo a base para todas as futuras interações e construções dentro do BlockForge.

---

## Contexto

Após a construção do ambiente 3D (câmera, luz, grid e chão), o próximo passo é introduzir o primeiro elemento interativo do sistema: o bloco.

Esse bloco será a unidade fundamental de construção do projeto. Todas as estruturas futuras serão compostas por múltiplos blocos.

Nesta etapa, o foco é apenas renderizar um bloco simples, sem qualquer tipo de interação ou lógica complexa.

---

## Escopo

Esta etapa inclui:

- Criação do componente de bloco
- Renderização de um cubo no ambiente 3D
- Definição de tamanho padrão do bloco
- Estrutura inicial preparada para múltiplos blocos

Não faz parte desta etapa:

- Sistema de grid lógico
- Adição ou remoção de blocos
- Interações com o usuário
- Tipos diferentes de blocos

---

## Tasks

- [ ] Criar pasta `components/scene/Block/`

- [ ] Criar componente `<Block />`:
  - Responsável por renderizar um cubo (box geometry)
  - Receber posição como propriedade (props)
  - Receber tipo (mesmo que ainda não utilizado)

- [ ] Definir tamanho padrão do bloco (ex: 1x1x1)

- [ ] Aplicar material básico ao bloco:
  - Cor simples (ex: branco ou cinza)
  - Sem texturas complexas

- [ ] Renderizar um bloco fixo na cena:
  - Posição inicial: (0, 0, 0)

- [ ] Garantir que o bloco esteja corretamente alinhado com o plano e o grid visual

- [ ] Preparar estrutura para múltiplos blocos:
  - Utilizar um array simples (mesmo com apenas 1 bloco)
  - Renderizar utilizando `.map()`

---

## Critério de Conclusão

Um cubo deve estar visível na cena 3D.

O bloco deve estar corretamente posicionado e alinhado com o grid visual.

A estrutura deve permitir facilmente a renderização de múltiplos blocos, mesmo que ainda exista apenas um.

Não deve haver erros no console.

---

## Regras

O bloco deve ser tratado como componente independente.

Não adicionar lógica de interação nesta etapa.

Não implementar variações de blocos.

Manter o código simples e previsível.

Preparar o sistema pensando em expansão futura, mas sem antecipar complexidade.

---

## Estrutura Esperada

A pasta `components/scene/Block/` deve conter:

- Block.jsx
- (opcional) Block.types.js

O componente `<Block />` deve ser reutilizável e desacoplado da lógica da aplicação.

---

## Resultado Esperado

Ao final desta etapa, o ambiente 3D deve conter um bloco visível, servindo como a primeira representação concreta do sistema de construção.

Esse bloco será a base para todas as próximas funcionalidades, como adição, remoção e manipulação no espaço 3D.

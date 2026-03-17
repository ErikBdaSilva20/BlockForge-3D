# Story 7.3 — Sistema de Seleção Inteligente de Blocos

## Objetivo

Permitir que o usuário selecione um ou múltiplos blocos dentro do editor, possibilitando interações mais avançadas e preparando a base para futuras manipulações em grupo.

---

## Contexto

Atualmente, o usuário interage com blocos de forma isolada (adicionar, remover, arrastar).

Não existe um conceito de “seleção ativa”, o que limita operações mais complexas e reduz a eficiência da edição.

Essa funcionalidade é essencial em qualquer editor moderno.

---

## Proposta

Implementar um sistema de seleção que permita:

- Selecionar um bloco individual
- Selecionar múltiplos blocos
- Visualizar claramente quais blocos estão selecionados

---

## Escopo

Inclui:

- Seleção de bloco único
- Multi-seleção (Shift + clique)
- Destaque visual dos blocos selecionados
- Estado global de seleção

Não inclui:

- Movimentação em grupo (futuro)
- Copiar/colar (futuro)
- Transformações avançadas

---

## Estrutura Técnica

Criar um estado global:

```js id="j8b5t0"
selectedBlocks: string[] // lista de IDs
```

---

## Comportamentos

### Seleção simples

- Clique em um bloco:
  - Limpa seleção anterior
  - Seleciona apenas o bloco clicado

---

### Multi-seleção

- Shift + clique:
  - Adiciona ou remove bloco da seleção atual

---

### Limpar seleção

- Clique fora dos blocos:
  - Limpa toda seleção

---

## Feedback Visual

Blocos selecionados devem ter destaque visual claro:

- Mudança de cor (ex: levemente mais claro)
- Outline / borda
- Ou leve emissive no material

---

## Tasks

- [ ] Criar estado `selectedBlocks`

- [ ] Implementar lógica de seleção no clique

- [ ] Detectar tecla Shift pressionada

- [ ] Implementar multi-seleção:
  - Adicionar/remover da lista

- [ ] Implementar limpeza de seleção:
  - Clique no vazio

- [ ] Atualizar `<Block />`:
  - Receber prop `isSelected`
  - Aplicar destaque visual

- [ ] Garantir compatibilidade com:
  - Drag & drop
  - Remoção de blocos

---

## Regras de Comportamento

- Um bloco não pode aparecer duplicado na seleção
- Seleção deve ser consistente após ações
- Remover bloco selecionado deve atualizar estado corretamente

---

## Considerações Técnicas

- Evitar re-render excessivo ao atualizar seleção
- Utilizar estruturas eficientes (Set pode ser considerado)
- Separar lógica de seleção do sistema de blocos

---

## Critério de Conclusão

O usuário deve conseguir:

- Selecionar blocos individualmente
- Selecionar múltiplos blocos com Shift
- Visualizar claramente a seleção
- Limpar seleção facilmente

---

## Resultado Esperado

O editor ganha uma camada essencial de controle, permitindo interações mais avançadas e preparando o terreno para funcionalidades futuras como:

- Movimentação em grupo
- Duplicação
- Edição em lote

Isso aproxima ainda mais o projeto de ferramentas profissionais de edição.

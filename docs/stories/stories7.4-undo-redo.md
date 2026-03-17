# Story 7.4 — Sistema de Undo / Redo

## Objetivo

Implementar um sistema de histórico de ações que permita ao usuário desfazer e refazer modificações no editor, garantindo maior controle, segurança e experiência de uso.

---

## Contexto

Atualmente, qualquer ação realizada no editor é definitiva.

Isso gera frustração em caso de erro e limita a usabilidade do sistema.

Ferramentas modernas de edição sempre possuem controle de histórico.

---

## Proposta

Criar um sistema de gerenciamento de estado com histórico baseado em três camadas:

- `past` (passado)
- `present` (estado atual)
- `future` (redo)

---

## Estrutura Técnica

```js
{
  past: [],
  present: [],
  future: []
}
```

---

## Funcionamento

### Nova ação

- Estado atual vai para `past`
- Novo estado vira `present`
- `future` é limpo

---

### Undo

- Move `present` para `future`
- Recupera último estado de `past`

---

### Redo

- Move `present` para `past`
- Recupera primeiro estado de `future`

---

## Escopo

Inclui:

- Undo
- Redo
- Histórico de ações
- Integração com sistema de blocos

Não inclui:

- Histórico persistente (salvo em banco)
- Timeline visual

---

## Tasks

- [ ] Criar estrutura de histórico
  - `past`, `present`, `future`

- [ ] Integrar com `useBlocks` (ou store global)

- [ ] Criar função `setStateWithHistory`:
  - Atualiza estado
  - Salva histórico

- [ ] Implementar `undo()`:
  - Verificar se existe `past`
  - Atualizar estados corretamente

- [ ] Implementar `redo()`:
  - Verificar se existe `future`
  - Atualizar estados corretamente

- [ ] Integrar com ações:
  - Adicionar bloco
  - Remover bloco
  - Drag & drop
  - Construção contínua

- [ ] Criar atalhos:
  - Ctrl + Z → undo
  - Ctrl + Y → redo

- [ ] Criar botões na UI (opcional)

---

## Regras de Comportamento

- Não permitir undo se não houver histórico
- Não permitir redo se não houver futuro
- Nova ação limpa o `future`
- Histórico deve ser consistente

---

## Considerações Técnicas

- Evitar mutação direta do estado
- Utilizar cópias imutáveis
- Limitar tamanho do histórico (ex: 50 ações)
- Considerar performance com muitos blocos

---

## Critério de Conclusão

O usuário deve conseguir:

- Desfazer ações (Ctrl + Z)
- Refazer ações (Ctrl + Y)
- Trabalhar com segurança sem medo de errar

---

## Resultado Esperado

O editor passa a oferecer uma experiência profissional, com controle total das ações realizadas.

Essa funcionalidade eleva significativamente o nível técnico do projeto e demonstra domínio avançado de gerenciamento de estado.

Além disso, aproxima o sistema de ferramentas reais de edição como Figma, Photoshop e editores 3D.

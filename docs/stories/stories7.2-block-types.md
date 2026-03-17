# Story 7.2 — Sistema de Tipos de Blocos (Cores, Texturas e Integração com API)

## Objetivo

Implementar um sistema de tipos de blocos com suporte a cores e texturas reais, utilizando dados externos (API de blocos do Minecraft), elevando o nível visual e profissional do editor.

---

## Contexto

Atualmente, os blocos possuem aparência uniforme.

Para aumentar o realismo e a qualidade do projeto, será implementada uma integração com uma API pública que fornece imagens de blocos do Minecraft.

Essa abordagem substitui o uso exclusivo de cores estáticas por um sistema baseado em assets reais.

---

## Decisão Técnica

Será utilizada uma API pública de blocos que fornece imagens (ícones/texturas) de itens e blocos do Minecraft.

A integração será feita de forma indireta, através de uma camada de service + adapter, garantindo desacoplamento.

---

## Proposta

Criar um sistema híbrido com duas fontes:

### 1. Fonte dinâmica (principal)

- API externa com imagens de blocos

### 2. Fonte local (fallback)

- Configuração com cores simples

---

## Estrutura Técnica

Cada bloco terá:

- `type` (string)
- `position`
- `texture` (opcional)
- `color` (fallback)

Exemplo:

```js id="e1ql9o"
{
  id: 'block-1',
  type: 'minecraft:stone',
  position: [0, 0, 0],
  texture: 'https://.../stone.png'
}
```

---

## Arquitetura

```txt id="2u2b8h"
API → Service → Adapter → Formato interno → UI / Renderização
```

---

## Camadas

### Service

`/services/minecraftService.js`

Responsável por buscar dados da API.

---

### Adapter

`/adapters/minecraftAdapter.js`

Responsável por converter os dados externos para o formato interno da aplicação.

---

## Formato Interno Padronizado

```js id="p2ascc"
{
  id: string,
  name: string,
  texture: string
}
```

---

## Configuração Local (Fallback)

`/config/blockTypes.js`

```js id="u22o8n"
export const BLOCK_TYPES = {
  grass: { label: 'Grama', color: '#4CAF50' },
  stone: { label: 'Pedra', color: '#9E9E9E' },
  wood: { label: 'Madeira', color: '#8D6E63' },
};
```

---

## Estratégia de Carregamento

- Não carregar todos os blocos da API
- Utilizar lista inicial reduzida (10–20 blocos)
- Preparar para expansão futura

---

## Renderização no Three.js

- Se `texture` existir:
  - Usar `TextureLoader`
  - Aplicar em `material.map`

- Se não existir:
  - Usar `color`

---

## Tasks

- [ ] Criar `minecraftService.js`

- [ ] Criar `minecraftAdapter.js`

- [ ] Buscar blocos da API (lista limitada)

- [ ] Mapear para formato interno

- [ ] Criar estado:
  - `availableBlocks`
  - `selectedBlockType`

- [ ] Atualizar `<Block />`:
  - Renderizar textura quando disponível
  - Usar cor como fallback

- [ ] Atualizar material:
  - `meshStandardMaterial` com `map` ou `color`

- [ ] Atualizar UI:
  - Exibir lista de blocos com imagem
  - Permitir seleção

- [ ] Atualizar preview:
  - Mostrar textura corretamente

---

## Regras de Comportamento

- Sempre deve existir um tipo selecionado
- Se API falhar → usar fallback local
- Blocos existentes continuam funcionando
- Sistema deve funcionar offline (modo básico)

---

## Considerações Técnicas

- Nunca consumir API direto no componente
- Utilizar adapter obrigatoriamente
- Evitar múltiplos loads da mesma textura
- Preparar cache futuro

---

## Critério de Conclusão

O usuário deve conseguir:

- Selecionar blocos com textura real
- Visualizar corretamente no editor
- Construir com diferentes estilos
- Continuar usando sistema mesmo sem API

---

## Resultado Esperado

O editor passa a utilizar assets reais, elevando significativamente a qualidade visual e o nível técnico do projeto.

Essa melhoria posiciona o projeto como uma ferramenta mais próxima de um produto real, destacando-o fortemente em portfólios.

Além disso, estabelece base para:

- Story 7.5 (blocos customizados)
- Biblioteca de assets
- Expansão futura com categorias e filtros

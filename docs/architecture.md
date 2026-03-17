# 🏛️ BLOCKFORGE — Arquitetura Atualizada do Projeto

## 🎯 Visão Geral

O BlockForge é um editor 3D baseado em grid, focado na criação e manipulação de estruturas com blocos.

A arquitetura foi projetada para:

- Escalabilidade
- Performance
- Separação clara de responsabilidades
- Evolução para produto real (SaaS / ferramenta criativa)

---

## 🛠️ Tecnologias Utilizadas

- React
- Vite
- styled-components
- Three.js
- React Three Fiber
- Drei

---

## 📂 Estrutura de Diretórios

```text
blockforge/
│
├── docs/
│   ├── architecture.md
│   └── stories/
│
├── public/
│   ├── assets/
│   │   ├── textures/
│   │   └── icons/
│   └── favicon.svg
│
├── src/
│   │
│   ├── app/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── components/
│   │   │
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.js
│   │   │   ├── Panel/
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.js
│   │   │   └── Toolbar/
│   │   │       ├── index.jsx
│   │   │       └── styles.js
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout/
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.js
│   │   │   └── Sidebar/
│   │   │       ├── index.jsx
│   │   │       └── styles.js
│   │   │
│   │   └── scene/
│   │       ├── Scene/
│   │       │   ├── index.jsx
│   │       │   └── styles.js
│   │       ├── Camera/
│   │       │   ├── index.jsx
│   │       │   └── styles.js
│   │       ├── Lights/
│   │       │   ├── index.jsx
│   │       │   └── styles.js
│   │       ├── Controls/
│   │       │   ├── index.jsx
│   │       │   └── styles.js
│   │       │
│   │       ├── Block/
│   │       │   ├── Block.jsx
│   │       │   ├── styles.js
│   │       │   └── Block.types.js
│   │       │
│   │       ├── Grid/
│   │       │   ├── GridHelper.jsx
│   │       │   └── useGrid.js
│   │       │
│   │       ├── World/
│   │       │   ├── World.jsx
│   │       │   └── useWorld.js
│   │       │
│   │       └── Instancing/ # performance otimizada
│   │           ├── InstancedBlocks.jsx
│   │           └── useInstancing.js
│   │
│   ├── pages/
│   │   └── Editor.jsx
│   │
│   ├── hooks/
│   │   ├── useBlocks.js
│   │   ├── useInteraction.js
│   │   ├── useCamera.js
│   │   ├── useHistory.js
│   │   └── usePerformance.js
│   │
│   ├── store/
│   │   └── blockStore.js
│   │
│   ├── utils/
│   │   ├── math/
│   │   │   └── snapToGrid.js
│   │   ├── helpers/
│   │   ├── performance/
│   │   │   └── optimizeScene.js
│   │   └── constants/
│   │       └── blockTypes.js
│   │
│   ├── styles/
│   │   ├── globals.js
│   │   └── theme.js
│   │
│   └── services/
│       ├── storage.js
│       ├── blocksApi.js
│       └── imageStorage.js
│
├── package.json
├── vite.config.js
└── babel.config.js
```

---

## 🏗️ Camadas da Aplicação

### 1. UI (Interface)

**Responsável por:**
- Sidebar
- Botões
- Seleção de blocos
- Responsividade

**Regra:** Não contém lógica de renderização 3D.

### 2. Lógica (Hooks e Estado)

**Responsável por:**
- Estado global de blocos
- Interações do usuário
- Histórico (undo/redo)
- Performance

**Principais hooks:**
- `useBlocks`
- `useInteraction`
- `useHistory`
- `usePerformance`

### 3. Engine 3D

**Responsável por:**
- Renderização da cena
- Posicionamento de blocos
- Grid e mundo

**Regra:** Não deve conter lógica de negócio.

---

## 📖 Integração com Stories

Cada story representa:
- Uma funcionalidade isolada
- Um avanço arquitetural
- Um bloco de evolução do sistema

**Estrutura dos stories:**
- **1.x** → Setup inicial
- **2.x** → Estrutura base (blocos e grid)
- **3.x** → Interações (add, drag, remove)
- **4.x** → Navegação e câmera
- **5.x** → Interface
- **6.x** → Persistência
- **7.x** → Refinamento (profissional)

---

## ⚙️ Sistemas Principais

### 📦 Sistema de Estado
Centralizado em `useBlocks`

**Responsável por:**
- Adicionar blocos
- Remover blocos
- Atualizar blocos

**Estrutura do bloco:**
```javascript
{
  id: string,
  position: { x, y, z },
  type: string,
  texture?: string
}
```

### ⏪ Sistema de Histórico (Undo/Redo)
Gerenciado por `useHistory`

**Responsável por:**
- Armazenar estados anteriores
- Permitir desfazer/refazer ações

**Regra:** Toda modificação de bloco deve passar pelo histórico.

### 📏 Sistema de Grid
Todo posicionamento passa por `snapToGrid()`

**Garante:**
- Alinhamento perfeito
- Consistência visual
- Performance previsível

### 🖱️ Sistema de Interação
Isolado em `useInteraction`

**Responsável por:**
- Raycasting
- Detecção de cliques
- Posicionamento no mundo

### ⚡ Sistema de Performance
Responsável por garantir fluidez.

**Inclui:**
- Uso de `InstancedMesh`
- Cache de texturas
- Reutilização de materiais
- Redução de re-render

### 🧩 Sistema de Assets (Blocos Externos)
Integração com APIs externas (Arquivo: `services/blocksApi.js`)

**Responsável por:**
- Buscar blocos (nome, imagem)
- Mapear dados para o sistema interno

### 🖼️ Sistema de Upload de Imagens
Arquivo: `services/imageStorage.js`

- **Inicial:** `URL.createObjectURL`
- **Futuro:** Cloudinary ou outro storage

### 📱 Responsividade
Responsável por adaptar a Sidebar, o Canvas e o Layout geral.

**Estratégias:**
- Flex/Grid
- Media queries
- Layout colapsável

### 💾 Persistência
Arquivo: `services/storage.js`

- **Inicial:** `localStorage`
- **Futuro:** Backend / API

---

## ⚖️ Regras Arquiteturais

- Separação total entre UI e 3D
- Hooks controlam lógica
- Componentes são apenas visuais
- Nenhuma lógica duplicada
- Código sempre escalável

---

## 🔁 Fluxo do Sistema

1. Usuário interage com UI
2. UI dispara hooks
3. Hooks atualizam estado
4. Estado atualiza cena 3D
5. Cena renderiza novamente

---

## 🚀 Direção do Projeto

O BlockForge evolui de um **Editor 3D simples** para:
- Ferramenta de criação visual
- Planejador de construções
- Plataforma criativa com potencial SaaS

---

## 🧠 Considerações Finais

A arquitetura atual suporta:
- Crescimento contínuo
- Novas features
- Otimizações avançadas

O projeto deixa de ser apenas técnico e passa a ser:
- Um produto em potencial

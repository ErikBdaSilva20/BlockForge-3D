# 📌 BlockForge — Decisões Futuras / Anotações Técnicas

## 🎯 Objetivo

Registrar ideias e decisões que foram adiadas durante o desenvolvimento do projeto, para serem revisitadas no futuro sem perda de contexto.

---

## 🧱 1. Sistema de Limites (Free vs Pro)

**Ideia:**

- Limitar quantidade de blocos no plano gratuito
- Liberar limites maiores via assinatura

**Possível evolução:**

- Controle por número de blocos
- Controle por tamanho da área (grid)
- Features exclusivas para usuários pagos

**Status:** 🔒 Adiado (pós-MVP)

---

## 🎮 2. Mecânica de Drag & Drop (Sidebar → Cena)

**Ideia:**

- Arrastar blocos diretamente da sidebar para o mundo 3D

**Motivo de adiamento:**

- Complexidade na detecção de posição no mundo
- Necessidade de refinar sistema de interação

**Status:** 🔒 Adiado

---

## 🧱 3. Construção Contínua (Click Segurado)

**Ideia:**

- Segurar o mouse e “pintar” blocos no grid

**Cuidados necessários:**

- Evitar sobreposição de blocos
- Garantir performance
- Controle de frequência de criação

**Status:** 🔒 Adiado

---

## 👁 4. Visualização da Área de Construção

**Ideia:**

- Exibir bordas da área (bounding box)
- Opção de ligar/desligar visualização

**Motivo:**

- Melhor feedback visual para o usuário
- Integração com limites do sistema

**Status:** 🔒 Adiado

---

## 🖼 5. Upload de Imagens (Persistência Real)

**Situação atual:**

- Uso de `URL.createObjectURL`

**Problema:**

- Dados são perdidos ao recarregar a página

**Ideia futura:**

- Integrar com Cloudinary ou outro storage

**Status:** 🔒 Adiado

---

## 🌐 6. API de Blocos (Minecraft)

**Ideia:**

- Utilizar API externa para obter:
  - Imagens de blocos
  - Nomes
  - Categorias

**Motivo:**

- Evitar uso de cores simples
- Tornar o projeto mais profissional

**Status:** 🔒 Adiado

---

## 💾 7. Persistência Avançada

**Situação atual:**

- localStorage

**Ideia futura:**

- Backend para salvar projetos
- Acesso multi-dispositivo

**Status:** 🔒 Adiado

---

## ⚡ 8. Performance Avançada (Além do Básico)

**Situação atual:**

- Otimizações iniciais aplicadas

**Ideia futura:**

- Otimizações mais agressivas
- Suporte a grandes volumes de blocos

**Status:** 🔒 Adiado

---

## 📱 9. Experiência Mobile Avançada

**Situação atual:**

- Responsividade básica

**Ideia futura:**

- Melhorar UX mobile
- Controles touch mais naturais

**Status:** 🔒 Adiado

---

## 🧠 Observação Geral

Essas decisões foram adiadas propositalmente para:

- Evitar complexidade precoce
- Manter foco no core do projeto
- Garantir entrega funcional e estável

---

## 🚀 Direção Futura

Esses pontos representam possíveis evoluções para transformar o BlockForge em:

- Produto real
- Ferramenta criativa
- Plataforma com potencial SaaS

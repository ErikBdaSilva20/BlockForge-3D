# Story 7.7 — Responsividade e Adaptação de Tela

## Objetivo

Garantir que o editor 3D funcione corretamente em diferentes tamanhos de tela, mantendo usabilidade, organização da interface e experiência consistente.

---

## Contexto

O editor possui:

- Sidebar (seleção de blocos)
- Área 3D (canvas)
- Controles de interação

Sem responsividade, o sistema pode:

- Quebrar em telas menores
- Ficar difícil de usar
- Perder valor como produto real

---

## Proposta

Adaptar o layout para diferentes resoluções, garantindo:

- Boa experiência em desktop
- Uso aceitável em tablets
- Estrutura mínima funcional em mobile

---

## Escopo

Inclui:

- Responsividade da UI
- Adaptação do layout geral
- Ajustes no canvas 3D

Não inclui:

- Versão mobile totalmente otimizada
- Controles touch avançados (gestos complexos)

---

## Breakpoints sugeridos

- Desktop: > 1024px
- Tablet: 768px – 1024px
- Mobile: < 768px

---

## Comportamento por tela

### 🖥 Desktop

- Sidebar fixa à esquerda
- Canvas ocupa o restante da tela
- Experiência completa

---

### 📱 Tablet

- Sidebar pode ser:
  - Reduzida (ícones)
  - Ou colapsável

- Canvas continua sendo foco principal

---

### 📱 Mobile

- Sidebar vira:
  - Drawer (menu lateral que abre/fecha)

- Canvas ocupa quase toda a tela

- Interface simplificada

---

## Ajustes no Canvas 3D

- Redimensionamento automático com `resize`
- Manter proporção correta da câmera
- Evitar distorções

---

## Tasks

- [ ] Implementar layout responsivo (CSS / styled-components)

- [ ] Criar sidebar colapsável

- [ ] Implementar drawer para mobile

- [ ] Ajustar canvas para resize dinâmico

- [ ] Testar em diferentes resoluções

---

## Regras de Comportamento

- UI nunca deve "quebrar"
- Elementos devem permanecer acessíveis
- Canvas deve sempre ser utilizável

---

## Considerações Técnicas

- Usar `flex` ou `grid`
- Usar `media queries`
- Evitar valores fixos (px excessivo)
- Priorizar proporções (% / vw / vh)

---

## Critério de Conclusão

O sistema deve:

- Funcionar bem em desktop
- Ser utilizável em tablet
- Não quebrar em mobile

---

## Resultado Esperado

O editor se torna adaptável e mais profissional, podendo ser apresentado como uma aplicação real.

Isso demonstra:

- Preocupação com UX
- Conhecimento de responsividade
- Capacidade de pensar além do código funcional

Esse é um diferencial importante para portfólio front-end.

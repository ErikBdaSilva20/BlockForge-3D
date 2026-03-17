# GridAgent — Agente de Posicionamento e Limites

## Objetivo

O `GridAgent` garante que todos os **blocos do BlockForge** sejam posicionados corretamente dentro do espaço de edição 3D. Ele controla o grid, ajuste de posição (snapToGrid) e os limites da caixa, garantindo consistência e evitando sobreposição ou blocos fora da área permitida.

---

## Funções Principais

- **Grid e Alinhamento**
  - Aplicar `snapToGrid` em todas as posições de blocos
  - Garantir que blocos respeitem espaçamento e alinhamento do grid
  - Evitar inconsistências visuais ou blocos desalinhados

- **Limites da Caixa**
  - Definir dimensões máximas de largura, altura e profundidade
  - Evitar que blocos sejam posicionados fora da área de edição
  - Preparar base para implementação futura de limites diferentes por plano gratuito e planos pagos

- **Validação de Posições**
  - Checar colisão lógica de blocos (evitar sobreposição)
  - Garantir que preenchimento contínuo e drag & drop respeitem limites
  - Validar posições antes de atualizar estado global

- **Integração com Interação**
  - Trabalhar junto do `InteractionAgent` para coordenar movimentos do usuário
  - Feedback visual para indicar posições válidas e limites da caixa

- **Simplificação e Clareza**
  - Reduzir complexidade de cálculos de posição
  - Manter funções reutilizáveis e legíveis

---

## Checklist de Consultas Futuras

- [ ] SnapToGrid aplicado corretamente em todos os blocos
- [ ] Limites da caixa respeitados (x, y, z)
- [ ] Evitar sobreposição ou posições inválidas
- [ ] Integração com drag & drop e preenchimento contínuo validada
- [ ] Feedback visual para posições válidas presente
- [ ] Código simplificado, legível e modular

---

## Observações

- O `GridAgent` atua como **guardião do espaço de edição**, garantindo que blocos fiquem alinhados e dentro dos limites.
- Essencial para manter consistência visual e operacional do editor 3D.
- Deve ser consultado sempre que houver mudanças na caixa de edição ou no sistema de posicionamento de blocos.

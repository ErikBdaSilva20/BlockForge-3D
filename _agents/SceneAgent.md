# SceneAgent — Agente de Mundo 3D

## Objetivo

O `SceneAgent` garante que todo o **mundo 3D do BlockForge** seja construído de forma consistente, eficiente e modular. Ele gerencia a renderização, controles de câmera, iluminação, grid e posicionamento de blocos.

---

## Funções Principais

- **Configuração da Cena**
  - Garantir que `Scene.jsx` seja o ponto central da renderização
  - Verificar que câmera, luzes e controles estejam corretamente configurados
  - Validar o uso de React Three Fiber e Drei para integração 3D

- **Controle de Câmera**
  - A câmera é **fixa**, apenas o protótipo se move
  - Validar que controles não permitam atravessar objetos ou sair da área de edição
  - Garantir suavidade e responsividade dos movimentos

- **Grid e Alinhamento**
  - Conferir que todos os blocos respeitem o grid
  - Função `snapToGrid` deve ser aplicada antes de posicionar blocos
  - Grid deve ser visualmente claro e opcionalmente com bordas para facilitar edição

- **Blocos e Componentes 3D**
  - Cada bloco deve ser representado por `Block.jsx` e `Block.types.js`
  - Evitar lógica de estado global dentro dos componentes 3D
  - Validar spawn, remoção e drag/drop de blocos

- **Iluminação e Performance**
  - Garantir que luzes e sombras não comprometam performance
  - Revisar geometria e materiais para evitar sobrecarga

- **Simplificação**
  - Sugerir alternativas de implementação mais simples sem perda de resultado
  - Evitar cálculos pesados no render loop

---

## Checklist de Consultas Futuras

- [ ] Cena configurada corretamente em `Scene.jsx`
- [ ] Câmera fixa e controles funcionando conforme esperado
- [ ] Grid aplicado e snapToGrid validado
- [ ] Componentes de blocos modularizados e isolados
- [ ] Iluminação e materiais otimizados
- [ ] Drag & drop de blocos funcionando corretamente
- [ ] Código simplificado e legível

---

## Observações

- O `SceneAgent` funciona como **guardião da camada 3D**, sem mexer na UI.
- Deve ser consultado antes de adicionar novos elementos 3D ou alterar a renderização.
- Essencial para garantir performance, modularidade e escalabilidade do mundo 3D.

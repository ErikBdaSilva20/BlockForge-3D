# InteractionAgent — Agente de Interação do Usuário

## Objetivo

O `InteractionAgent` garante que todas as **interações do usuário com o mundo 3D** funcionem de forma intuitiva, consistente e sem conflitos. Ele gerencia cliques, arrastar blocos, preenchimento contínuo e feedback visual.

---

## Funções Principais

- **Clique e Seleção**
  - Detectar clique sobre blocos ou áreas válidas do grid
  - Atualizar seleção de bloco de forma clara
  - Garantir que múltiplas interações simultâneas não quebrem o estado

- **Drag & Drop**
  - Permitir arrastar blocos da sidebar para a caixa 3D
  - Controlar posicionamento dentro do grid
  - Prevenir sobreposição desnecessária de blocos

- **Preenchimento Contínuo**
  - Implementar mecânica de “segurar clique e arrastar”
  - Adicionar blocos automaticamente conforme o hover
  - Garantir que cada posição seja única e respeite o grid

- **Feedback Visual**
  - Highlight ou outline para blocos selecionados
  - Indicação de posição válida durante arraste
  - Opcional: mostrar bordas da caixa grande para facilitar edição

- **Separação de Responsabilidades**
  - Lógica isolada em hooks (`useInteraction.js`)
  - Componentes 3D não devem manipular interações diretamente

- **Simplificação e Clareza**
  - Evitar cálculos desnecessários no render loop
  - Propor métodos simples de detectar hover, clique e drag & drop

---

## Checklist de Consultas Futuras

- [ ] Clique sobre blocos detectado corretamente
- [ ] Drag & drop funcional e respeitando grid
- [ ] Preenchimento contínuo implementado corretamente
- [ ] Feedback visual consistente
- [ ] Componentes 3D isolados da lógica de interação
- [ ] Código simplificado e legível

---

## Observações

- O `InteractionAgent` atua como **ponte entre UI e mundo 3D**, garantindo que ações do usuário reflitam corretamente no estado global.
- Essencial para funcionalidades como adicionar, mover, remover e preencher blocos.
- Deve ser consultado sempre que houver mudanças na interface ou no sistema de blocos.

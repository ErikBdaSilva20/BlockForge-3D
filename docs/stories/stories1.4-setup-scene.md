# Story 1.4 — Estrutura Visual da Cena (Chão e Grid)

## Objetivo

Criar a base visual do ambiente 3D, adicionando um plano (chão) e um grid de referência, permitindo ao usuário entender o espaço e se orientar dentro da cena.

---

## Contexto

Após a configuração do ambiente 3D (câmera, luz e controles), o próximo passo é dar contexto visual ao mundo.

Sem um plano e um grid, o usuário não consegue perceber profundidade, escala ou posicionamento, o que torna a interação futura com blocos confusa.

Essa etapa prepara o ambiente visual onde os blocos serão inseridos posteriormente.

---

## Escopo

Esta etapa inclui:

- Criação de um plano base (chão)
- Adição de um grid visual
- Ajuste de escala e proporção da cena

Não faz parte desta etapa:

- Sistema de blocos
- Interação com clique
- Lógica de grid funcional
- Validação de posicionamento

---

## Tasks

- [ ] Criar componente `<Ground />` dentro de `components/scene/`

- [ ] Implementar um plano (plane geometry):
  - Posicionado horizontalmente (eixo correto)
  - Centralizado na origem (0,0,0)
  - Com tamanho suficiente para navegação

- [ ] Aplicar material simples no plano:
  - Cor neutra (ex: cinza)
  - Sem texturas complexas

- [ ] Criar componente `<GridHelper />`:
  - Adicionar grid visual sobre o plano
  - Definir tamanho e número de divisões
  - Garantir alinhamento com o plano

- [ ] Integrar `<Ground />` e `<GridHelper />` dentro da `<Scene />`

- [ ] Ajustar escala geral da cena, se necessário

- [ ] Validar visualização com a câmera atual

---

## Critério de Conclusão

A cena deve exibir claramente:

- Um plano base (chão)
- Um grid visível e bem alinhado

O usuário deve conseguir entender orientação espacial (posição, escala e profundidade).

A navegação com a câmera deve permitir visualizar o ambiente de diferentes ângulos.

Não deve haver erros no console.

---

## Regras

O grid nesta etapa é apenas visual.

Não implementar qualquer tipo de lógica de posicionamento ou validação.

Evitar texturas ou elementos complexos.

Manter o ambiente limpo, leve e organizado.

Garantir que o plano e o grid estejam perfeitamente alinhados.

Não misturar lógica de interação nesta fase.

---

## Estrutura Esperada

A pasta `components/scene/` deve conter:

- Scene.jsx
- Camera.jsx
- Lights.jsx
- Controls.jsx
- Ground.jsx
- GridHelper.jsx

---

## Resultado Esperado

Ao final desta etapa, o ambiente 3D deve transmitir claramente a sensação de um espaço de construção.

O usuário deve conseguir navegar pela cena e entender onde os objetos poderão ser posicionados futuramente.

Essa base visual será utilizada diretamente nas próximas etapas do sistema.

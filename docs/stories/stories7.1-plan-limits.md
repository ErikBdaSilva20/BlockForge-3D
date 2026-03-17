# Story 7.1 — Sistema de Limites por Plano (Free vs Premium)

## Objetivo

Implementar um sistema de limitação de uso do editor baseado em planos, permitindo diferenciar usuários gratuitos de usuários premium através de restrições no espaço de construção.

---

## Contexto

O editor atualmente permite que o usuário construa livremente dentro do grid definido.

No entanto, não há nenhuma restrição de uso, o que impede a criação de regras de produto como:

- Limitação de espaço
- Progressão de usuário
- Possível monetização futura

Essa etapa introduz a base para controle de acesso por plano.

---

## Proposta

Criar um sistema simples e extensível que defina limites de construção com base no tipo de plano do usuário.

Inicialmente, será apenas uma simulação local (sem backend ou autenticação).

---

## Regras de Negócio

### Plano Free

- Área de construção limitada
- Exemplo:
  - largura: 10
  - altura: 10
  - profundidade: 10

---

### Plano Premium (futuro)

- Área expandida
- Exemplo:
  - largura: 30+
  - altura: 30+
  - profundidade: 30+

---

## Escopo

Inclui:

- Definição de planos
- Aplicação de limites no grid
- Bloqueio de construção fora da área permitida

Não inclui:

- Sistema de pagamento
- Login de usuário
- Backend

---

## Tasks

- [ ] Criar arquivo `plansConfig.js`:
  - Definir planos disponíveis
  - Estrutura:
    - name
    - maxWidth
    - maxHeight
    - maxDepth

- [ ] Criar estado global de plano:
  - Ex: `currentPlan = "free"`

- [ ] Integrar com sistema de grid:
  - Ajustar limites com base no plano

- [ ] Atualizar lógica de posicionamento:
  - Impedir criação fora dos limites

- [ ] Atualizar preview:
  - Indicar visualmente quando posição é inválida

- [ ] Adicionar feedback visual:
  - Hover vermelho para área bloqueada

- [ ] Garantir compatibilidade com:
  - Drag & drop
  - Construção contínua

---

## Critério de Conclusão

O usuário deve:

- Conseguir construir normalmente dentro da área permitida
- Ser impedido de construir fora dos limites
- Receber feedback visual claro quando ultrapassar o limite

---

## Considerações Técnicas

- O sistema deve ser desacoplado do grid base
- Deve ser fácil alterar valores futuramente
- Preparar estrutura para integração com backend

---

## Resultado Esperado

O editor passa a ter regras de uso, abrindo caminho para:

- Diferenciação de planos
- Estratégias de monetização
- Controle de performance (limitando quantidade de blocos)

Isso transforma o projeto em algo mais próximo de um produto real.

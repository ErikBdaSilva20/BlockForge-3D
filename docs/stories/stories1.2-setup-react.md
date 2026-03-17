# Story 1.2 — Estrutura Base do React

## Objetivo

Organizar a estrutura inicial do projeto React, definindo pastas, separação de responsabilidades e componentes base, garantindo que o projeto cresça de forma organizada e escalável.

---

## Contexto

Após a configuração das dependências, o próximo passo é preparar a base estrutural da aplicação. Sem uma boa organização desde o início, o projeto tende a se tornar confuso conforme cresce.

Essa etapa define como o código será organizado, sem ainda entrar na lógica do sistema ou no ambiente 3D.

---

## Escopo

Esta etapa inclui:

- Criação da estrutura de pastas principais
- Organização dos arquivos iniciais do React
- Criação de componentes base de layout
- Separação entre UI, lógica e estrutura

Não faz parte desta etapa:

- Implementação de lógica 3D
- Sistema de blocos
- Interações do usuário

---

## Tasks

- [ ] Criar estrutura de pastas dentro de `src`:
  - components/
  - pages/
  - hooks/
  - utils/
  - styles/

- [ ] Criar subpastas iniciais:
  - components/ui/
  - components/layout/

- [ ] Criar componente `<AppLayout />` responsável pela estrutura base da aplicação

- [ ] Criar página principal `Editor.jsx` dentro de `pages/`

- [ ] Configurar o `App.jsx` para utilizar o `<AppLayout />` e renderizar o `Editor`

- [ ] Garantir que a aplicação continua rodando sem erros

---

## Critério de Conclusão

A aplicação deve estar rodando normalmente com a nova estrutura de pastas.

O componente `<AppLayout />` deve envolver a aplicação corretamente.

A página `Editor` deve estar sendo renderizada como ponto principal da aplicação.

Não deve haver erros no console.

---

## Regras

Não adicionar lógica de negócio nesta etapa.

Não misturar componentes de UI com lógica futura do sistema.

Manter nomes claros e organizados.

Evitar criar arquivos desnecessários.

---

## Resultado Esperado

Ao final desta etapa, o projeto deve possuir uma base estrutural sólida, organizada e preparada para receber a lógica do sistema e o ambiente 3D nas próximas etapas.

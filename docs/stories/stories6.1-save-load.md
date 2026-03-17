# Story 6.1 — Salvar e Carregar Projetos

## Objetivo

Permitir que o usuário salve suas construções e carregue projetos posteriormente, garantindo persistência dos dados e continuidade de uso.

---

## Contexto

Até o momento, o editor permite:

- Criar estruturas com blocos
- Manipular o ambiente 3D
- Interagir de forma completa com o sistema

Porém, todo progresso é perdido ao recarregar a página.

Essa etapa resolve esse problema, tornando o editor utilizável no dia a dia.

Deve ser adicionado uma confirmação de tela caso a pessoa atualizar a página ou clicar em sair dela

---

## Escopo

Esta etapa inclui:

- Serialização dos blocos
- Salvamento local (LocalStorage)
- Carregamento de projetos
- Botões de salvar/carregar

Não faz parte desta etapa:

- Sistema de contas
- Backend
- Compartilhamento de projetos
- Versionamento (undo/redo avançado)

---

## Tasks

- [ ] Criar função de serialização:
  - Converter array de blocos em JSON

- [ ] Criar função de desserialização:
  - Converter JSON em estrutura de blocos

- [ ] Implementar salvamento:
  - Utilizar `localStorage`
  - Chave padrão (ex: `blockforge-project`)

- [ ] Implementar carregamento:
  - Ler dados salvos
  - Atualizar estado de blocos

- [ ] Criar botões na UI:
  - "Salvar"
  - "Carregar"

- [ ] Garantir fallback:
  - Caso não exista projeto salvo

- [ ] Validar dados carregados:
  - Evitar estruturas inválidas

- [ ] Atualizar renderização após load

---

## Critério de Conclusão

O usuário deve conseguir:

- Salvar sua construção
- Recarregar a página
- Restaurar o projeto exatamente como estava

O sistema deve funcionar sem erros e de forma previsível.

---

## Regras

Os dados devem ser simples e leves.

Não salvar informações desnecessárias.

A estrutura salva deve ser compatível com futuras evoluções.

Separar lógica de armazenamento da UI.

---

## Estrutura Esperada

Sugestão:

- utils/storage/saveProject.js
- utils/storage/loadProject.js

A lógica deve ser reutilizável e isolada.

---

## Resultado Esperado

Ao final desta etapa, o editor permitirá persistência de dados, transformando o projeto em uma ferramenta real de criação.

O usuário poderá construir, salvar e continuar seu trabalho a qualquer momento.

Essa funcionalidade marca o fim do MVP inicial do BlockForge.

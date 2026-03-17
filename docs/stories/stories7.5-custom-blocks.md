# Story 7.5 — Blocos Customizados com Upload de Imagens

## Objetivo

Permitir que o usuário faça upload de imagens e utilize essas imagens como textura em blocos dentro do editor, expandindo drasticamente a capacidade criativa da ferramenta.

---

## Contexto

Atualmente, os blocos podem utilizar:

- Cores (fallback)
- Texturas vindas de API (ex: blocos do Minecraft)

No entanto, o usuário ainda está limitado aos assets disponíveis.

Essa funcionalidade permite total liberdade criativa, tornando o editor mais flexível e poderoso.

---

## Proposta

Adicionar suporte para upload de imagens locais, permitindo que o usuário crie seus próprios blocos personalizados.

As imagens serão convertidas em texturas e aplicadas diretamente nos blocos.

---

## Escopo

Inclui:

- Upload de imagem (input file)
- Conversão da imagem para textura
- Aplicação da textura no bloco
- Integração com sistema de tipos

Não inclui:

- Edição de imagem
- Biblioteca persistente (backend)
- Compartilhamento de assets

---

## Estrutura Técnica

Cada bloco poderá conter:

- `type`
- `position`
- `texture` (URL ou base64)

---

## Fluxo de Funcionamento

```txt
Upload de imagem → Leitura (FileReader) → Criação de textura → Aplicação no bloco
```

---

## Estratégia de Armazenamento

Inicialmente:

- Utilizar Base64 (data URL)
- Armazenar no estado local

Futuro:

- Persistência em backend ou storage

---

## Tasks

- [ ] Criar input de upload na UI
  - Aceitar imagens (png, jpg)

- [ ] Implementar leitura de arquivo:
  - Utilizar `FileReader`

- [ ] Converter imagem para:
  - Base64 ou URL temporária

- [ ] Criar novo tipo de bloco dinâmico:
  - Adicionar à lista de `availableBlocks`

- [ ] Atualizar `<Block />`:
  - Aplicar textura customizada

- [ ] Atualizar preview:
  - Exibir imagem corretamente

- [ ] Integrar com seleção de blocos:
  - Usuário pode escolher bloco custom

---

## Regras de Comportamento

- Apenas imagens válidas devem ser aceitas
- Limitar tamanho do arquivo (ex: 2MB)
- Blocos customizados devem funcionar igual aos demais
- Não sobrescrever blocos existentes

---

## Considerações Técnicas

- Evitar múltiplos carregamentos da mesma imagem
- Considerar cache de texturas
- Evitar memory leaks com URLs

---

## UX (Importante)

- Mostrar preview da imagem antes de aplicar
- Feedback visual ao fazer upload
- Exibir bloco custom na sidebar

---

## Critério de Conclusão

O usuário deve conseguir:

- Fazer upload de uma imagem
- Criar um bloco com essa imagem
- Utilizar esse bloco no editor normalmente

---

## Resultado Esperado

O editor deixa de depender exclusivamente de assets pré-definidos e passa a oferecer liberdade total de criação.

Essa funcionalidade transforma o projeto em uma ferramenta criativa real, permitindo usos diversos e aumentando significativamente seu valor como projeto de portfólio.

Além disso, abre caminho para futuras evoluções como:

- Biblioteca de assets do usuário
- Compartilhamento de blocos
- Marketplace de texturas

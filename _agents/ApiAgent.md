# ApiAgent — Agente de Integração e Dados Externos

## Objetivo

O `ApiAgent` é responsável por integrar APIs externas ao BlockForge, servindo como a ponte entre fontes de dados externas (como APIs de Minecraft e Assets) e o sistema interno de blocos. Ele garante que os dados sejam normalizados, cacheados e tratados corretamente para manter a performance e a consistência visual do editor.

---

## Funções Principais

- **Integração e Busca de Dados**
  - Buscar dados de blocos de APIs externas (PrismarineJS, Minecraft Assets), ou alguma outra api que forneça os dados dos blocos.
  - Centralizar requisições HTTP em um cliente base (`apiClient.js`) de forma organizada

- **Normalização e Adaptação**
  - Converter dados brutos de APIs externas para o padrão interno do BlockForge
  - Garantir que cada bloco tenha `id`, `name`, `type`, `texture` e `category` definidos se possível
  - Disponibilizar os blocos para serem escolhidos em um menu de blocos no front end
  - Isolar a lógica de transformação em adaptadores específicos (`blockAdapter.js`) se necessário

- **Gerenciamento de Assets e Performance**
  - Gerenciar o carregamento de texturas, sprites e modelos 3D externos
  - Se possivel, utilizar (se já não integrado), os blocos devem carregar somente as feições visiveis para garantir mais performance
  - Implementar cache de requisições para evitar chamadas redundantes
  - Garantir fallback local (uso de blocos padrão) caso a API externa falhe

- **Organização do Código**
  - Manter a lógica isolada em `src/services/` (`blocksApi.js`, `minecraftApi.js`, `apiClient.js`)
  - Garantir que nenhum dado bruto chegue aos componentes de UI

- **Salvar o projeto no próprio dispositivo**
  -Possibilidade de poder baixar um arquivo .json com os dados da construção do projeto. (parecido com o que é feito no LocalStorage, mas com a possibilidade de salvar e carregar)
  -Possibilidade de poder carregar um arquivo .json com os dados do projeto

---

## Checklist de Consultas Futuras

- [ ] API conectada e respondendo corretamente
- [ ] Adapter criado e dados normalizados (padrão interno `{id, name, type, texture, category}`)
- [ ] Tratamento de erro implementado no `apiClient`
- [ ] Cache de requisições funcional para evitar overhead
- [ ] Fallback local configurado para falhas de rede ou APIs offline
- [ ] Texturas e assets mapeados corretamente via GitHub Assets

---

## Observações e Estratégia

- **Stack Ideal:** Usar **PrismarineJS** para a base de dados técnica e **Minecraft Assets (GitHub)** para a parte visual (texturas).

- **Regra de Ouro:** Nunca quebrar o sistema por erro externo; o editor deve ser resiliente a falhas de API.

---

## Detalhes de Implementação

### Estrutura de Pastas

```text
src/services/
├── apiClient.js         # Base HTTP (Fetch/Axios)
├── minecraftApi.js      # Integração específica (Prismarine/Outros)
└── adapters/
    └── blockAdapter.js  # Normalização de dados
```

### Principais Fontes de Dados

1. **PrismarineJS:** Lista completa de blocos e propriedades (Mais confiável).
2. **Minecraft Assets (GitHub):** Fonte oficial de texturas e modelos.
3. **Modrinth API:** Expansão futura para blocos de mods e marketplace.
4. **LocalStorage:** Salvar e carregar projetos no próprio dispositivo.
5. **Extra:** Caso não for possivel usar prismarinejs, usar a api do minecraft assets para obter os dados dos blocos, ou alguma outra api que forneça os dados dos blocos.

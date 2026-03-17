# StorageAgent — Agente de Persistência e Histórico

## Objetivo

O `StorageAgent` garante que todo o **salvamento, carregamento e histórico** do BlockForge funcione corretamente, de forma confiável e organizada. Ele gerencia localStorage, APIs externas e funcionalidades de undo/redo.

---

## Funções Principais

- **Salvamento de Projetos**
  - Validar que todos os blocos sejam salvos com posição e tipo corretos
  - Garantir integridade do estado antes do salvamento
  - Permitir salvar localmente (`localStorage`) ou via API futura

- **Carregamento de Projetos**
  - Validar dados carregados antes de atualizar o estado
  - Garantir compatibilidade com versões anteriores
  - Aplicar blocos e grid corretamente após o load

- **Undo / Redo**
  - Controlar histórico de alterações de blocos
  - Permitir desfazer/refazer adições, remoções e movimentações
  - Evitar inconsistências ou sobreposição de blocos

- **Gestão de Imagens**
  - Para blocos personalizados (7.2 / pós-MVP), suportar armazenamento de imagens
  - Integrar com Cloudinary ou serviço similar
  - Validar URLs de imagens e integridade do conteúdo

- **Simplificação e Segurança**
  - Evitar armazenamento duplicado ou dados desnecessários
  - Garantir que operações não bloqueiem a UI
  - Propor soluções simples e eficientes para histórico

---

## Checklist de Consultas Futuras

- [ ] Salvamento de blocos funcionando corretamente
- [ ] Carregamento aplicando grid e posições corretamente
- [ ] Undo / redo validado e consistente
- [ ] Imagens de blocos personalizados integradas e funcionais
- [ ] Dados armazenados de forma segura e otimizada
- [ ] Código legível e simplificado

---

## Observações

- O `StorageAgent` é essencial para **persistência e confiabilidade** do editor.
- Deve ser consultado antes de qualquer alteração no sistema de blocos ou ao implementar novas funcionalidades de histórico.
- Fundamental para permitir funcionalidades avançadas como undo/redo e blocos customizados.

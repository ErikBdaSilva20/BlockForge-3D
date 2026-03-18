# 🧱 BlockForge 3D

> **Status do Projeto:** 🚧 Em desenvolvimento ativo. Muitas funcionalidades ainda serão implementadas. O BlockForge é um editor/módulo experimental de construção voxel 3D para web.

O **BlockForge 3D** é um construtor estilo voxel (tipo Minecraft) desenvolvido em **React** e **Three.js** (@react-three/fiber). Ele permite construir e desenhar blocos no espaço 3D diretamente no navegador, suportando upload de texturas, seleções avançadas, gestão de histórico, e modos de pincel dinâmicos.

---

## 🌟 Funcionalidades Atuais

- **Editor 3D Responsivo:** Construa livremente pelo desktop ou navegue ajustando a tela.
- **Modo Pincel (Brush Mode):** 
  - **Construção:** Clique e arraste para desenhar pilares ou paredes verticais/horizontais super rápido.
  - **Remoção:** Use o modo borracha para destruir linhas inteiras arrastando o mouse.
  - O tamanho/altura da pintura interage diretamente com o Scroll do mouse!
- **Sistema de Seleções Profissionais:** 
  - Clique e arraste de qualquer lugar (segurando `Shift`) para desenhar uma área de seleção 3D invisível, pegando múltiplos blocos de uma vez.
  - Multi-selecione segurando `Ctrl` ou `Shift` ao clicar nos blocos.
  - Delete tudo que selecionou pressionando `Del` ou `Backspace`.
- **Customização de Blocos:** Faça o upload das suas próprias imagens locais (limite 2MB) para servirem de textura (tiles) no ambiente 3D.
- **Sombras e Grid Dinâmicas:** Alterne a renderização pesada de sombras globais ou os limites da "Caixa do Ambiente" diretamente na sidebar.
- **Histórico (Undo/Redo):** Volte atrás se cometeu algum erro na construção. Totalmente mapeado.
- **Persistência Local (LocalStorage):** Salve o estado do seu mundo e continue no próximo carregamento a qualquer momento.

---

## ⌨️ Atalhos e Comandos (Importante!)

O BlockForge foi desenhado para uso intenso em Desktop. Grande parte da agilidade vem de atalhos e ações do mouse:

### Construção
- **`Clique Esquerdo`** no chão ou lateral de bloco: Colocar um bloco.
- **`Shift + Alt + Clique`**: Remover exatamente o bloco clicado (Maneira clássica). *Ou utilize a Seleção em caixa e apague.*
- **Arrastar da Sidebar**: Pegar um novo tipo de bloco.

### Câmera 
- **`Botão Direito`** *(Segurar e Arrastar)*: Girar a câmera ao redor da cena.
- **`Botão do Meio`** *(Segurar e Arrastar)*: Fazer "Pan", varrer a cena lateralmente.
- **`Scroll`**: Zoom (aproximar/afastar).

### Seleção e Deleção
- **`Segurar Shift + Arrastar`**: (Desde o chão vazio até outro bloco) Cria uma "Caixa de Seleção" capturando todos os blocos no meio.
- **`Ctrl + Clique`** ou **`Shift + Clique`**: Seleciona aquele(s) blocos específicos.
- **`Delete`** ou **`Backspace`**: Tendo qualquer bloco selecionado, pressionar apaga tudo de uma vez marcando as deleções no histórico!
- **`Clique Rápido no Chão`**: Limpa todas as marcações de seleção atuais.

### Pincel (Brush Mode)
*Para funcionar, o "Modo Pincel" deve ser ativado na Sidebar (Lado esquerdo).*
- **`Segurar Clique Esquerdo + Arrastar`**: Prepara a "Sombra" da área horizontal ou as paredes que você deseja colocar ou apagar.
- **`Scroll`**: No Modo Pincel, aumenta ou diminui rapidamente a altura (Y) da camada principal!
- **`Confirmação`**: Para as sombras virarem blocos (ou deletarem os blocos atingidos), você deve clicar explicitamente no botão azul "✔ Executar" na sidebar.

### Histórico (Edição)
- **`Ctrl + Z`**: Desfaz as últimas criações ou deleções de blocos (Undo).
- **`Ctrl + Y`** ou **`Ctrl + Shift + Z`**: Refaz o último comando (Redo).

---

## 🚀 Como testar localmente

Este projeto roda no ecossistema Vite + React. 

**Pré-requisitos:**
- Node.js (preferencialmente versão LTS)
- npm ou yarn

**Passo a passo:**
1. Clone este repositório no seu computador local.
2. No diretório raiz (`/BlockForge`), instale as dependências:
   ```bash
   npm install
   ```
3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Navegue até o host que ele retornar (geralmente `http://localhost:5173/`).

---

## 🔮 Funcionalidades e Escopo Futuro

Como o projeto encontra-se na fase de MVP para validação (arquivos principais de "Histórias de Usuário" concluídos), existem recursos pendentes para serem implementados nas próximas iterações:
- Contas e limite de blocos vinculados pra versão "Free" vs "Pro".
- Mover/arrastar os blocos soltos e selecionados ("Mover seleção").
- Ferramenta de conta-gotas e exportação do Mundo inteiro (Share World).
- API em Cloudinary com login (bancos relacionais invés de apenas `LocalStorage`).

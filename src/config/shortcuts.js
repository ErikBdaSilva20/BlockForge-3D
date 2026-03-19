// Central registry of all keyboard/mouse shortcuts
// Edit this file to change any command across the entire app

export const SHORTCUTS = [
  { keys: 'Clique Esquerdo', action: 'Colocar bloco', category: 'Construção' },
  { keys: '🧼 Borracha (Botão)', action: 'Modo remoção rápida (Clique remove)', category: 'Construção' },
  { keys: 'Shift + Alt + Clique', action: 'Remover bloco (Clássico)', category: 'Construção' },
  { keys: 'Ctrl + Z', action: 'Desfazer', category: 'Edição' },
  { keys: 'Ctrl + Y', action: 'Refazer', category: 'Edição' },
  { keys: 'Ctrl + Shift + Z', action: 'Refazer (alternativo)', category: 'Edição' },
  { keys: 'Delete / Backspace', action: 'Apagar blocos selecionados', category: 'Edição' },
  { keys: 'Botão Direito', action: 'Girar câmera', category: 'Câmera' },
  { keys: 'Botão do Meio', action: 'Mover câmera (Pan)', category: 'Câmera' },
  { keys: 'Scroll', action: 'Zoom', category: 'Câmera' },
  { keys: 'Ctrl + Clique', action: 'Multi-selecionar bloco', category: 'Seleção' },
  { keys: 'Shift + Clique', action: 'Multi-selecionar bloco', category: 'Seleção' },
  { keys: 'Segurar Shift + Arrastar', action: 'Selecionar vários blocos em caixa (Área)', category: 'Seleção' },
  { keys: 'Modo Selecionar (Pincel)', action: 'Selecionar blocos arrastando o mouse', category: 'Pincel' },
  { keys: 'Clique no chão', action: 'Limpar seleção', category: 'Seleção' },
  { keys: 'Arrastar da Sidebar', action: 'Drag & Drop de bloco', category: 'Construção' },
  { keys: 'Scroll (Pincel)', action: 'Mudar camada/tamanho da parede', category: 'Pincel' },
  { keys: 'Segurar + Arrastar (Pincel)', action: 'Marcar área horizontal ou vertical', category: 'Pincel' },
];

export const SHORTCUT_CATEGORIES = ['Construção', 'Edição', 'Câmera', 'Seleção', 'Pincel'];

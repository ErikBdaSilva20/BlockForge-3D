// Central registry of all keyboard/mouse shortcuts
// Edit this file to change any command across the entire app

export const SHORTCUTS = [
  { keys: 'Clique Esquerdo', action: 'Colocar bloco', category: 'Construção' },
  { keys: 'Shift + Alt + Clique', action: 'Remover bloco', category: 'Construção' },
  { keys: 'Ctrl + Z', action: 'Desfazer', category: 'Edição' },
  { keys: 'Ctrl + Y', action: 'Refazer', category: 'Edição' },
  { keys: 'Ctrl + Shift + Z', action: 'Refazer (alternativo)', category: 'Edição' },
  { keys: 'Botão Direito', action: 'Girar câmera', category: 'Câmera' },
  { keys: 'Botão do Meio', action: 'Mover câmera (Pan)', category: 'Câmera' },
  { keys: 'Scroll', action: 'Zoom', category: 'Câmera' },
  { keys: 'Ctrl + Clique', action: 'Multi-selecionar bloco', category: 'Seleção' },
  { keys: 'Shift + Clique', action: 'Multi-selecionar bloco', category: 'Seleção' },
  { keys: 'Clique no chão', action: 'Limpar seleção', category: 'Seleção' },
  { keys: 'Arrastar da Sidebar', action: 'Drag & Drop de bloco', category: 'Construção' },
  { keys: 'Scroll (Pincel)', action: 'Mudar camada', category: 'Pincel' },
  { keys: 'Segurar + Arrastar (Pincel)', action: 'Marcar área', category: 'Pincel' },
];

export const SHORTCUT_CATEGORIES = ['Construção', 'Edição', 'Câmera', 'Seleção', 'Pincel'];

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { isInsideWorld } from '../utils/math/isInsideWorld';

export const useBlockStore = create((set) => ({
  blocks: [], // { id, position: [x, y, z], type }
  selectedBlockType: 'wood',
  isDragging: false,
  draggedType: null,

  addBlock: (position, type) => {
    if (!isInsideWorld(position)) return;
    
    set((state) => {
      const exists = state.blocks.find(
        (b) => b.position[0] === position[0] && 
               b.position[1] === position[1] && 
               b.position[2] === position[2]
      );
      if (exists) return state;

      return {
        blocks: [...state.blocks, { id: uuidv4(), position, type }]
      };
    });
  },

  removeBlock: (id) => set((state) => ({
    blocks: state.blocks.filter((b) => b.id !== id)
  })),

  setSelectedBlockType: (type) => set({ selectedBlockType: type }),
  startDrag: (type) => set({ isDragging: true, draggedType: type }),
  stopDrag: () => set({ isDragging: false, draggedType: null }),
}));

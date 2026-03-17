import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { isInsideWorld } from '../utils/math/isInsideWorld';
import { FALLBACK_BLOCKS } from '../config/blockTypes';
import { fetchMinecraftBlocks } from '../services/minecraftService';
import { adaptMinecraftBlocks } from '../adapters/minecraftAdapter';

export const useBlockStore = create((set, get) => ({
  blocks: [], // { id, position: [x, y, z], type }
  availableBlocks: FALLBACK_BLOCKS,
  selectedBlockType: FALLBACK_BLOCKS[0].id,
  currentPlan: 'free',
  
  isDragging: false,
  draggedType: null,
  isBuilding: false,

  setBlocks: (newBlocks) => set({ blocks: newBlocks }),

  loadBlocksFromAPI: async () => {
    try {
      const data = await fetchMinecraftBlocks();
      const adapted = adaptMinecraftBlocks(data);
      set({ availableBlocks: adapted, selectedBlockType: adapted[0].id });
    } catch (e) {
      console.warn('Failed to load blocks from API, using fallback', e);
    }
  },

  addBlock: (position, type) => {
    if (!isInsideWorld(position, get().currentPlan)) return;
    
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

  startBuilding: () => set({ isBuilding: true }),
  stopBuilding: () => set({ isBuilding: false }),
}));

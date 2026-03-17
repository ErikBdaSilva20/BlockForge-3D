import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { isInsideWorld } from '../utils/math/isInsideWorld';
import { FALLBACK_BLOCKS } from '../config/blockTypes';
import { fetchMinecraftBlocks } from '../services/minecraftService';
import { adaptMinecraftBlocks } from '../adapters/minecraftAdapter';

export const useBlockStore = create((set, get) => ({
  // History State
  past: [],
  blocks: [], // Present state: { id, position: [x, y, z], type }
  future: [],
  
  // Selection State
  selectedBlocksIDs: [], 

  // UI State
  availableBlocks: FALLBACK_BLOCKS,
  selectedBlockType: FALLBACK_BLOCKS[0].id,
  currentPlan: 'free',
  isDragging: false,
  draggedType: null,
  shadowsEnabled: false,

  // History Methods
  _pushHistory: (newBlocks) => {
    const { blocks, past } = get();
    // Keep max 50 history steps
    const newPast = [...past, blocks].slice(-50);
    set({ past: newPast, blocks: newBlocks, future: [], selectedBlocksIDs: [] });
  },

  undo: () => {
    const { past, blocks, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    set({ past: newPast, blocks: previous, future: [blocks, ...future], selectedBlocksIDs: [] });
  },

  redo: () => {
    const { past, blocks, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    set({ past: [...past, blocks], blocks: next, future: newFuture, selectedBlocksIDs: [] });
  },

  // Block Manipulation
  setBlocks: (newBlocks) => set({ blocks: newBlocks, past: [], future: [], selectedBlocksIDs: [] }),

  loadBlocksFromAPI: async () => {
    try {
      const data = await fetchMinecraftBlocks();
      const adapted = adaptMinecraftBlocks(data);
      set({ availableBlocks: adapted, selectedBlockType: adapted[0].id });
    } catch (e) {
      console.warn('Failed to load blocks from API, using fallback', e);
    }
  },

  addCustomBlockType: (block) => {
    set((state) => ({
      availableBlocks: [...state.availableBlocks, block]
    }));
  },

  addBlock: (position, type) => {
    if (!isInsideWorld(position, get().currentPlan)) return;
    
    const { blocks } = get();
    const exists = blocks.find(
      (b) => b.position[0] === position[0] && 
             b.position[1] === position[1] && 
             b.position[2] === position[2]
    );
    if (exists) return;

    const newBlocks = [...blocks, { id: uuidv4(), position, type }];
    get()._pushHistory(newBlocks);
  },

  removeBlock: (id) => {
    const { blocks } = get();
    const newBlocks = blocks.filter((b) => b.id !== id);
    get()._pushHistory(newBlocks);
  },

  // Selection
  selectBlock: (id, multi) => set((state) => {
    if (multi) {
      if (state.selectedBlocksIDs.includes(id)) {
        return { selectedBlocksIDs: state.selectedBlocksIDs.filter(v => v !== id) };
      }
      return { selectedBlocksIDs: [...state.selectedBlocksIDs, id] };
    }
    return { selectedBlocksIDs: [id] };
  }),
  
  clearSelection: () => set({ selectedBlocksIDs: [] }),

  // UI Actions
  setSelectedBlockType: (type) => set({ selectedBlockType: type }),
  startDrag: (type) => set({ isDragging: true, draggedType: type }),
  stopDrag: () => set({ isDragging: false, draggedType: null }),
  toggleShadows: () => set((state) => ({ shadowsEnabled: !state.shadowsEnabled })),
}));

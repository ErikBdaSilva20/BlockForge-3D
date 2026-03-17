import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { FALLBACK_BLOCKS } from '../config/blockTypes';
import { fetchMinecraftBlocks } from '../services/minecraftService';
import { adaptMinecraftBlocks } from '../adapters/minecraftAdapter';
import { WORLD_SIZES } from '../utils/constants/worldSizes';

function isInsideWorldDynamic(position, worldSize) {
  const [x, y, z] = position;
  const halfW = worldSize.width / 2;
  const halfD = worldSize.depth / 2;
  return (
    x >= -halfW && x <= halfW &&
    y >= 0 && y <= worldSize.height &&
    z >= -halfD && z <= halfD
  );
}

export const useBlockStore = create((set, get) => ({
  // History State
  past: [],
  blocks: [],
  future: [],
  
  // Selection State
  selectedBlocksIDs: [], 

  // UI State
  availableBlocks: FALLBACK_BLOCKS,
  selectedBlockType: FALLBACK_BLOCKS[0].id,
  isDragging: false,
  draggedType: null,
  shadowsEnabled: false,
  showWorldBounds: true,
  worldSize: WORLD_SIZES[1],

  // Brush Mode
  brushMode: false,
  brushLayer: 0,
  brushMarks: [], // array of [x, y, z]

  // History Methods
  _pushHistory: (newBlocks) => {
    const { blocks, past } = get();
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
    const ws = get().worldSize;
    if (!isInsideWorldDynamic(position, ws)) return;
    
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

  clearAllBlocks: () => {
    get()._pushHistory([]);
  },

  // Returns the number of blocks that would be out of bounds for a given size
  getOutOfBoundsCount: (sizeId) => {
    const size = WORLD_SIZES.find(s => s.id === sizeId);
    if (!size) return 0;
    const { blocks } = get();
    return blocks.filter(b => !isInsideWorldDynamic(b.position, size)).length;
  },

  // Sets new world size, optionally trimming out-of-bounds blocks
  setWorldSize: (sizeId, trimBlocks = false) => {
    const size = WORLD_SIZES.find(s => s.id === sizeId);
    if (!size) return;
    if (trimBlocks) {
      const { blocks } = get();
      const kept = blocks.filter(b => isInsideWorldDynamic(b.position, size));
      get()._pushHistory(kept);
    }
    set({ worldSize: size });
  },

  // UI Actions
  setSelectedBlockType: (type) => set({ selectedBlockType: type }),
  startDrag: (type) => set({ isDragging: true, draggedType: type }),
  stopDrag: () => set({ isDragging: false, draggedType: null }),
  toggleShadows: () => set((state) => ({ shadowsEnabled: !state.shadowsEnabled })),
  toggleWorldBounds: () => set((state) => ({ showWorldBounds: !state.showWorldBounds })),

  // Brush Mode Actions
  toggleBrushMode: () => set((state) => ({
    brushMode: !state.brushMode,
    brushMarks: [],
    brushLayer: 0,
  })),

  setBrushLayer: (y) => {
    const ws = get().worldSize;
    const clamped = Math.max(0, Math.min(y, ws.height));
    set({ brushLayer: clamped });
  },

  addBrushMark: (position) => {
    const ws = get().worldSize;
    if (!isInsideWorldDynamic(position, ws)) return;
    set((state) => {
      const key = position.join(',');
      const exists = state.brushMarks.some(m => m.join(',') === key);
      if (exists) return state;
      return { brushMarks: [...state.brushMarks, position] };
    });
  },

  removeBrushMark: (position) => {
    const key = position.join(',');
    set((state) => ({
      brushMarks: state.brushMarks.filter(m => m.join(',') !== key)
    }));
  },

  confirmBrushMarks: () => {
    const { brushMarks, selectedBlockType, blocks, worldSize } = get();
    if (brushMarks.length === 0) return;
    
    const newBlocks = [...blocks];
    for (const pos of brushMarks) {
      if (!isInsideWorldDynamic(pos, worldSize)) continue;
      const exists = newBlocks.find(
        b => b.position[0] === pos[0] && b.position[1] === pos[1] && b.position[2] === pos[2]
      );
      if (!exists) {
        newBlocks.push({ id: uuidv4(), position: pos, type: selectedBlockType });
      }
    }
    get()._pushHistory(newBlocks);
    set({ brushMarks: [] });
  },

  clearBrushMarks: () => set({ brushMarks: [] }),
}));

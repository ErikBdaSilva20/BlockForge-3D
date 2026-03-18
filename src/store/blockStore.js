import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { FALLBACK_BLOCKS } from '../config/blockTypes';
import { fetchMinecraftBlocks } from '../services/minecraftApi';
import { adaptMinecraftBlocks } from '../adapters/blockAdapter';
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
  isSelectingArea: false,
  selectionStartPos: null,
  selectionCurrentPos: null,

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
  brushMarks: [],
  brushDirection: 'x', // 'x' or 'z'
  brushType: 'add', // 'add' or 'remove'
  brushOrientation: 'horizontal', // 'horizontal' or 'vertical'

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
      if (adapted && adapted.length > 0) {
        set({ availableBlocks: adapted, selectedBlockType: adapted[0].id });
      }
    } catch (e) {
      console.error('Failed to load blocks from API', e);
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
  
  clearSelection: () => set({ selectedBlocksIDs: [], isSelectingArea: false, selectionStartPos: null, selectionCurrentPos: null }),

  startAreaSelection: (pos) => set({ isSelectingArea: true, selectionStartPos: pos, selectionCurrentPos: pos, selectedBlocksIDs: [] }),
  updateAreaSelection: (pos) => set((state) => {
    if (!state.isSelectingArea || !state.selectionStartPos) return state;
    
    // Calculate bounding box between start and current pos
    const [x1, y1, z1] = state.selectionStartPos;
    const [x2, y2, z2] = pos;
    const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
    const minZ = Math.min(z1, z2), maxZ = Math.max(z1, z2);

    const selectedIds = state.blocks
      .filter(b => 
        b.position[0] >= minX && b.position[0] <= maxX &&
        b.position[1] >= minY && b.position[1] <= maxY &&
        b.position[2] >= minZ && b.position[2] <= maxZ
      )
      .map(b => b.id);

    return { selectionCurrentPos: pos, selectedBlocksIDs: selectedIds };
  }),
  stopAreaSelection: () => set({ isSelectingArea: false, selectionStartPos: null, selectionCurrentPos: null }),

  deleteSelectedBlocks: () => {
    const { blocks, selectedBlocksIDs } = get();
    if (selectedBlocksIDs.length === 0) return;
    const newBlocks = blocks.filter(b => !selectedBlocksIDs.includes(b.id));
    get()._pushHistory(newBlocks);
  },

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
    brushLayer: 1,
    brushDirection: 'x',
    brushType: 'add',
    brushOrientation: 'horizontal'
  })),

  setBrushOrientation: (orientation) => set({ brushOrientation: orientation }),

  setBrushDirection: (dir) => set({ brushDirection: dir }),
  setBrushType: (type) => set({ brushType: type }),

  setBrushLayer: (y) => {
    const ws = get().worldSize;
    // Camada mínima 1 para não colocar blocos na camada 0
    const clamped = Math.max(1, Math.min(y, ws.height));
    set({ brushLayer: clamped });
  },

  addBrushMark: (position) => {
    const ws = get().worldSize;
    if (!isInsideWorldDynamic(position, ws)) return;
    
    const { blocks, brushType, brushLayer, brushDirection, brushMarks, brushOrientation } = get();
    
    let linePositions = [];
    const [x, startY, z] = position;

    if (brushOrientation === 'vertical') {
      // Modo VERTICAL: constrói ou remove uma coluna do chão (1) até o brushLayer nessa posição X/Z
      const minY = 1;
      const maxY = brushLayer;
      for (let y = minY; y <= maxY; y++) {
        if (y > ws.height || y < 1) continue;
        linePositions.push([x, y, z]);
      }
    } else {
      // Modo HORIZONTAL
      if (brushType === 'add') {
        // Coloca bloco na camada definida pelo brushLayer
        if (brushLayer >= 1 && brushLayer <= ws.height) {
          linePositions.push([x, brushLayer, z]);
        }
      } else {
        // Se for remove, marca a posição atingida pelo raycast
        // Em brush de pintura mista, remove foca apenas no bloco da camada do brushLayer
        linePositions.push([x, brushLayer, z]);
      }
    }

    set((state) => {
      let newMarks = [...state.brushMarks];
      linePositions.forEach(pos => {
         const key = pos.join(',');
         // Don't mark where a block already exists if adding
         const blockExists = blocks.some(b => b.position[0] === pos[0] && b.position[1] === pos[1] && b.position[2] === pos[2]);
         
         if (brushType === 'add' && blockExists) return;
         if (brushType === 'remove' && !blockExists) return;
         
         if (!newMarks.some(m => m.join(',') === key)) {
           newMarks.push(pos);
         }
      });
      return { brushMarks: newMarks };
    });
  },

  removeBrushMark: (position) => {
    const key = position.join(',');
    set((state) => ({
      brushMarks: state.brushMarks.filter(m => m.join(',') !== key)
    }));
  },

  confirmBrushMarks: () => {
    const { brushMarks, selectedBlockType, brushType, blocks, worldSize } = get();
    if (brushMarks.length === 0) return;
    
    let newBlocks = [...blocks];
    
    if (brushType === 'add') {
      for (const pos of brushMarks) {
        if (!isInsideWorldDynamic(pos, worldSize)) continue;
        const exists = newBlocks.find(
          b => b.position[0] === pos[0] && b.position[1] === pos[1] && b.position[2] === pos[2]
        );
        if (!exists) {
          newBlocks.push({ id: uuidv4(), position: pos, type: selectedBlockType });
        }
      }
    } else if (brushType === 'remove') {
      const markKeys = new Set(brushMarks.map(pos => pos.join(',')));
      newBlocks = blocks.filter(b => !markKeys.has(b.position.join(',')));
    }
    
    get()._pushHistory(newBlocks);
    set({ brushMarks: [] });
  },

  clearBrushMarks: () => set({ brushMarks: [] }),
}));

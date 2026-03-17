import { create } from 'zustand';

export const useSceneStore = create((set) => ({
  rotation: [Math.PI / 8, Math.PI / 4, 0],
  position: [0, 0, 0],
  scale: 1,
  setRotation: (r) => set({ rotation: r }),
  setPosition: (p) => set({ position: p }),
  setScale: (s) => set({ scale: s }),
}));

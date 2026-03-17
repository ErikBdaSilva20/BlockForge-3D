import React, { useEffect } from 'react';
import Scene from '../components/scene/Scene';
import Sidebar from '../components/ui/Sidebar/Sidebar';
import { useBlockStore } from '../store/blockStore';

export default function Editor() {
  useEffect(() => {
    // Carregar blocos da API
    useBlockStore.getState().loadBlocksFromAPI();

    const handleBeforeUnload = (e) => {
      const state = useBlockStore.getState();
      if (state.blocks.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    const handleKeyDown = (e) => {
      // Undo (Ctrl+Z or Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          useBlockStore.getState().redo(); // Ctrl+Shift+Z for redo
        } else {
          useBlockStore.getState().undo();
        }
      }
      // Redo (Ctrl+Y or Cmd+Y)
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        useBlockStore.getState().redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Sidebar />
      <div style={{ flex: 1, position: 'relative' }}>
        <Scene />
      </div>
    </div>
  );
}

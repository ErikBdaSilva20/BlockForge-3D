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
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
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

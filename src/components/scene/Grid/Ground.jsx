import React from 'react';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';

export default function Ground() {
  const { isDragging, addBlock, selectedBlockType, worldSize, clearSelection, brushMode, isEraseMode } = useBlockStore();

  const isInsideDynamic = (pos) => {
    const [x, y, z] = pos;
    const halfW = worldSize.width / 2;
    const halfD = worldSize.depth / 2;
    return x >= -halfW && x <= halfW && y >= 0 && y <= worldSize.height && z >= -halfD && z <= halfD;
  };

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.01, 0]} 
      userData={{ isTarget: true }}
      onPointerDown={(e) => {
        if (brushMode || isEraseMode) return;
        if (e.button !== 0 || isDragging) return;
        if (e.shiftKey) {
          const p = e.point.clone();
          const pos = snapToGrid([p.x, 0, p.z]);
          if (isInsideDynamic(pos)) {
            useBlockStore.getState().startAreaSelection(pos);
          }
          return;
        }
      }}
      onClick={(e) => {
        if (brushMode || isEraseMode) return;
        if (e.button !== 0 || isDragging) return;
        if (useBlockStore.getState().isSelectingArea) return;
        if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
        e.stopPropagation();
        
        clearSelection();

        const p = e.point.clone();
        const pos = [p.x, 0, p.z];
        const snapped = snapToGrid(pos);
        if (isInsideDynamic(snapped)) {
          addBlock(snapped, selectedBlockType);
        }
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
  );
}

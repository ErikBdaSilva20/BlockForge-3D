import React from 'react';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';
import { isInsideWorld } from '../../../utils/math/isInsideWorld';

export default function Ground() {
  const { isDragging, addBlock, selectedBlockType, startBuilding, currentPlan, clearSelection } = useBlockStore();

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.01, 0]} 
      userData={{ isTarget: true, isGround: true }}
      onClick={(e) => {
        if (e.button !== 0 || e.altKey || isDragging) return;
        if (e.shiftKey || e.ctrlKey || e.metaKey) return;
        e.stopPropagation();
        
        clearSelection();

        const p = e.point.clone();
        const pos = [p.x, 0, p.z];
        const snapped = snapToGrid(pos);
        if (isInsideWorld(snapped, currentPlan)) {
          addBlock(snapped, selectedBlockType);
        }
      }}
      onPointerDown={(e) => {
        if (e.button !== 0 || e.altKey || isDragging) return;
        if (e.shiftKey || e.ctrlKey || e.metaKey) return;
        e.stopPropagation();
        startBuilding();
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
  );
}

import React from 'react';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';
import { isInsideWorld } from '../../../utils/math/isInsideWorld';

export default function Ground() {
  const { isDragging, addBlock, selectedBlockType, startBuilding, currentPlan } = useBlockStore();

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.01, 0]} 
      receiveShadow
      userData={{ isTarget: true, isGround: true }}
      onPointerDown={(e) => {
        if (e.button !== 0 || e.altKey || isDragging) return;
        if (e.shiftKey) return;
        e.stopPropagation();
        
        startBuilding();

        const p = e.point.clone();
        const pos = [p.x, 0, p.z];
        const snapped = snapToGrid(pos);
        if (isInsideWorld(snapped, currentPlan)) {
          addBlock(snapped, selectedBlockType);
        }
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
}

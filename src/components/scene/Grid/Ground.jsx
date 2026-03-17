import React from 'react';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';
import { isInsideWorld } from '../../../utils/math/isInsideWorld';

export default function Ground() {
  const { isDragging, addBlock, selectedBlockType, startBuilding, setLastBuiltPos } = useBlockStore();

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.01, 0]} 
      receiveShadow
      userData={{ isTarget: true, isGround: true }}
      onPointerDown={(e) => {
        if (e.button !== 0 || e.altKey || isDragging) return;
        e.stopPropagation();
        
        startBuilding();

        const p = e.object.parent.worldToLocal(e.point.clone());
        const pos = [p.x, 0, p.z];
        const snapped = snapToGrid(pos);
        if (isInsideWorld(snapped)) {
          addBlock(snapped, selectedBlockType);
          setLastBuiltPos(snapped.join(','));
        }
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
}

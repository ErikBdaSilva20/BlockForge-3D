import React from 'react';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';
import { isInsideWorld } from '../../../utils/math/isInsideWorld';

export default function Ground() {
  const { isDragging, addBlock, selectedBlockType } = useBlockStore();

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.01, 0]} 
      receiveShadow
      userData={{ isTarget: true, isGround: true }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDragging) {
          const p = [e.point.x, 0, e.point.z];
          const snapped = snapToGrid(p);
          if (isInsideWorld(snapped)) {
            addBlock(snapped, selectedBlockType);
          }
        }
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
}

import React from 'react';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';

const COLORS = {
  wood: '#8B5A2B',
  stone: '#888888',
  grass: '#556B2F',
  glass: '#ADD8E6',
};

export default function Block({ id, position, type }) {
  const { addBlock, selectedBlockType, isDragging } = useBlockStore();

  return (
    <mesh 
      position={position} 
      castShadow 
      receiveShadow 
      userData={{ isTarget: true, isBlock: true, id, type }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDragging) {
          const p = [
            position[0] + e.face.normal.x,
            position[1] + e.face.normal.y,
            position[2] + e.face.normal.z,
          ];
          const snapped = snapToGrid(p);
          addBlock(snapped, selectedBlockType);
        }
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={COLORS[type] || COLORS.wood} 
        transparent={type === 'glass'}
        opacity={type === 'glass' ? 0.6 : 1}
      />
    </mesh>
  );
}

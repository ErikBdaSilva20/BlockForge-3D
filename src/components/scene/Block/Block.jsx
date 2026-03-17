import React, { useState } from 'react';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';
import { isInsideWorld } from '../../../utils/math/isInsideWorld';

const COLORS = {
  wood: '#8B5A2B',
  stone: '#888888',
  grass: '#556B2F',
  glass: '#ADD8E6',
};

export default function Block({ id, position, type }) {
  const { addBlock, removeBlock, selectedBlockType, isDragging, startBuilding } = useBlockStore();
  const [hovered, setHovered] = useState(false);

  return (
    <mesh 
      position={position} 
      castShadow 
      receiveShadow 
      userData={{ isTarget: true, isBlock: true, id, type }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onPointerDown={(e) => {
        // Allow OrbitControls to handle right and middle clicks
        if (e.button === 2 || e.button === 1) return;
        
        e.stopPropagation();
        
        // Remove block on Shift + Left Click
        if (e.button === 0 && e.shiftKey) {
           removeBlock(id);
           return;
        }

        // Add block on left click
        if (e.button === 0 && !e.altKey && !isDragging) {
          startBuilding();
          const p = [
            position[0] + e.face.normal.x,
            position[1] + e.face.normal.y,
            position[2] + e.face.normal.z,
          ];
          const snapped = snapToGrid(p);
          if (isInsideWorld(snapped)) {
            addBlock(snapped, selectedBlockType);
          }
        }
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={COLORS[type] || COLORS.wood} 
        transparent={type === 'glass'}
        opacity={type === 'glass' ? 0.6 : 1}
        emissive={hovered ? 'red' : 'black'}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
    </mesh>
  );
}

import React, { useState, useEffect } from 'react';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';
import { isInsideWorld } from '../../../utils/math/isInsideWorld';
import { getTexture } from '../../../utils/graphics/textureCache';

export default function Block({ id, position, type }) {
  const { addBlock, removeBlock, selectedBlockType, isDragging, startBuilding, availableBlocks, currentPlan } = useBlockStore();
  const [hovered, setHovered] = useState(false);
  const [map, setMap] = useState(null);

  const blockConfig = availableBlocks.find((b) => b.id === type);

  useEffect(() => {
    if (blockConfig?.texture) {
      getTexture(blockConfig.texture, (tex) => setMap(tex));
    } else {
      setMap(null);
    }
  }, [blockConfig?.texture]);

  // Transparent blocks fallback matching logic
  const isTransparent = type === 'mc:glass' || type === 'glass';

  return (
    <mesh 
      position={position} 
      castShadow 
      receiveShadow 
      userData={{ isTarget: true, isBlock: true, id, type }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onPointerDown={(e) => {
        if (e.button === 2 || e.button === 1) return;
        
        e.stopPropagation();
        
        if (e.button === 0 && e.shiftKey) {
           removeBlock(id);
           return;
        }

        if (e.button === 0 && !e.altKey && !isDragging) {
          startBuilding();
          const p = [
            position[0] + e.face.normal.x,
            position[1] + e.face.normal.y,
            position[2] + e.face.normal.z,
          ];
          const snapped = snapToGrid(p);
          if (isInsideWorld(snapped, currentPlan)) {
            addBlock(snapped, selectedBlockType);
          }
        }
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={map ? '#ffffff' : (blockConfig?.color || '#cccccc')}
        map={map}
        transparent={isTransparent}
        opacity={isTransparent ? 0.6 : 1}
        emissive={hovered ? 'red' : 'black'}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
    </mesh>
  );
}

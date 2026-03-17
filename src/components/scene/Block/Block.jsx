import React, { useState, useEffect, memo } from 'react';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';
import { isInsideWorld } from '../../../utils/math/isInsideWorld';
import { getTexture } from '../../../utils/graphics/textureCache';

const Block = memo(({ id, position, type }) => {
  const { addBlock, removeBlock, selectedBlockType, isDragging, startBuilding, availableBlocks, currentPlan, selectedBlocksIDs, selectBlock } = useBlockStore();
  const [hovered, setHovered] = useState(false);
  const [map, setMap] = useState(null);

  const blockConfig = availableBlocks.find((b) => b.id === type);
  const isSelected = selectedBlocksIDs.includes(id);

  useEffect(() => {
    if (blockConfig?.texture) {
      getTexture(blockConfig.texture, (tex) => setMap(tex));
    } else {
      setMap(null);
    }
  }, [blockConfig?.texture]);

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
        
        // Remove block on Shift + Left Click
        if (e.button === 0 && e.shiftKey && e.altKey) {
           removeBlock(id);
           return;
        }
        
        // Select Block on Ctrl/Cmd + Left Click (or shift without alt)
        if (e.button === 0 && (e.ctrlKey || e.metaKey || e.shiftKey)) {
          selectBlock(id, true);
          return;
        }

        // Add block on left click
        if (e.button === 0 && !e.altKey && !isDragging) {
          selectBlock(id, false); // Single select
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
        color={isSelected ? '#aaddff' : (map ? '#ffffff' : (blockConfig?.color || '#cccccc'))}
        map={map}
        transparent={isTransparent}
        opacity={isTransparent ? 0.6 : 1}
        emissive={isSelected ? '#0055ff' : (hovered ? 'white' : 'black')}
        emissiveIntensity={isSelected ? 0.5 : (hovered ? 0.2 : 0)}
      />
    </mesh>
  );
});

export default Block;

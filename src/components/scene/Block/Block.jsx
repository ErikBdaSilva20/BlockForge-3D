import React, { useState, useEffect, memo } from 'react';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';
import { getTexture } from '../../../utils/graphics/textureCache';

const Block = memo(({ id, position, type }) => {
  const { addBlock, removeBlock, selectedBlockType, isDragging, availableBlocks, worldSize, selectedBlocksIDs, selectBlock, shadowsEnabled } = useBlockStore();
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

  const isInsideDynamic = (pos) => {
    const [x, y, z] = pos;
    const halfW = worldSize.width / 2;
    const halfD = worldSize.depth / 2;
    return x >= -halfW && x <= halfW && y >= 0 && y <= worldSize.height && z >= -halfD && z <= halfD;
  };

  return (
    <mesh 
      position={position} 
      castShadow={shadowsEnabled}
      receiveShadow={shadowsEnabled}
      userData={{ isTarget: true, isBlock: true, id, type }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onClick={(e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        
        if (e.shiftKey && e.altKey) {
           removeBlock(id);
           return;
        }
        
        if (e.ctrlKey || e.metaKey || e.shiftKey) {
          selectBlock(id, true);
          return;
        }

        if (!e.altKey && !isDragging) {
          selectBlock(id, false);
          const p = [
            position[0] + e.face.normal.x,
            position[1] + e.face.normal.y,
            position[2] + e.face.normal.z,
          ];
          const snapped = snapToGrid(p);
          if (isInsideDynamic(snapped)) {
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

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useBlockStore } from '../../../store/blockStore';

export default function WorldBoundsBox() {
  const showWorldBounds = useBlockStore((state) => state.showWorldBounds);
  const worldSize = useBlockStore((state) => state.worldSize);

  const geometry = useMemo(() => {
    const box = new THREE.BoxGeometry(worldSize.width, worldSize.height, worldSize.depth);
    return new THREE.EdgesGeometry(box);
  }, [worldSize.width, worldSize.height, worldSize.depth]);

  if (!showWorldBounds) return null;

  return (
    <lineSegments position={[0, worldSize.height / 2, 0]} geometry={geometry}>
      <lineBasicMaterial color="#00e5ff" transparent opacity={0.6} />
    </lineSegments>
  );
}

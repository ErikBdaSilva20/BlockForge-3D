import React, { useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';

export default function BrushOverlay() {
  const { brushMode, brushLayer, brushMarks, addBrushMark, worldSize } = useBlockStore();
  const isPaintingRef = useRef(false);
  const layerMeshRef = useRef();
  
  const { raycaster, camera, pointer, scene } = useThree();

  useFrame(() => {
    if (!brushMode || !isPaintingRef.current) return;

    raycaster.setFromCamera(pointer, camera);
    
    // Raycast against the invisible layer plane
    const planeY = brushLayer;
    const origin = raycaster.ray.origin;
    const direction = raycaster.ray.direction;
    
    // Simple plane intersection at Y = planeY
    if (direction.y === 0) return;
    const t = (planeY - origin.y) / direction.y;
    if (t < 0) return;
    
    const hitX = origin.x + direction.x * t;
    const hitZ = origin.z + direction.z * t;
    
    const snapped = snapToGrid([hitX, brushLayer, hitZ]);
    
    // Check bounds
    const halfW = worldSize.width / 2;
    const halfD = worldSize.depth / 2;
    if (snapped[0] >= -halfW && snapped[0] <= halfW && snapped[2] >= -halfD && snapped[2] <= halfD) {
      addBrushMark(snapped);
    }
  });

  const handlePointerDown = useCallback((e) => {
    if (!brushMode || e.button !== 0) return;
    isPaintingRef.current = true;
  }, [brushMode]);

  const handlePointerUp = useCallback(() => {
    isPaintingRef.current = false;
  }, []);

  // Register global listeners for paint tracking
  React.useEffect(() => {
    if (!brushMode) return;
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [brushMode, handlePointerDown, handlePointerUp]);

  if (!brushMode) return null;

  return (
    <group>
      {/* Layer indicator plane */}
      <mesh 
        ref={layerMeshRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, brushLayer + 0.01, 0]}
      >
        <planeGeometry args={[worldSize.width, worldSize.depth]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.04} depthWrite={false} />
      </mesh>

      {/* Render brush marks as ghost blocks */}
      {brushMarks.map((pos, i) => (
        <mesh key={`mark-${i}`} position={[pos[0], pos[1], pos[2]]}>
          <boxGeometry args={[0.96, 0.96, 0.96]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';

export default function GhostBlock() {
  const { isDragging, draggedType, addBlock, worldSize } = useBlockStore();
  const meshRef = useRef();
  const currentPosRef = useRef(null);
  const isValidRef = useRef(false);
  
  const { raycaster, camera, pointer, scene } = useThree();

  const isInsideDynamic = (pos) => {
    const [x, y, z] = pos;
    const halfW = worldSize.width / 2;
    const halfD = worldSize.depth / 2;
    return x >= -halfW && x <= halfW && y >= 0 && y <= worldSize.height && z >= -halfD && z <= halfD;
  };

  useFrame(() => {
    if (!isDragging || !meshRef.current) {
      if (meshRef.current) meshRef.current.visible = false;
      return;
    }
    
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    const hit = intersects.find(i => i.object.userData.isTarget);
    
    if (hit) {
      let p;
      if (hit.object.userData.isBlock) {
        p = [
          hit.object.position.x + hit.face.normal.x,
          hit.object.position.y + hit.face.normal.y,
          hit.object.position.z + hit.face.normal.z,
        ];
      } else {
        p = [hit.point.x, 0, hit.point.z];
      }
      
      const snapped = snapToGrid(p);
      meshRef.current.position.set(...snapped);
      meshRef.current.visible = true;
      currentPosRef.current = snapped;
      
      const valid = isInsideDynamic(snapped);
      isValidRef.current = valid;
      meshRef.current.material.color.set(valid ? 'lime' : 'red');
    } else {
      meshRef.current.visible = false;
      currentPosRef.current = null;
      isValidRef.current = false;
    }
  });

  useEffect(() => {
    const handleUp = () => {
      const state = useBlockStore.getState();
      if (state.isDragging && isValidRef.current && currentPosRef.current) {
        state.addBlock(currentPosRef.current, state.draggedType);
      }
      state.stopDrag();
    };
    
    window.addEventListener('pointerup', handleUp);
    return () => window.removeEventListener('pointerup', handleUp);
  }, []);

  if (!isDragging) return null;

  return (
    <mesh ref={meshRef} name="Ghost" userData={{ isPreview: true }} visible={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial transparent opacity={0.5} />
    </mesh>
  );
}

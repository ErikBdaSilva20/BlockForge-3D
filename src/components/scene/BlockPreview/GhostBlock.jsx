import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';
import { isInsideWorld } from '../../../utils/math/isInsideWorld';

export default function GhostBlock() {
  const { isDragging, draggedType, addBlock } = useBlockStore();
  const meshRef = useRef();
  const currentPosRef = useRef(null);
  const isValidRef = useRef(false);
  
  const { raycaster, camera, pointer, scene } = useThree();

  useFrame(() => {
    if (!isDragging || !meshRef.current) return;
    
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
        p = [hit.point.x, hit.point.y, hit.point.z];
      }
      
      const snapped = snapToGrid(p);
      meshRef.current.position.set(...snapped);
      meshRef.current.visible = true;
      currentPosRef.current = snapped;
      
      const valid = isInsideWorld(snapped);
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
        addBlock(currentPosRef.current, state.draggedType);
      }
    };
    
    window.addEventListener('pointerup', handleUp);
    return () => window.removeEventListener('pointerup', handleUp);
  }, [addBlock]);

  if (!isDragging) return null;

  return (
    <mesh ref={meshRef} name="Ghost" userData={{ isPreview: true }}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial transparent opacity={0.5} />
    </mesh>
  );
}

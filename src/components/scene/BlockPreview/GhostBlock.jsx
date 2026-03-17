import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';
import { isInsideWorld } from '../../../utils/math/isInsideWorld';

export default function GhostBlock() {
  const { isDragging, isBuilding, draggedType, selectedBlockType, addBlock, currentPlan } = useBlockStore();
  const meshRef = useRef();
  const currentPosRef = useRef(null);
  const isValidRef = useRef(false);
  const localLastBuiltRef = useRef(null);
  const frameSkipRef = useRef(0);
  
  const { raycaster, camera, pointer, scene } = useThree();

  const activeType = isDragging ? draggedType : selectedBlockType;
  const isHandlingPreview = isDragging || isBuilding;

  useFrame(() => {
    if (!isHandlingPreview || !meshRef.current) {
      if (meshRef.current) meshRef.current.visible = false;
      return;
    }

    // Throttle: only process every 3rd frame during continuous build
    if (isBuilding) {
      frameSkipRef.current++;
      if (frameSkipRef.current % 3 !== 0) return;
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
      meshRef.current.visible = isDragging;
      currentPosRef.current = snapped;
      
      const valid = isInsideWorld(snapped, currentPlan);
      isValidRef.current = valid;
      meshRef.current.material.color.set(valid ? 'lime' : 'red');

      if (isBuilding && valid) {
         const posKey = snapped.join(',');
         if (posKey !== localLastBuiltRef.current) {
             addBlock(snapped, activeType);
             localLastBuiltRef.current = posKey;
         }
      }
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
      state.stopBuilding();
      localLastBuiltRef.current = null;
      frameSkipRef.current = 0;
    };
    
    window.addEventListener('pointerup', handleUp);
    return () => window.removeEventListener('pointerup', handleUp);
  }, []);

  return (
    <mesh ref={meshRef} name="Ghost" userData={{ isPreview: true }} visible={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial transparent opacity={0.5} />
    </mesh>
  );
}

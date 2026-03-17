import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';
import { isInsideWorld } from '../../../utils/math/isInsideWorld';

export default function GhostBlock() {
  const { isDragging, isBuilding, draggedType, selectedBlockType, addBlock, lastBuiltPos, setLastBuiltPos, stopBuilding, stopDrag } = useBlockStore();
  const meshRef = useRef();
  const currentPosRef = useRef(null);
  const isValidRef = useRef(false);
  
  const { raycaster, camera, pointer, scene } = useThree();

  const activeType = isDragging ? draggedType : selectedBlockType;
  const isHandlingPreview = isDragging || isBuilding;

  useFrame(() => {
    if (!isHandlingPreview || !meshRef.current) {
      if (meshRef.current) meshRef.current.visible = false;
      return;
    }
    
    raycaster.setFromCamera(pointer, camera);
    const worldGroup = scene.getObjectByName('WorldGroup');
    if (!worldGroup) return;

    const intersects = raycaster.intersectObject(worldGroup, true);
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
        const localPoint = worldGroup.worldToLocal(hit.point.clone());
        p = [localPoint.x, 0, localPoint.z];
      }
      
      const snapped = snapToGrid(p);
      meshRef.current.position.set(...snapped);
      meshRef.current.visible = isDragging; // only show ghost block if dragging explicitly
      currentPosRef.current = snapped;
      
      const valid = isInsideWorld(snapped);
      isValidRef.current = valid;
      meshRef.current.material.color.set(valid ? 'lime' : 'red');

      // Add block logic for continuous building
      if (isBuilding && valid) {
         const posKey = snapped.join(',');
         if (posKey !== lastBuiltPos) {
             addBlock(snapped, activeType);
             setLastBuiltPos(posKey);
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

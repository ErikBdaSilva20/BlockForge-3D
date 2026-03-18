import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';

export default function SelectionManager() {
  const { isSelectingArea, updateAreaSelection, stopAreaSelection, worldSize } = useBlockStore();
  const { raycaster, camera, pointer, scene } = useThree();
  const draggingRef = useRef(false);

  useFrame(() => {
    if (!isSelectingArea || !draggingRef.current) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    const hit = intersects.find(i => i.object.userData.isTarget);
    
    if (hit) {
      let p;
      if (hit.object.userData.isBlock) {
        p = hit.object.position.toArray();
      } else {
        const snapped = snapToGrid([hit.point.x, 0, hit.point.z]);
        p = snapped;
      }
      
      const [x, y, z] = p;
      const halfW = worldSize.width / 2;
      const halfD = worldSize.depth / 2;
      
      if (x >= -halfW && x <= halfW && y >= 0 && y <= worldSize.height && z >= -halfD && z <= halfD) {
        updateAreaSelection(p);
      }
    }
  });

  useEffect(() => {
    if (isSelectingArea) {
      draggingRef.current = true;
    }

    const handlePointerUp = () => {
      if (draggingRef.current) {
        draggingRef.current = false;
        useBlockStore.getState().stopAreaSelection();
      }
    };
    
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, [isSelectingArea]);

  return null;
}

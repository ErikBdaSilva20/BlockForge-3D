import React from 'react';
import { useSceneStore } from '../../../store/sceneStore';
import { useSceneControls } from '../../../hooks/useSceneControls';

export default function World({ children }) {
  const { rotation, position, scale } = useSceneStore();
  useSceneControls();

  return (
    <group 
      name="WorldGroup" 
      rotation={rotation} 
      position={position} 
      scale={scale}
    >
      {children}
    </group>
  );
}

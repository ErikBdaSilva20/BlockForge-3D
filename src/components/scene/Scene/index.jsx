import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Lights from '../Lights';
import Ground from '../Grid/Ground';
import GridHelper from '../Grid/GridHelper';
import WorldBoundsBox from '../Grid/WorldBoundsBox';
import Block from '../Block/Block';
import GhostBlock from '../BlockPreview/GhostBlock';
import BrushOverlay from '../BrushOverlay/BrushOverlay';
import SelectionManager from '../BlockPreview/SelectionManager';
import World from '../World/World';
import { useBlockStore } from '../../../store/blockStore';
import React, { useRef, useEffect, useCallback } from 'react';

function SceneContent() {
  const blocks = useBlockStore((state) => state.blocks);
  const brushMode = useBlockStore((state) => state.brushMode);
  const brushLayer = useBlockStore((state) => state.brushLayer);
  const controlsRef = useRef();

  // Intercept scroll in brush mode to change layer instead of zoom
  const handleWheel = useCallback((e) => {
    if (!brushMode) return;
    e.preventDefault();
    e.stopPropagation();
    const state = useBlockStore.getState();
    const delta = e.deltaY > 0 ? -1 : 1;
    state.setBrushLayer(state.brushLayer + delta);
  }, [brushMode]);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    if (brushMode) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      // Disable OrbitControls zoom in brush mode
      if (controlsRef.current) {
        controlsRef.current.enableZoom = false;
      }
    } else {
      if (controlsRef.current) {
        controlsRef.current.enableZoom = true;
      }
    }

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      if (controlsRef.current) {
        controlsRef.current.enableZoom = true;
      }
    };
  }, [brushMode, handleWheel]);

  return (
    <>
      <color attach="background" args={['#000000']} />
      <Lights />
      
      <OrbitControls 
        ref={controlsRef}
        makeDefault 
        mouseButtons={{
          LEFT: brushMode ? THREE.MOUSE.NONE : THREE.MOUSE.NONE, 
          MIDDLE: THREE.MOUSE.PAN, 
          RIGHT: THREE.MOUSE.ROTATE 
        }}
        minDistance={5}
        maxDistance={45}
        maxPolarAngle={Math.PI / 2 - 0.05}
        enableDamping
        dampingFactor={0.05}
      />

      <World>
        <Ground />
        <GridHelper />
        <WorldBoundsBox />
        
        {blocks.map((block) => (
          <Block key={block.id} id={block.id} position={block.position} type={block.type} />
        ))}
        <GhostBlock />
        <BrushOverlay />
      </World>
      <SelectionManager />
    </>
  );
}

export default function Scene() {
  const shadowsEnabled = useBlockStore((state) => state.shadowsEnabled);

  return (
    <Canvas 
      shadows={shadowsEnabled}
      onContextMenu={(e) => e.preventDefault()}
      camera={{ position: [12, 12, 12], fov: 50 }}
    >
      <SceneContent />
    </Canvas>
  );
}

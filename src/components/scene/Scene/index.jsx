import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useBlockStore } from '../../../store/blockStore';
import Block from '../Block/Block';
import GhostBlock from '../BlockPreview/GhostBlock';
import SelectionManager from '../BlockPreview/SelectionManager';
import BrushOverlay from '../BrushOverlay/BrushOverlay';
import GridHelper from '../Grid/GridHelper';
import Ground from '../Grid/Ground';
import WorldBoundsBox from '../Grid/WorldBoundsBox';
import Lights from '../Lights';
import World from '../World/World';

function SceneContent() {
  const [shiftPressed, setShiftPressed] = React.useState(false);
  const blocks = useBlockStore((state) => state.blocks);
  const brushMode = useBlockStore((state) => state.brushMode);
  const brushLayer = useBlockStore((state) => state.brushLayer);
  const controlsRef = useRef();
  const isMobile = window.innerWidth <= 768;

  // Track shift key globally for the scene
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Shift') setShiftPressed(true); };
    const handleKeyUp = (e) => { if (e.key === 'Shift') setShiftPressed(false); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Intercept scroll in brush mode to change layer instead of zoom
  const handleWheel = useCallback(
    (e) => {
      if (!brushMode) return;
      e.preventDefault();
      e.stopPropagation();
      const state = useBlockStore.getState();
      const delta = e.deltaY > 0 ? -1 : 1;
      state.setBrushLayer(state.brushLayer + delta);
    },
    [brushMode]
  );

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [brushMode, handleWheel]);

  return (
    <>
      <color attach="background" args={['#000000']} />
      <Lights />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.PAN,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
        enableRotate={!brushMode || shiftPressed}
        enablePan={!brushMode || shiftPressed}
        enableZoom={!brushMode || shiftPressed}
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
          <Block
            key={block.id}
            id={block.id}
            position={block.position}
            type={block.type}
            rotation={block.rotation}
            isFlipped={block.isFlipped}
          />
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

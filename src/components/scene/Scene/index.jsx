import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Lights from '../Lights';
import Ground from '../Grid/Ground';
import GridHelper from '../Grid/GridHelper';
import Block from '../Block/Block';
import GhostBlock from '../BlockPreview/GhostBlock';
import World from '../World/World';
import { useBlockStore } from '../../../store/blockStore';

export default function Scene() {
  const blocks = useBlockStore((state) => state.blocks);
  const shadowsEnabled = useBlockStore((state) => state.shadowsEnabled);

  return (
    <Canvas 
      shadows={shadowsEnabled}
      onContextMenu={(e) => e.preventDefault()}
      camera={{ position: [10, 10, 10], fov: 50 }}
    >
      <color attach="background" args={['#000000']} />
      <Lights />
      
      <OrbitControls 
        makeDefault 
        mouseButtons={{
          LEFT: THREE.MOUSE.NONE, 
          MIDDLE: THREE.MOUSE.PAN, 
          RIGHT: THREE.MOUSE.ROTATE 
        }}
        minDistance={5}
        maxDistance={35}
        enableDamping
        dampingFactor={0.05}
      />

      <World>
        <Ground />
        <GridHelper />
        
        {blocks.map((block) => (
          <Block key={block.id} id={block.id} position={block.position} type={block.type} />
        ))}
        <GhostBlock />
      </World>
    </Canvas>
  );
}

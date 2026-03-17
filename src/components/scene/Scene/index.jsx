import { Canvas } from '@react-three/fiber';
import Camera from '../Camera';
import Lights from '../Lights';
import Ground from '../Grid/Ground';
import GridHelper from '../Grid/GridHelper';
import Block from '../Block/Block';
import GhostBlock from '../BlockPreview/GhostBlock';
import World from '../World/World';
import { useBlockStore } from '../../../store/blockStore';

export default function Scene() {
  const blocks = useBlockStore((state) => state.blocks);

  return (
    <Canvas 
      shadows 
      onContextMenu={(e) => e.preventDefault()}
    >
      <color attach="background" args={['#1a1a1a']} />
      <Camera />
      <Lights />
      
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

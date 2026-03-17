import { Canvas } from '@react-three/fiber';
import Camera from '../Camera';
import Lights from '../Lights';
import Controls from '../Controls';
import Ground from '../Grid/Ground';
import GridHelper from '../Grid/GridHelper';

export default function Scene() {
  return (
    <Canvas shadows>
      <color attach="background" args={['#1a1a1a']} />
      <Camera />
      <Lights />
      <Controls />
      <Ground />
      <GridHelper />
    </Canvas>
  );
}

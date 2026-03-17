import { OrbitControls } from '@react-three/drei';

export default function Controls() {
  return (
    <OrbitControls 
      enableDamping 
      dampingFactor={0.05} 
    />
  );
}

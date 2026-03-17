import { Grid } from '@react-three/drei';

export default function GridHelper() {
  return (
    <Grid
      position={[0, 0, 0]}
      args={[100, 100]}
      cellSize={1}
      cellThickness={1}
      cellColor="#444"
      sectionSize={10}
      sectionThickness={1.5}
      sectionColor="#666"
      fadeDistance={50}
      fadeStrength={1}
    />
  );
}

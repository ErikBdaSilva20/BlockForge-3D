import { PerspectiveCamera } from '@react-three/drei';

export default function Camera() {
  return (
    <PerspectiveCamera
      makeDefault
      position={[10, 10, 10]}
      fov={50}
    />
  );
}

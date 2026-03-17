import { useBlockStore } from '../../../store/blockStore';

export default function Lights() {
  const shadowsEnabled = useBlockStore((state) => state.shadowsEnabled);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1} 
        castShadow={shadowsEnabled}
      />
    </>
  );
}

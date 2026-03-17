import Scene from '../components/scene/Scene';
import Sidebar from '../components/ui/Sidebar/Sidebar';

export default function Editor() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Sidebar />
      <div style={{ flex: 1, position: 'relative' }}>
        <Scene />
      </div>
    </div>
  );
}

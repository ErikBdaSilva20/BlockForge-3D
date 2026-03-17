import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useSceneStore } from '../store/sceneStore';

export function useSceneControls() {
  const { gl } = useThree();

  useEffect(() => {
    let isOrbiting = false;
    let isPanning = false;
    let lastX = 0;
    let lastY = 0;

    const canvas = gl.domElement;

    const onPointerDown = (e) => {
      // Middle click (1) or Alt + Left
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        e.preventDefault();
        if (e.shiftKey) isPanning = true;
        else isOrbiting = true;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const onPointerMove = (e) => {
      if (!isOrbiting && !isPanning) return;
      e.preventDefault();

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      if (isOrbiting) {
        useSceneStore.setState((state) => ({
          rotation: [
            state.rotation[0] + deltaY * 0.01,
            state.rotation[1] + deltaX * 0.01,
            state.rotation[2]
          ]
        }));
      } else if (isPanning) {
        useSceneStore.setState((state) => ({
          position: [
            state.position[0] + deltaX * 0.05,
            state.position[1] - deltaY * 0.05,
            state.position[2]
          ]
        }));
      }
    };

    const onPointerUp = () => {
      isOrbiting = false;
      isPanning = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      useSceneStore.setState((state) => {
        const newScale = Math.max(0.1, Math.min(5, state.scale - e.deltaY * 0.001));
        return { scale: newScale };
      });
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl]);
}

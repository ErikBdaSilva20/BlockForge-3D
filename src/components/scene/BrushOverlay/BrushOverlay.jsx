import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';

export default function BrushOverlay() {
  const {
    brushMode,
    brushLayer,
    brushMarks,
    addBrushMark,
    worldSize,
    isPainting,
    setIsPainting,
    brushType,
    brushOrientation,
    showBrushGuide,
  } = useBlockStore();

  const { raycaster, camera, pointer, gl } = useThree();
  const isPaintingRef = useRef(false);

  // Keep ref in sync with store (for use inside event listeners)
  useEffect(() => {
    isPaintingRef.current = isPainting;
  }, [isPainting]);

  // Lock/unlock the canvas cursor style and camera in brush mode
  useEffect(() => {
    const canvas = gl.domElement;
    if (brushMode) {
      canvas.style.cursor = 'crosshair';
    } else {
      canvas.style.cursor = '';
    }
    return () => { canvas.style.cursor = ''; };
  }, [brushMode, gl.domElement]);

  // Global pointer listeners to track painting state
  useEffect(() => {
    if (!brushMode) return;

    const onDown = (e) => {
      if (e.button !== 0) return;
      setIsPainting(true);
    };
    const onUp = () => {
      if (isPaintingRef.current) {
        setIsPainting(false);
      }
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [brushMode, setIsPainting]);

  // Every frame: if actively painting, cast ray and add brush mark
  useFrame(() => {
    if (!brushMode || !isPaintingRef.current) return;

    raycaster.setFromCamera(pointer, camera);
    const origin = raycaster.ray.origin;
    const direction = raycaster.ray.direction;

    // Modo Add + Horizontal usa o plano transparente na altura Y
    if (brushType === 'add' && brushOrientation === 'horizontal') {
      const planeY = brushLayer;
      if (Math.abs(direction.y) < 0.001) return;
      const t = (planeY - origin.y) / direction.y;
      if (t < 0) return;
      const hitX = origin.x + direction.x * t;
      const hitZ = origin.z + direction.z * t;
      const snapped = snapToGrid([hitX, planeY, hitZ]);

      const halfW = worldSize.width / 2;
      const halfD = worldSize.depth / 2;
      if (snapped[0] >= -halfW && snapped[0] <= halfW && snapped[2] >= -halfD && snapped[2] <= halfD) {
        addBrushMark(snapped);
      }
    } else {
      // Modos Remove, Select e Add(Vertical) interceptam os próprios blocos na cena
      const intersects = raycaster.intersectObjects(
        Array.from(document.querySelector('canvas').__r3f?.scene?.children || []),
        true
      );
      const hit = intersects.find(i => i.object?.userData?.isTarget && i.object.userData.isBlock);
      if (hit) {
        let blockPos = hit.object.parent.position.toArray();
        const snapped = snapToGrid(blockPos);
        addBrushMark(snapped);
      } else if (brushType === 'add' && brushOrientation === 'vertical') {
         // Se não acertou um bloco mas quiser plantar uma coluna vertical livre, pega intersecção com XZ (chão):
         const floorHit = intersects.find(i => i.object?.userData?.isTarget);
         if (floorHit) {
            const hitPos = floorHit.point ? [floorHit.point.x, 0, floorHit.point.z] : [0,0,0];
            addBrushMark(snapToGrid(hitPos));
         }
      }
    }
  });

  if (!brushMode || !showBrushGuide) return null;

  const markColor = brushType === 'remove' ? '#ff4444' : brushType === 'select' ? '#55ccff' : '#00e5ff';

  return (
    <group>
      {/* Camada de guia (plano semi-transparente na layer atual) */}
      {brushOrientation === 'horizontal' && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, brushLayer + 0.01, 0]}
          userData={{ isPreview: true }}
        >
          <planeGeometry args={[worldSize.width, worldSize.depth]} />
          <meshBasicMaterial
            color={markColor}
            transparent
            opacity={0.06}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Marcas do pincel (blocos fantasma destacados) */}
      {brushMarks.map((pos, i) => (
        <group key={`mark-${i}`} position={[pos[0], pos[1], pos[2]]}>
          {/* Bloco fantasma cheio */}
          <mesh userData={{ isPreview: true }}>
            <boxGeometry args={[0.98, 0.98, 0.98]} />
            <meshBasicMaterial
              color={markColor}
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </mesh>
          {/* Contorno wireframe */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.01, 1.01, 1.01)]} />
            <lineBasicMaterial color={markColor} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

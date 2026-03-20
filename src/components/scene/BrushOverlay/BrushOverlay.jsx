import { useFrame, useThree } from '@react-three/fiber';
import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';

export default function BrushOverlay() {
  const [hoveredMarkKey, setHoveredMarkKey] = React.useState(null);
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

  const { raycaster, camera, pointer, gl, scene } = useThree();
  const isPaintingRef = useRef(false);
  const lastMarkedRef = useRef(null);

  // Keep ref in sync with store (for use inside event listeners)
  useEffect(() => {
    isPaintingRef.current = isPainting;
    if (!isPainting) lastMarkedRef.current = null;
  }, [isPainting]);

  // Lock/unlock the canvas cursor style and camera in brush mode
  useEffect(() => {
    const canvas = gl.domElement;
    if (brushMode) {
      canvas.style.cursor = 'crosshair';
    } else {
      canvas.style.cursor = '';
    }
    return () => {
      canvas.style.cursor = '';
    };
  }, [brushMode, gl.domElement]);

  // Global pointer listeners to track painting state
  useEffect(() => {
    if (!brushMode) return;

    const onDown = (e) => {
      // Pincel agora é no CLIQUE ESQUERDO (0), e IGNORA se o Shift estiver pressionado
      if (e.button !== 0 || e.shiftKey) return;
      setIsPainting(true);
    };
    const onUp = () => {
      if (isPaintingRef.current) {
        setIsPainting(false);
        lastMarkedRef.current = null;
      }
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [brushMode, setIsPainting]);

  const interpolateAndMark = useCallback(
    (pos) => {
      const start = lastMarkedRef.current;
      if (!start) {
        addBrushMark(pos);
        lastMarkedRef.current = pos;
        return;
      }
      const dx = Math.abs(pos[0] - start[0]);
      const dz = Math.abs(pos[2] - start[2]);
      const steps = Math.ceil(Math.max(dx, dz));
      if (steps > 1) {
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const interpX = start[0] + (pos[0] - start[0]) * t;
          const interpZ = start[2] + (pos[2] - start[2]) * t;
          addBrushMark(snapToGrid([interpX, pos[1], interpZ]));
        }
      } else {
        addBrushMark(pos);
      }
      lastMarkedRef.current = pos;
    },
    [addBrushMark]
  );

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
      if (
        snapped[0] >= -halfW &&
        snapped[0] <= halfW &&
        snapped[2] >= -halfD &&
        snapped[2] <= halfD
      ) {
        interpolateAndMark(snapped);
      }
    } else {
      // Modos Remove, Select e Add(Vertical) interceptam os próprios blocos na cena
      const intersects = raycaster
        .intersectObjects(scene.children, true)
        .filter((i) => !i.object.userData.isPreview);

      const hit = intersects.find((i) => i.object?.userData?.isTarget);
      if (hit) {
        const hitPos = hit.object.userData.isBlock
          ? hit.object.parent.position.toArray()
          : [hit.point.x, 0, hit.point.z];
        const snapped = snapToGrid(hitPos);
        interpolateAndMark(snapped);
      }
    }
  });

  const { scene: dummy } = useThree(); // trigger re-render on scene change if needed

  // Ref for efficient cursor tracking in useFrame
  const currentHoverPosRef = useRef([0, 0, 0]);
  const verticalGuideRef = useRef();

  useFrame(() => {
    if (!brushMode) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster
      .intersectObjects(scene.children, true)
      .filter((i) => !i.object.userData.isPreview);

    // Determine the position under the cursor for both orientation modes
    let snapped = null;
    if (brushOrientation === 'horizontal') {
      const planeY = brushLayer;
      if (Math.abs(raycaster.ray.direction.y) > 0.001) {
        const t = (planeY - raycaster.ray.origin.y) / raycaster.ray.direction.y;
        if (t >= 0) {
          const hitX = raycaster.ray.origin.x + raycaster.ray.direction.x * t;
          const hitZ = raycaster.ray.origin.z + raycaster.ray.direction.z * t;
          snapped = snapToGrid([hitX, planeY, hitZ]);
        }
      }
    } else {
      const hit = intersects.find((i) => i.object?.userData?.isTarget);
      if (hit) {
        const p = hit.object.userData.isBlock
          ? hit.object.parent.position.toArray()
          : [hit.point.x, 0, hit.point.z];
        snapped = snapToGrid(p);
      }
    }

    if (snapped) {
      const key = snapped.join(',');
      if (hoveredMarkKey !== key) {
        setHoveredMarkKey(key);
      }

      // Update vertical pillar if needed
      if (verticalGuideRef.current && brushOrientation === 'vertical') {
        verticalGuideRef.current.position.set(snapped[0], brushLayer / 2 + 0.5, snapped[2]);
      }
    } else if (hoveredMarkKey !== null) {
      setHoveredMarkKey(null);
    }
  });

  if (!brushMode) return null;

  const baseMarkColor =
    brushType === 'remove' ? '#ff4444' : brushType === 'select' ? '#55ccff' : '#00e5ff';

  return (
    <group>
      {/* Camada de guia HORIZONTAL */}
      {showBrushGuide && brushOrientation === 'horizontal' && (
        <group position={[0, brushLayer + 0.01, 0]}>
          <gridHelper
            args={[
              Math.max(worldSize.width, worldSize.depth),
              Math.max(worldSize.width, worldSize.depth),
              '#006572',
              '#383838',
            ]}
          />
          <mesh rotation={[-Math.PI / 2, 0, 0]} userData={{ isPreview: true }}>
            <planeGeometry args={[worldSize.width, worldSize.depth]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.01} depthWrite={false} />
          </mesh>
        </group>
      )}

      {/* Guia VERTICAL (Pilar de altura no cursor) */}
      {showBrushGuide && brushOrientation === 'vertical' && !isPainting && (
        <group ref={verticalGuideRef}>
          <mesh userData={{ isPreview: true }}>
            <boxGeometry args={[1.05, brushLayer + 1, 1.05]} />
            <meshBasicMaterial color="white" transparent opacity={0.03} depthWrite={false} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.05, brushLayer + 1, 1.05)]} />
            <lineBasicMaterial color="#444444" transparent opacity={0.5} />
          </lineSegments>
        </group>
      )}

      {/* Marcas do pincel (blocos fantasma destacados) */}
      {brushMarks.map((pos, i) => {
        const key = pos.join(',');
        const isHovered = key === hoveredMarkKey;
        const color = isHovered
          ? '#ffff00'
          : brushType === 'remove'
            ? '#ff4444'
            : brushType === 'select'
              ? '#55ccff'
              : '#00e5ff';

        return (
          <group key={`mark-${i}`} position={[pos[0], pos[1], pos[2]]}>
            <mesh userData={{ isPreview: true }}>
              <boxGeometry args={[0.98, 0.98, 0.98]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isHovered ? 0.6 : 0.3}
                depthWrite={false}
              />
            </mesh>
            <lineSegments visible={showBrushGuide}>
              <edgesGeometry args={[new THREE.BoxGeometry(1.01, 1.01, 1.01)]} />
              <lineBasicMaterial
                color={isHovered ? '#ffff00' : '#444444'}
                transparent
                opacity={0.6}
              />
            </lineSegments>
          </group>
        );
      })}
    </group>
  );
}

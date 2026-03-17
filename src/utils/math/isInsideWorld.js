import { WORLD_BOUNDS } from '../constants/world';

export function isInsideWorld(position) {
  const [x, y, z] = position;
  const halfWidth = WORLD_BOUNDS.width / 2;
  const halfDepth = WORLD_BOUNDS.depth / 2;
  
  return (
    x >= -halfWidth && x <= halfWidth &&
    y >= 0 && y <= WORLD_BOUNDS.height &&
    z >= -halfDepth && z <= halfDepth
  );
}

import { PLANS } from '../constants/plansConfig';

export function isInsideWorld(position, currentPlan = 'free') {
  const plan = PLANS[currentPlan] || PLANS.free;
  const [x, y, z] = position;
  const halfWidth = plan.maxWidth / 2;
  const halfDepth = plan.maxDepth / 2;
  
  return (
    x >= -halfWidth && x <= halfWidth &&
    y >= 0 && y <= plan.maxHeight &&
    z >= -halfDepth && z <= halfDepth
  );
}

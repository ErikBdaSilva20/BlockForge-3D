// Mapa de cores por tipo de material para quando a textura não carrega
const MATERIAL_COLOR_MAP = {
  'mineable/pickaxe': '#888888',
  'mineable/axe': '#8B5A2B',
  'mineable/shovel': '#A0855B',
  'mineable/hoe': '#556B2F',
  'plant': '#3A6B2F',
  'wool': '#DDDDDD',
  default: '#666666',
};

export function adaptMinecraftBlocks(apiBlocks) {
  return apiBlocks.map((block) => {
    const idStr = block.name ? `mc:${block.name}` : block.id;
    const materialColor = MATERIAL_COLOR_MAP[block.material] || MATERIAL_COLOR_MAP.default;
    
    return {
      id: idStr,
      name: block.displayName || block.name || 'Unknown',
      label: block.displayName || block.name || 'Unknown',
      type: block.name || idStr.replace('mc:', ''),
      texture: block.textureUrl || block.url || null,
      category: block.material || 'geral',
      color: materialColor,
      transparent: block.transparent || false,
    };
  });
}

export function adaptMinecraftBlocks(apiBlocks) {
  return apiBlocks.map((block) => ({
    id: block.id || block.name,
    label: block.displayName || block.name,
    texture: block.textureUrl || block.url,
    category: block.category || 'minecraft',
    color: block.color || '#cccccc',
  }));
}

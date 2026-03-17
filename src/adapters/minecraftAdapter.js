export function adaptMinecraftBlocks(apiBlocks) {
  return apiBlocks.map((block) => ({
    id: block.id,
    label: block.displayName,
    texture: block.url,
    color: '#cccccc',
  }));
}

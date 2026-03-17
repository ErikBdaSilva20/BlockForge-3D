// Using the mc-heads API for reliable texture serving
const TEXTURE_BASE = 'https://mc-heads.net/blocks';

export async function fetchMinecraftBlocks() {
  // Return a curated list of blocks with reliable texture URLs
  return [
    { id: 'mc:grass_block', displayName: 'Grass Block', url: `${TEXTURE_BASE}/grass_block_side` },
    { id: 'mc:stone', displayName: 'Stone', url: `${TEXTURE_BASE}/stone` },
    { id: 'mc:oak_planks', displayName: 'Oak Planks', url: `${TEXTURE_BASE}/oak_planks` },
    { id: 'mc:cobblestone', displayName: 'Cobblestone', url: `${TEXTURE_BASE}/cobblestone` },
    { id: 'mc:bricks', displayName: 'Bricks', url: `${TEXTURE_BASE}/bricks` },
    { id: 'mc:diamond_block', displayName: 'Diamond', url: `${TEXTURE_BASE}/diamond_block` },
  ];
}

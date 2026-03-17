const BASE_URL = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.19.2/assets/minecraft/textures/block';

export async function fetchMinecraftBlocks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'mc:grass_block_side', displayName: 'Grass Block', url: `${BASE_URL}/grass_block_side.png` },
        { id: 'mc:stone', displayName: 'Stone Block', url: `${BASE_URL}/stone.png` },
        { id: 'mc:oak_planks', displayName: 'Oak Planks', url: `${BASE_URL}/oak_planks.png` },
        { id: 'mc:glass', displayName: 'Glass', url: `${BASE_URL}/glass.png` },
        { id: 'mc:bricks', displayName: 'Bricks', url: `${BASE_URL}/bricks.png` },
        { id: 'mc:diamond_block', displayName: 'Diamond Block', url: `${BASE_URL}/diamond_block.png` },
      ]);
    }, 600);
  });
}

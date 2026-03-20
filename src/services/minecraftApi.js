import { fetchWithCache } from './apiClient';

const MC_DATA_URL = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.20/blocks.json';
const TEXTURE_BASE = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/block';

// Blocos que possuem textura com sufixo diferente do nome direto
const TEXTURE_NAME_MAP = {
  grass_block: 'grass_block_side',
  mycelium: 'mycelium_side',
  podzol: 'podzol_side',
  furnace: 'furnace_front_on',
  blast_furnace: 'blast_furnace_front',
  crafting_table: 'crafting_table_front',
  smoker: 'smoker_front',
  loom: 'loom_front',
  barrel: 'barrel_top',
  beehive: 'beehive_front',
  bee_nest: 'bee_nest_front',
  carved_pumpkin: 'carved_pumpkin',
  jack_o_lantern: 'jack_o_lantern',
  pumpkin: 'pumpkin_side',
  melon: 'melon_side',
  hay_block: 'hay_block_side',
  bone_block: 'bone_block_side',
  mushroom_stem: 'mushroom_stem',
  jukebox: 'jukebox_top',
  tnt: 'tnt_side',
  bookshelf: 'bookshelf',
  chiseled_bookshelf: 'chiseled_bookshelf_empty',
  observer: 'observer_front',
  dispenser: 'dispenser_front_vertical',
  dropper: 'dropper_front_vertical',
  piston: 'piston_side',
  sticky_piston: 'piston_side',
  oak_log: 'oak_log',
  spruce_log: 'spruce_log',
  birch_log: 'birch_log',
  jungle_log: 'jungle_log',
  acacia_log: 'acacia_log',
  dark_oak_log: 'dark_oak_log',
  cherry_log: 'cherry_log',
  mangrove_log: 'mangrove_log',
  crimson_stem: 'crimson_stem',
  warped_stem: 'warped_stem',
  stripped_oak_log: 'stripped_oak_log',
  stripped_spruce_log: 'stripped_spruce_log',
  stripped_birch_log: 'stripped_birch_log',
  stripped_jungle_log: 'stripped_jungle_log', 
  stripped_acacia_log: 'stripped_acacia_log',
  stripped_dark_oak_log: 'stripped_dark_oak_log',
  stripped_cherry_log: 'stripped_cherry_log',
  stripped_mangrove_log: 'stripped_mangrove_log',
  stripped_crimson_stem: 'stripped_crimson_stem',
  stripped_warped_stem: 'stripped_warped_stem',
  bamboo_block: 'bamboo_block',
  stripped_bamboo_block: 'stripped_bamboo_block',
  crimson_hyphae: 'crimson_stem',
  warped_hyphae: 'warped_stem',
  stripped_crimson_hyphae: 'stripped_crimson_stem',
  stripped_warped_hyphae: 'stripped_warped_stem',
  oak_wood: 'oak_log',
  spruce_wood: 'spruce_log',
  birch_wood: 'birch_log',
  jungle_wood: 'jungle_log',
  acacia_wood: 'acacia_log',
  dark_oak_wood: 'dark_oak_log',
  cherry_wood: 'cherry_log',
  mangrove_wood: 'mangrove_log',
  stripped_oak_wood: 'stripped_oak_log',
  stripped_spruce_wood: 'stripped_spruce_log',
  stripped_birch_wood: 'stripped_birch_log',
  stripped_jungle_wood: 'stripped_jungle_log',
  stripped_acacia_wood: 'stripped_acacia_log',
  stripped_dark_oak_wood: 'stripped_dark_oak_log',
  stripped_cherry_wood: 'stripped_cherry_log',
  stripped_mangrove_wood: 'stripped_mangrove_log',
  quartz_block: 'quartz_block_side',
  quartz_pillar: 'quartz_pillar',
  purpur_pillar: 'purpur_pillar',
  mushroom_stem: 'mushroom_stem',
  brown_mushroom_block: 'brown_mushroom_block',
  red_mushroom_block: 'red_mushroom_block',
  composter: 'composter_side',
  lectern: 'lectern_front',
  lava: 'lava_still',
  water: 'water_still',
  mangrove_roots: 'mangrove_roots_side',
  muddy_mangrove_roots: 'muddy_mangrove_roots_side',
};

// Sufixos que não são blocos cúbicos puros - não terão texturas diretas
// e não renderizam bem como cubos simples
const NON_CUBE_SUFFIXES = [
  '_wall', '_fence', '_sign', '_door',
  '_trapdoor', '_pressure_plate', '_button', '_fence_gate',
  '_banner', '_bed', '_head', '_skull', '_candle',
  '_rail', '_rod', '_pot', '_hanging_sign',
  '_fan', '_coral', '_cluster', '_bud', '_point',
  '_sprouts',
  '_blossom', '_hyacinth',
];

const PLANT_SUFFIXES = [
  '_plant', '_sapling', '_flower', '_bush', '_crop', '_shrub',
  '_roots', '_tulip', '_orchid', '_allium', '_cornflower',
  '_daisy', '_poppy', '_lily', 'dandelion', 'blue_orchid', 'sageBrush',
  'rose', 'grass', 'fern', 'mushroom', 'sugar_cane', 'bamboo', 'propagule',
  'roots', 'sprouts', 'fungus', 'torch', 'vines', 'seagrass', 'kelp', 'azalea',
  'blossom', 'clover', 'leaf', 'leaves', 'coral_fan', 'coral', 'sea_pickle'
];

// Blocos técnicos/invisíveis para excluir (manter o essencial)
const EXCLUDED_NAMES = [
  'air', 'cave_air', 'void_air', 'structure_void', 'barrier',
  'light', 'moving_piston', 'piston_head', 'command_block',
  'chain_command_block', 'repeating_command_block', 'structure_block',
  'jigsaw', 'frosted_ice', 'spawner', 'trial_spawner',
];

// Prefixos de blocos que são variantes técnicas (colocados em paredes, etc)
const EXCLUDED_PREFIXES = [
  'wall_', 'potted_', 'attached_', 'brain_', 'bubble_', 'fire_', 'soul_fire_',
];

export async function fetchMinecraftBlocks() {
  try {
    const data = await fetchWithCache(MC_DATA_URL);
    
    const solidBlocks = data.filter(block => {
      // Excluir blocos técnicos puramente invisíveis
      if (EXCLUDED_NAMES.some(exc => block.name === exc)) {
        return false;
      }

      // Excluir prefixos técnicos (manter apenas o que pode ser colocado)
      if (EXCLUDED_PREFIXES.some(prefix => block.name.startsWith(prefix))) {
        return false;
      }

      // Manter variantes especiais essenciais, mas filtrar duplicatas de "wall_"
      if (block.name.includes('infested_') || block.name.includes('suspicious_')) {
        return false;
      }
      
      return true;
    });

    return solidBlocks.map(block => {
      let textureName = TEXTURE_NAME_MAP[block.name] || block.name;
      
      let renderType = 'cube';
      if (block.name.includes('torch')) renderType = 'torch';
      else if (block.name.includes('stairs')) {
        renderType = 'stairs';
        // Limpeza inteligente de nome para texturas de escada
        textureName = textureName.replace('_stairs', '');
        if (textureName.includes('oak') || textureName.includes('birch') || textureName.includes('spruce') || 
            textureName.includes('jungle') || textureName.includes('acacia') || textureName.includes('dark_oak') ||
            textureName.includes('mangrove') || textureName.includes('cherry') || textureName.includes('bamboo')) {
            if (!textureName.includes('planks') && !textureName.includes('log')) textureName += '_planks';
        }
        if (textureName.includes('stone_brick')) textureName = 'stone_bricks';
      }
      else if (block.name.includes('slab')) {
        renderType = 'slab';
        textureName = textureName.replace('_slab', '');
        if (textureName.includes('oak') || textureName.includes('birch') || textureName.includes('spruce') || 
            textureName.includes('jungle') || textureName.includes('acacia') || textureName.includes('dark_oak') ||
            textureName.includes('mangrove') || textureName.includes('cherry') || textureName.includes('bamboo')) {
            if (!textureName.includes('planks') && !textureName.includes('log')) textureName += '_planks';
        }
        if (textureName.includes('stone_brick')) textureName = 'stone_bricks';
      }
      else if (PLANT_SUFFIXES.some(s => block.name.endsWith(s) || block.name.includes(s) || block.name === s)) {
        renderType = 'plant';
      }
      else if (block.name.includes('lantern')) renderType = 'torch';

      // Lógica para múltiplas texturas (Topo/Lado)
      let textures = {
        all: `${TEXTURE_BASE}/${textureName}.png`
      };

      if (block.name.includes('grass_block')) {
        textures.top = `${TEXTURE_BASE}/grass_block_top.png`;
        textures.side = `${TEXTURE_BASE}/grass_block_side.png`;
        textures.bottom = `${TEXTURE_BASE}/dirt.png`;
      } else if (block.name.endsWith('_log')) {
        textures.top = `${TEXTURE_BASE}/${block.name}_top.png`;
        textures.side = `${TEXTURE_BASE}/${block.name}.png`;
        textures.bottom = `${TEXTURE_BASE}/${block.name}_top.png`;
      } else if (block.name.includes('tnt')) {
        textures.top = `${TEXTURE_BASE}/tnt_top.png`;
        textures.side = `${TEXTURE_BASE}/tnt_side.png`;
        textures.bottom = `${TEXTURE_BASE}/tnt_bottom.png`;
      }

      return {
        ...block,
        renderType,
        textures,
        textureUrl: textures.all // Retrocompatibilidade
      };
    });
  } catch (error) {
    console.warn('Utilizando fallback manual de blocos, API falhou', error);
    return [
      { id: 'mc:grass_block', name: 'grass_block', displayName: 'Grass Block', textures: { top: `${TEXTURE_BASE}/grass_block_top.png`, side: `${TEXTURE_BASE}/grass_block_side.png`, bottom: `${TEXTURE_BASE}/dirt.png` } },
      { id: 'mc:stone', name: 'stone', displayName: 'Stone', textures: { all: `${TEXTURE_BASE}/stone.png` } },
      { id: 'mc:oak_planks', name: 'oak_planks', displayName: 'Oak Planks', textures: { all: `${TEXTURE_BASE}/oak_planks.png` } },
      { id: 'mc:oak_stairs', name: 'oak_stairs', displayName: 'Oak Stairs', renderType: 'stairs', textures: { all: `${TEXTURE_BASE}/oak_planks.png` } },
      { id: 'mc:oak_slab', name: 'oak_slab', displayName: 'Oak Slab', renderType: 'slab', textures: { all: `${TEXTURE_BASE}/oak_planks.png` } },
      { id: 'mc:poppy', name: 'poppy', displayName: 'Poppy (Flower)', renderType: 'plant', textures: { all: `${TEXTURE_BASE}/poppy.png` } },
      { id: 'mc:torch', name: 'torch', displayName: 'Torch', renderType: 'torch', textures: { all: `${TEXTURE_BASE}/torch.png` } },
      { id: 'mc:cobblestone', name: 'cobblestone', displayName: 'Cobblestone', textures: { all: `${TEXTURE_BASE}/cobblestone.png` } },
      { id: 'mc:bricks', name: 'bricks', displayName: 'Bricks', textures: { all: `${TEXTURE_BASE}/bricks.png` } },
      { id: 'mc:glass', name: 'glass', displayName: 'Glass', transparent: true, textures: { all: `${TEXTURE_BASE}/glass.png` } },
    ];
  }
}

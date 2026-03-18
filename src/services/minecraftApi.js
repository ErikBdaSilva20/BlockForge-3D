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
};

// Sufixos que não são blocos cúbicos puros - não terão texturas diretas
// e não renderizam bem como cubos simples
const NON_CUBE_SUFFIXES = [
  '_slab', '_stairs', '_wall', '_fence', '_sign', '_door',
  '_trapdoor', '_pressure_plate', '_button', '_fence_gate',
  '_banner', '_bed', '_head', '_skull', '_candle', '_torch',
  '_plant', '_sapling', '_flower', '_bush', '_crop', '_shrub',
  '_rail', '_lantern', '_rod', '_pot', '_hanging_sign',
  '_fan', '_coral', '_cluster', '_bud', '_point', '_roots',
  '_sprouts', '_tulip', '_orchid', '_allium', '_cornflower',
  '_blossom', '_hyacinth', '_daisy', '_poppy', '_lily',
];

// Blocos técnicos/invisíveis ou que não são cubos sólidos para excluir
const EXCLUDED_NAMES = [
  'air', 'cave_air', 'void_air', 'structure_void', 'barrier',
  'light', 'moving_piston', 'piston_head', 'command_block',
  'chain_command_block', 'repeating_command_block', 'structure_block',
  'jigsaw', 'frosted_ice', 'spawner', 'trial_spawner',
  'petrified_oak_slab', 'budding_amethyst', 'conduit', 'beacon',
  'end_portal_frame', 'end_gateway', 'dragon_egg', 'bell', 'cauldron',
  'torch', 'lantern', 'ladder', 'vine', 'glow_lichen', 'sculck_vein',
  'redstone_wire', 'redstone_torch', 'repeater', 'comparator',
  'lever', 'tripwire', 'scaffolding', 'lily_pad', 'turtle_egg',
  'frogspawn', 'composter', 'cake', 'brewing_stand', 'cake',
  'campfire', 'soul_campfire', 'bamboo_sapling', 'sweet_berry_bush',
  'cave_vines', 'big_dripleaf', 'small_dripleaf', 'glow_berries',
  'spore_blossom', 'azalea', 'flowering_azalea', 'kelp', 'seagrass',
  'tall_grass', 'large_fern', 'rose_bush', 'peony', 'lilac',
  'sunflower', 'chorus_flower', 'chorus_plant', 'sea_pickle',
  'cactus', 'sugar_cane', 'bamboo', 'bamboo_plant',
];

// Prefixos de blocos que são variantes técnicas (colocados em paredes, etc)
const EXCLUDED_PREFIXES = [
  'wall_', 'potted_', 'attached_', 'brain_', 'bubble_', 'fire_', 'soul_fire_',
];

export async function fetchMinecraftBlocks() {
  try {
    const data = await fetchWithCache(MC_DATA_URL);
    
    const solidBlocks = data.filter(block => {
      // Precisa ser um bloco com bounding box sólida
      if (block.boundingBox !== 'block') return false;
      
      // Excluir transparentes (manter vidros e gelo)
      if (block.transparent && 
          !block.name.includes('glass') && 
          !block.name.includes('ice') && 
          !block.name.includes('slime') && 
          !block.name.includes('honey')) {
        return false;
      }

      // Excluir blocos técnicos
      if (EXCLUDED_NAMES.some(exc => block.name === exc || block.name.includes(exc))) {
        return false;
      }

      // Excluir prefixos técnicos
      if (EXCLUDED_PREFIXES.some(prefix => block.name.startsWith(prefix))) {
        return false;
      }

      // Excluir blocos não-cúbicos (escadas, slabs, cercas, portas, etc)
      if (NON_CUBE_SUFFIXES.some(suffix => block.name.endsWith(suffix) || block.name.includes(suffix + '_'))) {
        return false;
      }

      // Excluir variantes especiais
      if (block.name.includes('candle_cake') || 
          block.name.includes('_cauldron') ||
          block.name.includes('wall_torch') ||
          block.name.includes('wall_fan') ||
          block.name.includes('infested_')) {
        return false;
      }

      return true;
    });

    return solidBlocks.map(block => {
      const textureName = TEXTURE_NAME_MAP[block.name] || block.name;
      return {
        ...block,
        textureUrl: `${TEXTURE_BASE}/${textureName}.png`
      };
    });
  } catch (error) {
    console.warn('Utilizando fallback manual de blocos, API falhou', error);
    return [
      { id: 'mc:grass_block', name: 'grass_block', displayName: 'Grass Block', boundingBox: 'block', transparent: false, url: `${TEXTURE_BASE}/grass_block_side.png` },
      { id: 'mc:stone', name: 'stone', displayName: 'Stone', boundingBox: 'block', transparent: false, url: `${TEXTURE_BASE}/stone.png` },
      { id: 'mc:oak_planks', name: 'oak_planks', displayName: 'Oak Planks', boundingBox: 'block', transparent: false, url: `${TEXTURE_BASE}/oak_planks.png` },
      { id: 'mc:cobblestone', name: 'cobblestone', displayName: 'Cobblestone', boundingBox: 'block', transparent: false, url: `${TEXTURE_BASE}/cobblestone.png` },
      { id: 'mc:bricks', name: 'bricks', displayName: 'Bricks', boundingBox: 'block', transparent: false, url: `${TEXTURE_BASE}/bricks.png` },
      { id: 'mc:diamond_block', name: 'diamond_block', displayName: 'Diamond', boundingBox: 'block', transparent: false, url: `${TEXTURE_BASE}/diamond_block.png` },
      { id: 'mc:dirt', name: 'dirt', displayName: 'Dirt', boundingBox: 'block', transparent: false, url: `${TEXTURE_BASE}/dirt.png` },
      { id: 'mc:sand', name: 'sand', displayName: 'Sand', boundingBox: 'block', transparent: false, url: `${TEXTURE_BASE}/sand.png` },
      { id: 'mc:oak_log', name: 'oak_log', displayName: 'Oak Log', boundingBox: 'block', transparent: false, url: `${TEXTURE_BASE}/oak_log.png` },
      { id: 'mc:iron_block', name: 'iron_block', displayName: 'Iron Block', boundingBox: 'block', transparent: false, url: `${TEXTURE_BASE}/iron_block.png` },
      { id: 'mc:gold_block', name: 'gold_block', displayName: 'Gold Block', boundingBox: 'block', transparent: false, url: `${TEXTURE_BASE}/gold_block.png` },
      { id: 'mc:glass', name: 'glass', displayName: 'Glass', boundingBox: 'block', transparent: true, url: `${TEXTURE_BASE}/glass.png` },
    ];
  }
}

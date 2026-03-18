import * as THREE from 'three';

const textureCache = {};
const failedUrls = new Set();
const loader = new THREE.TextureLoader();
loader.crossOrigin = 'anonymous';

const TEXTURE_BASE = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/block';

/**
 * Gera URLs alternativas de textura baseado no nome do bloco.
 * Muitos blocos no Minecraft têm texturas com sufixos como _side, _top, _front, etc.
 */
function getAlternativeUrls(originalUrl) {
  // Extrair o nome do bloco da URL
  const match = originalUrl.match(/\/([^/]+)\.png$/);
  if (!match) return [];
  
  const blockName = match[1];
  const alternatives = [];
  
  // Tentar adicionar _side, _top, _front
  alternatives.push(`${TEXTURE_BASE}/${blockName}_side.png`);
  alternatives.push(`${TEXTURE_BASE}/${blockName}_top.png`);
  alternatives.push(`${TEXTURE_BASE}/${blockName}_front.png`);
  
  // Para blocos com _planks no nome da variante (ex: oak_slab -> oak_planks)
  const baseWood = blockName.replace(/_block$/, '');
  if (baseWood !== blockName) {
    alternatives.push(`${TEXTURE_BASE}/${baseWood}.png`);
  }
  
  // Smooth stone, chiseled, polished, etc — tentar sem prefixo
  if (blockName.startsWith('smooth_')) {
    alternatives.push(`${TEXTURE_BASE}/${blockName.replace('smooth_', '')}_top.png`);
    alternatives.push(`${TEXTURE_BASE}/${blockName.replace('smooth_', '')}.png`);
  }
  if (blockName.startsWith('chiseled_')) {
    alternatives.push(`${TEXTURE_BASE}/${blockName.replace('chiseled_', '')}.png`);
  }
  if (blockName.startsWith('cut_')) {
    alternatives.push(`${TEXTURE_BASE}/${blockName.replace('cut_', '')}.png`);
  }
  if (blockName.startsWith('polished_')) {
    alternatives.push(`${TEXTURE_BASE}/${blockName.replace('polished_', '')}.png`);
  }
  if (blockName.startsWith('waxed_')) {
    alternatives.push(`${TEXTURE_BASE}/${blockName.replace('waxed_', '')}.png`);
  }
  
  // Blocos oxidados (exposed_, weathered_, oxidized_)
  if (blockName.startsWith('exposed_')) {
    alternatives.push(`${TEXTURE_BASE}/${blockName.replace('exposed_', '')}.png`);
  }
  if (blockName.startsWith('weathered_')) {
    alternatives.push(`${TEXTURE_BASE}/${blockName.replace('weathered_', '')}.png`);
  }
  if (blockName.startsWith('oxidized_')) {
    alternatives.push(`${TEXTURE_BASE}/${blockName.replace('oxidized_', '')}.png`);
  }
  
  // Filtrar duplicatas e a URL original
  return [...new Set(alternatives)].filter(url => url !== originalUrl && !failedUrls.has(url));
}

function applyTextureSettings(texture) {
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
}

export function getTexture(url, callback) {
  if (!url) {
    callback(null);
    return;
  }
  
  // Retornar do cache se já temos
  if (textureCache[url]) {
    callback(textureCache[url]);
    return;
  }
  
  // Se já sabemos que falhou, não tentar de novo
  if (failedUrls.has(url)) {
    callback(null);
    return;
  }
  
  loader.load(
    url,
    (texture) => {
      applyTextureSettings(texture);
      textureCache[url] = texture;
      callback(texture);
    },
    undefined,
    () => {
      failedUrls.add(url);
      
      // Tentar URLs alternativas
      const alternatives = getAlternativeUrls(url);
      if (alternatives.length > 0) {
        tryAlternatives(alternatives, 0, callback);
      } else {
        callback(null);
      }
    }
  );
}

function tryAlternatives(urls, index, callback) {
  if (index >= urls.length) {
    callback(null);
    return;
  }
  
  const url = urls[index];
  
  if (textureCache[url]) {
    callback(textureCache[url]);
    return;
  }
  
  if (failedUrls.has(url)) {
    tryAlternatives(urls, index + 1, callback);
    return;
  }
  
  loader.load(
    url,
    (texture) => {
      applyTextureSettings(texture);
      textureCache[url] = texture;
      callback(texture);
    },
    undefined,
    () => {
      failedUrls.add(url);
      tryAlternatives(urls, index + 1, callback);
    }
  );
}

import React, { useState, useEffect, useRef, memo } from 'react';
import * as THREE from 'three';
import { useBlockStore } from '../../../store/blockStore';
import { snapToGrid } from '../../../utils/math/snapToGrid';

// Cache global de texturas - mantido fora do componente para persistir entre re-renders
const textureCache = new Map();
const failingLoad = new Map(); // url -> Promise

const TEXTURE_BASE = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/block';

/**
 * Resolve URLs alternativas quando a textura primária falha.
 */
function resolveAlternativeUrl(blockName) {
  const candidates = [
    `${TEXTURE_BASE}/${blockName}_side.png`,
    `${TEXTURE_BASE}/${blockName}_top.png`,
    `${TEXTURE_BASE}/${blockName}_front.png`,
  ];

  if (blockName.startsWith('smooth_'))    candidates.push(`${TEXTURE_BASE}/${blockName.replace('smooth_','')}.png`);
  if (blockName.startsWith('chiseled_'))  candidates.push(`${TEXTURE_BASE}/${blockName.replace('chiseled_','')}.png`);
  if (blockName.startsWith('cut_'))       candidates.push(`${TEXTURE_BASE}/${blockName.replace('cut_','')}.png`);
  if (blockName.startsWith('polished_'))  candidates.push(`${TEXTURE_BASE}/${blockName.replace('polished_','')}.png`);
  if (blockName.startsWith('waxed_'))     candidates.push(`${TEXTURE_BASE}/${blockName.replace('waxed_','')}.png`);
  if (blockName.startsWith('exposed_'))   candidates.push(`${TEXTURE_BASE}/${blockName.replace('exposed_','')}.png`);
  if (blockName.startsWith('weathered_')) candidates.push(`${TEXTURE_BASE}/${blockName.replace('weathered_','')}.png`);
  if (blockName.startsWith('oxidized_'))  candidates.push(`${TEXTURE_BASE}/${blockName.replace('oxidized_','')}.png`);
  if (blockName.endsWith('_block'))       candidates.push(`${TEXTURE_BASE}/${blockName.replace(/_block$/,'')}.png`);

  return candidates;
}

/**
 * Tenta carregar textura de uma URL, com retorno null se falhar.
 */
function loadTextureSafe(url) {
  return new Promise((resolve) => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(
      url,
      (tex) => {
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
        textureCache.set(url, tex);
        resolve(tex);
      },
      undefined,
      () => resolve(null) // falhou → retorna null
    );
  });
}

/**
 * Carrega textura com fallback automático de nomes alternativos.
 */
async function loadTextureWithFallback(primaryUrl) {
  // Já temos em cache?
  if (textureCache.has(primaryUrl)) return textureCache.get(primaryUrl);
  
  // Já está sendo carregada?
  if (failingLoad.has(primaryUrl)) return failingLoad.get(primaryUrl);

  const promise = (async () => {
    // Tentar URL primária
    const tex = await loadTextureSafe(primaryUrl);
    if (tex) return tex;
    
    // Extrair nome do bloco e tentar alternativas
    const match = primaryUrl.match(/\/([^/]+)\.png$/);
    if (!match) return null;
    
    const blockName = match[1];
    const alternatives = resolveAlternativeUrl(blockName);
    
    for (const altUrl of alternatives) {
      if (textureCache.has(altUrl)) return textureCache.get(altUrl);
      const altTex = await loadTextureSafe(altUrl);
      if (altTex) {
        // Cachear sob a URL primária também para evitar retentativas
        textureCache.set(primaryUrl, altTex);
        return altTex;
      }
    }
    
    return null; // Nenhuma textura funcionou
  })();
  
  failingLoad.set(primaryUrl, promise);
  return promise;
}

const Block = memo(({ id, position, type }) => {
  const { addBlock, removeBlock, selectedBlockType, isDragging, availableBlocks, worldSize, selectedBlocksIDs, selectBlock, shadowsEnabled, brushMode } = useBlockStore();
  const [hovered, setHovered] = useState(false);
  const [map, setMap] = useState(null);
  const mountedRef = useRef(true);

  const blockConfig = availableBlocks.find((b) => b.id === type);
  const isSelected = selectedBlocksIDs.includes(id);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const textureUrl = blockConfig?.texture;
    
    if (!textureUrl) {
      setMap(null);
      return;
    }

    // Verificar cache imediatamente (evita piscar)
    if (textureCache.has(textureUrl)) {
      const cached = textureCache.get(textureUrl);
      setMap(cached); // pode ser null (falhou antes) ou texture
      if (cached) return; // Se temos textura, não precisamos carregar de novo
    }

    // Carregar (async com fallback automático)
    loadTextureWithFallback(textureUrl).then((tex) => {
      if (mountedRef.current) {
        console.log(`Loaded texture for ${type}:`, !!tex, tex ? tex.image?.src : null);
        setMap(tex);
      }
    });
  }, [blockConfig?.texture]);

  const isTransparent = blockConfig?.transparent || (type && (type.includes('glass') || type.includes('ice')));
  const fallbackColor = blockConfig?.color || '#888888';
  const blockColor = isSelected ? '#aaddff' : (map ? '#ffffff' : fallbackColor);

  const isInsideDynamic = (pos) => {
    const [x, y, z] = pos;
    const halfW = worldSize.width / 2;
    const halfD = worldSize.depth / 2;
    return x >= -halfW && x <= halfW && y >= 0 && y <= worldSize.height && z >= -halfD && z <= halfD;
  };

  return (
    <mesh 
      position={position} 
      castShadow={shadowsEnabled}
      receiveShadow={shadowsEnabled}
      userData={{ isTarget: true, isBlock: true, id, type }}
      onPointerOver={(e) => { if (brushMode) return; e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { if (brushMode) return; e.stopPropagation(); setHovered(false); }}
      onPointerDown={(e) => {
        if (brushMode) return;
        if (e.button !== 0 || isDragging) return;
        if (e.shiftKey) {
          useBlockStore.getState().startAreaSelection(position);
          return;
        }
      }}
      onClick={(e) => {
        if (brushMode) return;
        if (e.button !== 0) return;
        e.stopPropagation();
        
        if (useBlockStore.getState().isSelectingArea) return;

        if (e.shiftKey && e.altKey) {
          removeBlock(id);
          return;
        }
        
        if (e.ctrlKey || e.metaKey || e.shiftKey) {
          selectBlock(id, true);
          return;
        }

        if (!e.altKey && !isDragging) {
          selectBlock(id, false);
          const p = [
            position[0] + e.face.normal.x,
            position[1] + e.face.normal.y,
            position[2] + e.face.normal.z,
          ];
          const snapped = snapToGrid(p);
          if (isInsideDynamic(snapped)) {
            addBlock(snapped, selectedBlockType);
          }
        }
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      {map ? (
        <meshStandardMaterial 
          key={`textured-${map.uuid}`}
          color={blockColor}
          map={map}
          transparent={isTransparent}
          opacity={isTransparent ? 0.6 : 1}
          emissive={isSelected ? '#0055ff' : (hovered ? 'white' : 'black')}
          emissiveIntensity={isSelected ? 0.5 : (hovered ? 0.2 : 0)}
        />
      ) : (
        <meshStandardMaterial 
          key="untextured"
          color={blockColor}
          transparent={isTransparent}
          opacity={isTransparent ? 0.6 : 1}
          emissive={isSelected ? '#0055ff' : (hovered ? 'white' : 'black')}
          emissiveIntensity={isSelected ? 0.5 : (hovered ? 0.2 : 0)}
        />
      )}
    </mesh>
  );
});

export default Block;

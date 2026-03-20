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

  const Block = memo(({ id, position, type, rotation = 0, isFlipped = false }) => {
  const { 
    addBlock, 
    removeBlock, 
    rotateBlock,
    flipBlock,
    selectedBlockType, 
    isDragging, 
    availableBlocks, 
    worldSize, 
    selectedBlocksIDs, 
    selectBlock, 
    shadowsEnabled, 
    brushMode, 
    isEraseMode 
  } = useBlockStore();
  const [hovered, setHovered] = useState(false);
  const [maps, setMaps] = useState({ all: null, top: null, side: null, bottom: null });
  const mountedRef = useRef(true);

  const blockConfig = availableBlocks.find((b) => b.id === type);
  const isSelected = selectedBlocksIDs.includes(id);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const config = blockConfig;
    if (!config) return;

    const loadMaps = async () => {
      const results = {};
      
      if (config.textures) {
        // Carrega texturas individuais
        if (config.textures.top) results.top = await loadTextureWithFallback(config.textures.top);
        if (config.textures.side) results.side = await loadTextureWithFallback(config.textures.side);
        if (config.textures.bottom) results.bottom = await loadTextureWithFallback(config.textures.bottom);
        if (config.textures.all) results.all = await loadTextureWithFallback(config.textures.all);
      } else if (config.texture) {
        results.all = await loadTextureWithFallback(config.texture);
      } else {
        results.all = null;
      }

      if (mountedRef.current) {
        setMaps(results);
      }
    };

    loadMaps();
  }, [type, blockConfig]);

  const isTransparent = blockConfig?.transparent || (type && (type.includes('glass') || type.includes('ice')));
  const isCutout = blockConfig?.renderType === 'plant' || blockConfig?.renderType === 'torch' || (blockConfig?.name && blockConfig.name.includes('leaves'));
  
  const fallbackColor = blockConfig?.color || '#888888';
  const blockColor = isSelected ? '#aaddff' : ((maps.all || maps.side) ? '#ffffff' : fallbackColor);

  const renderType = blockConfig?.renderType || 'cube';

  const isInsideDynamic = (pos) => {
    const [x, y, z] = pos;
    const halfW = worldSize.width / 2;
    const halfD = worldSize.depth / 2;
    return x >= -halfW && x <= halfW && y >= 0 && y <= worldSize.height && z >= -halfD && z <= halfD;
  };

  const getMaterial = (map) => (
    <meshStandardMaterial 
      key={map ? `textured-${map.uuid}` : "untextured"}
      color={blockColor}
      map={map}
      transparent={isTransparent || isCutout}
      opacity={isTransparent ? 0.6 : 1}
      alphaTest={isCutout ? 0.5 : 0}
      side={renderType === 'plant' ? THREE.DoubleSide : THREE.FrontSide}
      emissive={isSelected ? '#0055ff' : (hovered ? 'white' : 'black')}
      emissiveIntensity={isSelected ? 0.5 : (hovered ? 0.2 : 0)}
    />
  );

  return (
    <group 
      position={position} 
      rotation={[isFlipped ? Math.PI : 0, rotation * (Math.PI / 2), 0]}
      userData={{ isTarget: true, isBlock: true, id, type }}
      onPointerOver={(e) => { 
        if (brushMode) {
          const state = useBlockStore.getState();
          if (state.isPainting) {
            state.addBrushMark(position);
          }
          return;
        }
        e.stopPropagation(); 
        setHovered(true); 
      }}
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

        if (isEraseMode) {
          removeBlock(id);
          return;
        }

        if (e.shiftKey && e.altKey) {
          removeBlock(id);
          return;
        }
        
        if (e.ctrlKey || e.metaKey || e.shiftKey) {
          selectBlock(id, true);
          return;
        }

        if (e.altKey && e.ctrlKey && !isDragging) {
          flipBlock(id);
          return;
        }

        if (e.altKey && !isDragging) {
          rotateBlock(id);
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
      {renderType === 'cube' && (
        <mesh castShadow={shadowsEnabled} receiveShadow={shadowsEnabled}>
          <boxGeometry args={[1, 1, 1]} />
          {maps.side || maps.top ? (
            <>
              {getMaterial(maps.side || maps.all)} {/* X+ */}
              {getMaterial(maps.side || maps.all)} {/* X- */}
              {getMaterial(maps.top || maps.all)}  {/* Y+ */}
              {getMaterial(maps.bottom || maps.all)} {/* Y- */}
              {getMaterial(maps.side || maps.all)} {/* Z+ */}
              {getMaterial(maps.side || maps.all)} {/* Z- */}
            </>
          ) : (
             getMaterial(maps.all)
          )}
        </mesh>
      )}
      {renderType === 'slab' && (
        <mesh position={[0, -0.25, 0]} castShadow={shadowsEnabled} receiveShadow={shadowsEnabled}>
          <boxGeometry args={[1, 0.5, 1]} />
          {maps.side || maps.top ? (
            <>
              {getMaterial(maps.side || maps.all)} 
              {getMaterial(maps.side || maps.all)} 
              {getMaterial(maps.top || maps.all)}  
              {getMaterial(maps.bottom || maps.all)} 
              {getMaterial(maps.side || maps.all)} 
              {getMaterial(maps.side || maps.all)} 
            </>
          ) : getMaterial(maps.all)}
        </mesh>
      )}
      {renderType === 'torch' && (
        <mesh position={[0, -0.2, 0]} castShadow={shadowsEnabled} receiveShadow={shadowsEnabled}>
          <boxGeometry args={[0.125, 0.6, 0.125]} />
          {getMaterial(maps.all || maps.side)}
        </mesh>
      )}
      {renderType === 'plant' && (
        <>
          <mesh castShadow={shadowsEnabled} receiveShadow={shadowsEnabled}>
            <planeGeometry args={[1, 1]} />
            {getMaterial(maps.all || maps.side)}
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow={shadowsEnabled} receiveShadow={shadowsEnabled}>
            <planeGeometry args={[1, 1]} />
            {getMaterial(maps.all || maps.side)}
          </mesh>
        </>
      )}
      {renderType === 'stairs' && (
        <group>
          {/* Base da escada (Slab inferior) */}
          <mesh position={[0, -0.25, 0]} castShadow={shadowsEnabled} receiveShadow={shadowsEnabled}>
            <boxGeometry args={[1, 0.5, 1]} />
            {maps.side || maps.top ? (
              <>
                {getMaterial(maps.side || maps.all)} 
                {getMaterial(maps.side || maps.all)} 
                {getMaterial(maps.top || maps.all)}  
                {getMaterial(maps.bottom || maps.all)} 
                {getMaterial(maps.side || maps.all)} 
                {getMaterial(maps.side || maps.all)} 
              </>
            ) : getMaterial(maps.all)}
          </mesh>
          {/* Parte superior da escada (Meio bloco atrás) */}
          <mesh position={[0, 0.25, 0.25]} castShadow={shadowsEnabled} receiveShadow={shadowsEnabled}>
            <boxGeometry args={[1, 0.5, 0.5]} />
            {maps.side || maps.top ? (
              <>
                {getMaterial(maps.side || maps.all)} 
                {getMaterial(maps.side || maps.all)} 
                {getMaterial(maps.top || maps.all)}  
                {getMaterial(maps.bottom || maps.all)} 
                {getMaterial(maps.side || maps.all)} 
                {getMaterial(maps.side || maps.all)} 
              </>
            ) : getMaterial(maps.all)}
          </mesh>
        </group>
      )}
    </group>
  );
});

export default Block;

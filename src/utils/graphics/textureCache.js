import * as THREE from 'three';

const textureCache = {};
const loader = new THREE.TextureLoader();

export function getTexture(url, callback) {
  if (textureCache[url]) {
    callback(textureCache[url]);
    return;
  }
  
  loader.load(
    url,
    (texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      
      textureCache[url] = texture;
      callback(texture);
    },
    undefined,
    (err) => {
      console.warn("Failed loading texture:", url, err);
      callback(null);
    }
  );
}

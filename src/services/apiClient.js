const cache = new Map();

export async function fetchWithCache(url, options = {}) {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.warn(`Failed to fetch ${url}`, error);
    throw error;
  }
}

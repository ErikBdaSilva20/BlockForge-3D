const PROJECT_KEY = 'blockforge-project';

export function saveProject(blocks) {
  try {
    const serialized = JSON.stringify(blocks);
    localStorage.setItem(PROJECT_KEY, serialized);
    return true;
  } catch (error) {
    console.error("Failed to save project to localStorage", error);
    return false;
  }
}

export function loadProject() {
  try {
    const data = localStorage.getItem(PROJECT_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse project from localStorage", error);
    return null;
  }
}

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

export function downloadProjectFile(blocks) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blocks));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `blockforge_project_${Date.now()}.json`);
  document.body.appendChild(dlAnchorElem);
  dlAnchorElem.click();
  dlAnchorElem.remove();
}

export function loadProjectFile(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed)) {
        callback(parsed);
      } else {
        alert("Arquivo inv\u00e1lido!");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao ler o arquivo JSON.");
    }
  };
  reader.readAsText(file);
}

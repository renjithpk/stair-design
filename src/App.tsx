import { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { StairDiagram } from './components/StairDiagram';
import { calcGeometry } from './utils/geometry';
import { DEFAULT_CONFIG, STORAGE_KEY } from './utils/defaults';

function loadConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return DEFAULT_CONFIG;
}

export default function App() {
  const [config, setConfig] = useState(loadConfig);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const geo = useMemo(() => calcGeometry(config), [config]);

  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(config)), 150);
    return () => clearTimeout(t);
  }, [config]);

  function resetConfig() {
    localStorage.removeItem(STORAGE_KEY);
    setConfig(DEFAULT_CONFIG);
  }

  return (
    <div className="app-container">
      <Sidebar
        config={config}
        onChange={setConfig}
        geo={geo}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
        onReset={resetConfig}
      />
      <StairDiagram geo={geo} sidebarOpen={sidebarOpen} onShowSidebar={() => setSidebarOpen(true)} />
    </div>
  );
}

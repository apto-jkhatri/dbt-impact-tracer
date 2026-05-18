import React, { useState } from 'react';
import ManifestUploader from './components/ManifestUploader';
import ModelSelector from './components/ModelSelector';
import ImpactAnalyzer from './components/ImpactAnalyzer';
import { analyzeImpactPath } from './utils/graphTraversal';

function App() {
  const linkedInUrl = 'https://www.linkedin.com/in/jaydeepkhatri/';

  const [manifest, setManifest] = useState(null);
  const [allModels, setAllModels] = useState([]);
  const [selectedSources, setSelectedSources] = useState(new Set());
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectorResetKey, setSelectorResetKey] = useState(0);

  const handleManifestUpload = (parsedManifest) => {
    setManifest(parsedManifest);
    const models = extractModels(parsedManifest);
    setAllModels(models);
    setSelectedSources(new Set());
    setSelectedTarget(null);
    setAnalysisResults(null);
  };

  const extractModels = (manifest) => {
    if (!manifest || !manifest.nodes) return [];
    return Object.entries(manifest.nodes)
      .filter(([key, node]) => node.resource_type === 'model')
      .map(([key, node]) => ({
        uniqueId: key,
        name: node.name,
        schema: node.schema,
        depends_on: node.depends_on?.nodes || []
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleSourceToggle = (modelId) => {
    const newSources = new Set(selectedSources);
    if (newSources.has(modelId)) {
      newSources.delete(modelId);
    } else {
      newSources.add(modelId);
    }
    setSelectedSources(newSources);
  };

  const handleTargetSelect = (modelId) => {
    setSelectedTarget(selectedTarget === modelId ? null : modelId);
  };

  const handleAnalyze = () => {
    if (selectedSources.size === 0) {
      alert('Please select at least one source model');
      return;
    }
    if (!selectedTarget) {
      alert('Please select a target model');
      return;
    }

    const results = analyzeImpact(selectedSources, selectedTarget, allModels);
    setAnalysisResults(results);
  };

  const analyzeImpact = (sources, target, models) => {
    const modelMap = new Map(models.map(m => [m.uniqueId, m]));

    // Use the extracted algorithm
    const pathModels = analyzeImpactPath(sources, target, models);

    // Calculate source+ count (all models downstream of sources)
    // This simulates what `dbt build -s source+` would rebuild
    const sourcePlusModels = new Set(sources);
    const queue = Array.from(sources);
    const visited = new Set(sources);

    while (queue.length > 0) {
      const current = queue.shift();
      models.forEach(model => {
        if (!visited.has(model.uniqueId) && model.depends_on.includes(current)) {
          visited.add(model.uniqueId);
          sourcePlusModels.add(model.uniqueId);
          queue.push(model.uniqueId);
        }
      });
    }

    const pathNames = pathModels
      .map(id => modelMap.get(id)?.name)
      .filter(Boolean)
      .sort();

    const sourceNames = Array.from(sources)
      .map(id => modelMap.get(id)?.name)
      .filter(Boolean)
      .sort();

    const targetModel = modelMap.get(target);
    const targetName = targetModel?.name;

    return {
      success: pathModels.length > 0,
      sourceCount: selectedSources.size,
      pathCount: pathNames.length,
      sourcePlusCount: sourcePlusModels.size,
      sourceNames,
      targetName,
      allPathNames: pathNames,
      command: `dbt build --select ${pathNames.join(' ')}`
    };
  };

  const handleReset = () => {
    setManifest(null);
    setAllModels([]);
    setSelectedSources(new Set());
    setSelectedTarget(null);
    setAnalysisResults(null);
    setSelectorResetKey(prev => prev + 1);
  };

  const handleSelectionReset = () => {
    setSelectedSources(new Set());
    setSelectedTarget(null);
    setAnalysisResults(null);
    setSelectorResetKey(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>dbt Impact Tracer</h1>
        <p>Visualize dependency paths and run only the models affected by your changes</p>
      </header>

      <main style={{ padding: '1rem 0' }}>
        {!manifest ? (
          <ManifestUploader onUpload={handleManifestUpload} />
        ) : (
          <>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {allModels.length} models loaded
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSelectionReset}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    background: 'transparent',
                    border: '1px solid var(--color-border-secondary)',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer'
                  }}
                >
                  Reset selections
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    background: 'transparent',
                    border: '1px solid var(--color-border-secondary)',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer'
                  }}
                >
                  Upload new manifest
                </button>
              </div>
            </div>

            <ModelSelector
              key={selectorResetKey}
              allModels={allModels}
              selectedSources={selectedSources}
              selectedTarget={selectedTarget}
              onSourceToggle={handleSourceToggle}
              onTargetSelect={handleTargetSelect}
            />

            <button
              onClick={handleAnalyze}
              style={{
                width: '100%',
                padding: '12px',
                fontWeight: '500',
                background: 'var(--color-background-info)',
                color: 'var(--color-text-info)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '1.5rem'
              }}
            >
              Show impact path
            </button>

            {analysisResults && (
              <ImpactAnalyzer results={analysisResults} />
            )}
          </>
        )}
      </main>

      <footer style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-primary)', textAlign: 'center', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
        <p>Open source • <a href="https://github.com/apto-jkhatri/dbt-impact-tracer" target="_blank" rel="noopener noreferrer">GitHub</a> • MIT License</p>
        <p>
          Made with Love by{' '}
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
            Jaydeep Khatri
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

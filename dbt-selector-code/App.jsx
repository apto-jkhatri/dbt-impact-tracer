import React, { useState } from 'react';
import ManifestUploader from './components/ManifestUploader';
import ModelSelector from './components/ModelSelector';
import ImpactAnalyzer from './components/ImpactAnalyzer';
import './styles/main.css';

function App() {
  const [manifest, setManifest] = useState(null);
  const [allModels, setAllModels] = useState([]);
  const [selectedSources, setSelectedSources] = useState(new Set());
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

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

    // Step 1: Backward from target - find all models that lead to target
    const allReachableToTarget = new Set();
    const queue = [target];
    const visited = new Set([target]);

    while (queue.length > 0) {
      const current = queue.shift();
      allReachableToTarget.add(current);

      const currentModel = modelMap.get(current);
      if (!currentModel) continue;

      currentModel.depends_on.forEach(depId => {
        if (!visited.has(depId)) {
          visited.add(depId);
          queue.push(depId);
        }
      });
    }

    // Step 2: Forward from sources - find all models reachable from sources
    const reachableFromSources = new Set(sources);
    const fwdQueue = Array.from(sources);
    const fwdVisited = new Set(sources);

    while (fwdQueue.length > 0) {
      const current = fwdQueue.shift();
      const currentModel = modelMap.get(current);
      if (!currentModel) continue;

      models.forEach(model => {
        if (fwdVisited.has(model.uniqueId)) return;

        if (model.depends_on.includes(current)) {
          fwdVisited.add(model.uniqueId);
          reachableFromSources.add(model.uniqueId);
          fwdQueue.push(model.uniqueId);
        }
      });
    }

    // Step 3: Intersection - models in both sets
    const pathModels = Array.from(sources);
    reachableFromSources.forEach(modelId => {
      if (allReachableToTarget.has(modelId) && !sources.has(modelId)) {
        pathModels.push(modelId);
      }
    });

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
      sourceNames,
      targetName,
      allPathNames: pathNames,
      command: `dbt build --select ${pathNames.join(' ')}`
    };
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      {!manifest ? (
        <ManifestUploader onUpload={handleManifestUpload} />
      ) : (
        <>
          <ModelSelector
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
    </div>
  );
}

export default App;

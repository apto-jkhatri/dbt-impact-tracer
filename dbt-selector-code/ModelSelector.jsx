import React, { useState } from 'react';

function ModelSelector({
  allModels,
  selectedSources,
  selectedTarget,
  onSourceToggle,
  onTargetSelect
}) {
  const [sourceSearch, setSourceSearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');

  const filterModels = (models, query) => {
    return models.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
  };

  const filteredSources = filterModels(allModels, sourceSearch);
  const filteredTargets = filterModels(allModels, targetSearch);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '1.5rem'
    }}>
      {/* Source Models Column */}
      <div>
        <label style={{
          display: 'block',
          fontWeight: 500,
          fontSize: '15px',
          marginBottom: '8px',
          color: 'var(--color-text-primary)'
        }}>
          Source models (changed)
        </label>
        <input
          type="text"
          placeholder="Search source models..."
          value={sourceSearch}
          onChange={(e) => setSourceSearch(e.target.value)}
          style={{
            width: '100%',
            marginBottom: '8px',
            padding: '8px',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '13px'
          }}
        />
        <div style={{
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--color-background-secondary)',
          maxHeight: '250px',
          overflowY: 'auto',
          padding: '8px'
        }}>
          {filteredSources.map(model => (
            <label
              key={model.uniqueId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: 'var(--border-radius-md)',
                marginBottom: '4px',
                backgroundColor: selectedSources.has(model.uniqueId)
                  ? 'var(--color-background-info)'
                  : 'transparent'
              }}
            >
              <input
                type="checkbox"
                checked={selectedSources.has(model.uniqueId)}
                onChange={() => onSourceToggle(model.uniqueId)}
                style={{ cursor: 'pointer' }}
              />
              <span>{model.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Target Model Column */}
      <div>
        <label style={{
          display: 'block',
          fontWeight: 500,
          fontSize: '15px',
          marginBottom: '8px',
          color: 'var(--color-text-primary)'
        }}>
          Target model (check effect)
        </label>
        <input
          type="text"
          placeholder="Search target model..."
          value={targetSearch}
          onChange={(e) => setTargetSearch(e.target.value)}
          style={{
            width: '100%',
            marginBottom: '8px',
            padding: '8px',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '13px'
          }}
        />
        <div style={{
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--color-background-secondary)',
          maxHeight: '250px',
          overflowY: 'auto',
          padding: '8px'
        }}>
          {filteredTargets.map(model => (
            <label
              key={model.uniqueId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: 'var(--border-radius-md)',
                marginBottom: '4px',
                backgroundColor: selectedTarget === model.uniqueId
                  ? 'var(--color-background-success)'
                  : 'transparent'
              }}
            >
              <input
                type="radio"
                name="target"
                checked={selectedTarget === model.uniqueId}
                onChange={() => onTargetSelect(model.uniqueId)}
                style={{ cursor: 'pointer' }}
              />
              <span>{model.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ModelSelector;

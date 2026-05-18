import React, { useState } from 'react';

function ModelSelector({
  allModels,
  selectedSources,
  selectedTargets,
  onSourceToggle,
  onTargetToggle
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
          {selectedSources.size > 0 && (
            <span style={{ fontWeight: 400, color: 'var(--color-text-info)', marginLeft: '8px' }}>
              {selectedSources.size} selected
            </span>
          )}
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
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '8px'
        }}>
          {filteredSources.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '13px' }}>
              No models found
            </div>
          ) : (
            filteredSources.map(model => (
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
            ))
          )}
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
          {selectedTargets.size > 0 && (
            <span style={{ fontWeight: 400, color: 'var(--color-text-success)', marginLeft: '8px' }}>
              {selectedTargets.size} selected
            </span>
          )}
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
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '8px'
        }}>
          {filteredTargets.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '13px' }}>
              No models found
            </div>
          ) : (
            filteredTargets.map(model => (
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
                  backgroundColor: selectedTargets.has(model.uniqueId)
                    ? 'var(--color-background-success)'
                    : 'transparent'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTargets.has(model.uniqueId)}
                  onChange={() => onTargetToggle(model.uniqueId)}
                  style={{ cursor: 'pointer' }}
                />
                <span>{model.name}</span>
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ModelSelector;

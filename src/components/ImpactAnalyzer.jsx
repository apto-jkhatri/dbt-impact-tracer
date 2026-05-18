import React, { useState } from 'react';

function ImpactAnalyzer({ results }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(results.command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(results.command)
    );
    element.setAttribute('download', 'dbt_build_command.sh');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!results.success) {
    return (
      <div style={{
        padding: '1rem',
        background: 'var(--color-background-danger)',
        borderRadius: 'var(--border-radius-md)',
        color: 'var(--color-text-danger)',
        border: '1px solid var(--color-border-danger)'
      }}>
        ✗ No path found from sources to target. The selected models may not be connected in the dependency graph.
      </div>
    );
  }

  // Compare against source+ (what `dbt build -s model+` would rebuild)
  const sourcePlusCount = results.sourcePlusCount || results.pathCount;
  const savePercentage = sourcePlusCount > 0 
    ? Math.round((1 - results.pathCount / sourcePlusCount) * 100)
    : 0;

  return (
    <div>
      {/* Summary Stats */}
      <div style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-md)',
        border: '0.5px solid var(--color-border-tertiary)'
      }}>
        <div style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          marginBottom: '8px'
        }}>
          Summary
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '12px'
        }}>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--color-text-primary)'
            }}>
              {results.sourceCount}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)'
            }}>
              source models
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--color-text-danger)'
            }}>
              {sourcePlusCount}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)'
            }}>
              source+ models
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--color-text-primary)'
            }}>
              {results.pathCount}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)'
            }}>
              models to rebuild
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--color-text-success)'
            }}>
              {savePercentage}%
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)'
            }}>
              saved vs source+
            </div>
          </div>
        </div>
      </div>

      {/* Impact Path Visualization */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          fontWeight: 500,
          fontSize: '14px',
          marginBottom: '12px',
          color: 'var(--color-text-primary)'
        }}>
          Impact path
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '12px',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-md)',
          border: '0.5px solid var(--color-border-tertiary)',
          minHeight: '80px',
          lineHeight: '1.8'
        }}>
          {/* Source Models */}
          {results.sourceNames.map((name, idx) => (
            <React.Fragment key={`source-${idx}`}>
              <div style={{
                padding: '8px 12px',
                background: 'var(--color-background-info)',
                color: 'var(--color-text-info)',
                border: '0.5px solid var(--color-border-info)',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '12px',
                fontWeight: 500
              }}>
                {name}
              </div>
              {idx < results.sourceNames.length - 1 && (
                <div style={{ color: 'var(--color-text-tertiary)' }}>
                  ,
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Arrow */}
          <div style={{
            color: 'var(--color-text-tertiary)',
            fontSize: '18px',
            marginLeft: '4px'
          }}>
            →
          </div>

          {/* Intermediate Models */}
          {results.allPathNames
            .filter(name => !results.sourceNames.includes(name) && name !== results.targetName)
            .map((name, idx) => (
              <React.Fragment key={`inter-${idx}`}>
                <div style={{
                  padding: '8px 12px',
                  background: 'var(--color-background-primary)',
                  border: '0.5px solid var(--color-border-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  {name}
                </div>
                <div style={{ color: 'var(--color-text-tertiary)' }}>
                  →
                </div>
              </React.Fragment>
            ))}

          {/* Target Model */}
          <div style={{
            padding: '8px 12px',
            background: 'var(--color-background-success)',
            color: 'var(--color-text-success)',
            border: '0.5px solid var(--color-border-success)',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '12px',
            fontWeight: 500
          }}>
            {results.targetName}
          </div>
        </div>
      </div>

      {/* Command Output */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          marginBottom: '8px'
        }}>
          Your dbt build command
        </div>
        <div style={{
          background: 'var(--color-background-secondary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--color-text-primary)',
          wordBreak: 'break-all',
          lineHeight: '1.8',
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          {results.command}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleCopy}
          style={{
            flex: 1,
            padding: '12px',
            fontWeight: 500,
            background: copied ? 'var(--color-background-success)' : 'var(--color-background-primary)',
            color: copied ? 'var(--color-text-success)' : 'var(--color-text-primary)',
            border: `0.5px solid ${copied ? 'var(--color-border-success)' : 'var(--color-border-secondary)'}`,
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          {copied ? '✓ Copied!' : 'Copy command'}
        </button>
        <button
          onClick={handleDownload}
          style={{
            flex: 1,
            padding: '12px',
            fontWeight: 500,
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-secondary)',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Download .sh
        </button>
      </div>
    </div>
  );
}

export default ImpactAnalyzer;

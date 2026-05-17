import React, { useRef, useState } from 'react';

function ManifestUploader({ onUpload }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    if (!file.name.endsWith('.json')) {
      alert('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const manifest = JSON.parse(event.target.result);
        if (!manifest.nodes) {
          alert('Invalid manifest.json: missing "nodes" property');
          return;
        }
        onUpload(manifest);
      } catch (err) {
        alert(`Error parsing JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--color-border-info)' : 'var(--color-border-secondary)'}`,
          borderRadius: 'var(--border-radius-lg)',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? 'var(--color-background-info)' : 'var(--color-background-secondary)',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📁</div>
        <div style={{ fontWeight: 500, fontSize: '16px', marginBottom: '0.5rem' }}>
          Drop manifest.json here
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          or click to browse
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div style={{
        marginTop: '1.5rem',
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        lineHeight: '1.8'
      }}>
        <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>💡 How to get manifest.json:</p>
        <ol style={{ marginLeft: '20px', marginTop: 0 }}>
          <li>Navigate to your dbt project directory</li>
          <li>Run: <code>dbt compile</code></li>
          <li>Find: <code>target/manifest.json</code></li>
          <li>Upload it here</li>
        </ol>
      </div>
    </div>
  );
}

export default ManifestUploader;

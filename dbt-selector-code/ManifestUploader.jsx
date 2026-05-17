import React, { useRef } from 'react';

function ManifestUploader({ onUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const manifest = JSON.parse(event.target.result);
        onUpload(manifest);
      } catch (err) {
        alert(`Error parsing JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: 500,
        fontSize: '15px'
      }}>
        Upload manifest.json from your dbt project
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{
          width: '100%',
          marginBottom: '1rem',
          padding: '8px'
        }}
      />
      <div style={{
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        lineHeight: '1.6'
      }}>
        <p>💡 How to get manifest.json:</p>
        <ol style={{ marginLeft: '20px' }}>
          <li>Run: <code>dbt compile</code></li>
          <li>Find: <code>target/manifest.json</code></li>
          <li>Upload it here</li>
        </ol>
      </div>
    </div>
  );
}

export default ManifestUploader;

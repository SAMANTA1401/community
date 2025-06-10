// LandingPage.jsx
import React from 'react';

export default function LandingPage({ onSelectApp }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Choose an App</h1>
      <button onClick={() => onSelectApp('app1')} style={{ margin: '10px', padding: '10px 20px' }}>
        Go to App 1
      </button>
      <button onClick={() => onSelectApp('app2')} style={{ margin: '10px', padding: '10px 20px' }}>
        Go to App 2
      </button>
    </div>
  );
}

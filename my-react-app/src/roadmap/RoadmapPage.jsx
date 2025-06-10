

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import D3Roadmap from './D3Roadmap';

const RoadmapPage = () => {
  const { career } = useParams();
  const [currentState, setCurrentState] = useState('');
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState('degree'); // degree or skill
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    setError('');
    // Optionally clear old roadmap while generating:
    // setRoadmapData(null);

    try {
      const response = await fetch('http://localhost:8000/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          career,
          current_state: currentState,
          target,
          mode
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received roadmap:', data);
      setRoadmapData(data);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // When mode changes, reset loading and error (and optionally roadmapData)
  useEffect(() => {
    setLoading(false);
    setError('');
    setRoadmapData(null); // Optional: clear old roadmap when switching mode
  }, [mode]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>{career} Roadmap Generator</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Current Education State:{' '}
          <input
            type="text"
            value={currentState}
            onChange={(e) => setCurrentState(e.target.value)}
            placeholder="e.g. 12th pass, BSc, Diploma"
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Target Role (Optional):{' '}
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g. Data Scientist"
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Roadmap Mode:{' '}
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="degree">Degree-based Roadmap</option>
            <option value="skill">Skill-based Roadmap</option>
          </select>
        </label>
      </div>

      <button onClick={handleGenerateRoadmap} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Roadmap'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

      {roadmapData && (
        <>
          <h3 style={{ marginTop: '20px' }}>
            Generated Roadmap ({mode} mode)
          </h3>
          <D3Roadmap key={mode} data={roadmapData} />
        </>
      )}
    </div>
  );
};

export default RoadmapPage;

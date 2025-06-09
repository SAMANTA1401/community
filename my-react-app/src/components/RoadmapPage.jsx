import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import D3Roadmap from './D3Roadmap';

const RoadmapPage = () => {
  const { career } = useParams();
  const [currentState, setCurrentState] = useState('');
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState('degree'); // degree or skill
  const [roadmapData, setRoadmapData] = useState(null);

  const handleGenerateRoadmap = () => {
    // Mock roadmap generation logic — in real app, fetch from backend
    const mockRoadmap = {
      title: `${career} Roadmap`,
      stages: [
        {
          stage: 1,
          title: 'Foundation',
          topics: [
            { topic: 'Basics', subtopics: ['Introduction', 'Fundamentals'] }
          ]
        },
        {
          stage: 2,
          title: 'Intermediate',
          topics: [
            { topic: 'Core Concepts', subtopics: ['Topic A', 'Topic B'] }
          ]
        },
        {
          stage: 3,
          title: 'Advanced',
          topics: [
            { topic: 'Specialization', subtopics: ['Sub A', 'Sub B'] }
          ]
        }
      ]
    };

    setRoadmapData(mockRoadmap);
  };

  return (
    <div>
      <h2>{career} Roadmap Generator</h2>
      <div>
        <label>
          Current Education State:
          <input
            type="text"
            value={currentState}
            onChange={(e) => setCurrentState(e.target.value)}
            placeholder="e.g. 12th pass, BSc, Diploma"
          />
        </label>
      </div>
      <div>
        <label>
          Target Role (Optional):
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g. Data Scientist"
          />
        </label>
      </div>
      <div>
        <label>
          Roadmap Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="degree">Degree-based Roadmap</option>
            <option value="skill">Skill-based Roadmap</option>
          </select>
        </label>
      </div>
      <button onClick={handleGenerateRoadmap}>Generate Roadmap</button>

      {roadmapData && (
        <>
          <h3>Generated Roadmap ({mode} mode)</h3>
          <D3Roadmap data={roadmapData} />
        </>
      )}
    </div>
  );
};

export default RoadmapPage;

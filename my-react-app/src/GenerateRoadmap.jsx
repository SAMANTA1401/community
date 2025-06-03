// src/GenerateRoadmap.jsx
import React, { useState } from 'react';
import axios from 'axios';
import RoadmapFlow from './RoadmapFlow';
import { convertRoadmapToFlow } from './roadmapUtils';

const GenerateRoadmap = () => {
  const [goal, setGoal] = useState('');
  const [flowData, setFlowData] = useState(null);

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:8000/generate-roadmap', { goal });
      const roadmap = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      const { nodes, edges } = convertRoadmapToFlow(roadmap);
      setFlowData({ nodes, edges });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>AI Roadmap Generator</h2>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your goal (e.g., AI Engineer)"
      />
      <button onClick={handleSubmit}>Generate</button>

      {flowData && <RoadmapFlow nodes={flowData.nodes} edges={flowData.edges} />}
    </div>
  );
};

export default GenerateRoadmap;

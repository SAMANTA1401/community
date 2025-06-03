// src/RoadmapFlow.jsx
import React from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

const RoadmapFlow = ({ nodes, edges }) => {
  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
};

export default RoadmapFlow;

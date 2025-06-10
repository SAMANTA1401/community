import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './roadmap/LandingPage';
import CareerPage from './roadmap/CareerPage';
import RoadmapPage from './roadmap/RoadmapPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/careers/:field" element={<CareerPage />} />
        <Route path="/roadmap/:career" element={<RoadmapPage />} />
      </Routes>
    </Router>
  );
}

export default App;

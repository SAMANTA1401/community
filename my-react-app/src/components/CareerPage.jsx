import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const mockCareers = {
  STEM: ['AI Engineer', 'Data Scientist', 'Mechanical Engineer'],
  Arts: ['Graphic Designer', 'Musician', 'Filmmaker'],
  Business: ['Marketing Manager', 'Financial Analyst'],
  Law: ['Corporate Lawyer', 'Public Prosecutor'],
  Medicine: ['Doctor', 'Nurse', 'Pharmacist']
};

const CareerPage = () => {
  const { field } = useParams();
  const navigate = useNavigate();

  const handleCareerSelect = (career) => {
    navigate(`/roadmap/${career}`);
  };

  const careers = mockCareers[field] || [];

  return (
    <div>
      <h2>Careers in {field}</h2>
      {careers.map((career) => (
        <button key={career} onClick={() => handleCareerSelect(career)}>
          {career}
        </button>
      ))}
    </div>
  );
};

export default CareerPage;

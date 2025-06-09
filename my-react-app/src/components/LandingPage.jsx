import React from 'react';
import { useNavigate } from 'react-router-dom';

const fields = ['STEM', 'Arts', 'Business', 'Law', 'Medicine'];

const LandingPage = () => {
  const navigate = useNavigate();

  const handleFieldSelect = (field) => {
    navigate(`/careers/${field}`);
  };

  return (
    <div>
      <h2>Select your Field of Interest</h2>
      {fields.map((field) => (
        <button key={field} onClick={() => handleFieldSelect(field)}>
          {field}
        </button>
      ))}
    </div>
  );
};

export default LandingPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);

  useEffect(() => {
    // Fetch fields from backend
    axios.get('http://localhost:8000/fields')
      .then(response => {
        setFields(response.data.fields);
      })
      .catch(error => {
        console.error('Error fetching fields:', error);
      });
  }, []);

  const handleFieldSelect = (field) => {
    navigate(`/careers/${field}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Select your Field of Interest</h2>
      {fields.length === 0 ? (
        <p>Loading fields...</p>
      ) : (
        fields.map((field) => (
          <button
            key={field}
            onClick={() => handleFieldSelect(field)}
            style={{
              display: 'block',
              marginBottom: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {field}
          </button>
        ))
      )}
    </div>
  );
};

export default LandingPage;

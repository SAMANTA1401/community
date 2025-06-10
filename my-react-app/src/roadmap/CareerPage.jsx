import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CareerPage = () => {
  const { field } = useParams();
  const navigate = useNavigate();

  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch careers for selected field
    axios.get(`http://localhost:8000/careers/${field}`)
      .then(response => {
        setCareers(response.data.careers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching careers:', error);
        setError('Failed to fetch careers.');
        setLoading(false);
      });
  }, [field]);

  const handleCareerSelect = (career) => {
    navigate(`/roadmap/${career}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Careers in {field}</h2>

      {loading && <p>Loading careers...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {careers.length > 0 ? (
        careers.map((career) => (
          <button
            key={career}
            onClick={() => handleCareerSelect(career)}
            style={{
              display: 'block',
              marginBottom: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {career}
          </button>
        ))
      ) : (!loading && !error) && (
        <p>No careers found for this field.</p>
      )}
    </div>
  );
};

export default CareerPage;

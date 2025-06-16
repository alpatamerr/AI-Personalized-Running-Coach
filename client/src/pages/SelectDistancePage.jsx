import React from 'react';
import { useNavigate } from 'react-router-dom';

const distances = ['5k', '10k', 'Half Marathon', 'Marathon', 'Ultramarathon'];

const SelectDistancePage = () => {
  const navigate = useNavigate();

  const handleSelect = (distance) => {
    localStorage.setItem('selectedDistance', distance);
    navigate('/select-time');
  };

  return (
    <div className="goal-setting-container">
      <h1>What distance do you want to run?</h1>
      <div>
        {distances.map(d => (
          <div key={d} onClick={() => handleSelect(d)} style={{ cursor: 'pointer', margin: '1em 0', padding: '1em', background: '#222', borderRadius: '12px', color: '#fff', textAlign: 'center' }}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectDistancePage; 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SelectGoalPage.css';

const goals = [
  { key: 'race', label: 'Race', description: 'Personalized plan for your next big event.', emoji: '🏁' },
  { key: 'distance', label: 'Run a specific distance', description: 'Pick any distance, from 5k to ultramarathon.', emoji: '⛰️' },
];

const SelectGoalPage = () => {
  const navigate = useNavigate();

  const handleSelect = (goal) => {
    localStorage.setItem('selectedGoal', goal.key);
    navigate('/select-distance');
  };

  return (
    <div className="select-goal-bg">
      <div className="select-goal-container">
        <h1 className="select-goal-title">Choose Your Adventure</h1>
        <p className="select-goal-subtitle">What inspires you most right now?</p>
        <div className="select-goal-cards">
          {goals.map(goal => (
            <button
              key={goal.key}
              className="select-goal-card"
              onClick={() => handleSelect(goal)}
            >
              <span className="select-goal-emoji">{goal.emoji}</span>
              <span className="select-goal-label">{goal.label}</span>
              <span className="select-goal-desc">{goal.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectGoalPage; 
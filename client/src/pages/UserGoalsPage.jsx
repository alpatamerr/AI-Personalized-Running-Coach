import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalSurveyForm from '../components/GoalSurveyForm';
import '../styles/UserGoalsPage.css';

const UserGoalsPage = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();
        const storedUserId = localStorage.getItem('userId');
        
        if (data.userId && data.userId === storedUserId) {
          setUserId(data.userId);
        } else {
          throw new Error('User ID mismatch');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="user-goals-page">
      <div className="page-header">
        <h1>Set Your Running Goals</h1>
        <p>Choose your target distances and times</p>
      </div>
      <GoalSurveyForm userId={userId} />
    </div>
  );
};

export default UserGoalsPage;
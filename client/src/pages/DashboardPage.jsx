import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserGoals from '../components/UserGoals';
import '../styles/DashboardPage.css';
import '../styles/GeneratePlanButton.css';
import GeneratePlanButton from '../components/GeneratePlanButton';

const DashboardPage = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [stravaUserId, setStravaUserId] = useState(null);
  const navigate = useNavigate();

  // On mount: load userId and fetch stravaUserId dynamically
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/login');
      return;
    }
    setUserId(storedUserId);

    // Dynamically get the strava demo user id from backend
    fetch('/api/plans/strava-user-id')
      .then(res => res.json())
      .then(data => setStravaUserId(data.userId))
      .catch(() => setStravaUserId(null));
  }, [navigate]);

  // Fetch user goals (ALWAYS for logged-in user)
  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);

    fetch(`/api/goals/${userId}`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data)) setGoals(data.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [userId]);

  // Fetch demo running stats and activities (ALWAYS for strava user)
  useEffect(() => {
    if (!stravaUserId) return;

    fetch(`/api/plans/dashboard-stats?userId=${stravaUserId}`)
      .then(res => res.json())
      .then(data => setWeeklyStats(data))
      .catch(() => setWeeklyStats(null));

    fetch(`/api/plans/recent-activities?userId=${stravaUserId}`)
      .then(res => res.json())
      .then(data => setRecentActivities(data.activities || []))
      .catch(() => setRecentActivities([]));
  }, [stravaUserId]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Pick the most recent goal (by created_at, if available)
  let selectedGoal = null;
  if (goals.length > 0) {
    selectedGoal = goals.reduce((a, b) => {
      if (a.created_at && b.created_at) {
        return new Date(a.created_at) > new Date(b.created_at) ? a : b;
      }
      return a;
    });
  }

  const ProgressBar = ({ percent }) => (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${percent}%` }}></div>
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatPace = (pace) => {
    if (!pace || isNaN(pace)) return '—';
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const weeklyDistance = weeklyStats?.weeks?.[0]?.total_km || 0;
  const weeklyTarget = selectedGoal?.weeklyKm || 40;
  const weeklyPercent = Math.min(100, Math.round((weeklyDistance / weeklyTarget) * 100));

  const activeDays = weeklyStats?.weeks?.[0]?.count || 0;
  const activeDaysTarget = selectedGoal?.days?.length || 5;
  const activeDaysPercent = Math.min(100, Math.round((activeDays / activeDaysTarget) * 100));

  const avgPace = weeklyStats?.weeks?.[0]?.avg_pace ? formatPace(weeklyStats.weeks[0].avg_pace) : '—';

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Your Running Dashboard</h1>
        <p>Track your progress and achieve your goals</p>
      </header>
      <main className="dashboard-content">
        <section className="selected-goal-section">
          <h2>Your Selected Goal</h2>
          {selectedGoal ? (
            <div className="goal-detail">
              <div className="goal-info">
                <strong>Distance:</strong> {selectedGoal.distance}<br />
                <strong>Target Time:</strong> {selectedGoal.targetTime}
              </div>
              <div className="goal-progress">
                <div className="progress-info">
                  <span>Progress</span>
                  <span className="progress-percent">{weeklyPercent}%</span>
                </div>
                <ProgressBar percent={weeklyPercent} />
              </div>
            </div>
          ) : (
            <div>No goal set yet.</div>
          )}
        </section>
        <section className="goals-section">
          <h2>Your Running Goals</h2>
          <UserGoals userId={userId} />
        </section>
        <section className="weekly-progress-section">
          <h2>Weekly Progress</h2>
          <div className="weekly-stats">
            <div className="stat-card">
              <div className="stat-title">Distance</div>
              <div className="stat-value">{weeklyDistance} km</div>
              <div className="stat-subtitle">of {weeklyTarget} km target</div>
              <ProgressBar percent={weeklyPercent} />
            </div>
            <div className="stat-card">
              <div className="stat-title">Active Days</div>
              <div className="stat-value">{activeDays}</div>
              <div className="stat-subtitle">of {activeDaysTarget} days target</div>
              <ProgressBar percent={activeDaysPercent} />
            </div>
            <div className="stat-card">
              <div className="stat-title">Avg. Pace</div>
              <div className="stat-value">{avgPace}</div>
              <div className="stat-subtitle">min/km</div>
            </div>
          </div>
        </section>
        <section className="stats-section">
          <h2>Recent Activities</h2>
          {recentActivities.length > 0 ? (
            <div className="recent-activities">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-card">
                  <div className="activity-date">{formatDate(activity.date)}</div>
                  <div className="activity-details">
                    <div className="activity-stat">
                      <span className="stat-label">Distance</span>
                      <span className="stat-value">{activity.distance} km</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label">Time</span>
                      <span className="stat-value">{activity.time}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label">Pace</span>
                      <span className="stat-value">{formatPace(activity.pace)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button className="view-all-btn">View All Activities</button>
            </div>
          ) : (
            <div className="coming-soon">
              <p>Activity tracking coming soon!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
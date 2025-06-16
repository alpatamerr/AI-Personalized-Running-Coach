import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoalSettingPage from './pages/GoalSettingPage';
// import SelectGoalPage from './pages/SelectGoalPage';
// import SelectDistancePage from './pages/SelectDistancePage';
// import SelectTimePage from './pages/SelectTimePage';
import NavBar from './components/NavBar';
import AuthCallback from './components/AuthCallback';
import './styles/App.css';
import TrainingPlanCalendarPage from './pages/TrainingPlanCalendarPage';
import TrainingPlanWizard from './components/TrainingPlanWizard';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSetGoals, setHasSetGoals] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has set goals
        const goalsResponse = await fetch(`/api/goals/${userId}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (goalsResponse.ok) {
          const goalsData = await goalsResponse.json();
          if (goalsData && goalsData.success && Array.isArray(goalsData.data)) {
            setHasSetGoals(goalsData.data.length > 0);
          } else if (Array.isArray(goalsData)) {
            setHasSetGoals(goalsData.length > 0);
          } else {
            setHasSetGoals(false);
          }
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error checking auth state:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

//   return (
//     <div className="app">
//       {isAuthenticated && hasSetGoals && <NavBar setIsAuthenticated={setIsAuthenticated} />}
//       <main className="main-content">
//         <Routes>
//           <Route 
//             path="/" 
//             element={
//               isAuthenticated ? 
//                 (hasSetGoals ? <Navigate to="/dashboard" replace /> : <Navigate to="/select-goal" replace />) : 
//                 <Navigate to="/login" replace />
//             } 
//           />
//           <Route 
//             path="/login" 
//             element={
//               !isAuthenticated ? 
//               <LoginPage setIsAuthenticated={setIsAuthenticated} /> : 
//               (hasSetGoals ? <Navigate to="/dashboard" replace /> : <Navigate to="/select-goal" replace />)
//             } 
//           />
//           <Route 
//             path="/register" 
//             element={
//               !isAuthenticated ? 
//               <RegisterPage /> : 
//               (hasSetGoals ? <Navigate to="/dashboard" replace /> : <Navigate to="/select-goal" replace />)
//             } 
//           />
//           <Route 
//             path="/dashboard" 
//             element={
//               isAuthenticated && hasSetGoals ? 
//                 <DashboardPage /> :
//                 <Navigate to="/select-goal" replace />
//             }
//           />  
//           <Route path="/auth/callback" element={<AuthCallback />} />
//           <Route path="/select-goal" element={
//             isAuthenticated && !hasSetGoals ? <SelectGoalPage /> : <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
//           } />
//           <Route path="/select-distance" element={
//             isAuthenticated && !hasSetGoals ? <SelectDistancePage /> : <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
//           } />
//           <Route path="/select-time" element={
//             isAuthenticated && !hasSetGoals ? <SelectTimePage setHasSetGoals={setHasSetGoals} /> : <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
//           } />
//           <Route path="/training-plan" element={ isAuthenticated && hasSetGoals ? <TrainingPlanCalendarPage /> : <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace /> }/>
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//     </div>
//   );
// };

return (
  <div className="app">
    {isAuthenticated && <NavBar setIsAuthenticated={setIsAuthenticated} />}
    <main className="main-content">
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to="/training-plan" replace />
              : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/login" 
          element={
            !isAuthenticated
              ? <LoginPage setIsAuthenticated={setIsAuthenticated} />
              : <Navigate to="/training-plan" replace />
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated
              ? <RegisterPage />
              : <Navigate to="/training-plan" replace />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated
              ? <DashboardPage />
              : <Navigate to="/login" replace />
          }
        />  
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route 
          path="/training-plan" 
          element={
            isAuthenticated
              ? <TrainingPlanCalendarPage />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </div>
);
};


const StravaCallback = () => {
  React.useEffect(() => {
    if (location.pathname === '/auth/callback') return;
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      window.location.href = '/goals?strava=connected';
    }
  }, [location]);

  return (
    <div className="strava-callback">
      <div className="loading-spinner"></div>
      <p>Processing Strava connection...</p>
    </div>
  );
};

export default App;
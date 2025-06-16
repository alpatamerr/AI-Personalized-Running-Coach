import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      // First clear the local storage
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      
      // Then attempt to logout from the server
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Show success message
      setLogoutMessage('Logged out successfully!');
      
      // Update authentication state
      setIsAuthenticated(false);
      
      // Navigate to login after a short delay
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Error during logout:', error);
      setLogoutMessage('Error during logout, redirecting...');
      // Still update authentication state and redirect on error
      setIsAuthenticated(false);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">Running Coach</Link>
      </div>
      
      <div className="navbar-links">
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/training-plan" 
          className={`nav-link ${location.pathname === '/training-plan' ? 'active' : ''}`}
        >
          Training
        </Link>
      </div>

      <div className="navbar-actions">
        {logoutMessage && (
          <div className="logout-message">
            {logoutMessage}
          </div>
        )}
        <button 
          onClick={handleLogout} 
          className={`logout-button ${isLoggingOut ? 'loading' : ''}`}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;


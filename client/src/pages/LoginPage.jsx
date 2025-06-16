import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SocialLogin from '../components/SocialLogin';
import '../styles/Auth.css';

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful! Redirecting...');
        localStorage.setItem('userId', data.userId);
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        // Set authentication state
        setIsAuthenticated(true);
        // Wait for the message to be shown
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Navigate to goals
        navigate('/goals', { replace: true });
      } else {
        setMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          {message && (
            <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
      </form>

        <SocialLogin />

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
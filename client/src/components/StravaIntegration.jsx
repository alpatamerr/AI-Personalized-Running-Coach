import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const StravaIntegration = ({ userId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkStravaConnection = async () => {
      try {
        const response = await fetch(`${API_URL}/api/strava/check-connection`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsConnected(data.isConnected);
        }
      } catch (error) {
        console.error('Error checking Strava connection:', error);
        setError('Failed to check Strava connection status');
      }
    };

    if (userId) {
      checkStravaConnection();
    }
  }, [userId]);

  const connectStrava = async () => {
    try {
      const response = await fetch(`${API_URL}/api/strava/auth-url`);
      if (!response.ok) {
        throw new Error('Failed to get Strava auth URL');
      }
      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error getting Strava auth URL:', error);
      setError('Failed to connect to Strava. Please try again.');
    }
  };

  const syncStravaData = async () => {
    try {
      setIsSyncing(true);
      setMessage('Syncing Strava data...');
      setError('');
      
      const response = await fetch(`${API_URL}/api/strava/sync-strava`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync Strava data');
      }

      const data = await response.json();
      setMessage(data.message || 'Data synced successfully!');
    } catch (error) {
      console.error('Error syncing Strava data:', error);
      setError(error.message || 'Failed to sync Strava data. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="strava-integration">
      <h2>Strava Integration</h2>
      {!isConnected ? (
        <button onClick={connectStrava} className="connect-button">
          Connect with Strava
        </button>
      ) : (
        <div>
          <p>Strava account connected!</p>
          <button 
            onClick={syncStravaData} 
            disabled={isSyncing}
            className="sync-button"
          >
            {isSyncing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      )}
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default StravaIntegration; 
import { useEffect } from 'react';

const AuthCallback = () => {
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;
    const delay = 500;

    const checkAuth = () => {
      fetch('/api/auth/me', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data && data.userId) {
            localStorage.setItem('userId', data.userId);
            // Force a reload so the app picks up the new userId
            window.location.replace('/select-goal');
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(checkAuth, delay);
          } else {
            window.location.replace('/login');
          }
        })
        .catch(() => {
          if (attempts < maxAttempts) {
            attempts++;
            setTimeout(checkAuth, delay);
          } else {
            window.location.replace('/login');
          }
        });
    };

    checkAuth();
  }, []);

  return <div>Signing you in...</div>;
};

export default AuthCallback;
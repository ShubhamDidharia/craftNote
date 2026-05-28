import { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getUser();
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (userData, authType) => {
    setUser(userData);
    setIsAuthenticated(true);
    console.log(`User ${authType} successful:`, userData);
    // You can redirect to dashboard or main app here
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="App loading">Loading...</div>;
  }

  // If authenticated, show main app (dashboard)
  if (isAuthenticated && user) {
    return (
      <div className="App authenticated">
        <header className="app-header">
          <h1>Welcome, {user.firstName}!</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </header>
        <main className="app-main">
          <p>Your main application will be displayed here.</p>
          <p>User: {user.email}</p>
        </main>
      </div>
    );
  }

  // If not authenticated, show landing page with auth modals
  return (
    <div className="App">
      <Landing onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}

export default App;

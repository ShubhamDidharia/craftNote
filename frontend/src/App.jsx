import { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Workspace } from './components/Workspace';
import { Profile } from './components/Profile';
import { CreateNotePage } from './components/CreateNotePage';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('home');
  const [createNoteMode, setCreateNoteMode] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          return;
        }

        const cachedUser = authService.getUser();
        setUser(cachedUser);
        setIsAuthenticated(true);

        try {
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
        } catch (error) {
          const isAuthError =
            error.message?.includes('token') ||
            error.message?.includes('401') ||
            error.message?.includes('expired') ||
            error.message?.includes('Invalid');
          if (isAuthError) {
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          } else {
            console.warn('Auth refresh skipped (server unreachable):', error.message);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (userData, authType) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentTab('home');
    console.log(`User ${authType} successful:`, userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentTab('home');
    setCreateNoteMode(false);
    setSelectedWorkspace(null);
  };

  const handleCreateNote = (workspaceId, workspaceName) => {
    setSelectedWorkspace({ _id: workspaceId, name: workspaceName });
    setCreateNoteMode(true);
  };

  const handleNoteSaved = (newNote) => {
    setCreateNoteMode(false);
    setSelectedWorkspace(null);
    setCurrentTab('workspace');
  };

  const handleCancelCreateNote = () => {
    setCreateNoteMode(false);
    setSelectedWorkspace(null);
  };

  const renderContent = () => {
    if (createNoteMode && selectedWorkspace) {
      return (
        <CreateNotePage
          workspaceId={selectedWorkspace._id}
          workspaceName={selectedWorkspace.name}
          onNoteSaved={handleNoteSaved}
          onCancel={handleCancelCreateNote}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return <Home user={user} />;
      case 'workspace':
        return <Workspace onCreateNote={handleCreateNote} />;
      case 'profile':
        return (
          <Profile
            user={user}
            onUserUpdated={setUser}
            onAccountDeleted={handleLogout}
            onNavigateToWorkspace={() => setCurrentTab('workspace')}
          />
        );
      default:
        return <Home user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-bg-main">
        <div className="text-lg text-accent font-medium">Loading...</div>
      </div>
    );
  }

  // If authenticated, show main app with navbar
  if (isAuthenticated && user) {
    return (
      <div className="w-full min-h-screen bg-bg-main flex flex-col">
        {!createNoteMode && (
          <Navbar
            user={user}
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            onLogout={handleLogout}
          />
        )}
        <main className={`flex-1 ${createNoteMode ? 'p-0' : ''}`}>
          {renderContent()}
        </main>
      </div>
    );
  }

  // If not authenticated, show landing page with auth modals
  return (
    <div className="w-full min-h-screen">
      <Landing onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}

export default App;

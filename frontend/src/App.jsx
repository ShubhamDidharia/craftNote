import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Landing } from './components/Landing';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Workspace } from './components/Workspace';
import { Profile } from './components/Profile';
import { NoteEditorPage } from './components/NoteEditorPage';
import { authService } from './services/authService';
import { showToast } from './utils/toast';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('home');
  const [noteEditor, setNoteEditor] = useState(null);

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
    showToast.success(authType === 'signup' ? 'Account created successfully!' : 'Signed in successfully!');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentTab('home');
    setNoteEditor(null);
  };

  const handleCreateNote = (workspaceId, workspaceName, colorTheme) => {
    setNoteEditor({ mode: 'create', workspaceId, workspaceName, colorTheme });
  };

  const handleEditNote = (note, workspaceName) => {
    setNoteEditor({
      mode: 'edit',
      workspaceId: note.workspaceId,
      workspaceName: workspaceName || 'Workspace',
      note,
    });
  };

  const handleNoteSaved = () => {
    const wasCreate = noteEditor?.mode === 'create';
    setNoteEditor(null);
    if (wasCreate) {
      setCurrentTab('workspace');
    }
  };

  const handleCancelNoteEditor = () => {
    setNoteEditor(null);
  };

  const renderMainContent = () => {
    if (noteEditor) {
      return (
        <NoteEditorPage
          mode={noteEditor.mode}
          workspaceId={noteEditor.workspaceId}
          workspaceName={noteEditor.workspaceName}
          colorTheme={noteEditor.colorTheme}
          note={noteEditor.note}
          onSaved={handleNoteSaved}
          onCancel={handleCancelNoteEditor}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return <Home user={user} onEditNote={handleEditNote} />;
      case 'workspace':
        return (
          <Workspace onCreateNote={handleCreateNote} onEditNote={handleEditNote} />
        );
      case 'profile':
        return (
          <Profile
            user={user}
            onUserUpdated={(updated) => {
              setUser(updated);
              showToast.success('Profile updated successfully');
            }}
            onAccountDeleted={handleLogout}
            onNavigateToWorkspace={() => setCurrentTab('workspace')}
          />
        );
      default:
        return <Home user={user} onEditNote={handleEditNote} />;
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-bg-main">
        <div className="text-lg text-accent font-medium">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="w-full min-h-screen bg-bg-main flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#212529',
              borderRadius: '10px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
            },
            success: { iconTheme: { primary: '#9E1B32', secondary: '#fff' } },
          }}
        />
        <Navbar
          user={user}
          currentTab={currentTab}
          onTabChange={(tab) => {
            setNoteEditor(null);
            setCurrentTab(tab);
          }}
          onLogout={handleLogout}
        />
        <main className="flex-1">{renderMainContent()}</main>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <Toaster position="top-right" />
      <Landing onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}

export default App;

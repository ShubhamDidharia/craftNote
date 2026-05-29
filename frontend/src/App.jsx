import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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

// Layout component for authenticated routes
function AuthLayout({ user, onLogout, children }) {
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
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/" />;
}

// Main routes component with access to useNavigate
function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    showToast.success(authType === 'signup' ? 'Account created successfully!' : 'Signed in successfully!');
  };

  // Navigate when authentication is complete
  useEffect(() => {
    if (isAuthenticated && user && location.pathname === '/') {
      navigate('/home');
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setNoteEditor(null);
  };

  const handleNoteSaved = () => {
    setNoteEditor(null);
  };

  const handleCancelNoteEditor = () => {
    setNoteEditor(null);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-bg-main">
        <div className="text-lg text-accent font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Landing/Auth route */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" /> : <Landing onAuthSuccess={handleAuthSuccess} />
          }
        />

        {/* Home route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthLayout user={user} onLogout={handleLogout}>
                {noteEditor ? (
                  <NoteEditorPage
                    mode={noteEditor.mode}
                    workspaceId={noteEditor.workspaceId}
                    workspaceName={noteEditor.workspaceName}
                    colorTheme={noteEditor.colorTheme}
                    note={noteEditor.note}
                    onSaved={handleNoteSaved}
                    onCancel={handleCancelNoteEditor}
                  />
                ) : (
                  <Home
                    user={user}
                    onEditNote={(note, workspaceName) => {
                      setNoteEditor({
                        mode: 'edit',
                        workspaceId: note.workspaceId,
                        workspaceName: workspaceName || 'Workspace',
                        note,
                      });
                    }}
                  />
                )}
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* Workspace route */}
        <Route
          path="/workspace"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthLayout user={user} onLogout={handleLogout}>
                {noteEditor ? (
                  <NoteEditorPage
                    mode={noteEditor.mode}
                    workspaceId={noteEditor.workspaceId}
                    workspaceName={noteEditor.workspaceName}
                    colorTheme={noteEditor.colorTheme}
                    note={noteEditor.note}
                    onSaved={handleNoteSaved}
                    onCancel={handleCancelNoteEditor}
                  />
                ) : (
                  <Workspace
                    onCreateNote={(workspaceId, workspaceName, colorTheme) => {
                      setNoteEditor({
                        mode: 'create',
                        workspaceId,
                        workspaceName,
                        colorTheme,
                      });
                    }}
                    onEditNote={(note, workspaceName) => {
                      setNoteEditor({
                        mode: 'edit',
                        workspaceId: note.workspaceId,
                        workspaceName: workspaceName || 'Workspace',
                        note,
                      });
                    }}
                  />
                )}
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* Profile route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthLayout user={user} onLogout={handleLogout}>
                <Profile
                  user={user}
                  onUserUpdated={(updated) => {
                    setUser(updated);
                    showToast.success('Profile updated successfully');
                  }}
                  onAccountDeleted={handleLogout}
                />
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/home' : '/'} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

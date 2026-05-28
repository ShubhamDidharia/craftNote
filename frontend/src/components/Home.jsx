import React from 'react';
import '../styles/Home.css';

export const Home = ({ user }) => {
  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Welcome back, {user.firstName}!</h2>
        <p>Your note-taking workspace is ready</p>
      </div>

      <div className="home-content">
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h4>Getting Started</h4>
              <p className="stat-hint">Create your first workspace</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📂</div>
            <div className="stat-info">
              <h4>Organize</h4>
              <p className="stat-hint">Manage notes in workspaces</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <h4>Stay Productive</h4>
              <p className="stat-hint">Jot down your ideas instantly</p>
            </div>
          </div>
        </div>

        <div className="quick-guide">
          <h3>How to Get Started</h3>
          <div className="guide-steps">
            <div className="guide-step">
              <span className="step-number">1</span>
              <div className="step-content">
                <h4>Create a Workspace</h4>
                <p>Go to the Workspace tab to create your first workspace</p>
              </div>
            </div>

            <div className="guide-step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h4>Add Notes</h4>
                <p>Click "Create New Note" to start jotting down your ideas</p>
              </div>
            </div>

            <div className="guide-step">
              <span className="step-number">3</span>
              <div className="step-content">
                <h4>Organize & Pin</h4>
                <p>Pin important notes and add tags to keep things organized</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

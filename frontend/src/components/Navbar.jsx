import React from 'react';
import '../styles/Navbar.css';

export const Navbar = ({ user, currentTab, onTabChange, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon">📝</div>
          <h1>CraftNote</h1>
        </div>

        {/* Nav Tabs */}
        <div className="nav-tabs">
          <button
            className={`nav-tab ${currentTab === 'home' ? 'active' : ''}`}
            onClick={() => onTabChange('home')}
          >
            Home
          </button>
          <button
            className={`nav-tab ${currentTab === 'workspace' ? 'active' : ''}`}
            onClick={() => onTabChange('workspace')}
          >
            Workspace
          </button>
          <button
            className={`nav-tab ${currentTab === 'profile' ? 'active' : ''}`}
            onClick={() => onTabChange('profile')}
          >
            Profile
          </button>
        </div>

        {/* User Info & Logout */}
        <div className="navbar-right">
          <div className="user-info">
            <span className="user-name">{user.firstName} {user.lastName}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

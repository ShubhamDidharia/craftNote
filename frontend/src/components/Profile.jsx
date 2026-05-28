import React from 'react';
import '../styles/Profile.css';

export const Profile = ({ user }) => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
      </div>

      <div className="profile-card">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>

          <div className="profile-details">
            <h3>{user.firstName} {user.lastName}</h3>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        <div className="profile-section">
          <h4>Account Information</h4>
          <div className="info-row">
            <span className="info-label">First Name:</span>
            <span className="info-value">{user.firstName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Last Name:</span>
            <span className="info-value">{user.lastName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
        </div>

        <div className="profile-section">
          <h4>Actions</h4>
          <button className="profile-btn edit-btn">Edit Profile</button>
          <button className="profile-btn password-btn">Change Password</button>
        </div>
      </div>
    </div>
  );
};

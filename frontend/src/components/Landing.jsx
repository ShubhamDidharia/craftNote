import React, { useState } from 'react';
import { SignupModal } from './SignupModal';
import { SigninModal } from './SigninModal';
import '../styles/Landing.css';

export const Landing = ({ onAuthSuccess }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [showSignin, setShowSignin] = useState(false);

  const handleSignupSuccess = (user) => {
    if (onAuthSuccess) {
      onAuthSuccess(user, 'signup');
    }
  };

  const handleSigninSuccess = (user) => {
    if (onAuthSuccess) {
      onAuthSuccess(user, 'signin');
    }
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">CraftNote</h1>
          <p className="hero-subtitle">
            Craft Your Ideas, Note Your Progress
          </p>
          <p className="hero-description">
            A modern note-taking application designed for creators, developers, and thinkers.
            Organize your thoughts, collaborate with others, and bring your ideas to life.
          </p>

          <div className="hero-cta">
            <button
              className="cta-btn cta-btn-primary"
              onClick={() => setShowSignup(true)}
            >
              Create Account
            </button>
            <button
              className="cta-btn cta-btn-secondary"
              onClick={() => setShowSignin(true)}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose CraftNote?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Easy Note Taking</h3>
            <p>
              Capture your thoughts quickly with our intuitive note editor.
              Format text, add images, and organize with tags.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>
              Find any note instantly with powerful search capabilities.
              Filter by tags, dates, and keywords.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Collaborate</h3>
            <p>
              Share notes and collaborate in real-time with team members.
              Leave comments and track changes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Access Anywhere</h3>
            <p>
              Your notes are synced across all devices. Access them anytime,
              anywhere, online or offline.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>
              Your data is encrypted and secure. Only you and those you share
              with can access your notes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>
              Optimized performance ensures quick loading and smooth editing
              experience even with large notes.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Optional) */}
      <section className="pricing-section">
        <h2 className="section-title">Simple Pricing</h2>
        <div className="pricing-cards">
          <div className="pricing-card free">
            <h3>Free</h3>
            <p className="price">$0<span>/month</span></p>
            <ul className="features-list">
              <li>✓ Up to 50 notes</li>
              <li>✓ Basic search</li>
              <li>✓ Single device sync</li>
              <li>✗ Collaboration</li>
            </ul>
            <button className="pricing-btn" onClick={() => setShowSignup(true)}>
              Get Started
            </button>
          </div>

          <div className="pricing-card pro">
            <div className="badge">Popular</div>
            <h3>Pro</h3>
            <p className="price">$9.99<span>/month</span></p>
            <ul className="features-list">
              <li>✓ Unlimited notes</li>
              <li>✓ Advanced search</li>
              <li>✓ Multi-device sync</li>
              <li>✓ Collaboration tools</li>
            </ul>
            <button className="pricing-btn" onClick={() => setShowSignup(true)}>
              Start Free Trial
            </button>
          </div>

          <div className="pricing-card team">
            <h3>Team</h3>
            <p className="price">$29<span>/month</span></p>
            <ul className="features-list">
              <li>✓ Everything in Pro</li>
              <li>✓ Team management</li>
              <li>✓ Advanced permissions</li>
              <li>✓ Priority support</li>
            </ul>
            <button className="pricing-btn" onClick={() => setShowSignup(true)}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Crafting?</h2>
        <p>Join thousands of creators and thinkers using CraftNote today.</p>
        <button
          className="cta-btn cta-btn-large"
          onClick={() => setShowSignup(true)}
        >
          Create Your Free Account
        </button>
      </section>

      {/* Auth Modals */}
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSuccess={handleSignupSuccess}
      />

      <SigninModal
        isOpen={showSignin}
        onClose={() => setShowSignin(false)}
        onSuccess={handleSigninSuccess}
      />
    </div>
  );
};

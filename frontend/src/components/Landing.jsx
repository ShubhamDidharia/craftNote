import React, { useState } from 'react';
import {
  FileText,
  Lock,
  Sparkles,
  Palette,
  Zap,
  Layers,
} from 'lucide-react';
import { SignupModal } from './SignupModal';
import { SigninModal } from './SigninModal';

const FEATURES = [
  { icon: Lock, title: 'Secure Authentication', desc: 'Sign up and sign in securely with JWT-based authentication. Your account is protected and your sessions are managed safely.' },
  { icon: Layers, title: 'Workspace Organization', desc: 'Create multiple workspaces to organize your notes by project, topic, or team. Keep your content structured and easy to navigate.' },
  { icon: FileText, title: 'Full Note Management', desc: 'Create, edit, delete, and organize notes with tags and pin them for quick access. Full control over your content.' },
  { icon: Sparkles, title: 'AI-Powered Helpers', desc: 'Use AI to generate note titles, get writing assistance, and verify content. Let AI enhance your productivity.' },
  { icon: Palette, title: 'Customizable Themes', desc: 'Apply color themes to your workspaces for visual organization. Personalize your workspace appearance.' },
  { icon: Zap, title: 'Real-Time Performance', desc: 'Instant note creation, updates, and synchronization. Fast and responsive interface for seamless productivity.' },
];

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
    <div className="w-full bg-bg-main">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-main via-bg-surface to-bg-main px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-accent mb-4">
            CraftNote
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-text-primary mb-6">
            Craft Your Ideas, Note Your Progress
          </p>
          <p className="text-lg text-text-secondary mb-12 leading-relaxed">
            A modern note-taking application designed for creators, developers, and thinkers.
            Organize your thoughts, collaborate with others, and bring your ideas to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="btn-primary px-8 py-3 text-lg"
              onClick={() => setShowSignup(true)}
            >
              Create Account
            </button>
            <button
              className="btn-secondary px-8 py-3 text-lg"
              onClick={() => setShowSignin(true)}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-text-primary mb-16">
            Why Choose <span className="text-accent">CraftNote</span>?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
              <div key={idx} className="card p-8 text-center hover:shadow-lg transform hover:scale-105 transition-all">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon size={28} className="text-accent" strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.desc}</p>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accent to-highlight text-bg-surface text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Ready to Start Crafting?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of creators and thinkers using CraftNote today.
        </p>
        <button
          className="bg-bg-surface text-accent px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
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

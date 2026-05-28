import React, { useState } from 'react';
import { SignupModal } from './SignupModal';
import { SigninModal } from './SigninModal';

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
            {[
              { icon: '📝', title: 'Easy Note Taking', desc: 'Capture your thoughts quickly with our intuitive note editor. Format text, add images, and organize with tags.' },
              { icon: '🔍', title: 'Smart Search', desc: 'Find any note instantly with powerful search capabilities. Filter by tags, dates, and keywords.' },
              { icon: '🤝', title: 'Collaborate', desc: 'Share notes and collaborate in real-time with team members. Leave comments and track changes.' },
              { icon: '📱', title: 'Access Anywhere', desc: 'Your notes are synced across all devices. Access them anytime, anywhere, online or offline.' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and secure. Only you and those you share with can access your notes.' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized performance ensures quick loading and smooth editing experience even with large notes.' },
            ].map((feature, idx) => (
              <div key={idx} className="card p-8 text-center hover:shadow-lg transform hover:scale-105 transition-all">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-bg-main">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-text-primary mb-16">
            Simple <span className="text-accent">Pricing</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['✓ Up to 50 notes', '✓ Basic search', '✓ Single device sync', '✗ Collaboration'],
              },
              {
                name: 'Pro',
                price: '$9.99',
                features: ['✓ Unlimited notes', '✓ Advanced search', '✓ Multi-device sync', '✓ Collaboration tools'],
                popular: true,
              },
              {
                name: 'Team',
                price: '$29',
                features: ['✓ Everything in Pro', '✓ Team management', '✓ Advanced permissions', '✓ Priority support'],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`card p-8 relative ${plan.popular ? 'ring-2 ring-accent md:scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-highlight text-text-primary px-4 py-1 rounded-full text-sm font-bold">
                    Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-accent mb-6">
                  {plan.price}
                  <span className="text-lg text-text-secondary">/month</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-text-secondary">{feature}</li>
                  ))}
                </ul>
                <button
                  className={plan.popular ? 'btn-primary w-full' : 'btn-secondary w-full'}
                  onClick={() => setShowSignup(true)}
                >
                  {plan.name === 'Pro' ? 'Start Free Trial' : plan.name === 'Team' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
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

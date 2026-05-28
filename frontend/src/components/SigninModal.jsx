import React, { useState } from 'react';
import { authService } from '../services/authService';
import { validateSigninForm } from '../utils/validation';

export const SigninModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Validate form
    const validationErrors = validateSigninForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.signin({
        email: formData.email,
        password: formData.password,
      });

      // Reset form
      setFormData({
        email: '',
        password: '',
      });
      setErrors({});

      // Call success callback
      if (onSuccess) {
        onSuccess(response.user);
      }

      onClose();
    } catch (error) {
      setServerError(error.message || 'An error occurred during signin');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-text-primary">Sign In</h2>
          <button
            className="text-text-secondary hover:text-accent text-xl transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {serverError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`input w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 inline-block">{errors.email}</span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`input w-full ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 inline-block">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-4">
          Don't have an account?{' '}
          <button
            className="text-accent font-semibold hover:underline"
            onClick={() => {
              onClose();
            }}
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

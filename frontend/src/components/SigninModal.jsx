import React, { useState } from 'react';
import { authService } from '../services/authService';
import { validateSigninForm } from '../utils/validation';
import { showToast } from '../utils/toast';

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

      setFormData({
        email: '',
        password: '',
      });
      setErrors({});

      if (onSuccess) {
        onSuccess(response.user);
      }

      onClose();
    } catch (error) {
      const msg = error.message || 'An error occurred during signin';
      setServerError(msg);
      showToast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300" 
      onClick={onClose}
    >
      <div 
        className="modal-content bg-white w-full max-w-md transform overflow-hidden rounded-2xl p-6 md:p-8 text-left align-middle shadow-2xl transition-all border border-gray-100" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sign In</h2>
          <button
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {serverError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2.5 animate-fadeIn">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`input w-full px-4 py-2.5 rounded-xl border bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-red-500/20 focus:border-red-500'
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`input w-full px-4 py-2.5 rounded-xl border bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-red-500/20 focus:border-red-500'
              }`}
            />
            {errors.password && (
              <span className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 py-3 px-4 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-red-600/10 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <button
            className="text-zinc-600 font-semibold hover:text-zinc-700 hover:underline transition-colors ml-1"
            onClick={onClose}
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
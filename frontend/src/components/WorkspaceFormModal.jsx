import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ThemePicker } from './ThemePicker';
import { DEFAULT_THEME_ID } from '../constants/colorThemes';

export const WorkspaceFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    colorTheme: DEFAULT_THEME_ID,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        description: initialData?.description || '',
        colorTheme: initialData?.colorTheme || DEFAULT_THEME_ID,
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay z-210" onClick={onClose}>
      <div className="modal-content w-[calc(100vw-1.5rem)] sm:w-full p-4 sm:p-6 max-w-lg mx-3 sm:mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="m-0 text-lg font-bold text-text-primary">
            {mode === 'edit' ? 'Edit Workspace' : 'New Workspace'}
          </h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              className="input w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Workspace name"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="input w-full resize-none min-h-20"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              disabled={loading}
            />
          </div>
          <ThemePicker
            value={formData.colorTheme}
            onChange={(colorTheme) => setFormData({ ...formData, colorTheme })}
            disabled={loading}
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <button type="button" className="btn-ghost w-full sm:w-auto" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
              {loading ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

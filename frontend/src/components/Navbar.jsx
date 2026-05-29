import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Home, LayoutGrid, User, LogOut } from 'lucide-react';
import { showToast } from '../utils/toast';

export const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    showToast.success('Logged out successfully');
    navigate('/');
  };

  const tabs = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/workspace', label: 'Workspace', icon: LayoutGrid },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-gradient-to-r from-accent to-accent/90 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center justify-between gap-2 w-full sm:w-auto min-w-fit">
          <FileText size={24} strokeWidth={2} />
          <h1 className="m-0 text-xl font-bold tracking-wide">CraftNote</h1>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-1 w-full sm:flex-1 sm:justify-center">
          {tabs.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              type="button"
              className={`inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-semibold transition-all flex-1 sm:flex-none min-w-[104px] ${
                location.pathname === path
                  ? 'bg-white text-accent shadow-sm'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
              onClick={() => navigate(path)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto min-w-fit">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-xs opacity-90">{user.email}</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/20 border-2 border-white rounded-md text-sm font-semibold hover:bg-white hover:text-accent transition-all w-full sm:w-auto"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

import React from 'react';
import { FileText, Home, LayoutGrid, User, LogOut } from 'lucide-react';
import { showToast } from '../utils/toast';

export const Navbar = ({ user, currentTab, onTabChange, onLogout }) => {
  const handleLogout = () => {
    onLogout();
    showToast.success('Logged out successfully');
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'workspace', label: 'Workspace', icon: LayoutGrid },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-gradient-to-r from-accent to-accent/90 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2 min-w-fit">
          <FileText size={24} strokeWidth={2} />
          <h1 className="m-0 text-xl font-bold tracking-wide">CraftNote</h1>
        </div>

        <div className="flex gap-1 flex-1 justify-center">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                currentTab === id
                  ? 'bg-white text-accent shadow-sm'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
              onClick={() => onTabChange(id)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 min-w-fit">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-xs opacity-90">{user.email}</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border-2 border-white rounded-md text-sm font-semibold hover:bg-white hover:text-accent transition-all"
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

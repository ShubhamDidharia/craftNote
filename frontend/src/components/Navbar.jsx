import React from 'react';

export const Navbar = ({ user, currentTab, onTabChange, onLogout }) => {
  return (
    <nav className="bg-gradient-to-r from-accent to-accent/90 text-white shadow-lg sticky top-0 z-100">
      <div className="max-w-[1400px] mx-auto px-5 py-4 flex items-center justify-between gap-10">
        {/* Logo */}
        <div className="flex items-center gap-3 min-w-fit">
          <div className="text-2xl">📝</div>
          <h1 className="m-0 text-xl font-bold tracking-wide">CraftNote</h1>
        </div>

        {/* Nav Tabs */}
        <div className="flex gap-2 flex-1 justify-center">
          <button
            className={`px-4 py-2 bg-white/20 text-white border-2 border-transparent rounded-md cursor-pointer text-sm font-semibold transition-all hover:bg-white/30 ${currentTab === 'home' ? 'bg-white text-accent border-white' : ''}`}
            onClick={() => onTabChange('home')}
          >
            Home
          </button>
          <button
            className={`px-4 py-2 bg-white/20 text-white border-2 border-transparent rounded-md cursor-pointer text-sm font-semibold transition-all hover:bg-white/30 ${currentTab === 'workspace' ? 'bg-white text-accent border-white' : ''}`}
            onClick={() => onTabChange('workspace')}
          >
            Workspace
          </button>
          <button
            className={`px-4 py-2 bg-white/20 text-white border-2 border-transparent rounded-md cursor-pointer text-sm font-semibold transition-all hover:bg-white/30 ${currentTab === 'profile' ? 'bg-white text-accent border-white' : ''}`}
            onClick={() => onTabChange('profile')}
          >
            Profile
          </button>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-5 min-w-fit">
          <div className="flex flex-col gap-1 text-right">
            <span className="text-sm font-semibold">{user.firstName} {user.lastName}</span>
            <span className="text-xs opacity-90">{user.email}</span>
          </div>
          <button className="px-4 py-2 bg-white/20 text-white border-2 border-white rounded-md text-sm font-semibold cursor-pointer transition-all hover:bg-white hover:text-accent" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

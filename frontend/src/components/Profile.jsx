import React from 'react';

export const Profile = ({ user }) => {
  return (
    <div className="max-w-[800px] mx-auto px-5 py-10">
      <div className="mb-8">
        <h2 className="m-0 text-2xl text-text-primary">User Profile</h2>
      </div>

      <div className="bg-bg-surface rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-accent to-accent/80 p-10 flex items-center gap-6 text-white">
          <div className="w-[100px] h-[100px] rounded-full bg-white/30 flex items-center justify-center text-[40px] font-bold flex-shrink-0">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>

          <div className="flex-1">
            <h3 className="m-0 mb-2 text-xl font-bold">{user.firstName} {user.lastName}</h3>
            <p className="m-0 text-sm opacity-90">{user.email}</p>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h4 className="m-0 mb-4 text-base font-semibold text-text-primary">Account Information</h4>
          <div className="flex py-3 border-b border-gray-100">
            <span className="flex-0-0-[150px] font-medium text-text-secondary text-sm">First Name:</span>
            <span className="flex-1 text-text-primary text-sm word-break break-word">{user.firstName}</span>
          </div>
          <div className="flex py-3 border-b border-gray-100">
            <span className="flex-0-0-[150px] font-medium text-text-secondary text-sm">Last Name:</span>
            <span className="flex-1 text-text-primary text-sm word-break break-word">{user.lastName}</span>
          </div>
          <div className="flex py-3">
            <span className="flex-0-0-[150px] font-medium text-text-secondary text-sm">Email:</span>
            <span className="flex-1 text-text-primary text-sm word-break break-word">{user.email}</span>
          </div>
        </div>

        <div className="p-6">
          <h4 className="m-0 mb-4 text-base font-semibold text-text-primary">Actions</h4>
          <button className="inline-block px-5 py-2.5 mr-3 mb-3 border-2 border-gray-200 bg-bg-surface rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">Edit Profile</button>
          <button className="inline-block px-5 py-2.5 mr-3 mb-3 border-2 border-gray-200 bg-bg-surface rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700">Change Password</button>
        </div>
      </div>
    </div>
  );
};

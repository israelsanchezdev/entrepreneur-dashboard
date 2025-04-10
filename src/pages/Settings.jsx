
import React from 'react';
import { useAuth } from '../auth.jsx';

const Settings = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div className="p-6">Loading user settings...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Account Settings</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;

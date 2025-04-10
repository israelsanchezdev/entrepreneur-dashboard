
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) {
      alert('Password reset successfully!');
      navigate('/login');
    } else {
      alert('Error resetting password');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 rounded text-black"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Set New Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

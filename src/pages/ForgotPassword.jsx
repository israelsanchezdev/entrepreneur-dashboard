
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (!error) setSent(true);
    else alert('Error sending reset email');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      {sent ? (
        <p className="text-green-600">Check your email for the reset link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded text-black"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;

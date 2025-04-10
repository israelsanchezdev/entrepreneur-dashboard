// src/pages/ConfirmEmail.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ConfirmEmail = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    const token = query.get('token');
    if (!token) {
      setMessage('No token provided.');
      return;
    }

    const confirmUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .update({ is_confirmed: true, confirmation_token: null })
        .eq('confirmation_token', token)
        .select();

      if (error) {
        console.error('Confirmation error:', error.message);
        setMessage('Failed to confirm email. The token may be invalid.');
      } else if (!data || data.length === 0) {
        setMessage('No matching record found. The token may be invalid or expired.');
      } else {
        setMessage('Your email has been confirmed! You may now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    confirmUser();
  }, [query, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-xl w-full bg-white p-10 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Confirmation</h2>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default ConfirmEmail;

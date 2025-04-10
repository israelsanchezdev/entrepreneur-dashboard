
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (!error) navigate('/dashboard');
    else alert('Login failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black px-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left Section */}
        <div className="bg-white p-10 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Resource Partners – Entrepreneur Journey
          </h1>
          <p className="text-gray-700">
            A collaborative platform for resource partners to track entrepreneurs through their business journey.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Track Entrepreneurial Progress</li>
            <li>✅ Collaborate With Partners</li>
            <li>✅ Analytics & Reports</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="bg-gray-100 p-10">
          <h2 className="text-xl font-semibold mb-6 text-center">Sign in to your account</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          </form>
          <div className="text-center mt-4 text-sm">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
            <br />
            <a href="/forgot-password" className="text-blue-500 hover:underline mt-2 inline-block">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

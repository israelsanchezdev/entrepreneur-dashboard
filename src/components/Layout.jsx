// src/components/Layout.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { useTheme } from './ThemeContext';
import { LayoutDashboard, Users, PlusSquare, BarChart2, Sun, Moon } from 'lucide-react';

export default function Layout() {
  const { logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isAuthPage = ['/login','/register','/forgot-password','/reset-password'].includes(location.pathname);
  if (isAuthPage) return <Outlet />;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Founder Tracker</h1>
          <button
            onClick={toggleTheme}
            title="Toggle Light/Dark Mode"
            className="p-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
        <nav className="space-y-2">
          <Link to="/" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/entrepreneurs" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <Users size={18} /> Entrepreneurs
          </Link>
          <Link to="/add" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <PlusSquare size={18} /> Add Entrepreneur
          </Link>
          <Link to="/reports" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
            <BarChart2 size={18} /> Reports
          </Link>
        </nav>
        <button
          onClick={logout}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 bg-white dark:bg-gray-950 text-black dark:text-white">
        <Outlet />
      </main>
    </div>
  );
}

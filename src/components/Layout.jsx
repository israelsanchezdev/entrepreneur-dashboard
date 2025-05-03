import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { LayoutDashboard, Users, PlusSquare, BarChart2, Sun, Moon } from 'lucide-react';

export default function Layout() {
  const { logout } = useAuth();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white dark:bg-white dark:text-black p-4 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Founder Tracker</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200"
            title="Toggle Light/Dark Mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <nav className="space-y-2">
          <Link to="/" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/entrepreneurs" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200">
            <Users size={18} /> Entrepreneurs
          </Link>
          <Link to="/add" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200">
            <PlusSquare size={18} /> Add Entrepreneur
          </Link>
          <Link to="/reports" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200">
            <BarChart2 size={18} /> Reports
          </Link>
        </nav>
        <button
          onClick={logout}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded dark:bg-red-500 dark:hover:bg-red-600"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 bg-gray-950 text-white dark:bg-gray-100 dark:text-black transition-colors">
        <Outlet />
      </main>
    </div>
  );
}

import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Layout() {
  const { logout } = useAuth();
  const location = useLocation();

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-2">
        <h1 className="text-xl font-bold mb-4">Founder Tracker</h1>
        <nav className="space-y-2">
          <Link to="/" className="block hover:underline">Dashboard</Link>
          <Link to="/entrepreneurs" className="block hover:underline">Entrepreneurs</Link>
          <Link to="/add" className="block hover:underline">Add Entrepreneur</Link>
          <Link to="/reports" className="block hover:underline">Reports</Link>
          <Link to="/settings" className="block hover:underline">Settings</Link>
        </nav>
        <button onClick={logout} className="mt-6 bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </aside>
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <Outlet />
      </main>
    </div>
  );
}

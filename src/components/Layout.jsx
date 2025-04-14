import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { LayoutDashboard, Users, PlusSquare, BarChart2 } from 'lucide-react';

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
          <Link to="/" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/entrepreneurs" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <Users size={18} /> Entrepreneurs
          </Link>
          <Link to="/add" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <PlusSquare size={18} /> Add Entrepreneur
          </Link>
          <Link to="/reports" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
            <BarChart2 size={18} /> Reports
          </Link>
        </nav>
        <button
          onClick={logout}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 bg-gray-950 text-white">
        <Outlet />
      </main>
    </div>
  );
}

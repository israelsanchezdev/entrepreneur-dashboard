import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-white border-b shadow-sm py-4 px-6 flex gap-6">
    <Link to="/" className="text-blue-600 font-semibold hover:underline">Login</Link>
    <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
    <Link to="/dashboard" className="text-blue-600 font-semibold hover:underline">Dashboard</Link>
    <Link to="/entrepreneurs" className="text-blue-600 font-semibold hover:underline">Entrepreneurs</Link>
    <Link to="/add-entrepreneur" className="text-blue-600 font-semibold hover:underline">Add Entrepreneur</Link>
  </nav>
);

export default Navbar;

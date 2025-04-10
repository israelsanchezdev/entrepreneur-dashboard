
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/entrepreneurs">Entrepreneurs</Link></li>
            <li><Link to="/add-entrepreneur">Add Entrepreneur</Link></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="sticky-footer">
        <p>Powered by <a href="https://gentleai.tech" target="_blank">Gentle AI</a> &copy; 2025</p>
      </footer>
    </div>
  );
};

export default Layout;

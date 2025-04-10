import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Entrepreneurs from './pages/Entrepreneurs';
import AddEntrepreneur from './pages/AddEntrepreneur';
import ForgotPassword from './pages/ForgotPassword';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/entrepreneurs" element={<Entrepreneurs />} />
              <Route path="/add-entrepreneur" element={<AddEntrepreneur />} />
            </Route>
          </Routes>

          {/* Sticky Footer */}
          <footer className="sticky-footer">
            <p>
              Powered by <a href="https://gentleai.tech" target="_blank" rel="noopener noreferrer">Gentle AI</a> | Copyright 2025
            </p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

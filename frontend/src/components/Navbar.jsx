import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    // Show a confirmation popup
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <nav className="bg-purple-700 text-white p-4 flex justify-between">
      <div className="font-bold">SlotSwapper</div>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/requests">Requests</Link>
            <button
              onClick={logout}
              className="bg-white text-purple-700 px-3 py-1 rounded hover:bg-purple-100"
            >Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

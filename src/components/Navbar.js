import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">P2P App</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/topup">Top Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/transactions">Transactions</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/requests">Money Requests</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/splits">Split Payments</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/stores">Stores</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/friends">Friends</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
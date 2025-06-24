import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Pay App</Link>

        {/* Hamburger toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible section */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
              </>
            )}
          </ul>

          {token && (
            <ul className="navbar-nav mb-2 mb-lg-0">
              {user?.role === 'admin' && (
                <li className="nav-item">
                  <Link className="btn btn-warning btn-sm me-2" to="/admin">Admin</Link>
                </li>
              )}
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

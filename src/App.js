import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Transactions from './pages/Transactions';
import TopUp from './pages/TopUp';
import MoneyRequests from './pages/MoneyRequests';
import SplitPayments from './pages/SplitPayments';
import PosPayments from './pages/PosPayments';
import Friends from './pages/Friends';
import Navbar from './components/Navbar';
import AuthProvider, { useAuth } from './auth/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/topup"
              element={
                <PrivateRoute>
                  <TopUp />
                </PrivateRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <PrivateRoute>
                  <MoneyRequests />
                </PrivateRoute>
              }
            />
            <Route
              path="/splits"
              element={
                <PrivateRoute>
                  <SplitPayments />
                </PrivateRoute>
              }
            />
            <Route
              path="/stores"
              element={
                <PrivateRoute>
                  <PosPayments />
                </PrivateRoute>
              }
            />
            <Route
              path="/friends"
              element={
                <PrivateRoute>
                  <Friends />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
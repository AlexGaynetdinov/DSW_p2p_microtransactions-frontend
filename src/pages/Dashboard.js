import React from 'react';
import { useAuth } from '../auth/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Welcome, {user?.name}!</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
};

export default Dashboard;
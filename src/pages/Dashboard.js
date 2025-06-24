import React from 'react';
import { useAuth } from '../auth/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-3">
          <div className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center" style={{ width: 70, height: 70, fontSize: 28 }}>
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </div>
        </div>
        <h4 className="text-center">Welcome, {user?.name || 'User'}!</h4>
        {user?.balance != null && (
          <p className="text-center mt-2 mb-1" style={{ fontSize: '1.5rem', color: 'green', fontWeight: 'bold' }}>
            Balance: €{Number(user.balance).toFixed(2)}
          </p>
        )}
        <hr />
        <p><strong>Email:</strong> {user?.email}</p>
        <p>
          <strong>Role:</strong>{' '}
          <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : user?.role === 'merchant' ? 'bg-success' : 'bg-secondary'}`}>
            {user?.role}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

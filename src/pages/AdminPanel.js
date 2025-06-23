import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [friendships, setFriendships] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await axios.get('/users');
        const resTrans = await axios.get('/transactions');
        const resFriends = await axios.get('/admin/friendships'); // custom endpoint below
        setUsers(resUsers.data);
        setTransactions(resTrans.data);
        setFriendships(resFriends.data);
      } catch (err) {
        setStatus('Admin data fetch failed');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="card p-4">
      <h3>Admin Panel</h3>
      {status && <div className="alert alert-danger">{status}</div>}

      <h4 className="mt-4">All Users</h4>
      <ul className="list-group">
        {users.map(u => (
          <li key={u.id} className="list-group-item">
            {u.id} — {u.name || '(no name)'} — {u.email} — <strong>{u.role}</strong>
          </li>
        ))}
      </ul>

      <h4 className="mt-4">All Transactions</h4>
      <ul className="list-group">
        {transactions.map(t => (
          <li key={t.id} className="list-group-item">
            ID: {t.id} | From: {t.sender_id} → To: {t.recipient_id} — €{t.amount}
          </li>
        ))}
      </ul>

      <h4 className="mt-4">All Friendships</h4>
      <ul className="list-group">
        {friendships.map(f => (
          <li key={f.id} className="list-group-item">
            {f.requester.email} ➝ {f.receiver.email} — <strong>{f.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;

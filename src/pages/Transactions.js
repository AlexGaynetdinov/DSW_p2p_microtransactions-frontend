import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ recipient_id: '', amount: '', message: '' });
  const [status, setStatus] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      setStatus('Failed to load transactions');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      await axios.post('/transactions', form);
      setStatus('Transaction successful!');
      setForm({ recipient_id: '', amount: '', message: '' });
      fetchTransactions();
    } catch (err) {
      const msg = err.response?.data?.error || 'Transaction failed';
      setStatus(msg);
    }
  };

  return (
    <div className="card p-4">
      <h3>Send Money</h3>
      {status && <div className="alert alert-info">{status}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Recipient ID"
          value={form.recipient_id}
          onChange={(e) => setForm({ ...form, recipient_id: e.target.value })}
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Message (optional)"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button type="submit" className="btn btn-success">Send</button>
      </form>

      <hr />
      <h4>My Transactions</h4>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul className="list-group">
          {transactions.map((t) => {
            const isSent = t.sender_id === user.id;
            const direction = isSent ? 'Sent to' : 'Received from';
            const otherUserId = isSent ? t.recipient_id : t.sender_id;

            return (
              <li key={t.id} className="list-group-item">
                <strong>{direction}:</strong> User #{otherUserId}<br />
                <strong>Amount:</strong> €{Number(t.amount).toFixed(2)}<br />
                <strong>Message:</strong> {t.message || '(none)'}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Transactions;

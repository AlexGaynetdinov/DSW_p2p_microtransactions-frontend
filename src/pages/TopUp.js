import React, { useState } from 'react';
import axios from '../api/axios';

const TopUp = () => {
  const [form, setForm] = useState({
    card_number: '',
    cardholder_name: '',
    cvv: '',
    amount: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      await axios.post('/top_up_balance', form);
      setStatus('Top-up successful!');
      setForm({ card_number: '', cardholder_name: '', cvv: '', amount: '' });
    } catch (err) {
      const msg = err.response?.data?.errors?.join(', ') || 'Top-up failed';
      setStatus(msg);
    }
  };

  return (
    <div className="card p-4">
      <h3>Top Up Balance</h3>
      {status && <div className="alert alert-info">{status}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Card Number"
          value={form.card_number}
          onChange={(e) => setForm({ ...form, card_number: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Cardholder Name"
          value={form.cardholder_name}
          onChange={(e) => setForm({ ...form, cardholder_name: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="CVV"
          value={form.cvv}
          onChange={(e) => setForm({ ...form, cvv: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <button type="submit" className="btn btn-primary">Top Up</button>
      </form>
    </div>
  );
};

export default TopUp;

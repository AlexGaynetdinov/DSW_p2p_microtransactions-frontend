import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const PosPayments = () => {
  const [merchants, setMerchants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ amount: '', message: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const res = await axios.get('/merchants');
        setMerchants(res.data);
      } catch (err) {
        setStatus('Failed to load merchants');
      }
    };
    fetchMerchants();
  }, []);

  const handlePay = async () => {
    try {
      await axios.post('/pos_payment', {
        merchant_id: selected.id,
        amount: form.amount,
        message: form.message
      });
      setStatus(`Payment to ${selected.name || selected.email} successful!`);
      setForm({ amount: '', message: '' });
      setSelected(null);
    } catch (err) {
      const msg = err.response?.data?.error || 'Payment failed';
      setStatus(msg);
    }
  };

  return (
    <div className="card p-4">
      <h3>Stores</h3>
      {status && <div className="alert alert-info">{status}</div>}

      {!selected ? (
        <>
          <p>Select a store to make a payment:</p>
          <ul className="list-group">
            {merchants.map(m => (
              <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{m.name || m.email}</span>
                <button className="btn btn-primary btn-sm" onClick={() => setSelected(m)}>Pay</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h5>Pay {selected.name || selected.email}</h5>
          <input
            className="form-control mb-2"
            placeholder="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Message (optional)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handlePay}>Confirm Payment</button>
            <button className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PosPayments;

import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const MoneyRequests = () => {
    const [form, setForm] = useState({ recipient_id: '', amount: '', message: '' });
    const [incoming, setIncoming] = useState([]);
    const [history, setHistory] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [status, setStatus] = useState('');

    const fetchIncoming = async () => {
        try {
            const res = await axios.get('/money_requests');
            const pending = res.data.filter(r => r.status === 'pending');
            const past = res.data.filter(r => r.status !== 'pending');
            setIncoming(pending);
            setHistory(past);
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to load requests';
            setStatus(msg);
        }

    };

    const fetchSent = async () => {
        try {
            const res = await axios.get('/money_requests/sent');
            setSentRequests(res.data);
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to load sent requests';
            setStatus(msg);
        }

    };

    useEffect(() => {
        fetchIncoming();
        fetchSent();
    }, []);

    const handleRequest = async (e) => {
        e.preventDefault();
        setStatus('');
        try {
            await axios.post('/money_requests', form);
            setStatus('Request sent!');
            setForm({ recipient_id: '', amount: '', message: '' });
        } catch (err) {
            const res = err.response?.data;
            const msg =
                res?.error ? res.error :
                    Array.isArray(res?.errors) ? res.errors.join(', ') :
                        'Failed to send request';
            setStatus(msg);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.post(`/money_requests/${id}/${action}`);
            setStatus(`Request ${action}ed`);
            fetchIncoming();
        } catch (err) {
            setStatus('Action failed');
        }
    };

    return (
        <div className="card p-4">
            <h3>Request Money</h3>
            {status && <div className="alert alert-info">{status}</div>}
            <form onSubmit={handleRequest}>
                <input
                    className="form-control mb-2"
                    placeholder="Recipient ID"
                    value={form.recipient_id}
                    onChange={(e) => setForm({ ...form, recipient_id: e.target.value })}
                />
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
                <button className="btn btn-primary">Send Request</button>
            </form>

            <hr />
            <h4>Incoming Requests</h4>
            {incoming.length === 0 ? (
                <p>No pending requests.</p>
            ) : (
                <ul className="list-group">
                    {incoming.map(req => (
                        <li key={req.id} className="list-group-item">
                            <p><strong>From:</strong> {req.requester_id}</p>
                            <p><strong>Amount:</strong> €{Number(req.amount).toFixed(2)}</p>
                            <p><strong>Message:</strong> {req.message || '(none)'}</p>
                            <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => handleAction(req.id, 'accept')}
                            >Accept</button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleAction(req.id, 'reject')}
                            >Reject</button>
                        </li>
                    ))}
                </ul>
            )}
            {history.length > 0 && (
                <>
                    <hr />
                    <h4>Request History</h4>
                    <ul className="list-group">
                        {history.map(req => (
                            <li key={req.id} className="list-group-item">
                                <p><strong>From:</strong> {req.requester_id}</p>
                                <p><strong>Amount:</strong> €{Number(req.amount).toFixed(2)}</p>
                                <p><strong>Message:</strong> {req.message || '(none)'}</p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    <span className={
                                        req.status === 'accepted' ? 'text-success' :
                                            req.status === 'rejected' ? 'text-danger' : 'text-muted'
                                    }>
                                        {req.status.toUpperCase()}
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {sentRequests.length > 0 && (
                <>
                    <hr />
                    <h4>Requests You've Sent</h4>
                    <ul className="list-group">
                        {sentRequests.map(req => (
                            <li key={req.id} className="list-group-item">
                                <p><strong>To:</strong> {req.recipient_id}</p>
                                <p><strong>Amount:</strong> €{Number(req.amount).toFixed(2)}</p>
                                <p><strong>Message:</strong> {req.message || '(none)'}</p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    <span className={
                                        req.status === 'accepted' ? 'text-success' :
                                            req.status === 'rejected' ? 'text-danger' : 'text-muted'
                                    }>
                                        {req.status.toUpperCase()}
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </>
            )}

        </div>
    );
};

export default MoneyRequests;

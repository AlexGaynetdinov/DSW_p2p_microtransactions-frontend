import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const SplitPayments = () => {
    const [participants, setParticipants] = useState([]);
    const [myCreatedSplits, setMyCreatedSplits] = useState([]);
    const [form, setForm] = useState({
        participant_ids: '',
        amount: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const fetchMySplits = async () => {
        try {
            const res = await axios.get('/split_participants');
            setParticipants(res.data);
        } catch (err) {
            setStatus('Failed to load split requests');
        }
    };

    const fetchCreatedSplits = async () => {
        try {
            const res = await axios.get('/split_transactions');
            setMyCreatedSplits(res.data);
        } catch (err) {
            console.error('Failed to load created splits');
        }
    };

    useEffect(() => {
        fetchMySplits();
        fetchCreatedSplits();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setStatus('');
        try {
            const res = await axios.post('/split_transactions', {
                amount: form.amount,
                participant_ids: form.participant_ids.split(',').map(id => id.trim()),
                message: form.message
            });
            setStatus('Split created!');
            setForm({ participant_ids: '', amount: '', message: '' });
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to create split';
            setStatus(msg);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.post(`/split_participants/${id}/${action}`);
            setStatus(`Split ${action}ed`);
            fetchMySplits();
        } catch (err) {
            setStatus('Action failed');
        }
    };

    return (
        <div className="card p-4">
            <h3>Create Split Payment</h3>
            {status && <div className="alert alert-info">{status}</div>}
            <form onSubmit={handleCreate}>
                <input
                    className="form-control mb-2"
                    placeholder="Participant IDs (comma-separated)"
                    value={form.participant_ids}
                    onChange={(e) => setForm({ ...form, participant_ids: e.target.value })}
                />
                <input
                    className="form-control mb-2"
                    placeholder="Amount (total)"
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
                <button className="btn btn-primary">Create Split</button>
            </form>

            <hr />
            <h4>Your Split Invitations</h4>
            {participants.length === 0 ? (
                <p>No split requests</p>
            ) : (
                <ul className="list-group">
                    {participants.map(p => (
                        <li key={p.id} className="list-group-item">
                            <p><strong>From:</strong> {p.creator_email}</p>
                            <p><strong>Amount:</strong> €{Number(p.share).toFixed(2)}</p>
                            <p><strong>Message:</strong> {p.message || '(none)'}</p>
                            <p><strong>Status:</strong> <span className={
                                p.status === 'pending' ? 'text-warning' :
                                    p.status === 'accepted' ? 'text-success' :
                                        'text-danger'
                            }>{p.status.toUpperCase()}</span></p>

                            {p.status === 'pending' && (
                                <>
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => handleAction(p.id, 'accept')}
                                    >Accept</button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleAction(p.id, 'reject')}
                                    >Reject</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {myCreatedSplits.length > 0 && (
                <>
                    <hr />
                    <h4>Splits You Created</h4>
                    <ul className="list-group">
                        {myCreatedSplits.map(split => (
                            <li key={split.id} className="list-group-item">
                                <p><strong>Message:</strong> {split.message || '(none)'}</p>
                                <p><strong>Total:</strong> €{Number(split.total_amount).toFixed(2)}</p>
                                <p><strong>Participants:</strong></p>
                                <ul>
                                    {split.participants.map((p, i) => (
                                        <li key={i}>
                                            {p.email} — €{Number(p.share).toFixed(2)} —{' '}
                                            <span className={
                                                p.status === 'accepted' ? 'text-success' :
                                                    p.status === 'rejected' ? 'text-danger' : 'text-warning'
                                            }>
                                                {p.status.toUpperCase()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SplitPayments;

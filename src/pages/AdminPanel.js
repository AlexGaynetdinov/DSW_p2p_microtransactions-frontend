import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

const AdminPanel = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [friendships, setFriendships] = useState([]);
    const [splits, setSplits] = useState([]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resUsers = await axios.get('/users');
                const resTrans = await axios.get('/transactions');
                const resFriends = await axios.get('/admin/friendships');
                const resSplits = await axios.get('/admin/split_transactions');
                setUsers(resUsers.data || []);
                setTransactions(resTrans.data || []);
                setFriendships(resFriends.data || []);
                setSplits(resSplits.data || []);

            } catch (err) {
                const msg = err.response?.data?.error || 'Admin data fetch failed';
                setStatus(msg);
            }

        };
        fetchData();
    }, [user]);

    const handleDeleteUser = async (user) => {
        const confirm = window.confirm(`Are you sure you want to delete ${user.email}? This cannot be undone.`);
        if (!confirm) return;

        try {
            await axios.delete(`/users/${user.id}`);
            setStatus(`User ${user.email} deleted.`);
            setUsers(users.filter(u => u.id !== user.id));
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to delete user.';
            setStatus(msg);
        }
    };

    const handleRevert = async (transactionId) => {
        const confirm = window.confirm('Revert this transaction? A refund will be sent automatically.');

        if (!confirm) return;

        try {
            const res = await axios.post(`/admin/transactions/${transactionId}/revert`);
            setStatus(`Refund issued: ${res.data.transaction.amount}€`);
        } catch (err) {
            setStatus(`Refund failed: ${err.response?.data?.error || 'unknown error'}`);
        }
    };


    return (
        <div className="card p-4">
            <h3>Admin Panel</h3>
            {status && <div className="alert alert-danger">{status}</div>}

            <h4 className="mt-4">All Users</h4>
            <ul className="list-group">
                {users.map(u => (
                    <li
                        key={u.id}
                        className={`list-group-item d-flex justify-content-between align-items-center ${u.deleted ? 'text-muted' : ''
                            }`}
                    >
                        <div>
                            ID: {u.id} — {u.name || '(no name)'} — {u.email}
                            {u.deleted && (
                                <span className="ms-2 badge bg-secondary">deleted</span>
                            )}
                            {' '}— <strong>{u.role}</strong>
                        </div>
                        {!u.deleted && (
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteUser(u)}
                            >
                                Delete
                            </button>
                        )}
                    </li>
                ))}

            </ul>
            <h4 className="mt-4">All Transactions</h4>
            <ul className="list-group">
                {transactions.map(t => (
                    <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            ID: {t.id} | From: {t.sender_id} → To: {t.recipient_id} — €{t.amount} | Message: {t.message || '(none)'}
                        </span>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleRevert(t.id)}>
                            Revert
                        </button>
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
            <h4 className="mt-4">All Split Payments</h4>
            <ul className="list-group">
                {splits.map(split => (
                    <li key={split.id} className="list-group-item">
                        <p><strong>From:</strong> {split.creator.email}</p>
                        <p><strong>Total:</strong> €{Number(split.total_amount).toFixed(2)}</p>
                        <p><strong>Message:</strong> {split.message || '(none)'}</p>
                        <p><strong>Participants:</strong></p>
                        <ul>
                            {split.participants.map((p, i) => (
                                <li key={i}>
                                    {p.email} — €{Number(p.share).toFixed(2)} —{' '}
                                    <span className={
                                        p.status === 'accepted' ? 'text-success' :
                                            p.status === 'rejected' ? 'text-danger' :
                                                'text-warning'
                                    }>
                                        {p.status.toUpperCase()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default AdminPanel;

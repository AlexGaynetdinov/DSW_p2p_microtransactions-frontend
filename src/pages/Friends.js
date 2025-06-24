import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [form, setForm] = useState({ receiver_id: '' });
    const [status, setStatus] = useState('');

    const fetchAll = async () => {
        try {
            const resFriends = await axios.get('/friendships'); // accepted
            const resIncoming = await axios.get('/friendships/incoming'); // pending
            const resOutgoing = await axios.get('/friendships/outgoing'); // outgoing
            setFriends(resFriends.data || []);
            setPending(resIncoming.data || []);
            setOutgoing(resOutgoing.data || []);
        } catch (err) {
            const res = err.response?.data;
            if (res?.error) {
                setStatus(res.error);
            } else if (Array.isArray(res?.errors)) {
                setStatus(res.errors.join(', ')); // join array into readable string
            } else {
                setStatus('Failed to load friends');
            }
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleSendRequest = async (e) => {
        e.preventDefault();
        setStatus('');
        try {
            await axios.post('/friendships', { receiver_id: form.receiver_id });
            setStatus('Friend request sent!');
            setForm({ receiver_id: '' });
            fetchAll();
        } catch (err) {
            const res = err.response?.data;
            if (res?.error) {
                setStatus(res.error);
            } else if (Array.isArray(res?.errors)) {
                setStatus(res.errors.join(', ')); // join array into readable string
            } else {
                setStatus('Failed to send request');
            }
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.post(`/friendships/${id}/${action}`);
            setStatus(`Friend request ${action}ed`);
            fetchAll();
        } catch {
            setStatus('Action failed');
        }
    };

    const handleRevoke = async (id) => {
        try {
            await axios.delete(`/friendships/${id}`);
            setStatus('Friendship revoked');
            fetchAll();
        } catch {
            setStatus('Revoke failed');
        }
    };

    return (
        <div className="card p-4">
            <h3>Friends</h3>
            {status && <div className="alert alert-info">{status}</div>}

            <form onSubmit={handleSendRequest}>
                <input
                    className="form-control mb-2"
                    placeholder="User ID to send request"
                    value={form.receiver_id}
                    onChange={(e) => setForm({ receiver_id: e.target.value })}
                />
                <button className="btn btn-primary">Send Request</button>
            </form>

            <hr />
            <h4>Your Friends</h4>
            {friends.length === 0 ? (
                <p>No friends yet.</p>
            ) : (
                <ul className="list-group">
                    {friends.map(f => (
                        <li key={f.friendship_id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                {f.user.name
                                    ? `${f.user.name} (ID: ${f.user.id}, ${f.user.email})`
                                    : `ID: ${f.user.id}, ${f.user.email}`}
                            </span>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleRevoke(f.friendship_id)}>Revoke</button>
                        </li>
                    ))}
                </ul>
            )}

            <hr />
            <h4>Incoming Requests</h4>
            {pending.length === 0 ? (
                <p>No incoming requests.</p>
            ) : (
                <ul className="list-group">
                    {pending.map(p => (
                        <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                {p.requester.name
                                    ? `${p.requester.name} (${p.requester.email})`
                                    : p.requester.email}
                            </span>
                            <div>
                                <button className="btn btn-success btn-sm me-2" onClick={() => handleAction(p.id, 'accept')}>Accept</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleAction(p.id, 'reject')}>Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <hr />
            <h4>Sent Requests</h4>
            {outgoing.length === 0 ? (
                <p>You haven't sent any friend requests.</p>
            ) : (
                <ul className="list-group">
                    {outgoing.map(req => (
                        <li key={req.id} className="list-group-item">
                            <span>
                                To: {req.receiver.name
                                    ? `${req.receiver.name} (${req.receiver.email})`
                                    : req.receiver.email}
                            </span>
                            <br />
                            <span>Status: <strong className={
                                req.status === 'accepted' ? 'text-success' :
                                    req.status === 'rejected' ? 'text-danger' :
                                        'text-warning'
                            }>{req.status.toUpperCase()}</strong></span>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default Friends;

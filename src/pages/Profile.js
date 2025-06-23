import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

const Profile = () => {
    const { user, login } = useAuth();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: '', email: '' });
    const [editing, setEditing] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/profile');
                setProfile(res.data);
                setForm({ name: res.data.name, email: res.data.email });
            } catch (err) {
                setStatus('Failed to load profile');
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/users/${profile.id}`, {
                user: { name: form.name, email: form.email }
            });
            setStatus('Profile updated!');
            setProfile(res.data);
            login(localStorage.getItem('token'), res.data); // update global auth context
            setEditing(false);
        } catch (err) {
            setStatus('Update failed');
        }
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="card p-4">
            <h3>My Profile</h3>

            {status && <div className="alert alert-info">{status}</div>}

            {!editing ? (
                <>
                    <p><strong>Your User ID:</strong> {profile.id}</p>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <p><strong>Balance:</strong> €{Number(profile.balance).toFixed(2)}</p>
                    <button className="btn btn-secondary mt-2" onClick={() => setEditing(true)}>Edit</button>
                </>
            ) : (
                <form onSubmit={handleUpdate}>
                    <div className="mb-2">
                        <label>Name</label>
                        <input
                            className="form-control"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div className="mb-2">
                        <label>Email</label>
                        <input
                            className="form-control"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button className="btn btn-link" onClick={() => setEditing(false)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default Profile;

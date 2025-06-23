import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from './AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log("Login request to:", axios.defaults.baseURL + '/login');
      console.log("Payload:", { user: form });
      const res = await axios.post('/login', { user: form });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  // useEffect(() => {
  //   const expired = localStorage.getItem('session_expired');
  //   if (expired) {
  //     setError('Session expired. Please log in again.');
  //     localStorage.removeItem('session_expired');
  //   }
  // }, []);


  return (
    <div className="card p-4">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-control mb-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
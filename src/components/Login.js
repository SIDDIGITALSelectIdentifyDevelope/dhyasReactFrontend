import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password }, { withCredentials: true });
      const { role } = response.data.user;
      onLogin({ role });
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/voters/list');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center vh-100">
      <div className="login-container card p-4 shadow-sm">
        {/* Header with Home icon and Sign Up */}
        <div className="d-flex justify-content-between align-items-center mb-4">
        <a href="/" className="home-btn">
            <FontAwesomeIcon icon={faHome} className="home-icon" />
          </a>
          <a href="/signup" className="signup-link">
            <u>Sign Up</u>
          </a>
          
        </div>

        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <p className="error-message mt-3">{error}</p>}
      </div>
    </div>
  );
}

export default Login;

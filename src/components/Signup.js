import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './Signup.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [constituency, setConstituency] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup', { username, password, role, constituency });
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="signup-container card shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <a href="/" className="home-btn">
            <FontAwesomeIcon icon={faHome} className="home-icon" />
          </a>
          <h2>Signup</h2>
        </div>

        <form onSubmit={handleSignup}>
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
          <div className="mb-3">
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={constituency}
              onChange={(e) => setConstituency(e.target.value)}
              placeholder="Constituency"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;

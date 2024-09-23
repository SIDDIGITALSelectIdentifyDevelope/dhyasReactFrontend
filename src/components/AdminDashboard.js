import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LeftSideMenuAdmin from './LeftSideMenuAdmin';
import './AdminDashboard.css';

function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/admin/dashboard', { withCredentials: true });
        setPendingUsers(response.data.pendingUsers);
        setAcceptedUsers(response.data.acceptedUsers);
      } catch (error) {
        setError('Failed to fetch users.');
        console.error('Fetch users error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAccept = async (username) => {
    try {
      await axios.post('http://localhost:5000/api/admin/accept', { username }, { withCredentials: true });
      setPendingUsers(pendingUsers.filter(user => user.username !== username));
      const user = pendingUsers.find(user => user.username === username);
      if (user) {
        setAcceptedUsers(prevUsers => [...prevUsers, user]);
      }
    } catch (error) {
      setError('Failed to accept user.');
      console.error('Accept user error:', error);
    }
  };

  const handleRefuse = async (username) => {
    try {
      await axios.post('http://localhost:5000/api/admin/refuse', { username }, { withCredentials: true });
      setPendingUsers(pendingUsers.filter(user => user.username !== username));
    } catch (error) {
      setError('Failed to refuse user.');
      console.error('Refuse user error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      setError('Failed to logout.');
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <LeftSideMenuAdmin isAdmin={true} />
      <div className="container">
        <header className="admin-header">
          <button onClick={handleLogout} aria-label="Logout">Logout</button>
        </header>
        <h1>Admin Panel</h1>
        <h5>SignUp Requests</h5>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="user-list">
              <h3>Pending Users</h3>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Constituency</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.length > 0 ? (
                    pendingUsers.map(user => (
                      <tr key={user.username}>
                        <td>{user.username}</td>
                        <td>{user.constituency}</td>
                        <td>
                          <div className="user-actions">
                            <button className="accept-button" onClick={() => handleAccept(user.username)}>Accept</button>
                            <button className="refuse-button" onClick={() => handleRefuse(user.username)} style={{ marginLeft: '10px' }}>Refuse</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center' }}>No pending users.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="user-list">
              <h3>Accepted Users</h3>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Constituency</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedUsers.length > 0 ? (
                    acceptedUsers.map(user => (
                      <tr key={user.username}>
                        <td>{user.username}</td>
                        <td>{user.constituency}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" style={{ textAlign: 'center' }}>No accepted users.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        <Outlet /> {/* Renders the child routes */}
      </div>
    </div>
  );
}

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './VoterList.css';

function VoterList() {
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState('');
  const [newConstituency, setNewConstituency] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/voters', { withCredentials: true });
        setVoters(response.data);
      } catch (error) {
        setError('Failed to fetch voters.');
        console.error('Fetch voters error:', error);
      }
    };

    fetchVoters();
  }, []);

  const handleAddVoter = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/voters', { name: newName, constituency: newConstituency }, { withCredentials: true });
      setVoters([...voters, response.data.voter]);
      setNewName('');
      setNewConstituency('');
    } catch (error) {
      setError('Failed to add voter.');
      console.error('Add voter error:', error);
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
    <div>
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>Logout</button>
      <h2>Voter List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="voter-table" border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Constituency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {voters.length > 0 ? (
            voters.map(voter => (
              <tr key={voter._id}>
                <td>{voter.name}</td>
                <td>{voter.constituency}</td>
                <td>
                  <Link to={`/admin/voters/edit/${voter._id}`} className="link">
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No voters available.</td>
            </tr>
          )}
          <tr>
            <td>
              <input
                type="text"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Constituency"
                value={newConstituency}
                onChange={(e) => setNewConstituency(e.target.value)}
              />
            </td>
            <td>
              <button onClick={handleAddVoter}>Add Voter</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VoterList;

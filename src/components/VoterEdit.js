import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditVoter = ({ voterId, onUpdate }) => {
  const [voter, setVoter] = useState(null);
  const [name, setName] = useState('');
  const [constituency, setConstituency] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVoter = async () => {
      try {
        const response = await axios.get(`/api/voters/${voterId}`, { withCredentials: true });
        setVoter(response.data);
        setName(response.data.Name || '');
        setConstituency(response.data.Constituency || '');
      } catch (err) {
        setError(err.response ? err.response.data.message : 'An unexpected error occurred');
      }
    };

    fetchVoter();
  }, [voterId]);

  const handleUpdate = async () => {
    if (!name || !constituency) {
      setError('Name and Constituency are required');
      return;
    }

    try {
      const response = await axios.put(`/api/voters/${voterId}`, { Name: name, Constituency: constituency }, { withCredentials: true });
      alert('Voter updated successfully');
      onUpdate(response.data.voter);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'An unexpected error occurred');
    }
  };

  return (
    <div>
      <h1>Edit Voter</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {voter ? (
        <div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input type="text" value={constituency} onChange={(e) => setConstituency(e.target.value)} placeholder="Constituency" />
          <button onClick={handleUpdate}>Update</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditVoter;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditVoter = ({ voterId, onUpdate, onCancel }) => {
  const [voterData, setVoterData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVoterData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/voters/${voterId}`, {
          withCredentials: true,
        });

        if (response.data && response.data.voter) {
          setVoterData(response.data.voter);
        }
      } catch (err) {
        console.error('Error fetching voter data:', err);
        setError('Failed to load voter data');
      }
    };

    if (voterId) {
      fetchVoterData();
    } else {
      setError('Invalid voter ID');
    }
  }, [voterId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Only include fields that have been changed
    const updatedData = {};
    for (const key in voterData) {
      if (voterData[key] !== '') {
        updatedData[key] = voterData[key];
      }
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/voters/${voterId}`,
        updatedData,
        { withCredentials: true }
      );

      onUpdate(response.data.voter);
    } catch (err) {
      console.error('Error updating voter:', err);
      setError('An error occurred while updating the voter.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVoterData(prevData => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <h2>Edit Voter</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            placeholder="Leave blank to keep current value"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Marathi Name:</label>
          <input
            type="text"
            name="Marathi_Name"
            placeholder="Leave blank to keep current value"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Constituency:</label>
          <input
            type="text"
            name="Constituency"
            placeholder="Leave blank to keep current value"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Epic No:</label>
          <input
            type="text"
            name="Epic_No"
            placeholder="Leave blank to keep current value"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Father:</label>
          <input
            type="text"
            name="Father"
            placeholder="Leave blank to keep current value"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender:</label>
          <input
            type="text"
            name="Gender"
            placeholder="Leave blank to keep current value"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Middle Name:</label>
          <input
            type="text"
            name="Middle_Name"
            placeholder="Leave blank to keep current value"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Relation:</label>
          <input
            type="text"
            name="Relation"
            placeholder="Leave blank to keep current value"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Voting Booth Name:</label>
          <input
            type="text"
            name="Votting_Boothe_Name"
            placeholder="Leave blank to keep current value"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Ward No:</label>
          <input
            type="text"
            name="Ward_No"
            placeholder="Leave blank to keep current value"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="text"
            name="Age"
            placeholder="Leave blank to keep current value"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Has Voted:</label>
          <input
            type="checkbox"
            name="hasVoted"
            checked={voterData.hasVoted || false}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditVoter;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VoterDetails() {
  const { voterId } = useParams();
  const [voter, setVoter] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoterDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/voters/${voterId}`, { withCredentials: true });
        setVoter(response.data);
      } catch (error) {
        setError('Failed to fetch voter details. Please try again later.');
        console.error('Fetch voter details error:', error);
      }
    };

    fetchVoterDetails();
  }, [voterId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!voter) {
    return <p>Loading voter details...</p>;
  }

  return (
    <div>
      <h2>Voter Details</h2>
      <p><strong>Epic No:</strong> {voter.Epic_No}</p>
      <p><strong>Name:</strong> {voter.Name}</p>
      <p><strong>Middle Name:</strong> {voter.Middle_Name}</p>
      <p><strong>Age:</strong> {voter.age}</p>
      <p><strong>Gender:</strong> {voter.Gender}</p>
      <p><strong>English Name:</strong> {voter.English_Name}</p>
      <p><strong>Marathi Name:</strong> {voter.Marathi_Name}</p>
      {/* Add more fields as needed */}
    </div>
  );
}

export default VoterDetails;

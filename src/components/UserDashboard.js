import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/data', { withCredentials: true });
        setUserData(response.data.userData);
      } catch (err) {
        setError(err.response.data.message || 'user Dashboard');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>User Dashboard</h2>
      {error && <p>{error}</p>}
      <h3>Your Data</h3>
      <ul>
        {userData.map((data, index) => (
          <li key={index}>{JSON.stringify(data)}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VoterList.css'; // Ensure you have appropriate styling in this CSS file

const AgewiseList = () => {
  const navigate = useNavigate();
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [votersPerPage] = useState(10); // Number of voters to display per page

  // Fetch voters from API
  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/data', { withCredentials: true });
        setVoters(response.data.userData);
      } catch (error) {
        setError('Failed to fetch voters. Please try again later.');
      }
    };

    fetchVoters();
  }, []);

  // Filter voters within age range (18 to 80)
  const filteredVoters = voters.filter(voter => {
    const age = parseInt(voter.age, 10);
    return age >= 18 && age <= 80; // Adjust age range here
  });

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredVoters.length / votersPerPage);

  // Get current voters for pagination
  const currentVoters = filteredVoters.slice(
    (currentPage - 1) * votersPerPage,
    currentPage * votersPerPage
  );

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed. Please try again.');
    }
  };

  return (
    <div className="voter-list-container">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <h2 className="no-print">Voter List (Age 18 to 80)</h2>

      {error && <p className="error-message no-print">{error}</p>}

      <table className="voter-table">
        <thead>
          <tr>
            <th>Constituency</th>
            <th>Ward No</th>
            <th>Votting Boothe Name</th>
            <th>Epic No</th>
            <th>Name</th>
            <th>Middle Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th>English Name</th>
            <th>Marathi Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentVoters.length > 0 ? (
            currentVoters.map(voter => (
              <tr key={voter._id}>
                <td>{voter.Constituency}</td>
                <td>{voter.Ward_No}</td>
                <td>{voter.Votting_Boothe_Name}</td>
                <td>{voter.Epic_No}</td>
                <td>{voter.Name}</td>
                <td>{voter.Middle_Name}</td>
                <td>{voter.Gender}</td>
                <td>{voter.age}</td>
                <td>{voter.English_Name}</td>
                <td>{voter.Marathi_Name}</td>
                <td>
                  <button onClick={() => navigate(`/admin/voters/view/${voter._id}`)}>View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No voters available in this age range.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AgewiseList;

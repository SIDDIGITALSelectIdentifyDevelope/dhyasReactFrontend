import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import './VoterList.css';

function VoterList() {
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    Votting_Boothe_Name: '',
    Epic_No: '',
    Name: '',
    Middle_Name: '',
    age: '',
    Gender: '',
    English_Name: '',
    Marathi_Name: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [votersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetching voters data
  const fetchVoters = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/voters', { withCredentials: true });
      setVoters(response.data || []); // Ensure response.data is an array
    } catch (error) {
      setError('Failed to fetch voters. Please try again later.');
      console.error('Fetch voters error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVoters();
  }, [fetchVoters]);

  useEffect(() => {
    setTotalPages(Math.ceil((voters ? voters.length : 0) / votersPerPage));
  }, [voters, votersPerPage]);

  // Handling page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handling filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      Votting_Boothe_Name: '',
      Epic_No: '',
      Name: '',
      Middle_Name: '',
      age: '',
      Gender: '',
      English_Name: '',
      Marathi_Name: '',
    });
    setCurrentPage(1);
  };

  const filteredVoters = (voters || []).filter((voter) =>
    Object.keys(filters).every((key) =>
      filters[key] === '' || (voter[key] && voter[key].toString().toLowerCase().includes(filters[key].toLowerCase()))
    )
  );

  useEffect(() => {
    setTotalPages(Math.ceil((filteredVoters ? filteredVoters.length : 0) / votersPerPage));
  }, [filteredVoters, votersPerPage]);

  const currentVoters = (filteredVoters || []).slice(
    (currentPage - 1) * votersPerPage,
    currentPage * votersPerPage
  );

  // Navigate to detailed view of a voter
  const handleView = (voterId) => {
    navigate(`/admin/voters/view/${voterId}`);
  };

  // Calculate gender totals
  const genderTotals = (filteredVoters || []).reduce((totals, voter) => {
    const gender = voter.Gender ? voter.Gender.toLowerCase() : '';
    if (gender === 'male' || gender === 'पुरुष') totals.male += 1;
    else if (gender === 'female' || gender === 'महिला') totals.female += 1;
    else if (gender === 'transgender' || gender === 'ट्रांसजेंडर') totals.transgender += 1;
    totals.total += 1;
    return totals;
  }, { male: 0, female: 0, transgender: 0, total: 0 });

  // Print the table
  const printTable = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
      <html>
      <head>
        <title>Print Voter List</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; border: 1px solid #ddd; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>Voter List</h1>
        <table>
          <thead>
            <tr>
              <th>Constituency</th><th>Ward No</th><th>Votting Boothe Name</th>
              <th>Epic No</th><th>Name</th><th>Middle Name</th>
              <th>Gender</th><th>Age</th><th>English Name</th><th>Marathi Name</th>
            </tr>
          </thead>
          <tbody>
            ${(currentVoters || []).map(voter => `
              <tr>
                <td>${voter.Constituency}</td>
                <td>${voter.Ward_No}</td>
                <td>${voter.Votting_Boothe_Name}</td>
                <td>${voter.Epic_No}</td>
                <td>${voter.Name}</td>
                <td>${voter.Middle_Name}</td>
                <td>${voter.Gender}</td>
                <td>${voter.age}</td>
                <td>${voter.English_Name}</td>
                <td>${voter.Marathi_Name}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Handle logout
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
      <div className="header">
        <h2 className="no-print">Voter List</h2>
        <div className="header-controls">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Back</button>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {loading && <p>Loading voters...</p>}
      {error && <p className="error-message no-print">{error}</p>}

      <div className="filter-section">
        {Object.keys(filters).map((key) => (
          <div className="filter-input" key={key}>
            <label htmlFor={key}>{key.replace('_', ' ')}</label>
            <input
              type="text"
              id={key}
              name={key}
              value={filters[key]}
              onChange={handleFilterChange}
              placeholder={`Search by ${key.replace('_', ' ')}`}
              aria-label={`Search by ${key.replace('_', ' ')}`}
            />
          </div>
        ))}
      </div>

      <div className="filter-button-group">
        <button className="clear-button" onClick={handleClearFilters}>Clear</button>
        <button className="print-button" onClick={printTable}>Print</button>
      </div>

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {currentVoters.length > 5 ? (
    currentVoters.map((voter) => (
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
          <button onClick={() => handleView(voter._id)}>View</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5">No voters available.</td>
    </tr>
  )}
</tbody>
      </table>

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>

      <div className="totalcounter">
        <div className="total-box">
          <h4>Total Male</h4>
          <p>{genderTotals.male}</p>
        </div>
        <div className="total-box">
          <h4>Total Female</h4>
          <p>{genderTotals.female}</p>
        </div>
        <div className="total-box">
          <h4>Total Transgender</h4>
          <p>{genderTotals.transgender}</p>
        </div>
        <div className="total-box">
          <h4>Total Rows</h4>
          <p>{genderTotals.total}</p>
        </div>
      </div>
    </div>
  );
}

export default VoterList;

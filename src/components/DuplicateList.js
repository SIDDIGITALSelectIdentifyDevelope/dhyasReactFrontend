import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VoterList.css';

function DuplicateList() {
  const [voters, setVoters] = useState([]);
  const [currentVoters, setCurrentVoters] = useState([]);
  const [filters, setFilters] = useState({
    Constituency: '',
    Ward_No: '',
    Votting_Boothe_Name: '',
    Epic_No: '',
    Name: '',
    Middle_Name: '',
    Gender: '',
    age: '',
    English_Name: '',
    Marathi_Name: ''
  });
  const [newVoter, setNewVoter] = useState({
    Name: '',
    Constituency: '',
    Marathi_Name: ''
  });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [votersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [genderTotals, setGenderTotals] = useState({
    male: 0,
    female: 0,
    transgender: 0,
    total: 0
  });

  const navigate = useNavigate();

  // Fetch voters data
  const fetchVoters = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/voters', { withCredentials: true });
      setVoters(response.data);
      setTotalPages(Math.ceil(response.data.length / votersPerPage));
    } catch (error) {
      setError('Failed to fetch voters. Please try again later.');
      console.error('Fetch voters error:', error);
    }
  }, [votersPerPage]);

  useEffect(() => {
    fetchVoters();
  }, [fetchVoters]);

  // Filter for duplicates
  const findDuplicates = (voterList) => {
    const voterMap = {};
    voterList.forEach(voter => {
      const key = `${voter.Epic_No}_${voter.Name}_${voter.Constituency}`;
      if (voterMap[key]) {
        voterMap[key].push(voter);
      } else {
        voterMap[key] = [voter];
      }
    });
    return Object.values(voterMap).filter(group => group.length > 1).flat();
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      Constituency: '',
      Ward_No: '',
      Votting_Boothe_Name: '',
      Epic_No: '',
      Name: '',
      Middle_Name: '',
      Gender: '',
      age: '',
      English_Name: '',
      Marathi_Name: '',
    });
    setCurrentPage(1); // Reset to first page
  };

  // Filter voters based on search criteria
  const filteredVoters = findDuplicates(voters).filter(voter =>
    Object.keys(filters).every(key => {
      if (filters[key] === '') return true;
      return voter[key] && voter[key].toString().toLowerCase().includes(filters[key].toLowerCase());
    })
  );

  // Update total pages when filters change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredVoters.length / votersPerPage));
  }, [filteredVoters, votersPerPage]);

  // Get current page voters
  const currentVotersPage = filteredVoters.slice(
    (currentPage - 1) * votersPerPage,
    currentPage * votersPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Navigate to voter details view
  const handleView = (voterId) => {
    navigate(`/admin/voters/view/${voterId}`);
  };

  // Calculate gender totals
  useEffect(() => {
    const totals = filteredVoters.reduce((acc, voter) => {
      const gender = voter.Gender ? voter.Gender.toLowerCase() : '';
      if (gender === 'male' || gender === 'पुरुष') acc.male += 1;
      else if (gender === 'female' || gender === 'महिला') acc.female += 1;
      else if (gender === 'transgender' || gender === 'ट्रांसजेंडर') acc.transgender += 1;
      acc.total += 1;
      return acc;
    }, { male: 0, female: 0, transgender: 0, total: 0 });

    setGenderTotals(totals);
  }, [filteredVoters]);

  // Print table function
  const printTable = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Voter List</title>');
    printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { padding: 10px; border: 1px solid #ddd; } th { background-color: #f4f4f4; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>Voter List</h1>');
    printWindow.document.write('<table><thead><tr>');
    printWindow.document.write('<th>Constituency</th><th>Ward No</th><th>Votting Boothe Name</th><th>Epic No</th><th>Name</th><th>Middle Name</th><th>Gender</th><th>Age</th><th>English Name</th><th>Marathi Name</th>');
    printWindow.document.write('</tr></thead><tbody>');
    currentVotersPage.forEach(voter => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${voter.Constituency}</td>`);
      printWindow.document.write(`<td>${voter.Ward_No}</td>`);
      printWindow.document.write(`<td>${voter.Votting_Boothe_Name}</td>`);
      printWindow.document.write(`<td>${voter.Epic_No}</td>`);
      printWindow.document.write(`<td>${voter.Name}</td>`);
      printWindow.document.write(`<td>${voter.Middle_Name}</td>`);
      printWindow.document.write(`<td>${voter.Gender}</td>`);
      printWindow.document.write(`<td>${voter.age}</td>`);
      printWindow.document.write(`<td>${voter.English_Name}</td>`);
      printWindow.document.write(`<td>${voter.Marathi_Name}</td>`);
      printWindow.document.write('</tr>');
    });
    printWindow.document.write('</tbody></table></body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Handle new voter input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVoter(prevNewVoter => ({
      ...prevNewVoter,
      [name]: value
    }));
  };

  // Handle adding a new voter
  const handleAddVoter = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/voters', newVoter, { withCredentials: true });
      setVoters([...voters, response.data]);
      setNewVoter({ Name: '', Constituency: '', Marathi_Name: '' });
      fetchVoters(); // Refresh the list
    } catch (error) {
      setError('Failed to add voter. Please try again.');
      console.error('Add voter error:', error);
    }
  };

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
      <h2>Duplicate List</h2>
     
      {error && <p className="error-message">{error}</p>}
      
      <div className="filter-section">
        {Object.keys(filters).map(key => (
          <div className="filter-input" key={key}>
            <label htmlFor={key}>{key.replace('_', ' ')}</label>
            <input
              type="text"
              id={key}
              name={key}
              value={filters[key]}
              onChange={handleFilterChange}
              placeholder={`Search by ${key.replace('_', ' ')}`}
            />
          </div>
        ))}
        <button onClick={handleClearFilters}>Clear Filters</button>
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
          {currentVotersPage.length > 0 ? (
            currentVotersPage.map(voter => (
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
              <td colSpan="11">No voters available.</td>
            </tr>
          )}
          {/* Add new voter */}
          <tr>
            <td>
              <input
                type="text"
                placeholder="Name"
                name="Name"
                value={newVoter.Name}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Constituency"
                name="Constituency"
                value={newVoter.Constituency}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Marathi Name"
                name="Marathi_Name"
                value={newVoter.Marathi_Name}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <button onClick={handleAddVoter} className="add-button">Add Voter</button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Gender Totals */}
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

export default DuplicateList;

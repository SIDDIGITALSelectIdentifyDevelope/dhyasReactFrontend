import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VoterList.css'; // Ensure you have this CSS file for styling

function AlphbheticalList() {
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState(null);
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
  const [votersPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('Name'); // Default sorting by Name
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order ascending
  const navigate = useNavigate();

  const fetchVoters = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/voters', { withCredentials: true });
      if (Array.isArray(response.data)) {
        setVoters(response.data);
        setTotalPages(Math.ceil(response.data.length / votersPerPage));
      } else {
        setError('Unexpected data format from server.');
      }
    } catch (error) {
      setError('Failed to fetch voters. Please try again later.');
      console.error('Fetch voters error:', error);
    }
  }, [votersPerPage]);

  useEffect(() => {
    fetchVoters();
  }, [fetchVoters]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
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
    setCurrentPage(1); // Reset to first page when filters are cleared
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      setError('Failed to logout. Please try again later.');
      console.error('Logout error:', error);
    }
  };

  const filteredVoters = voters.filter(voter =>
    Object.keys(filters).every(key => {
      if (filters[key] === '') return true;
      return voter[key] && voter[key].toString().toLowerCase().includes(filters[key].toLowerCase());
    })
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredVoters.length / votersPerPage));
  }, [filteredVoters, votersPerPage]);

  const sortedVoters = [...filteredVoters].sort((a, b) => {
    const fieldA = a[sortBy]?.toString().toLowerCase() || '';
    const fieldB = b[sortBy]?.toString().toLowerCase() || '';

    if (sortOrder === 'asc') {
      return fieldA.localeCompare(fieldB);
    } else {
      return fieldB.localeCompare(fieldA);
    }
  });

  const currentVoters = sortedVoters.slice(
    (currentPage - 1) * votersPerPage,
    currentPage * votersPerPage
  );

  const handleView = (voterId) => {
    navigate(`/admin/voters/view/${voterId}`);
  };

  const printTable = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Voter List</title>');
    printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { padding: 10px; border: 1px solid #ddd; } th { background-color: #f4f4f4; } </style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<h1>Voter List</h1>');
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr>');
    printWindow.document.write('<th>Votting Boothe Name</th><th>Epic No</th><th>Name</th><th>Middle Name</th><th>Age</th><th>Gender</th><th>English Name</th><th>Marathi Name</th>');
    printWindow.document.write('</tr></thead>');
    printWindow.document.write('<tbody>');
    currentVoters.forEach(voter => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${voter.Votting_Boothe_Name}</td>`);
      printWindow.document.write(`<td>${voter.Epic_No}</td>`);
      printWindow.document.write(`<td>${voter.Name}</td>`);
      printWindow.document.write(`<td>${voter.Middle_Name}</td>`);
      printWindow.document.write(`<td>${voter.age}</td>`);
      printWindow.document.write(`<td>${voter.Gender}</td>`);
      printWindow.document.write(`<td>${voter.English_Name}</td>`);
      printWindow.document.write(`<td>${voter.Marathi_Name}</td>`);
      printWindow.document.write('</tr>');
    });
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Normalize and calculate totals
  const genderTotals = filteredVoters.reduce((totals, voter) => {
    const gender = voter.Gender ? voter.Gender.toLowerCase() : '';

    if (gender === 'male' || gender === 'पुरुष') totals.male += 1;
    else if (gender === 'female' || gender === 'महिला') totals.female += 1;
    else if (gender === 'transgender' || gender === 'ट्रांसजेंडर') totals.transgender += 1;
    totals.total += 1;

    return totals;
  }, { male: 0, female: 0, transgender: 0, total: 0 });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="voter-list-container">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button className="logout-button" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Back
          </button>
          <button className="logout-button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

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
        <div className="filter-button-group">
          <button className="clear-button" onClick={handleClearFilters}>Clear</button>
          <button className="print-button" onClick={printTable}>Print</button>
        </div>
      </div>

      <h2 className="no-print">Alphabetical List</h2>
      {error && <p className="error-message no-print">{error}</p>}

      <table className="voter-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('Votting_Boothe_Name')}>Votting Boothe Name</th>
            <th onClick={() => handleSort('Epic_No')}>Epic No</th>
            <th onClick={() => handleSort('Name')}>Name</th>
            <th onClick={() => handleSort('Middle_Name')}>Middle Name</th>
            <th onClick={() => handleSort('age')}>Age</th>
            <th onClick={() => handleSort('Gender')}>Gender</th>
            <th onClick={() => handleSort('English_Name')}>English Name</th>
            <th onClick={() => handleSort('Marathi_Name')}>Marathi Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentVoters.length > 0 ? (
            currentVoters.map((voter) => (
              <tr key={voter._id}>
                <td>{voter.Votting_Boothe_Name}</td>
                <td>{voter.Epic_No}</td>
                <td>{voter.Name}</td>
                <td>{voter.Middle_Name}</td>
                <td>{voter.age}</td>
                <td>{voter.Gender}</td>
                <td>{voter.English_Name}</td>
                <td>{voter.Marathi_Name}</td>
                <td>
                  <button onClick={() => handleView(voter._id)}>View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No voters available.</td>
            </tr>
          )}
        </tbody>
      </table>

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

export default AlphbheticalList;

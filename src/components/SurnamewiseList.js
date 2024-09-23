import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VoterList.css';

function SurnamewiseList() {
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState(null);
  const [newVoter, setNewVoter] = useState({ name: '', constituency: '', marathiName: '' });
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
  const [genderTotals, setGenderTotals] = useState({
    male: 0,
    female: 0,
    transgender: 0,
    total: 0
  });
  const [sortBy, setSortBy] = useState(''); // Sorting state
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting order

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSurnamewiseData() {
      try {
        const response = await axios.get('http://localhost:5000/api/user/data', { withCredentials: true });
        setVoters(response.data.userData || []);
      } catch (error) {
        setError('Failed to fetch surnamewise data');
        console.error('Failed to fetch surnamewise data', error);
      }
    }

    fetchSurnamewiseData();
  }, []);

  const handleAddVoter = async () => {
    if (!newVoter.name || !newVoter.constituency || !newVoter.marathiName) {
      setError('Please fill out all fields to add a voter.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/voters',
        newVoter,
        { withCredentials: true }
      );
      setVoters([...voters, response.data.voter]);
      setNewVoter({ name: '', constituency: '', marathiName: '' });
    } catch (error) {
      setError('Failed to add voter. Please try again.');
      console.error('Add voter error:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    setCurrentPage(1); // Reset to the first page when filters change
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVoter(prevVoter => ({
      ...prevVoter,
      [name]: value
    }));
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
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

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter voters based on the applied filters
  const filteredVoters = voters.filter(voter =>
    Object.keys(filters).every(key =>
      filters[key] === '' || voter[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  // Sort voters by surname
  const sortedVoters = [...filteredVoters].sort((a, b) => {
    if (sortBy === 'Surname') {
      const surnameA = a.Surname?.toLowerCase() || '';
      const surnameB = b.Surname?.toLowerCase() || '';

      if (sortOrder === 'asc') {
        return surnameA.localeCompare(surnameB);
      } else {
        return surnameB.localeCompare(surnameA);
      }
    } else {
      return 0; // No sorting if sortBy is not Surname
    }
  });

  // Update total pages whenever sortedVoters or currentPage changes
  useEffect(() => {
    setTotalPages(Math.ceil(sortedVoters.length / votersPerPage));
  }, [sortedVoters, votersPerPage]);

  const currentVoters = sortedVoters.slice(
    (currentPage - 1) * votersPerPage,
    currentPage * votersPerPage
  );

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

  const handleView = (voterId) => {
    navigate(`/admin/voters/view/${voterId}`);
  };

  const printTable = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Voter List</title>');
    printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { padding: 10px; border: 1px solid #ddd; } th { background-color: #f4f4f4; } </style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>Voter List</h1>');
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr>');
    printWindow.document.write('<th>Constituency</th><th>Ward No</th><th>Votting Boothe Name</th><th>Epic No</th><th>Name</th><th>Middle Name</th><th>Gender</th><th>Age</th><th>English Name</th><th>Marathi Name</th>');
    printWindow.document.write('</tr></thead>');
    printWindow.document.write('<tbody>');
    currentVoters.forEach(voter => {
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
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="voter-list-container">
      <h2 className="no-print">Voter List</h2>
      
      
      {error && <p className="error-message no-print">{error}</p>}

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
      </div>

      <div className="filter-button-group">
        <button className="clear-button" onClick={handleClearFilters}>Clear</button>
        <button className="print-button" onClick={printTable}>Print</button>
      </div>

      <table className="voter-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('Surname')}>Surname</th> {/* Add sorting by surname */}
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
                <td>{voter.Surname}</td> {/* Display surname */}
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
              <td colSpan="12">No voters available.</td>
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

export default SurnamewiseList;

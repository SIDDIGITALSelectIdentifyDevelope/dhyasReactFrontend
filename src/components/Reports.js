import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Reports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports', { withCredentials: true });
        setReports(response.data);
      } catch (error) {
        setError('Failed to fetch reports.');
        console.error('Fetch reports error:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h2>Reports List</h2>
      {error && <p>{error}</p>}
      <ul>
        {reports.length > 0 ? (
          reports.map(report => (
            <li key={report.id}>
              <Link to={`/reports/${report.id}`}>{report.name}</Link>
            </li>
          ))
        ) : (
          <p>No reports available.</p>
        )}
      </ul>
    </div>
  );
}

export default Reports;

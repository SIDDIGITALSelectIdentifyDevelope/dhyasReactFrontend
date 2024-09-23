import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

function ViewReport() {
  const { id } = useParams();
  const location = useLocation();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reports/${id}`);
        setReport(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch report');
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, location.state?.refresh]); // Depend on location.state.refresh

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>View Report</h2>
      <p><strong>Report Name:</strong> {report?.reportName}</p>
      <p><strong>Report Data:</strong> {report?.reportData}</p>
    </div>
  );
}

export default ViewReport;

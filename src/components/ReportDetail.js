import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ReportDetail() {
  const { id } = useParams(); // Extract the report ID from the URL
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reports/${id}`, { withCredentials: true });
        setReport(response.data);
      } catch (error) {
        setError('Failed to fetch report details.');
        console.error('Fetch report detail error:', error);
      }
    };

    fetchReportDetail();
  }, [id]);

  return (
    <div>
      <h2>Report Detail</h2>
      {error && <p>{error}</p>}
      {report ? (
        <div>
          <h3>{report.name}</h3>
          <p>{report.description}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ReportDetail;

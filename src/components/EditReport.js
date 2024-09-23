// src/components/EditReport.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditReport() {
  const { id } = useParams(); // Get the report ID from the URL
  const [report, setReport] = useState({ reportName: '', reportData: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/reports/${id}`, report);
      navigate('/admin/addresswiseReport', { state: { refresh: true } }); // Redirect after successful update
    } catch (error) {
      setError('Failed to update report');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Edit Report</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Report Name:</label>
          <input
            type="text"
            name="reportName"
            value={report.reportName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Report Data:</label>
          <textarea
            name="reportData"
            value={report.reportData}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Report</button>
      </form>
    </div>
  );
}

export default EditReport;

// src/components/ReportTable.js
import React from 'react';
import { Link } from 'react-router-dom';

function ReportTable({ headers, data }) {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.reportName}</td>
            <td>{row.reportData}</td>
            <td>
              {row._id ? (
                <Link to={`/admin/reports/edit/${row._id}`}>Edit</Link>
              ) : (
                'No ID'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ReportTable;

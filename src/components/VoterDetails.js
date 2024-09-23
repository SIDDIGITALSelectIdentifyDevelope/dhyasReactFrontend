import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import EditVoter from './EditVoter';
import dhyasLogo from '../assets/dhyas.png'; // Import the logo
import './VoterDetails.css'; // Import the CSS file

const VoterDetails = () => {
  const { voterId } = useParams();
  const [voter, setVoter] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const printRef = useRef(null); // Ref for the printable content

  useEffect(() => {
    const fetchVoter = async () => {
      if (!voterId) {
        setError('Voter ID is required');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/voters/${voterId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setVoter(data);
        localStorage.setItem(`voter_${voterId}`, JSON.stringify(data)); // Store in local storage
      } catch (err) {
        const localVoter = localStorage.getItem(`voter_${voterId}`);
        if (localVoter) {
          setVoter(JSON.parse(localVoter)); // Use cached data if offline
          setError('Offline: using cached data');
        } else {
          setError(err.message);
        }
      }
    };

    fetchVoter();
  }, [voterId]);

  const handleVoterUpdate = (updatedVoter) => {
    setVoter(prev => ({ ...prev, ...updatedVoter }));
    setIsEditing(false);
    localStorage.setItem(`voter_${voterId}`, JSON.stringify({ ...voter, ...updatedVoter })); // Update local storage
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload after printing to restore the page
  };

  const handleWhatsAppShare = () => {
    const voterDetails = `Voter Details:
    Name: ${voter.Name}
    Constituency: ${voter.Constituency}
    Epic No: ${voter.Epic_No}
    Father: ${voter.Father}
    Gender: ${voter.Gender}
    Age: ${voter.Age}
    Voting Status: ${voter.hasVoted ? 'Done' : 'Not Done'}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(voterDetails)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!voter) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="voter-details-container">
      <h2 className="title">Voter Details</h2>
      <div ref={printRef} className="voter-details-content">
        <img src={dhyasLogo} alt="Dhyas Logo" className="logo" />
        <h3 className="details-heading">Voter Information:</h3>
        <div className="voter-info">
          <div>ID: <span>{voter._id}</span></div>
          <div>Name: <span>{voter.Name}</span></div>
          <div>Marathi Name: <span>{voter.Marathi_Name}</span></div>
          <div>Constituency: <span>{voter.Constituency}</span></div>
          <div>Epic No: <span>{voter.Epic_No}</span></div>
          <div>Father: <span>{voter.Father}</span></div>
          <div>Gender: <span>{voter.Gender}</span></div>
          <div>Middle Name: <span>{voter.Middle_Name}</span></div>
          <div>Relation: <span>{voter.Relation}</span></div>
          <div>Voting Booth Name: <span>{voter.Votting_Boothe_Name}</span></div>
          <div>Ward No: <span>{voter.Ward_No}</span></div>
          <div>Age: <span>{voter.Age}</span></div>
          <div>Voting Status: <span>{voter.hasVoted ? 'Done' : 'Not Done'}</span></div>
        </div>
      </div>
      <div className="button-group">
        <button className="edit-button" onClick={handleEditClick}>Edit</button>
        <button className="print-button" onClick={handlePrint}>Print</button>
        <button className="whatsapp-button" onClick={handleWhatsAppShare}>Share on WhatsApp</button>
      </div>
      {isEditing && (
        <EditVoter
          voterId={voterId}
          onUpdate={handleVoterUpdate}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default VoterDetails;

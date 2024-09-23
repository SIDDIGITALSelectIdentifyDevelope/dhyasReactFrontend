import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt, faList, faAddressCard, faUserCheck, faSearch,
  faCogs, faUsers, faCircle, faGenderless, faUserTag, faHeart,
  faBook, faExclamationTriangle, faBars, faTimes
} from '@fortawesome/free-solid-svg-icons';

import logoImage from '../assets/dhyas.png';
import './LeftSideMenuAdmin.css'; // Import the CSS file

function LeftSideMenuAdmin({ onLogout, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar open/closed

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button className="toggle-button" onClick={toggleSidebar} aria-label="Toggle Menu">
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <img src={logoImage} alt="Logo" className="logo" />
        <h2>{isAdmin ? "Admin Menu" : "User Menu"}</h2>
        {isAdmin ? (
          <>
            <Link to="/admin/dashboard" className="link">
              <FontAwesomeIcon icon={faTachometerAlt} className="link-icon" />
              Admin Dashboard
            </Link>
            <Link to="/admin/voters/list" className="link">
              <FontAwesomeIcon icon={faList} className="link-icon" />
              Voters List
            </Link>
            <Link to="/admin/alphbheticalList" className="link">
              <FontAwesomeIcon icon={faAddressCard} className="link-icon" />
              Alphbhetical List
            </Link>
            <Link to="/admin/agewiseList" className="link">
              <FontAwesomeIcon icon={faUserCheck} className="link-icon" />
              Agewise List
            </Link>
            <Link to="/admin/familyReport" className="link">
              <FontAwesomeIcon icon={faUsers} className="link-icon" />
              Family Report
            </Link>
            <Link to="/admin/duplicateList" className="link">
              <FontAwesomeIcon icon={faSearch} className="link-icon" />
              Duplicate List
            </Link>
            <Link to="/admin/surnamewiseList" className="link">
              <FontAwesomeIcon icon={faUserTag} className="link-icon" />
              Surnamewise List
            </Link>
            <Link to="/admin/deadOrAlive" className="link">
              <FontAwesomeIcon icon={faCircle} className="link-icon" />
              Dead or Alive
            </Link>
            <Link to="/admin/redGreenReport" className="link">
              <FontAwesomeIcon icon={faHeart} className="link-icon" />
              Red Green Report
            </Link>
            <Link to="/admin/addresswiseReport" className="link">
              <FontAwesomeIcon icon={faAddressCard} className="link-icon" />
              Addresswise Report
            </Link>
            <Link to="/admin/boothwiseReport" className="link">
              <FontAwesomeIcon icon={faCogs} className="link-icon" />
              Boothwise Report
            </Link>
            <Link to="/admin/genderReport" className="link">
              <FontAwesomeIcon icon={faGenderless} className="link-icon" />
              Gender Report
            </Link>
            <Link to="/admin/casteReport" className="link">
              <FontAwesomeIcon icon={faUserTag} className="link-icon" />
              Caste Report
            </Link>
            <Link to="/admin/wardwiseReport" className="link">
              <FontAwesomeIcon icon={faBook} className="link-icon" />
              Wardwise Report
            </Link>
            <Link to="/admin/bloodGroupReport" className="link">
              <FontAwesomeIcon icon={faCircle} className="link-icon" />
              Blood Group Report
            </Link> 
            <Link to="/admin/educationReport" className="link">
              <FontAwesomeIcon icon={faBook} className="link-icon" />
              Education Report
            </Link>
            <Link to="/admin/shiftedReport" className="link">
              <FontAwesomeIcon icon={faExclamationTriangle} className="link-icon" />
              Shifted Report
            </Link>
          </>
        ) : (
          <>
            <Link to="/user/voters/list" className="link">
              <FontAwesomeIcon icon={faList} className="link-icon" />
              Voters List
            </Link>
            <Link to="/user/alphbheticalList" className="link">
              <FontAwesomeIcon icon={faAddressCard} className="link-icon" />
              Alphbhetical List
            </Link>
            <Link to="/user/agewiseList" className="link">
              <FontAwesomeIcon icon={faUserCheck} className="link-icon" />
              Agewise List
            </Link>
            <Link to="/user/familyReport" className="link">
              <FontAwesomeIcon icon={faUsers} className="link-icon" />
              Family Report
            </Link>
            <Link to="/user/duplicateList" className="link">
              <FontAwesomeIcon icon={faSearch} className="link-icon" />
              Duplicate List
            </Link>
            <Link to="/user/surnamewiseList" className="link">
              <FontAwesomeIcon icon={faUserTag} className="link-icon" />
              Surnamewise List
            </Link>
            <Link to="/user/deadOrAlive" className="link">
              <FontAwesomeIcon icon={faCircle} className="link-icon" />
              Dead or Alive
            </Link>
            <Link to="/user/redGreenReport" className="link">
              <FontAwesomeIcon icon={faHeart} className="link-icon" />
              Red Green Report
            </Link>
            <Link to="/user/addresswiseReport" className="link">
              <FontAwesomeIcon icon={faAddressCard} className="link-icon" />
              Addresswise Report
            </Link>
            <Link to="/user/boothwiseReport" className="link">
              <FontAwesomeIcon icon={faCogs} className="link-icon" />
              Boothwise Report
            </Link>
            <Link to="/user/genderReport" className="link">
              <FontAwesomeIcon icon={faGenderless} className="link-icon" />
              Gender Report
            </Link>
            <Link to="/user/casteReport" className="link">
              <FontAwesomeIcon icon={faUserTag} className="link-icon" />
              Caste Report
            </Link>
            <Link to="/user/wardwiseReport" className="link">
              <FontAwesomeIcon icon={faBook} className="link-icon" />
              Wardwise Report
            </Link>
            <Link to="/user/bloodGroupReport" className="link">
              <FontAwesomeIcon icon={faCircle} className="link-icon" />
              Blood Group Report
            </Link> 
            <Link to="/user/educationReport" className="link">
              <FontAwesomeIcon icon={faBook} className="link-icon" />
              Education Report
            </Link>
            <Link to="/user/shiftedReport" className="link">
              <FontAwesomeIcon icon={faExclamationTriangle} className="link-icon" />
              Shifted Report
            </Link>
          </>
        )}
      </div>
    </>
  );
}

export default LeftSideMenuAdmin;

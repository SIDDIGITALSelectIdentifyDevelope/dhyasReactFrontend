import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import VoterList from './components/VoterList';
import AlphbheticalList from './components/AlphbheticalList';
import AgewiseList from './components/AgewiseList';
import FamilyReport from './components/FamilyReport';
import DuplicateList from './components/DuplicateList';
import SurnamewiseList from './components/SurnamewiseList';
import DeadOrAlive from './components/DeadOrAlive';
import RedGreenReport from './components/RedGreenReport';
import AddresswiseReport from './components/AddresswiseReport';
import BoothwiseReport from './components/BoothwiseReport';
import GenderReport from './components/GenderReport';
import CasteReport from './components/CasteReport';
import WardwiseReport from './components/WardwiseReport';
import BloodGroupReport from './components/BloodGroupReport';
import EducationReport from './components/EducationReport';
import ShiftedReport from './components/ShiftedReport';
import VoterDetails from './components/VoterDetails';
import VoterEdit from './components/VoterEdit';
import LeftSideMenuAdmin from './components/LeftSideMenuAdmin';

// PrivateRoute component to protect routes based on authentication
function PrivateRoute({ element }) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // Save the intended path to redirect to after login
    sessionStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    return <Navigate to="/login" />;
  }

  return element;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const adminStatus = localStorage.getItem('isAdmin');

    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setIsAdmin(adminStatus === 'true');
    }
  }, []);

  // Handle login logic
  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setIsAdmin(user.role === 'admin');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('isAdmin', user.role === 'admin' ? 'true' : 'false');

    // Redirect the user after login based on their role or previously stored path
    const redirectPath = sessionStorage.getItem('redirectAfterLogin') || (user.role === 'admin' ? '/admin/dashboard' : '/user/voters/list');
    sessionStorage.removeItem('redirectAfterLogin');
    window.location.href = redirectPath; // Use window.location.href for hard redirect
  };

  // Handle logout logic
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    window.location.href = '/login'; // Redirect to login page on logout
  };

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute
                element={
                  <div style={{ display: 'flex', height: '100%' }}>
                    <LeftSideMenuAdmin onLogout={handleLogout} isAdmin={isAdmin} />
                    <div style={{ marginLeft: '250px', padding: '20px', width: '100%', flex: 1 }}>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="voters/list" element={<VoterList />} />
                        <Route path="voter/edit/:voterId" element={<VoterEdit />} />
                        <Route path="voters/view/:voterId" element={<VoterDetails />} />
                        <Route path="alphbheticalList" element={<AlphbheticalList />} />
                        <Route path="agewiseList" element={<AgewiseList />} />
                        <Route path="familyReport" element={<FamilyReport />} />
                        <Route path="duplicateList" element={<DuplicateList />} />
                        <Route path="surnamewiseList" element={<SurnamewiseList />} />
                        <Route path="deadOrAlive" element={<DeadOrAlive />} />
                        <Route path="redGreenReport" element={<RedGreenReport />} />
                        <Route path="addresswiseReport" element={<AddresswiseReport />} />
                        <Route path="boothwiseReport" element={<BoothwiseReport />} />
                        <Route path="genderReport" element={<GenderReport />} />
                        <Route path="casteReport" element={<CasteReport />} />
                        <Route path="wardwiseReport" element={<WardwiseReport />} />
                        <Route path="bloodGroupReport" element={<BloodGroupReport />} />
                        <Route path="educationReport" element={<EducationReport />} />
                        <Route path="shiftedReport" element={<ShiftedReport />} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                      </Routes>
                    </div>
                  </div>
                }
              />
            }
          />

          {/* User Protected Routes */}
          <Route
            path="/user/*"
            element={
              <PrivateRoute
                element={
                  <div style={{ display: 'flex', height: '100%' }}>
                    <LeftSideMenuAdmin onLogout={handleLogout} isAdmin={isAdmin} />
                    <div style={{ marginLeft: '250px', padding: '20px', width: '100%', flex: 1 }}>
                      <Routes>
                        <Route path="voter/edit/:voterId" element={<VoterEdit />} />
                        <Route path="voters/list" element={<VoterList />} />
                        <Route path="voters/view/:voterId" element={<VoterDetails />} />
                        <Route path="alphbheticalList" element={<AlphbheticalList />} />
                        <Route path="agewiseList" element={<AgewiseList />} />
                        <Route path="familyReport" element={<FamilyReport />} />
                        <Route path="duplicateList" element={<DuplicateList />} />
                        <Route path="surnamewiseList" element={<SurnamewiseList />} />
                        <Route path="deadOrAlive" element={<DeadOrAlive />} />
                        <Route path="redGreenReport" element={<RedGreenReport />} />
                        <Route path="addresswiseReport" element={<AddresswiseReport />} />
                        <Route path="boothwiseReport" element={<BoothwiseReport />} />
                        <Route path="genderReport" element={<GenderReport />} />
                        <Route path="casteReport" element={<CasteReport />} />
                        <Route path="wardwiseReport" element={<WardwiseReport />} />
                        <Route path="bloodGroupReport" element={<BloodGroupReport />} />
                        <Route path="educationReport" element={<EducationReport />} />
                        <Route path="shiftedReport" element={<ShiftedReport />} />
                        <Route path="*" element={<Navigate to="/user/voters/list" />} />
                      </Routes>
                    </div>
                  </div>
                }
              />
            }
          />

          {/* Default route handling based on authentication */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? (isAdmin ? "/admin/dashboard" : "/user/voters/list") : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

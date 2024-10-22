import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Common/navbar/Navbar.jsx';
import Index from './components/Homepage/index.jsx';
import AboutUs from './components/Homepage/about-us/AboutUs.jsx';
import Contact from './components/Homepage/contact-us/Contact.jsx';
import Login from './components/Authentication/Login.jsx';
import ResetPassword from './components/Authentication/reset-password.jsx';
import StudentDashboard from './components/Student/StudentDashboard/StudentDashboard.jsx';
import DailyAttendance from './components/Student/DailyAttendance/DailyAtt.jsx';
import TeacherDashboard from './components/Teacher/TeacherDashboard/TeacherDashboard.jsx';
import DailyAttendanceRecord from './components/Teacher/DailyAttendanceRecord/DailyAttendanceRecord.jsx';
import ProtectedRoute from './components/Common/ProtectedRoute.jsx'; // Import the ProtectedRoute

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Function to check token and update isLoggedIn state
    const checkToken = () => {
      const token = localStorage.getItem('token');
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      const currentTime = new Date().getTime();
  
      if (token && tokenExpiration && currentTime <= tokenExpiration) {
        setIsLoggedIn(true);  // Token is valid
      } else {
        setIsLoggedIn(false); // Token is missing or expired
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
      }
    };
  
    // Check token on component mount
    checkToken();
    
    // Set interval to check token every 2 minutes
    const intervalId = setInterval(checkToken, 2 * 60 * 1000); // 2 minutes in milliseconds
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [location]);

  return (
    <div>
      {!isAdminRoute && (
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )} 
      <div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protecting student and teacher routes */}
          <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
          <Route path="/daily-attendance" element={<ProtectedRoute element={<DailyAttendance />} />} />
          <Route path="/teacher-dashboard" element={<ProtectedRoute element={<TeacherDashboard />} />} />
          <Route path="/daily-attendance-record" element={<ProtectedRoute element={<DailyAttendanceRecord />} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

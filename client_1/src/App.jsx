import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Index from './screens/homepage/homepage.jsx';
import AboutUs from './screens//about-us/AboutUs.jsx';
import Contact from './screens/contact-us/Contact.jsx';
// import Login from './screens/login/Login.jsx';
// import ResetPassword from './components/Authentication/reset-password.jsx';

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
        setIsLoggedIn(true); 
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
      }
    };

    checkToken();
   
    const intervalId = setInterval(checkToken, 2 * 60 * 1000);
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [location]);
  return (
    <>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      
    </>
  );
}

export default App;
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Homepage/navbar/Navbar.jsx';
import Index from './components/Homepage/index.jsx';
import AboutUs from './components/Homepage/about-us/AboutUs.jsx';
import Contact from './components/Homepage/contact-us/Contact.jsx';
import { Element } from 'react-scroll'; // Import Element from react-scroll

function App() {
  return (
    <>
        <Router>
          <Navbar />
          <div style={{ paddingTop: '60px' }}> {/* Adjust padding based on navbar height */}
            <Element name="home" className="element">
              <Index />
            </Element>
            <Element name="about" className="element">
              <AboutUs />
            </Element>
            <Element name="contact" className="element">
              <Contact />
            </Element>
          </div>
        </Router>
    </>
  )
}

export default App

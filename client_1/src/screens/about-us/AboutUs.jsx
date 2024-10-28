import React from 'react';
import './AboutUs.css';

import campus from '/src/assets/Portal/HomePage/campus.png'; 
import chairman from '/src/assets/Portal/HomePage/chairman.png'; 
import vc from '/src/assets/Portal/HomePage/vc.jpeg'; 
import principal from '/src/assets/Portal/HomePage/principal.jpeg'; 
import vp from '/src/assets/Portal/HomePage/vp.png';  

const AboutUs = () => {
  return (
    <div className="about">
      <h1 className='home-h1'>About Us</h1>

      {/* Campus Section */}
      <Section 
        title="Campus" 
        photo={campus} // Using the imported profile photo
        description="Our campus is located in a serene environment with state-of-the-art facilities designed to foster academic excellence." 
      />

      {/* Chairman Section */}
      <Section 
        title="Chairman" 
        photo={chairman} // Replace this with an appropriate image path
        description="Our chairman, Mr. XYZ, is a visionary leader who has greatly contributed to the growth of our institution." 
      />

      {/* Vice Chairman Section */}
      <Section 
        title="Vice Chairman" 
        photo={vc} // Replace this with an appropriate image path
        description="Mr. ABC, our vice chairman, ensures the institution stays on track with its mission and vision." 
      />

      {/* Principal Section */}
      <Section 
        title="Principal" 
        photo={principal} // Replace this with an appropriate image path
        description="Our principal, Mrs. DEE, ensures the institution stays on track with its mission and vision." 
      />

      {/* Vice Principal Section */}
      <Section 
        title="Vice Principal" 
        photo={vp} // Replace this with an appropriate image path
        description="Mr. GHI, our vice principal, ensures the institution stays on track with its mission and vision." 
      />
    </div>
  );
};

// Reusable section component for cleaner code
const Section = ({ title, photo, description }) => (
  <div className="section">
    <div className="photo-space">
      <img src={photo} alt={title} /> {/* Displaying the image */}
    </div>
    <div className="description">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  </div>
);

export default AboutUs;

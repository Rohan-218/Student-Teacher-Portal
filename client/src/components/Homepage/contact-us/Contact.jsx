import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1 className='contact-sh1'>Contact Us</h1>
      <div className='info-map'>
        <div className="contact-info">
          <div className="info-item">
            <h3 className='sh3'>Address:</h3>
            <p className='sp'>XYZ University, 123 College Road, Jaipur, Rajasthan, 302001</p>
          </div>
          <div className="info-item">
            <h3 className='sh3'>Phone:</h3>
            <p className='sp'>+91 98765 43210</p>
          </div>
          <div className="info-item">
            <h3 className='sh3'>Email:</h3>
            <p className='sp'>contact@xyzuniversity.edu.in</p>
          </div>
        </div>

        <div className="map">
          <h2>Find Us Here:</h2>
          <div 
            className="map-placeholder"
            dangerouslySetInnerHTML={{
              __html: `<iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1001.9848428368007!2d75.74478120294455!3d26.887808289948463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4ecf86825bd%3A0x820916352aa479a4!2s246%2C%20Rani%20Path%2C%20Rani%20Sati%20Nagar%2C%20Nirman%20Nagar%2C%20Brijlalpura%2C%20Jaipur%2C%20Rajasthan%20302019!5e1!3m2!1sen!2sin!4v1729489271795!5m2!1sen!2sin"
                        width="800" 
                        height="300" 
                        style="border:0;" 
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade">
                      </iframe>`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;

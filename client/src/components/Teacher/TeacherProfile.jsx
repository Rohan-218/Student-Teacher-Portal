import React from 'react';
import './TeacherProfile.css';

function TeacherProfile({ data }) {
  return (
    <div className="details">
         <div className="profile">
           <span className="logo-circle">
               {data.teacher_name.charAt(0).toUpperCase()}
           </span>
                <div className="welcome">
                   <h2>WELCOME</h2>
                   <h2>{data.teacher_name}</h2>
                 </div>
         </div>
          <p><strong>Subject : </strong> {data.subjects.join(', ')}</p>
          <p><strong>Designation : </strong> {data.designation}</p>
          <p><strong>Email Id : </strong> {data.email}</p>
          <p><strong>Contact No. : </strong> {data.contact_no}</p>
     </div>
  );
}

export default TeacherProfile;

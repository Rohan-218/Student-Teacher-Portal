import React, { useEffect, useState } from 'react';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import { Link, useParams } from 'react-router-dom';
import './StudentProfile.css';  // Custom CSS for Student Profile
import axios from 'axios';

const StudentProfile = () => {
  const { userId } = useParams();  // Get userId from URL parameters
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Sidebar toggle state
  const [student, setStudent] = useState(null);  // State to hold student data
  const [isEditing, setIsEditing] = useState(false);  // State to check if in editing mode
  const [error, setError] = useState(null);  // State to hold error messages

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);  // Toggle sidebar state
  };

  useEffect(() => {
    fetchStudentProfile();  // Fetch student profile when component mounts or userId changes
  }, [userId]);  // Dependency on userId

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      const response = await axios.get(`http://192.168.1.17:3000/api/admin/students/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Add token to headers
        },
      });

      // Set student data from response
      setStudent({
        name: response.data.student_name,
        enrollment: response.data.enrollment_no,
        branch: response.data.branch_name,
        semester: response.data.semester,
        email: response.data.email,
        contact: response.data.contact_no,
      });
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error fetching student profile');
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);  // Toggle editing state
  };

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });  // Update student data
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      const response = await axios.put('http://192.168.1.17:3000/api/admin/students/edit', {
        user_id: userId,
        student_name: student.name,
        enrollment_no: student.enrollment,
        branch_name: student.branch,
        semester: student.semester,
        contact_no: student.contact,
        email: student.email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,  // Add token to headers
        },
      });

      console.log('Save response:', response); // Log the response
      alert('Changes have been saved');  // Show alert for successful save
      fetchStudentProfile();  // Re-fetch student profile to get updated information
      setIsEditing(false);  // Exit editing mode after save
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error saving student profile');
    }
  };

  // Loading and error states
  if (!student) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="adstudent-profile">
      <Header />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`student-main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="stprofile-container">
          <div className="stprofile-header">
            <Link to="/admin/students">
              <button className="back-Button">←</button>
            </Link>
            <div className="stprofile-picture">
              {/* Profile picture placeholder */}
              <span className="stprofile-icon">{student.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="stprofile-info">
              <p><strong>Name:</strong> 
                {isEditing ? (
                  <input type="text" name="name" value={student.name} onChange={handleChange} />
                ) : (
                  student.name
                )}
              </p>
              <p><strong>Enrollment No:</strong> 
                {isEditing ? (
                  <input type="text" name="enrollment" value={student.enrollment} onChange={handleChange} />
                ) : (
                  student.enrollment
                )}
              </p>
              <p><strong>Branch:</strong> 
                {isEditing ? (
                  <input type="text" name="branch" value={student.branch} onChange={handleChange} />
                ) : (
                  student.branch
                )}
              </p>
              <p><strong>Semester:</strong> 
                {isEditing ? (
                  <input type="number" name="semester" value={student.semester} onChange={handleChange} />
                ) : (
                  student.semester
                )}
              </p>
              <p><strong>Email Id:</strong> 
                {isEditing ? (
                  <input type="email" name="email" value={student.email} onChange={handleChange} />
                ) : (
                  student.email
                )}
              </p>
              <p><strong>Contact No.:</strong> 
                {isEditing ? (
                  <input type="text" name="contact" value={student.contact} onChange={handleChange} />
                ) : (
                  student.contact
                )}
              </p>
              <button className="edit-button" onClick={isEditing ? handleSave : handleEdit}>
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
          <div className="stprofile-actions">
            {/* Update the Link to include userId for View Marks */}
            <Link to={`/admin/student-scoreboard/${userId}`}>
              <button className="staction-button">View Marks</button>
            </Link>
            {/* Update Link for View Attendance */}
            <Link to={`/admin/student-attendance/${userId}`}>
              <button className="staction-button">View Attendance</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

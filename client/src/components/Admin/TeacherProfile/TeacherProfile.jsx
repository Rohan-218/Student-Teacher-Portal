import React, { useEffect, useState } from 'react';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import { Link, useParams } from 'react-router-dom';
import './TeacherProfile.css';  // Custom CSS for Teacher Profile
import axios from 'axios';

const TeacherProfile = () => {
  const { userId } = useParams();  // Get userId from URL parameters
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Sidebar toggle state
  const [teacher, setTeacher] = useState(null);  // State for teacher data
  const [isEditing, setIsEditing] = useState(false);  // State for edit mode

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);  // Toggle sidebar state
  };

  useEffect(() => {
    fetchTeacherProfile();  // Fetch the teacher profile on component mount
  }, [userId]);

  const fetchTeacherProfile = async () => {
    try {
      const token = localStorage.getItem('token');  // Get token from local storage
      const response = await axios.get(`http://192.168.1.17:3000/api/admin/teachers/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Include the token in the request
        },
      });
      setTeacher(response.data);  // Set the teacher data to state
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);  // Enable edit mode
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher({ ...teacher, [name]: value });  // Update teacher state with input value
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');  // Get token from local storage
      const response = await axios.put('http://192.168.1.17:3000/api/admin/teachers/edit', {
        teacher_name: teacher.teacher_name,
        user_id: userId,  // Use userId from URL parameters
        designation: teacher.designation,
        contact_no: teacher.contact_no,
        email: teacher.email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,  // Include the token in the request
        },
      });

      console.log('Save response:', response);  // Log the response
      alert('Changes have been saved');  // Show alert for successful save

      // Fetch updated teacher profile
      fetchTeacherProfile();

      setIsEditing(false);  // Exit editing mode after save
    } catch (error) {
      console.error('Error saving teacher profile:', error);
      alert('Error saving changes');  // Show error alert
    }
  };

  if (!teacher) {
    return <div>Loading...</div>;  // Show loading state while fetching
  }

  return (
    <div className="teacher-profile">
      <Header />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`teachermain-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="profile-container">
          <div className="profile-header">
            <Link to="/admin/teachers">
              <button className="Back-button">←</button>
            </Link>
            <div className="profile-picture">
              {/* Profile picture placeholder */}
              <span className="profile-icon">{teacher.teacher_name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="teaprofile-info">
              <p><strong>Name : </strong> 
                {isEditing ? (
                  <input
                    type="text"
                    name="teacher_name"
                    value={teacher.teacher_name}
                    onChange={handleChange}
                  />
                ) : (
                  teacher.teacher_name
                )}
              </p>
              <p><strong>Designation : </strong> 
                {isEditing ? (
                  <input
                    type="text"
                    name="designation"
                    value={teacher.designation}
                    onChange={handleChange}
                  />
                ) : (
                  teacher.designation
                )}
              </p>
              <p><strong>Email Id : </strong> 
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={teacher.email}
                    onChange={handleChange}
                  />
                ) : (
                  teacher.email
                )}
              </p>
              <p><strong>Contact No. : </strong> 
                {isEditing ? (
                  <input
                    type="text"
                    name="contact_no"
                    value={teacher.contact_no}
                    onChange={handleChange}
                  />
                ) : (
                  teacher.contact_no
                )}
              </p>
              <p><strong>Subjects :</strong> {teacher.subjects.join(', ')}</p> {/* Display subjects as read-only */}
              <button className="edit-button" onClick={isEditing ? handleSave : handleEdit}>
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
          {/* <div className="profile-actions">
            <Link to="/admin/attendance-record">
              <button className="action-button">Attendance Record</button>
            </Link>
            <Link to="/admin/student-record">
              <button className="action-button">Student Record</button>
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;

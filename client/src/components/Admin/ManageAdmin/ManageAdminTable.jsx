import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';

const AdminTable = ({ refresh }) => {
  const [admins, setAdmins] = useState([]);

  // Fetch admin data from the API
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('token');  // Assuming token is stored in localStorage
        const response = await fetch('http://student-teacher-portal-server.onrender.com/api/admin/admins', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Pass token if required
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch admins');
        }

        const data = await response.json();
        const formattedAdmins = data.map((admin, index) => ({
          sNo: index + 1,
          user_id: admin.user_id,  // Store user_id for update API
          adminname: admin.admin_name,
          email: admin.email,
          password: admin.password,
          is_active: admin.is_active,
        }));

        setAdmins(formattedAdmins);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
  }, [refresh]);

  // Handle toggle delete (active/inactive) and update in the backend
  const handleDelete = async (user_id, currentStatus, index) => {
    const updatedAdmins = [...admins];
    const newIsActiveStatus = !currentStatus;  // Toggle active status
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://student-teacher-portal-server.onrender.com/api/admin/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,  // Ensure user_id is passed here
          is_active: newIsActiveStatus,  // Send the toggled is_active status
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update admin status');
      }
  
      updatedAdmins[index].is_active = newIsActiveStatus;
      setAdmins(updatedAdmins);
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  return (
    <div className="admin-table">
      <table>
        <thead>
          <tr>
            <th>S. No</th>
            <th>Admin Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Is Active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={index} className={!admin.is_active ? 'deleted' : ''}>
              <td>{admin.sNo}</td>
              <td>{admin.adminname}</td>
              <td>{admin.email}</td>
              <td>{admin.password}</td>
              <td>{admin.is_active ? 'True' : 'False'}</td>
              <td>
                <button
                  className={`delete-btn ${!admin.is_active ? 'add-btn' : ''}`}
                  onClick={() => handleDelete(admin.user_id, admin.is_active, index)}  // Pass user_id and is_active
                  style={{ backgroundColor: 'transparent' }}
                >
                  {admin.is_active ? <FontAwesomeIcon icon={faTrashAlt} style={{ color: 'red', fontSize: '16px' }} /> :<FontAwesomeIcon icon={faCheck} style={{ color: 'black', fontSize: '16px' }}/>}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;

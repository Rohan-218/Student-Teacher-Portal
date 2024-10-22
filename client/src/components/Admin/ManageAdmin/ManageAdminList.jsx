import React, { useState } from 'react';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import ManageAdminTable from './ManageAdminTable'; 
import AddNewAdmin from './AddNewAdmin'; 
import './ManageAdminList.css';  

const ManageAdmin = () => {
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [refreshTable, setRefreshTable] = useState(false); // State to refresh the ExamTable

   // Function to trigger table refresh
   const refreshExamTable = () => {
    setRefreshTable(!refreshTable);  // Toggle to refresh the component
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="ManageAdmin-list">
      <Header />
      <Sidebar />
      <div className="main-content">
        <div className="container">
          <div className="add-admin-button-container">
            <button className="btn-open-popup" onClick={handleOpenPopup}>
              Add New Admin
            </button>
          </div>
          <ManageAdminTable refresh={refreshExamTable} />
          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <button className="close-popup-btn" onClick={handleClosePopup}>
                  &times;
                </button>
                <AddNewAdmin onClose={handleClosePopup} refreshTable={refreshExamTable}/> {/* Passing onClose to handle popup close */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAdmin;

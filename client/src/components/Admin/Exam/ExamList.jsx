import React, { useState } from 'react';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import ExamTable from './ExamTable';
import AddNewExam from './AddNewExam';
import './ExamList.css';

const Exam = () => {
  const [showAddExam, setShowAddExam] = useState(false); // Manage visibility of AddNewExam popup
  const [refreshTable, setRefreshTable] = useState(false); // State to refresh the ExamTable

   // Function to trigger table refresh
  const refreshExamTable = () => {
    setRefreshTable(!refreshTable);  // Toggle to refresh the component
  };

  // Toggle function to show or hide AddNewExam popup
  const toggleAddExam = () => {
    setShowAddExam(!showAddExam);
  };

  return (
    <div className="Exam-list">
      <Header />
      <Sidebar />
      <div className="main-content">
        <div className="container">
          {/* Button to add new exam */}
          <div className="add-exam-button-container">
            <button className="add-exam-btn" onClick={toggleAddExam}>
              Add New Exam
            </button>
          </div>

          {/* Exam table component */}
          <ExamTable refresh={refreshExamTable}/>

          {/* Modal Popup for Add New Exam */}
          {showAddExam && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-btn" onClick={toggleAddExam}>
                  &times;
                </span>
                <AddNewExam closePopup={toggleAddExam} refreshTable={refreshExamTable} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exam;

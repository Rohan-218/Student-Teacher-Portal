import React, { useState } from 'react';
import Sidebar from '../../../common/Admin/Sidebar';
import Header from '../../../common/Admin/Header';
import UserActivityTable from './UserActivityTable';
import './UserActivityList.css'; // Custom CSS for User Activity List

const UserActivityList = () => {
    const [userType, setUserType] = useState('');
    const [date, setDate] = useState('');
    const [activeTable, setActiveTable] = useState(0); // 0 for User Logs, 1 for User Activity

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    // Toggle between User Logs and User Activity
    const toggleTable = () => {
        setActiveTable((prev) => (prev === 0 ? 1 : 0)); // Switch between 0 and 1
    };

    return (
        <div className="user-activity-list">
            <Header />
            <Sidebar />
            <div className="main-content">
                <div className="container">
                    <div className="filter-section">
                        <select className="user-type-dropdown" value={userType} onChange={handleUserTypeChange}>
                            <option value="">User Type</option>
                            <option value="Admin">Admin</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Student">Student</option>
                        </select>
                        <div className="date-picker">
                            <label htmlFor="date">Date: </label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Render User Logs or User Activity based on activeTable */}
                    <UserActivityTable
                        userType={userType}
                        date={date}
                        tableType={activeTable === 0 ? "log" : "activity"}
                        onPrev={toggleTable}
                        onNext={toggleTable}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserActivityList;

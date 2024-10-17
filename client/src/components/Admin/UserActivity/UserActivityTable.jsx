import React, { useEffect, useState } from 'react';
import './UserActivityTable.css'; // Custom CSS for User Activity Table

const UserActivityTable = ({ userType, date, tableType, onPrev, onNext }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const token = localStorage.getItem('token');
                
                let url = '';
                if (tableType === 'log') {
                    // API for User Logs
                    url = 'http://localhost:3000/api/admin/user';
                } else if (tableType === 'activity') {
                    // API for User Activity (replace this with the new API when added)
                    url = 'http://localhost:3000/api/admin/user'; 
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.success) {
                    setActivities(result.data);
                }
            } catch (error) {
                console.error(`Error fetching ${tableType} data:`, error);
            }
        };

        fetchActivities();
    }, [tableType]);

    const filteredActivities = activities.filter((activity) => {
        let isUserTypeMatch = true;
        if (userType === 'Teacher') {
            isUserTypeMatch = activity.user_type === 2;
        } else if (userType === 'Admin') {
            isUserTypeMatch = activity.user_type === 0 || activity.user_type === 3;
        } else if (userType === 'Student') {
            isUserTypeMatch = activity.user_type === 1;
        }

        let isDateMatch = true;
        if (date) {
            const activityDate = new Date(activity.timestamp).toISOString().split('T')[0];
            isDateMatch = activityDate === date;
        }

        return isUserTypeMatch && isDateMatch;
    });

    return (
        <div className="user-activity-table">
            <h3>{tableType === 'log' ? 'User Logs' : 'User Activity'}</h3>

            {/* Arrow buttons above the table headers */}
            <div className="arrow-container">
                <button className="prev-arrow" onClick={onPrev}>
                    &#9664;
                </button>
                <button className="next-arrow" onClick={onNext}>
                    &#9654;
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>S. No</th>
                        <th>Name</th>
                        <th>Timestamp</th>
                        <th>Event Type</th>
                        {tableType === 'activity' && <th>Message</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredActivities.map((activity, index) => (
                        <tr key={activity.id}>
                            <td>{index + 1}</td>
                            <td>{activity.user_name}</td>
                            <td>{new Date(activity.timestamp).toLocaleString()}</td>
                            <td>{activity.action}</td>
                            {tableType === 'activity' && <td>{activity.message}</td>} {/* New Message column */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserActivityTable;

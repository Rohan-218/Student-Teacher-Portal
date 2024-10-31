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
                    url = 'http://student-teacher-portal-server.onrender.com/api/admin/user-logs';
                } else if (tableType === 'activity') {
                    // API for User Activity 
                    url = 'http://student-teacher-portal-server.onrender.com/api/admin/user-activity'; 
                } else if (tableType === 'email') {
                    // API for Email Activity
                    url = 'http://student-teacher-portal-server.onrender.com/api/admin/user-email'; 
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

    // Filtering logic based on userType and date (for logs and activity tables)
    const filteredActivities = activities.filter((activity) => {
        let isUserTypeMatch = true;
        if (tableType !== 'email') {
            if (userType === 'Teacher') {
                isUserTypeMatch = activity.user_type === 2;
            } else if (userType === 'Admin') {
                isUserTypeMatch = activity.user_type === 0 || activity.user_type === 3;
            } else if (userType === 'Student') {
                isUserTypeMatch = activity.user_type === 1;
            }
        }

        let isDateMatch = true;
        if (date) {
            const activityDate = new Date(activity.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD format
            isDateMatch = activityDate === date;
        }

        return isUserTypeMatch && isDateMatch;
    });

    const getNextTableName = (direction) => {
        const tableTypes = ['log', 'activity', 'email'];
        const currentIndex = tableTypes.indexOf(tableType);
    
        if (direction === 'next') {
            return tableTypes[(currentIndex + 1) % tableTypes.length];
        }
        if (direction === 'prev') {
            return tableTypes[(currentIndex - 1 + tableTypes.length) % tableTypes.length];
        }
        return '';
    };

    return (
        <div className="user-activity-table">
            <h5>
                {tableType === 'log' && 'User Logs'}
                {tableType === 'activity' && 'User Activity'}
                {tableType === 'email' && 'Email Activity'}
            </h5>

            {/* Arrow buttons above the table headers */}
            <div className="arrow-container">
                <div className='tooltip1'>
                    <button className="prev-arrow" onClick={onPrev} style={{ backgroundColor: 'white' }} >
                        &#9664;
                    </button>
                    <span className="tooltiptext1">{`${getNextTableName('prev')} `}</span>
                </div>
                <div className='tooltip2'>
                    <button className="next-arrow" onClick={onNext} style={{ backgroundColor: 'white' }} >
                        &#9654;
                    </button>
                    <span className="tooltiptext2">{`${getNextTableName('next')} `}</span>
                </div>
            </div>

            <table>
                <thead> 
                    <tr>
                        <th>S. No</th>
                        {tableType === 'email' ? <th>Email</th> : <th>Name</th>}
                        <th>Timestamp</th>
                        {tableType === 'email' ? <th>Email Subject</th> : <th>Event Type</th>}
                        {(tableType === 'activity' || tableType === 'email') && <th>Message</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredActivities.map((activity, index) => (
                        <tr key={activity.id}>
                            <td>{index + 1}</td>
                            {tableType === 'email' ? (
                                <>
                                    <td>{activity.email}</td>
                                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                                    <td>{activity.subject}</td>
                                    <td>{activity.message}</td>
                                </>
                            ) : (
                                <>
                                    <td>{activity.user_name}</td>
                                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                                    <td>{activity.action}</td>
                                    {tableType === 'activity' && <td>{activity.message}</td>} 
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserActivityTable;

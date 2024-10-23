
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './DailyAttendanceRecord.css'; // Import CSS for custom styles
import DailyAttendanceRecordTable from './DailyAttReTable';
import axios from 'axios';

const DailyAttendanceRecord = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectID, setSubjectID] = useState(-1);
  const [subjectList, setSubjectList] = useState([]);
  const [studentList, setStudentList] = useState([]); // Define studentList state
  const [selectedAttendanceBelow, setSelectedAttendanceBelow] = useState(''); // New state for attendance filter

  const [updatedLast, setUpdatedLast] = useState(''); // State for updated last
  const [totalLectures, setTotalLectures] = useState(0); // State for total lectures
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const fetchSubjects = async () => {
        try {
          const subjectResponse = await axios.get('http://192.168.29.80:3000/api/teachers/subjects', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log('Subjects fetched:', subjectResponse.data);
          setSubjectList(subjectResponse.data);
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      };
      fetchSubjects();
    } else {
      console.log('Token is not available');
    }
  }, [token]);
  
  const handleSubjectChange = async (subjectCode, subjectId) => {
    console.log('Selected Subject:', subjectCode, 'Subject ID:', subjectId);
    
    setSelectedSubject(subjectCode); // Only subjectCode is stored in state
    setSubjectID(subjectId); // Store subject ID in state
  
    try {
      const studentResponse = await axios.get(
        `http://192.168.29.80:3000/api/teachers/subject-students?subjectCode=${subjectCode}&subjectId=${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedLastResponse = await axios.get(
        `http://192.168.29.80:3000/api/teachers/updated-last?subjectId=${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const totalLecturesResponse = await axios.get(
        `http://192.168.29.80:3000/api/teachers/total-lectures?subjectId=${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Students fetched:', studentResponse.data);
      setStudentList(studentResponse.data); // Update studentList state
      setUpdatedLast(updatedLastResponse.data.updatedLast || 'No updates found');
      setTotalLectures(totalLecturesResponse.data.totalLectures || 0);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAttendanceBelowChange = async (e) => {
    const selectedValue = e.target.value;
    setSelectedAttendanceBelow(selectedValue);
  
    // Show alert for debarred students
    if (selectedValue) {
      alert('Debarred Students are shown in red.');
    }

    try {
      // Filter the student list based on selected attendance percentage
      const filteredStudents = studentList.filter((student) => {
        const attendancePercentage = student.attendance_percentage || 0;
        if (selectedValue === '75') {
          return attendancePercentage < 75;
        } else if (selectedValue === '50') {
          return attendancePercentage < 50;
        }
        return true; // If no filter is applied, show all students
      });
  
      setStudentList(filteredStudents); // Update student list with filtered data
  
    } catch (error) {
      console.error('Error filtering students:', error);
    }
  };

  return (
    <div className="teacher-dailyAttendanceContainer">
      <Link to="/teacher-dashboard">
        <button className="Teacher-back-button">←</button>
      </Link>
      <h1 className="Daily-att">Daily Attendance Record</h1>

      <div className='sub-drop'>
        {/* Subject Dropdown */}
        <div className="teacherSub-Dropdown">
          <select
            className='PortalSelect'
            value={selectedSubject}
            onChange={(e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              const subjectId = selectedOption.getAttribute('data-id'); // Get subject ID from data attribute
              handleSubjectChange(selectedOption.value, subjectId); // Pass subjectCode and subjectId
            }}
          >
            <option value="">Subject</option>
            {subjectList.length > 0 ? (
              subjectList.map((subject, index) => (
                <option 
                  key={index} 
                  value={subject.subject_code} // Display subject code
                  data-id={subject.subject_id} // Store subject ID as data attribute
                >
                  {`${subject.sub_initials} (${subject.subject_code})`}
                </option>
              ))
            ) : (
              <option value="">No subjects available</option>
            )}
          </select>
        </div>

       
        {/* AttendanceBelow Dropdown */}
        <div className="attendanceBelow-Dropdown">
          <select
            className='PortalSelect'
            value={selectedAttendanceBelow}
            onChange={handleAttendanceBelowChange}
          >
            <option value="">Attendance %</option>
            <option value="75">Below 75%</option>
            <option value="50">Below 50%</option>
          </select>
        </div>
      </div>

       {/* Record details below buttons */}
       <div className="daily-teacher-RecordDetails">
          <span className="daily-teacher-UpdatedLast">
            <strong>Updated Last: </strong>
            <span >{updatedLast}</span>
          </span>
          <span className="daily-teacher-TotalLecture">
            <strong>Total Lecture: </strong>
            <span >{totalLectures}</span>
          </span>
        </div>


      {/* Attendance record table */}
      <div className="teacher-attendanceContent">
        <DailyAttendanceRecordTable students={studentList} setStudents={setStudentList} subjectID={subjectID}  attendanceFilter={selectedAttendanceBelow}/> {/* Pass studentList as a prop */}
      </div>
    </div>
  );
};

export default DailyAttendanceRecord;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherAttendance.css';
import axios from 'axios';
import AttendanceTable from './AttendanceTable';

const TeacherAttendance = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState('');
  const [lecture, setLecture] = useState('');
  const [subjectList, setSubjectList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [buttonText, setButtonText] = useState('Save');
  const [isSaving, setIsSaving] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  
 
  const token = localStorage.getItem('token');

  // Fetch subjects on mount
  useEffect(() => {
    if (token) {
      const fetchSubjects = async () => {
        try {
          const subjectResponse = await axios.get('http://localhost:3000/api/teachers/subjects', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          setSubjectList(subjectResponse.data);
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      };
      fetchSubjects();
    }
  }, [token]);

  // Fetch students when a subject is selected
  const handleSubjectChange = async (subject) => {
    setSelectedSubject(subject);
    setAttendanceList([]); // Clear attendance if subject changes
    setDate(''); // Reset date
    setLecture(''); // Reset lecture

    try {
      const studentResponse = await axios.get(
        `http://localhost:3000/api/teachers/subject-students?subjectCode=${subject}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudentList(studentResponse.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Fetch attendance only when all fields are filled
  useEffect(() => {
    const fetchAttendance = async () => {
      if (selectedSubject && date && lecture && !dataFetched) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/teachers/attendance/get?subjectCode=${selectedSubject}&date=${date}&lecture=${lecture}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response.data.length > 0) {
            const updatedStudents = studentList.map((student) => {
              const attendanceData = response.data.find((attendance) => attendance.enrollment_no === student.enrollment_no);
              return {
                ...student,
                // Set status based on attendance data, or initialize as neutral
                status: attendanceData ? (attendanceData.attendance ? 'Present' : 'Absent') : '', // Use '' for neutral
                percentage: attendanceData ? attendanceData.percentage : 'N/A',
              };
            });
  
            setStudentList(updatedStudents); // Update student list with attendance data
            setAttendanceList(updatedStudents.map(student => ({
              enrollment_no: student.enrollment_no,
              status: student.status, // Maintain the neutral or attendance status
            }))); // Prefill attendance data
            setIsUpdating(true); // Set to update mode
            setButtonText('Update'); // Change button text to 'Update'
            alert('Attendance data fetched for the selected date and lecture.');
          } else {
            // Initialize attendance records based on student list
            const freshAttendanceList = studentList.map((student) => ({
              enrollment_no: student.enrollment_no,
              status: 'MARK', // Mark attendance status as empty for fresh entry
            }));
  
            setStudentList(freshAttendanceList); // Update student list to show default 'MARK' status
            setAttendanceList(freshAttendanceList); // Initialize attendance list
            setIsUpdating(false); // Not in update mode
            setButtonText('Save'); // Reset button text to 'Save'
            // alert('No attendance data found. You can now mark attendance.');
          }
          setDataFetched(true); // Mark data as fetched to prevent continuous alert
        } catch (error) {
          console.error('Error fetching attendance data:', error);
          alert('Error fetching attendance data.');
        }
      }
    };
  
    fetchAttendance();
  }, [selectedSubject, date, lecture, token, studentList, dataFetched]);
  
 // Toggle attendance status for a student, but only mark as modified when it's changed manually
const toggleStudentAttendance = (enrollmentNo) => {
  setAttendanceList((prevAttendanceList) => {
    return prevAttendanceList.map((student) => {
      if (student.enrollment_no === enrollmentNo) {
        const newStatus = student.status === 'Present' ? 'Absent' : 'Present';
        return {
          ...student,
          status: newStatus, // Toggle the attendance status
          modified: true, // Mark this record as modified
        };
      }
      return student;
    });
  });
};

// Handle attendance submission or update
const handleAttendanceSubmit = async () => {
  if (!attendanceList || !Array.isArray(attendanceList)) {
    alert("Attendance list is missing or not in the correct format.");
    return;
  }

  setIsSaving(true); // Disable button

  // Ensure the attendance list contains both enrollment_no and status for each student
  // Only include modified students for the update
  const formattedAttendanceList = attendanceList
    .filter(student => isUpdating ? student.modified : true) // For update, send only modified records
    .map((student) => ({
      enrollmentNo: student.enrollment_no,
      newAttendance: student.status === 'Present' ? true : false, // Ensure correct boolean conversion
    }));

  if (isUpdating && formattedAttendanceList.length === 0) {
    alert("No changes to update.");
    setIsSaving(false); // Re-enable button if no changes
    return;
  }

  const url = isUpdating
    ? 'http://localhost:3000/api/teachers/attendance/update'
    : 'http://localhost:3000/api/teachers/attendance/upload';

  const body = {
    subjectCode: selectedSubject, // The selected subject
    lecture: lecture, // The selected lecture
    attendanceDate: date, // The selected date
    attendanceList: formattedAttendanceList, // Send formatted attendance list
  };

  try {
    const response = await fetch(url, {
      method: isUpdating ? 'PUT' : 'POST', // Use PUT for update, POST for new upload
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the auth token
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to process attendance');
    }

    alert(`Attendance ${isUpdating ? 'updated' : 'uploaded'} successfully!`);

    setDate(''); // Clear date input
    setLecture(''); // Clear lecture input
    setAttendanceList([]); // Clear the attendance list 
    setSelectedSubject(''); // Optionally reset the subject selection if desired
    setDataFetched(false); // Reset the data fetched flag for new data fetch
  } catch (error) {
    alert(`Failed to ${isUpdating ? 'update' : 'upload'} attendance: ${error.message}`);
  }
  finally {
    setIsSaving(false); // Re-enable button after the request completes
  }
};



  return (
    <div className="teacher-attendance-container">
      <div className="teacher-subject-dropdown">
        <select
          className="portalselect"
          value={selectedSubject}
          onChange={(e) => handleSubjectChange(e.target.value)}
        >
          <option value="">Subject</option>
          {subjectList.map((subject, index) => (
            <option key={index} value={subject.subject_code}>
              {`${subject.sub_initials} (${subject.subject_code})`}
            </option>
          ))}
        </select>
      </div>

      <div className="teacher-attendance-details">
        <div className='atten-input'>
        <div className="teacher-input-row">
          <label htmlFor="date">Date: </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setDataFetched(false); // Reset the data fetched flag when date changes
            }}
          />
        </div>

        <div className="teacher-input-row">
          <label htmlFor="lecture">Lecture: </label>
          <input
            type="number"
            id="lecture"
            value={lecture}
            onChange={(e) => {
              setLecture(e.target.value);
              setDataFetched(false); // Reset the data fetched flag when lecture changes
            }}
            placeholder="Enter lecture number"
            min="0"
          />
        </div>
        </div>

        {/* Pass attendance props and the submit handler */}
        <AttendanceTable
          students={studentList}
          attendanceList={attendanceList}
          onSave={handleAttendanceSubmit}
          isUpdating={isUpdating}
          buttonText={isSaving ? (isUpdating ? 'Updating...' : 'Saving...') : buttonText} // Update button text dynamically
          isSaving={isSaving} // Disable the button while saving or updating
          onToggleAttendance={toggleStudentAttendance} // Pass the toggle function
        />
      </div>
    </div>
  );
};

export default TeacherAttendance;

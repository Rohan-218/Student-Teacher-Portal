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
          const subjectResponse = await axios.get('http://192.168.29.80:3000/api/teachers/subjects', {
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
    setStudentList([]); // Clear student list
    setDate(''); // Reset date
    setLecture(''); // Reset lecture

    try {
      const studentResponse = await axios.get(
        `http://192.168.29.80:3000/api/teachers/subject-students?subjectCode=${subject}`,
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
            `http://192.168.29.80:3000/api/teachers/attendance/get?subjectCode=${selectedSubject}&date=${date}&lecture=${lecture}`,
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
                status: attendanceData ? (attendanceData.attendance ? 'Present' : 'Absent') : '',
                percentage: attendanceData ? attendanceData.percentage : 'N/A',
              };
            });

            setStudentList(updatedStudents);
            setAttendanceList(updatedStudents.map(student => ({
              enrollment_no: student.enrollment_no,
              status: student.status,
            })));
            setIsUpdating(true);
            setButtonText('Update');
            alert('Attendance data fetched for the selected date and lecture.');
          } else {
            const freshAttendanceList = studentList.map((student) => ({
              enrollment_no: student.enrollment_no,
              status: 'MARK',
            }));

            setStudentList(freshAttendanceList);
            setAttendanceList(freshAttendanceList);
            setIsUpdating(false);
            setButtonText('Save');
          }
          setDataFetched(true);
        } catch (error) {
          console.error('Error fetching attendance data:', error);
          alert('Error fetching attendance data.');
        }
      }
    };

    fetchAttendance();
  }, [selectedSubject, date, lecture, token, studentList, dataFetched]);

  const toggleStudentAttendance = (enrollmentNo) => {
    setAttendanceList((prevAttendanceList) => {
      return prevAttendanceList.map((student) => {
        if (student.enrollment_no === enrollmentNo) {
          const newStatus = student.status === 'Present' ? 'Absent' : 'Present';
          return {
            ...student,
            status: newStatus,
            modified: true,
          };
        }
        return student;
      });
    });
  };

  const handleAttendanceSubmit = async () => {
    if (!attendanceList || !Array.isArray(attendanceList)) {
      alert("Attendance list is missing or not in the correct format.");
      return;
    }

    setIsSaving(true);

    const formattedAttendanceList = attendanceList
      .filter(student => isUpdating ? student.modified : true)
      .map((student) => ({
        enrollmentNo: student.enrollment_no,
        newAttendance: student.status === 'Present' ? true : false,
      }));

    if (isUpdating && formattedAttendanceList.length === 0) {
      alert("No changes to update.");
      setIsSaving(false);
      return;
    }

    const url = isUpdating
      ? 'http://192.168.29.80:3000/api/teachers/attendance/update'
      : 'http://192.168.29.80:3000/api/teachers/attendance/upload';

    const body = {
      subjectCode: selectedSubject,
      lecture: lecture,
      attendanceDate: date,
      attendanceList: formattedAttendanceList,
    };

    try {
      const response = await fetch(url, {
        method: isUpdating ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process attendance');
      }

      alert(`Attendance ${isUpdating ? 'updated' : 'uploaded'} successfully!`);

      // Clear state for fresh entries
      setDate('');
      setLecture('');
      setAttendanceList([]);
      setSelectedSubject('');
      setDataFetched(false);
    } catch (error) {
      alert(`Failed to ${isUpdating ? 'update' : 'upload'} attendance: ${error.message}`);
    } finally {
      setIsSaving(false);
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
                setDataFetched(false);
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
                setDataFetched(false);
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
          buttonText={isSaving ? (isUpdating ? 'Updating...' : 'Saving...') : buttonText}
          toggleStudentAttendance={toggleStudentAttendance}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default TeacherAttendance;

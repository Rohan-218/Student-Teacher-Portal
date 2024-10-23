import { useState, useEffect } from 'react';
import './StudentRecord.css';
import axios from 'axios';
import StudentRecordTable from './StudentRecordTable';

const StudentRecord = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectList, setSubjectList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [updatedLast, setUpdatedLast] = useState('');
  const [totalLectures, setTotalLectures] = useState(0);
  const [examColumns, setExamColumns] = useState([]); 
  const token = localStorage.getItem('token');

  // Fetch subjects on mount
  useEffect(() => {
    if (token) {
      const fetchSubjects = async () => {
        try {
          const subjectResponse = await axios.get('http://192.168.29.80:3000/api/teachers/subjects', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setSubjectList(subjectResponse.data);
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      };
      fetchSubjects();
    }
  }, [token]);

  // Handle subject change and fetch students, attendance, marks, and exams for the selected subject
  const handleSubjectChange = async (subject, subjectId) => {
    setSelectedSubject(subject);
    try {
      // Fetch students for the selected subject
      const studentResponse = await axios.get(
        `http://192.168.29.80:3000/api/teachers/subject-students?subjectCode=${subject}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch attendance and marks for the selected subject using subjectId
      const attenMarksResponse = await axios.get(
        `http://192.168.29.80:3000/api/teachers/atten/marks?subjectId=${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    
      console.log('Attendance and marks response:', attenMarksResponse.data);

      
      const { result, examNames } = attenMarksResponse.data;

      // Fetch updated last and total lectures for the selected subject
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

      // Combine student data with attendance and marks data
      const combinedData = studentResponse.data.map(student => {
        const attenMarks = result.find(item => item.student_id === student.student_id) || {};
        return {
          ...student,
          attended_lecture: attenMarks.attended_lecture || 0,
          attendance_percentage: attenMarks.attendance_percentage || 0,
          ...examNames.reduce((acc, exam) => {
            acc[exam] = attenMarks[exam] || 0; // Add dynamic exams marks
            return acc;
          }, {})
        };
      });

      // Set updated last and total lectures state
      setUpdatedLast(updatedLastResponse.data.updatedLast || 'No updates found');
      setTotalLectures(totalLecturesResponse.data.totalLectures || 0);
      setExamColumns(examNames); 
      setStudentList(combinedData); 
    } catch (error) {
      console.error('Error fetching students or attendance/marks:', error);
    }
  };

  return (
    <div className="teacher-attendanceContainer">
  <div className="teacher-TopButtons">
    {/* Subject Dropdown */}
    <div className="teacherSub-Dropdown">
      <select
        className='PortalSelect'
        value={selectedSubject}
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          const subjectId = selectedOption.getAttribute('data-id'); // Get subject ID from data attribute

          if (!selectedOption.value) {
            // Reset state when no subject is selected
            setSelectedSubject(''); // Reset the selected subject
            setStudentList([]);
            setShowDetails(false);
          } else {
            // If the same subject is selected, force re-selection by resetting
            if (selectedOption.value === selectedSubject) {
              setSelectedSubject(''); // Reset to trigger change
              setTimeout(() => {
                handleSubjectChange(selectedOption.value, subjectId); // Delay re-selecting
              }, 0);
            } else {
              // Handle subject change as usual
              handleSubjectChange(selectedOption.value, subjectId);
            }
          }
        }}
      >
        <option value="">Subject</option>
        {subjectList.length > 0 ? (
          subjectList.map((subject, index) => (
            <option 
              key={index} 
              value={subject.subject_code} 
              data-id={subject.subject_id}
            >
              {`${subject.sub_initials} (${subject.subject_code})`}
            </option>
          ))
        ) : (
          <option value="">No subjects available</option>
        )}
      </select>
    </div>
  


      </div>

      {/* Record details below buttons */}
      <div className="teacher-RecordDetails">
        <span className="teacher-UpdatedLast">
          <strong>Updated Last: </strong>
          <span>{updatedLast}</span>
        </span>
        <span className="teacher-TotalLecture">
          <strong>Total Lecture: </strong>
          <span>{totalLectures}</span>
        </span>
      </div>
      {/* Student Record Table */}
      <StudentRecordTable students={studentList} examColumns={examColumns} /> {/* Pass dynamic exam columns */}
    </div>
  );
};

export default StudentRecord;

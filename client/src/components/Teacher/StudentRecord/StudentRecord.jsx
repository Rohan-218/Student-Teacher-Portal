import { useState, useEffect } from 'react';
import './StudentRecord.css';
import axios from 'axios';
import StudentRecordTable from './StudentRecordTable'; 

const StudentRecord = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectList, setSubjectList] = useState([]);
  const [studentList, setStudentList] = useState([]); 
  const [updatedLast, setUpdatedLast] = useState(''); // State for updated last
  const [totalLectures, setTotalLectures] = useState(0); // State for total lectures
  const token = localStorage.getItem('token');

  // Fetch subjects on mount
  useEffect(() => {
    if (token) {
      const fetchSubjects = async () => {
        try {
          const subjectResponse = await axios.get('http://192.168.1.17:3000/api/teachers/subjects', {
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

  // Handle subject change and fetch students and attendance/marks for the selected subject
  const handleSubjectChange = async (subject, subjectId) => {
    setSelectedSubject(subject);
    try {
      // Fetch students for the selected subject
      const studentResponse = await axios.get(
        `http://192.168.1.17:3000/api/teachers/subject-students?subjectCode=${subject}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch attendance and marks for the selected subject using subjectId
      const attenMarksResponse = await axios.get(
        `http://192.168.1.17:3000/api/teachers/atten/marks?subjectId=${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch updated last and total lectures for the selected subject
      const updatedLastResponse = await axios.get(
        `http://192.168.1.17:3000/api/teachers/updated-last?subjectId=${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const totalLecturesResponse = await axios.get(
        `http://192.168.1.17:3000/api/teachers/total-lectures?subjectId=${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Combine student data with attendance and marks data
      const combinedData = studentResponse.data.map(student => {
        const attenMarks = attenMarksResponse.data.find(item => item.student_id === student.student_id) || {};
        return {
          ...student,
          attended_lecture: attenMarks.attended_lecture || 0,
          attendance_percentage: attenMarks.attendance_percentage || 0,
          midterm1_marks: attenMarks.midterm1_marks || 0,
          midterm2_marks: attenMarks.midterm2_marks || 0,
          finals_marks: attenMarks.finals_marks || 0,
        };
      });

      // Set the updated last and total lectures state
      setUpdatedLast(updatedLastResponse.data.updatedLast || 'No updates found');
      setTotalLectures(totalLecturesResponse.data.totalLectures || 0);

      console.log('Combined data:', combinedData);

      setStudentList(combinedData); // Update student list with combined data
    } catch (error) {
      console.error('Error fetching students or attendance/marks:', error);
      // Log the error details to the console for better debugging
      console.error('Error details:', error.response.data);
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
              handleSubjectChange(selectedOption.value, subjectId);
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
      </div>

      {/* Record details below buttons */}
      <div className="teacher-RecordDetails">
  <span className="teacher-UpdatedLast">
    <strong>Updated Last: </strong>
    <span >{updatedLast}</span>
  </span>
  <span className="teacher-TotalLecture">
    <strong>Total Lecture: </strong>
    <span>{totalLectures}</span>
  </span>
</div>
      {/* Student Record Table */}
      <StudentRecordTable students={studentList} />
    </div>
  );
};

export default StudentRecord;

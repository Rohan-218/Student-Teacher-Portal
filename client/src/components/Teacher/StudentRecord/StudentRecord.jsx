// import { useState, useEffect } from 'react';
// import './StudentRecord.css';
// import axios from 'axios';
// import StudentRecordTable from './StudentRecordTable'; 

// const StudentRecord = () => {
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedMarksBelow, setSelectedMarksBelow] = useState('');
//   const [subjectList, setSubjectList] = useState([]);
//   const [studentList, setStudentList] = useState([]); 
//   const [threshold, setThreshold] = useState(null); // State to store selected threshold
//   const token = localStorage.getItem('token');

//   // Fetch subjects on mount
//   useEffect(() => {
//     if (token) {
//       const fetchSubjects = async () => {
//         try {
//           const subjectResponse = await axios.get('http://localhost:3000/api/teachers/subjects', {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           });
//           setSubjectList(subjectResponse.data);
//         } catch (error) {
//           console.error('Error fetching subjects:', error);
//         }
//       };
//       fetchSubjects();
//     }
//   }, [token]);

//   // Handle subject change and fetch students for the selected subject
//   const handleSubjectChange = async (subject) => {
//     setSelectedSubject(subject);
//     try {
//       const studentResponse = await axios.get(
//         `http://localhost:3000/api/teachers/subject-students?subjectCode=${subject}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setStudentList(studentResponse.data); // Update student list with fetched data
//     } catch (error) {
//       console.error('Error fetching students:', error);
//     }
//   };

//   // Handle Marks Below change and fetch students whose marks are below the selected threshold
//   const handleMarksBelowChange = async (e) => {
//     const selectedThreshold = e.target.value === 'Below 10' ? 10 : e.target.value === 'Below 20' ? 20 : null;
//     setSelectedMarksBelow(e.target.value);
//     setThreshold(selectedThreshold);

//     if (selectedSubject && selectedThreshold) {
//       try {
//         // Fetch students whose marks are below the selected threshold
//         const response = await axios.get(
//           `http://localhost:3000/api/below-threshold?subjectId=${selectedSubject}&threshold=${selectedThreshold}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setStudentList(response.data); // Update the student list with the filtered data
//       } catch (error) {
//         console.error('Error fetching students below threshold:', error);
//       }
//     }
//   };

//   return (
//     <div className="teacher-attendanceContainer">
//       <div className="teacher-TopButtons">
//         {/* Subject Dropdown */}
//         <div className="teacherSub-Dropdown">
//           <select
//             className='PortalSelect'
//             value={selectedSubject}
//             onChange={(e) => handleSubjectChange(e.target.value)}
//           >
//             <option value="">Subject</option>
//             {subjectList.length > 0 ? (
//               subjectList.map((subject, index) => (
//                 <option 
//                   key={index} 
//                   value={subject.subject_code} // Display initials and code
//                 >
//                   {`${subject.sub_initials} (${subject.subject_code})`} {/* Show sub_initials(subject_code) */}
//                 </option>
//               ))
//             ) : (
//               <option value="">No subjects available</option>
//             )}
//           </select>
//         </div>

//         {/* Marks Below Dropdown */}
//         <div className="teacherMarks-Dropdown">
//           <select className='PortalSelect' value={selectedMarksBelow} onChange={handleMarksBelowChange}>
//             <option value="">Marks below</option>
//             <option value="Below 10">Below 10</option>
//             <option value="Below 20">Below 20</option>
//           </select>
//         </div>
//       </div>

//       {/* Record details below buttons */}
//       <div className="teacher-RecordDetails">
//         <span className="teacher-UpdatedLast">Updated Last: Yesterday</span>
//         <span className="teacher-TotalLecture">Total Lecture: 10</span>
//       </div>

//       {/* Student Record Table */}
//       <StudentRecordTable students={studentList} />
//     </div>
//   );
// };

// export default StudentRecord;



import { useState, useEffect } from 'react';
import './StudentRecord.css';
import axios from 'axios';
import StudentRecordTable from './StudentRecordTable'; 

const StudentRecord = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectList, setSubjectList] = useState([]);
  const [studentList, setStudentList] = useState([]); 
  const token = localStorage.getItem('token');

  // Fetch subjects on mount
  useEffect(() => {
    if (token) {
      const fetchSubjects = async () => {
        try {
          const subjectResponse = await axios.get('http://localhost:3000/api/teachers/subjects', {
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
        `http://localhost:3000/api/teachers/subject-students?subjectCode=${subject}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch attendance and marks for the selected subject using subjectId
      const attenMarksResponse = await axios.get(
        `http://localhost:3000/api/teachers/atten/marks?subjectId=${subjectId}`,
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
        };
      });

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
        <span className="teacher-UpdatedLast">Updated Last: Yesterday</span>
        <span className="teacher-TotalLecture">Total Lecture: 10</span>
      </div>

      {/* Student Record Table */}
      <StudentRecordTable students={studentList} />
    </div>
  );
};

export default StudentRecord;

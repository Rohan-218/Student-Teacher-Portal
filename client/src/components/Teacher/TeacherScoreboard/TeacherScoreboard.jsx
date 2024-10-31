import { useState, useEffect } from 'react';
import './TeacherScoreboard.css';
import StudentTable from './Table'; // Import StudentTable component

const TeacherScoreboard = () => {
  // const [examDropdown, setExamDropdown] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [examList, setExamList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [studentList, setStudentList] = useState([]); // State for student list
  const [maxMarks, setMaxMarks] = useState(null); // State for maximum marks
  const [isUpdateMode, setIsUpdateMode] = useState(false); // To track if it's update mode
  const [branchName, setBranchName] = useState(''); // State for branch name
  const [semester, setSemester] = useState(''); // State for semester

  const token = localStorage.getItem('token');

  // Fetch subjects and exams
  useEffect(() => {
    if (token) {
      const fetchSubjectsAndExams = async () => {
        try {
          // Fetch subjects based on teacherId
          const subjectResponse = await fetch('https://student-teacher-portal-server.onrender.com/api/teachers/subjects', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const subjectData = await subjectResponse.json();
          setSubjectList(subjectData);

          // Fetch exams
          const examResponse = await fetch('https://student-teacher-portal-server.onrender.com/api/teachers/exams', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const examData = await examResponse.json();
          setExamList(examData);
        } catch (error) {
          console.error('Error fetching subjects or exams:', error);
        }
      };

      fetchSubjectsAndExams();
    }
  }, [token]);

  // Fetch students based on the selected subject
  const handleSubjectChange = async (subject) => {
    setSelectedSubject(subject);
    setSelectedExam(''); // Reset selected exam
    setStudentList([]); // Clear student list before fetching new data
    try {
      // Fetch students based on the selected subject
      const studentResponse = await fetch(`https://student-teacher-portal-server.onrender.com/api/teachers/subject-students?subjectCode=${subject}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const studentData = await studentResponse.json();

      console.log('Fetched Student Data:', studentData);
      setStudentList(studentData);

      const selectedSubjectData = subjectList.find(s => s.subject_code === subject);
      if (selectedSubjectData) {
        setBranchName(selectedSubjectData.branch_name); 
        setSemester(selectedSubjectData.semester); 
      }

      setIsUpdateMode(false);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Fetch marks data when selectedExam is present
  useEffect(() => {
    const fetchMarksData = async () => {
      if (!selectedExam || studentList.length === 0) return; // Early return if no exam or students

      try {
        const marksResponse = await fetch(
          `https://student-teacher-portal-server.onrender.com/api/teachers/marks?subjectCode=${selectedSubject}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const marksData = await marksResponse.json();

        // Check if marks data is returned and update studentList accordingly
        const updatedStudents = studentList.map((student) => {
          const studentMarks = marksData.find(
            (mark) => mark.student_id === student.student_id && mark.exam_id === Number(selectedExam)
          );

          return {
            ...student,
            Marks_Obtained: studentMarks ? studentMarks.marks_obtained : undefined,
            originalMarks: studentMarks ? studentMarks.marks_obtained : undefined, // Track original marks
            percentage: studentMarks ? studentMarks.percentage : undefined,
          };
        });

        // Update studentList with marks data
        setStudentList(updatedStudents);

        // Check if any student has marks already entered and switch to update mode
        const hasExistingMarks = updatedStudents.some(student => student.Marks_Obtained !== undefined);
        if (hasExistingMarks) {
          setIsUpdateMode(true); // Switch to update mode if marks exist
        } else {
          setIsUpdateMode(false); // Stay in save mode if no marks exist
        }
      } catch (error) {
        console.error("Error fetching marks data:", error);
      }
    };

    fetchMarksData();
  }, [selectedExam, selectedSubject, token, studentList.length]);

  // Handle exam selection and update maximum marks
  const handleExamSelect = (examId) => {
    setSelectedExam(examId);

    const selectedExamObj = examList.find(exam => exam.exam_id === Number(examId));
    if (selectedExamObj) {
      setMaxMarks(selectedExamObj.maximum_marks);
    }
  };

  // Save or update marks
  const handleSaveMarks = async () => {
    // Filter the students to only send those who have marks entered or have updated marks
    const studentsToUpdate = studentList.filter(student => 
      student.Marks_Obtained !== undefined && student.Marks_Obtained !== student.originalMarks
    ).map(student => ({
      student_id: student.student_id,
      enrollment_no: student.enrollment_no,
      marks_obtained: student.Marks_Obtained,
      subject_code: selectedSubject
    }));

    // Early return if no changes or no valid marks
    if (studentsToUpdate.length === 0) {
      alert("No changes to upload.");
      return;
    }

    const payload = {
      exam_id: Number(selectedExam),
      marks: studentsToUpdate
    };

    try {
      const url = isUpdateMode
        ? 'https://student-teacher-portal-server.onrender.com/api/teachers/marks/update' // Use PUT for updating marks
        : 'https://student-teacher-portal-server.onrender.com/api/teachers/marks/upload'; // Use POST for saving marks

      const method = isUpdateMode ? 'PUT' : 'POST'; // Change method based on mode

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log(isUpdateMode ? 'Marks updated successfully:' : 'Marks uploaded successfully:', result);

      alert(isUpdateMode ? 'Marks updated successfully!' : 'Marks uploaded successfully!');

      // Reset state after successful save or update
      setSelectedSubject('');
      setStudentList([]); // Clear student list
      setSelectedExam(''); // Reset selected exam
      setMaxMarks(null); // Reset maximum marks
      setBranchName(''); // Clear branch name
      setSemester(''); // Clear semester
      setIsUpdateMode(false); // Reset update mode

    } catch (error) {
      console.error(isUpdateMode ? 'Error updating marks:' : 'Error uploading marks:', error);
    }
  };

  return (
    <div className="teacher-scoreboard-container">
      <div className="teacher-top-buttons">
        <div className="teacher-subject-dropdown">
          <select
            className='portal-select'
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
          >
            <option value="">Subject</option>
            {subjectList.length > 0 ? (
              subjectList.map((subject, index) => (
                <option 
                  key={index} 
                  value={subject.subject_code}
                >
                  {`${subject.sub_initials} (${subject.subject_code})`} 
                </option>
              ))
            ) : (
              <option value="">No subjects available</option>
            )}
          </select>
        </div>
  
        <div className="teacher-exam-dropdown">
          <select
            className='portal-select'
            value={selectedExam}
            onChange={(e) => handleExamSelect(e.target.value)}
          >
            <option value="">Exam</option>
            {examList.length > 0 ? (
              examList.map((exam) => (
                <option key={exam.exam_id} value={exam.exam_id}>
                  {exam.exam_name}
                </option>
              ))
            ) : (
              <option value="">No exams available</option>
            )}
          </select>
        </div>
      </div>
  
      <div className="teacher-info-row">
        <span><strong>Branch: </strong>{branchName || 'N/A'}</span>
        <span><strong>Semester: </strong>{semester || 'N/A'}</span>
      </div>
  
      <div className="teacher-maxmarks">
        <span><strong>Exam: </strong>{examList.find(exam => exam.exam_id === Number(selectedExam))?.exam_name || 'N/A'}</span>
        <span><strong>Max marks: </strong>{maxMarks ? maxMarks : 'N/A'}</span>
      </div>
  
      {/* Always render StudentTable, passing studentList */}
      <StudentTable 
        students={studentList} 
        setStudents={setStudentList} 
        onSave={handleSaveMarks} 
        buttonText={isUpdateMode ? 'Update' : 'Save'}
        maxMarks={maxMarks} 
      />
    </div>
  );  
};

export default TeacherScoreboard;

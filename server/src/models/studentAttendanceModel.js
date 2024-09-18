const pool = require('../config/dbConfig'); 

//attendance data
const getAttendanceData = async (student_id) => {
    const query = `
        WITH student_info AS (
            SELECT branch_id, semester
            FROM student
            WHERE student_id = $1
        ),
        subject_list AS (
            SELECT s.subject_id, s.subject_code, s.subject_name
            FROM branch_sem_sub bss
            JOIN subject s ON bss.subject_id = s.subject_id
            JOIN student_info si ON bss.branch_id = si.branch_id AND bss.semester = si.semester
        ),
        latest_attendance AS (
            SELECT
                a.subject_id,
                a.attended_lecture,
                a.percentage,
                a.updated_at
            FROM attendance a
            JOIN (
                SELECT
                    subject_id,
                    MAX(attendance_record_id) AS latest_id
                FROM attendance
                WHERE student_id = $1
                GROUP BY subject_id
            ) latest ON a.subject_id = latest.subject_id AND a.attendance_record_id = latest.latest_id
        )
        SELECT
            sl.subject_code,
            sl.subject_name,
            la.attended_lecture,
            la.percentage,
            la.updated_at
        FROM subject_list sl
        LEFT JOIN latest_attendance la ON sl.subject_id = la.subject_id;
    `;
    
    const result = await pool.query(query, [student_id]);
    return result.rows;
};


//attendance trend
const getAttendanceTrend = async (student_id) => {
    const query = `
        WITH student_info AS (
            SELECT branch_id, semester
            FROM student
            WHERE student_id = $1
        ),
        subject_list AS (
            SELECT s.subject_id, s.subject_code, s.subject_name
            FROM branch_sem_sub bss
            JOIN subject s ON bss.subject_id = s.subject_id
            JOIN student_info si ON bss.branch_id = si.branch_id AND bss.semester = si.semester
        ),
        latest_attendance AS (
            SELECT
                a.subject_id,
                a.attended_lecture,
                a.percentage,
                a.updated_at
            FROM attendance a
            JOIN (
                SELECT
                    subject_id,
                    MAX(attendance_record_id) AS latest_id
                FROM attendance
                WHERE student_id = $1
                GROUP BY subject_id
            ) latest ON a.subject_id = latest.subject_id AND a.attendance_record_id = latest.latest_id
        )
        SELECT
            sl.subject_name,
            la.percentage
        FROM subject_list sl
        LEFT JOIN latest_attendance la ON sl.subject_id = la.subject_id;
    `;
    
    const result = await pool.query(query, [student_id]);
    return result.rows;
};

// New function to fetch daily attendance records
const getDailyAttendanceData = async (student_id) => {
    const query = `
       WITH student_info AS (
            SELECT branch_id, semester
            FROM student
            WHERE student_id = $1
        ),
        subject_list AS (
            SELECT s.subject_id, s.subject_code, s.subject_name
            FROM branch_sem_sub bss
            JOIN subject s ON bss.subject_id = s.subject_id
            JOIN student_info si ON bss.branch_id = si.branch_id AND bss.semester = si.semester
        ),
        daily_attendance AS (
            SELECT
                a.subject_id,
                ar.date, -- Fetching the date from attendance_record table
                a.attendance, -- This field represents the present/absent status
            CASE
                WHEN a.attendance = true THEN 'Present'
                ELSE 'Absent'
                END AS status
            FROM attendance a
            JOIN attendance_record ar ON a.attendance_record_id = ar.attendance_record_id -- Joining attendance_record to get the date
            WHERE a.student_id = $1
        )
        SELECT
            sl.subject_code,
            sl.subject_name,
            da.date,
            da.status
        FROM subject_list sl
        LEFT JOIN daily_attendance da ON sl.subject_id = da.subject_id
        ORDER BY da.date ASC;
    `;

    const result = await pool.query(query, [student_id]);
    return result.rows;
};

module.exports = { getAttendanceData , getAttendanceTrend, getDailyAttendanceData};

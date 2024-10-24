const sequelize = require('../config/dbConfig');

// attendance data
const getAttendanceData = async (student_id) => {
    const query = `
        WITH student_info AS (
            SELECT branch_id, semester
            FROM student
            WHERE student_id = :student_id
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
                a.updated_at,
                ar.date,
                ar.total_lectures  -- Fetching total lectures from attendance_record
            FROM attendance a
            JOIN attendance_record ar ON a.attendance_record_id = ar.attendance_record_id
            WHERE a.student_id = :student_id
            AND a.attendance_record_id = (
                SELECT MAX(attendance_record_id)
                FROM attendance
                WHERE student_id = :student_id
                    AND subject_id = a.subject_id
            )
        )
        SELECT
            sl.subject_code,
            sl.subject_name,
            COALESCE(la.attended_lecture, 0) AS attended_lecture,
            la.date,
            COALESCE(la.percentage, 0) AS percentage,
            COALESCE(la.total_lectures, 0) AS total_lectures,  -- Adding total lectures
            la.updated_at
        FROM subject_list sl
        LEFT JOIN latest_attendance la ON sl.subject_id = la.subject_id
        ORDER BY sl.subject_code; -- Optional: order by subject code
    `;

    const result = await sequelize.query(query, {
        replacements: { student_id },
        type: sequelize.QueryTypes.SELECT
    });
    return result;
};


// attendance trend
const getAttendanceTrend = async (student_id) => {
    const query = `
        WITH student_info AS (
            SELECT branch_id, semester
            FROM student
            WHERE student_id = :student_id
        ),
        subject_list AS (
            SELECT s.subject_id, s.sub_initials, s.subject_code, s.subject_name
            FROM branch_sem_sub bss
            JOIN subject s ON bss.subject_id = s.subject_id
            JOIN student_info si ON bss.branch_id = si.branch_id AND bss.semester = si.semester
        ),
        latest_attendance AS (
            SELECT
                a.subject_id,
                a.percentage,
                ar.total_lectures,  -- Fetching total lectures from attendance_record
                ar.date,
                a.updated_at
            FROM attendance a
            JOIN attendance_record ar ON a.attendance_record_id = ar.attendance_record_id
            WHERE a.student_id = :student_id
            AND a.attendance_record_id = (
                SELECT MAX(attendance_record_id)
                FROM attendance
                WHERE student_id = :student_id
                    AND subject_id = a.subject_id
            )
        )
        SELECT
            sl.subject_name,
            sl.sub_initials,
            la.date,
            la.percentage,
            COALESCE(la.total_lectures, 0) AS total_lectures  -- Adding total lectures
        FROM subject_list sl
        LEFT JOIN latest_attendance la ON sl.subject_id = la.subject_id;
    `;

    const result = await sequelize.query(query, {
        replacements: { student_id },
        type: sequelize.QueryTypes.SELECT
    });
    return result;
};

// daily attendance
const getDailyAttendanceData = async (student_id) => {
    const query = `
       WITH student_info AS (
    SELECT branch_id, semester
    FROM student
    WHERE student_id = :student_id
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
        ar.total_lectures,
        ar.lecture,
        a.attendance, -- This field represents the present/absent status
        a.percentage,
        a.attendance_record_id,
        CASE
            WHEN a.attendance = true THEN 'Present'
            ELSE 'Absent'
        END AS status
    FROM attendance a
    JOIN attendance_record ar ON a.attendance_record_id = ar.attendance_record_id -- Joining attendance_record to get the date
    WHERE a.student_id = :student_id
)
SELECT
    sl.subject_code,
    sl.subject_name,
    da.attendance_record_id,
    da.date,
    da.total_lectures,
    da.percentage,
    da.lecture,
    da.status
FROM subject_list sl
LEFT JOIN daily_attendance da ON sl.subject_id = da.subject_id
ORDER BY da.date DESC;  

    `;

    const result = await sequelize.query(query, {
        replacements: { student_id },
        type: sequelize.QueryTypes.SELECT
    });
    return result;
};

module.exports = { getAttendanceData, getAttendanceTrend, getDailyAttendanceData };

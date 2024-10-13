const sequelize = require('../config/dbConfig');

// Function to create a subject in the database
const createSubject = async (subjectName, subjectCode, subjectInitials, branchName, semester) => {
    try {
        // Start a transaction to ensure atomicity
        const result = await sequelize.transaction(async (t) => {
            // 1. Insert subject into the `Subject` table
            const subjectQuery = `
                INSERT INTO Subject (subject_code, subject_name, sub_initials, created_at, updated_at, is_active)
                VALUES (:subjectCode, :subjectName, :subjectInitials, NOW(), NOW(), TRUE)
                RETURNING subject_id;  -- Return the generated subject_id
            `;
            const subjectResult = await sequelize.query(subjectQuery, {
                replacements: {
                    subjectCode,
                    subjectName,
                    subjectInitials
                },
                type: sequelize.QueryTypes.INSERT,
                transaction: t
            });

            const subjectId = subjectResult[0][0].subject_id; // Get the new subject_id

            // 2. Fetch the branch_id using branchName
            const branchQuery = `
                SELECT branch_id 
                FROM Branch 
                WHERE branch_name = :branchName;
            `;
            const branchResult = await sequelize.query(branchQuery, {
                replacements: { branchName },
                type: sequelize.QueryTypes.SELECT,
                transaction: t
            });

            if (branchResult.length === 0) {
                throw new Error('Branch not found');
            }

            const branchId = branchResult[0].branch_id; // Get the branch_id

            // 3. Insert into the `Branch_Sem_Sub` table
            const branchSemSubQuery = `
                INSERT INTO Branch_Sem_Sub (subject_id, branch_id, semester, created_at, updated_at)
                VALUES (:subjectId, :branchId, :semester, NOW(), NOW());
            `;
            await sequelize.query(branchSemSubQuery, {
                replacements: { subjectId, branchId, semester },
                type: sequelize.QueryTypes.INSERT,
                transaction: t
            });

            // 4. Insert into the `Subject_Teacher` table for the single teacher name
            // const teacherQuery = `
            //     SELECT teacher_id 
            //     FROM Teacher 
            //     WHERE teacher_name = :teacherName;
            // `;
            // const teacherResult = await sequelize.query(teacherQuery, {
            //     replacements: { teacherName },
            //     type: sequelize.QueryTypes.SELECT,
            //     transaction: t
            // });

            // if (teacherResult.length === 0) {
            //     throw new Error(`Teacher '${teacherName}' not found`);
            // }

            // const teacherId = teacherResult[0].teacher_id; // Get the teacher_id

            // // Insert into the Subject_Teacher table
            // const subjectTeacherQuery = `
            //     INSERT INTO Subject_Teacher (subject_id, teacher_id)
            //     VALUES (:subjectId, :teacherId);
            // `;
            // await sequelize.query(subjectTeacherQuery, {
            //     replacements: { subjectId, teacherId },
            //     type: sequelize.QueryTypes.INSERT,
            //     transaction: t
            // });

            // Return the new subject information
            return { subjectId, subjectName, subjectCode, subjectInitials, branchId, semester };
        });

        return result;
    } catch (error) {
        console.error('Error adding subject:', error);
        throw new Error('Error adding subject');
    }
};

module.exports = { createSubject };

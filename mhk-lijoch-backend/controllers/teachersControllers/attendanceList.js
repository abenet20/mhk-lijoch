const database = require("../dbControllers/db_connection.js");
const verifyToken = require("../../middleware/verifyToken.js");

exports.getAttendanceList = [
  verifyToken,
  async (req, res) => {
    const userId = req.user.id;
    try {
      const [teacher] = await database.query(
        `SELECT * FROM teachers WHERE user_id = ?`,
        [userId]
      );

      if (teacher.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Teacher not found." });
      }

      // Fetch all attendance records with student info
      const [attendanceFetched] = await database.query(
        `SELECT attendance.student_id AS id, students.name AS name, attendance.status, attendance.date, students.age
         FROM attendance
         JOIN students ON attendance.student_id = students.id
         WHERE attendance.is_deleted = 0 AND students.is_deleted = 0
         ORDER BY attendance.id ASC, students.name ASC`
      );

      // Filter students by teacher's grade
      let filtered = [];
      for (const record of attendanceFetched) {
        if (
          (teacher[0].grade === "4-6" && record.age <= 6) ||
          (teacher[0].grade === "7-9" && record.age > 6 && record.age <= 9) ||
          (teacher[0].grade === "10-11" &&
            record.age > 9 &&
            record.age <= 11) ||
          (teacher[0].grade === "12-14" && record.age > 11 && record.age <= 14)
        ) {
          filtered.push(record);
        }
      }

      // Group by date
      const attendanceByDate = {};
      for (const record of filtered) {
        const dateKey = new Date(record.date).toISOString().split("T")[0];
        if (!attendanceByDate[dateKey]) {
          attendanceByDate[dateKey] = [];
        }
        attendanceByDate[dateKey].push({
          name: record.name,
          status: record.status,
        });
      }

      res.status(200).json({ success: true, attendance: attendanceByDate });
    } catch (error) {
      console.error("Database error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  },
];

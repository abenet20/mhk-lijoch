const verifyToken = require("../../middleware/verifyToken");
const database = require("../dbControllers/db_connection");

exports.teacherDashboard = [
  verifyToken,
  async (req, res) => {
    try {
      const user_id = req.user.id;

      const [teacher] = await database.query(
        `SELECT * from teachers WHERE user_id = ? AND is_deleted = 0`,
        [user_id]
      );

      if (teacher.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No teacher found.",
        });
      }

      let firstClass = []; //4-6
      let secondClass = []; //7-9
      let thirdClass = []; //10-11
      let fourthClass = []; //12-14
      let studentsList = [];

      const [students] = await database.query(
        `SELECT * FROM students WHERE is_deleted = 0`
      );

      for (const student of students) {
        if (student.age <= 6) {
          firstClass.push(student);
        } else if (student.age > 6 && student.age <= 9) {
          secondClass.push(student);
        } else if (student.age > 9 && student.age <= 11) {
          thirdClass.push(student);
        } else if (student.age > 11 && student.age <= 14) {
          fourthClass.push(student);
        }
      }

      if (teacher[0].grade == "4-6") {
        studentsList = firstClass;
      } else if (teacher[0].grade == "7-9") {
        studentsList = secondClass;
      } else if (teacher[0].grade == "10-11") {
        studentsList = thirdClass;
      } else if (teacher[0].grade == "12-14") {
        studentsList = fourthClass;
      }
      const studentsCount = studentsList.length;

      let data = {};
      data.success = true;
      data.studentsCount = studentsCount;
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  },
];

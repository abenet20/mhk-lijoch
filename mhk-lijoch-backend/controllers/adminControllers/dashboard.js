const verifyToken = require("../../middleware/verifyToken");
const database = require("../dbControllers/db_connection");
const { toEthiopian } = require("ethiopian-date");

exports.adminDashboard = [
  verifyToken,
  async (req, res) => {
    try {
      const today = new Date();
      const [year, month, day] = toEthiopian(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
      const ethDate = `${year}-${month}-${day}`; //ethiopian date format

      const [results] = await database.query(`
  SELECT 
    (SELECT COUNT(*) FROM students WHERE is_deleted = 0) AS totalStudents,
    (SELECT COUNT(*) FROM teachers WHERE is_deleted = 0) AS totalTeachers,
    (SELECT COUNT(*) FROM attendance WHERE date = ${ethDate} AND status = 'present' AND is_deleted = 0) AS todayTotalAttendance
`);

//to calculate attendance oercentage
      const todayAttendance =
        results[0].totalStudents > 0
          ? (results[0].todayTotalAttendance / results[0].totalStudents) * 100
          : 0;
results[0].todayAttendance = todayAttendance;

//to append grades data
 const [classesData] = await database.query(`
 SELECT
  SUM(CASE WHEN age IN (4, 5, 6) THEN 1 ELSE 0 END) AS \`Class 4-6\`,
  SUM(CASE WHEN age IN (7, 8, 9) THEN 1 ELSE 0 END) AS \`Class 7-9\`,
  SUM(CASE WHEN age IN (10, 11) THEN 1 ELSE 0 END) AS \`Class 10-11\`,
  SUM(CASE WHEN age IN (12, 13, 14) THEN 1 ELSE 0 END) AS \`Class 12-14\`
FROM students
WHERE is_deleted = 0
`);



      let data = {};
      data.success = true;
      data.general = results[0];
      data.classesData = classesData[0];
      res.json(data);
    } catch (error) {
      return res.status(500).json({
        error: "Internal Server Error",
        error
      });
    }
  },
];

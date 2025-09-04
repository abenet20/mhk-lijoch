const verifyToken = require("../../middleware/verifyToken");
const database = require("../dbControllers/db_connection");

exports.teacherDashboard = [
  verifyToken,
  async (req, res) => {
    try {
      const {user_id} = req.user;

      const [teacher] = await database.query(`SELECT grade from teachers WHERE user_id = ?`,[user_id]);
      if (teacher.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No teacher found.",
        });
      }



 const [studentsCount] = await database.query(`
 SELECT
  SUM(CASE WHEN age IN (4, 5, 6) THEN 1 ELSE 0 END) AS \`4-6\`,
  SUM(CASE WHEN age IN (7, 8, 9) THEN 1 ELSE 0 END) AS \`7-9\`,
  SUM(CASE WHEN age IN (10, 11) THEN 1 ELSE 0 END) AS \`10-11\`,
  SUM(CASE WHEN age IN (12, 13, 14) THEN 1 ELSE 0 END) AS \`12-14\`
FROM students
WHERE is_deleted = 0
`);



      let data = {};
      data.success = true;
      data.studentsCount = studentsCount[teacher[0].grade];
      res.json(data);
    } catch (error) {
      return res.status(500).json({
        error: "Internal Server Error",
        error
      });
    }
  },
];

const database = require("../dbControllers/db_connection.js");
const verifyToken = require("../../middleware/verifyToken.js");

exports.students = [
  verifyToken,
  async (req, res) => {
    const [students] = await database.query(
         `SELECT 
         students.id AS id,
         students.name AS name,
         students.age AS age,
         students.gender AS gender,
         students.photo AS photo,
         students.address AS address,
         students.parent_name AS parentName,
         students.parent_phone AS parentPhone
         FROM students WHERE is_deleted = 0`,
       );

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found." });
    }

    return res.status(201).json({
      success: true,
      students: students,
    });
  },
];


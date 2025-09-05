const database = require("../dbControllers/db_connection.js");
const verifyToken = require("../../middleware/verifyToken.js");

exports.teachers = [
  verifyToken,
  async (req, res) => {
    //getting teachers
    const [teachers] = await database.query(
      `SELECT 
      teachers.id AS id,
      teachers.name AS name,
      teachers.grade AS grade,
      teachers.phone AS phone,
      teachers.photo AS photo,
      teachers.address AS address,
      teachers.user_id AS userId,
      users.username AS username
       FROM teachers
      LEFT JOIN users ON teachers.user_id = users.user_id
      WHERE teachers.is_deleted = 0`
    );

    if (teachers.length === 0) {
      return res.status(404).json({ message: "No teachers found." });
    }

    return res.status(201).json({
      success: true,
      teachers: teachers,
    });
  },
];

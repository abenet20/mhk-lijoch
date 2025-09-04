const database = require("../dbControllers/db_connection.js");
const { body, validationResult } = require("express-validator");
const verifyToken = require("../../middleware/verifyToken.js");

exports.removeStudent = [
  body("id")
    .isLength({ min: 1 })
    .withMessage("ID is required")
    .isNumeric()
    .withMessage("ID must be a number"),
  verifyToken,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Extracting id from request body
    const { id } = req.body;
 console.log(id);
    try {
      // Fetch student
      const [studentRows] = await database.query(
        `SELECT * FROM students WHERE id = ? AND is_deleted = 0`,
        [id]
      );
      const student = studentRows[0];

      if (!student) {
        console.error("Student not found for ID:", id);
        return res
          .status(404)
          .json({ success: false, message: "Student not found" });
      }


      // Soft delete student from students table
      await database.query(
        `UPDATE students SET is_deleted = 1 WHERE id = ?`,
        [id]
      );

      return res.status(200).json({
        success: true,
        message: "Student removed successfully",
      });
    } catch (error) {
      console.error("Error removing student:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];


exports.removeTeacher = [
  verifyToken,
  body("user_id")
  .isLength({ min: 1 })
    .withMessage("User ID is required")
    .isNumeric()
    .withMessage("User ID must be a number"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Extracting user_id from request body
    const { user_id } = req.body;
    console.log(user_id);

    try {
      // Fetch teacher
      const [teacherRows] = await database.query(
        `SELECT * FROM teachers WHERE user_id = ? AND is_deleted = 0`,
        [user_id]
      );
      const teacher = teacherRows[0];

      if (!teacher) {
        return res
          .status(404)
          .json({ success: false, message: "Teacher not found" });
      }

      // Soft delete teacher from teachers table
      await database.query(
        `UPDATE teachers SET is_deleted = 1 WHERE user_id = ?`,
        [user_id]
      );

      // Soft delete user account (role: teacher)
      await database.query(
        `UPDATE users SET is_deleted = 1 WHERE user_id = ? AND role = 'teacher'`,
        [user_id]
      );

      return res.status(200).json({
        success: true,
        message: "Teacher removed successfully",
      });
    } catch (error) {
      console.error("Error removing teacher:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

  }
    
]
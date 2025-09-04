const database = require("../dbControllers/db_connection.js");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const generator = require("generate-password");
const verifyToken = require("../../middleware/verifyToken.js");
const { send } = require("../senders/smsSender.js");



exports.addStudent = [
  verifyToken,
  body("name")
    .isLength({ min: 3 })
    .withMessage("name should contain atleast 3 letters")
    .trim()
    .notEmpty()
    .withMessage("name should not be empty")
    .matches(/^[\p{L}\s]+$/u)
    .withMessage("name must only contain letters and spaces"),
  body("parentName")
    .isLength({ min: 3 })
    .withMessage("name should contain atleast 3 letters")
    .trim()
    .notEmpty()
    .withMessage("name should not be empty")
    .matches(/^[\p{L}\s]+$/u)
    .withMessage("name must only contain letters and spaces"),
  body("parentPhone")
    .isLength({ min: 10 })
    .withMessage("phone should contain 10 numbers")
    .isNumeric()
    .withMessage("phone must be number"),
  body("age")
    .isLength({ min: 1 })
    .withMessage("age should contain atleast 1 number")
    .isNumeric()
    .withMessage("age must be number"),
  body("address"),
  async (req, res) => {
    const photoPath = req.file ? req.file.path : null;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
      console.log(req.body);
console.log('FILE:', req.file);

    //getting students
    const [students] = await database.query(
      `SELECT 
      students.id AS Id,
      students.name AS name,
      students.age AS age,
      students.gender AS gender,
      students.parent_name AS parentName,
      students.parent_phone AS parentPhone
      FROM students WHERE is_deleted = 0`,
    );


    try {
      const {
        name,
        parentName,
        parentPhone,
        gender,
        age,
        address
      } = req.body;

      for (const student of students) {
        if (
          name == student.student_name &&
          gender == student.student_gender &&
          parentName == student.parent_name &&
          parentPhone == student.parent_phone
        ) {
          return res.status(400).json({
            message: "Student and parent not registered due to duplication",
            student,
          });
        }
      }

      await database.query(
        "INSERT INTO students (`name`, `parent_name`,`parent_phone`, `age`, `gender`,  `address` ,`photo`) VALUES (?,?,?,?,?,?,?)",
        [
          name,
          parentName,
          parentPhone,
          age,
          gender,
          address,
          photoPath,
        ]
      );

      // Send SMS notifications (assuming a send function is defined)
      send(
        parentPhone,
        `Your child ${name} has been registered successfully to mehal hosaina kalehiwot sunday school program.`
      );
    
      return res.status(201).json({
        message: "Student registered successfully",
      });
    } catch (error) {
      console.error("Error during student/parent creation:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
];

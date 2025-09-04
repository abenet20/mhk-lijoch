const database = require("../dbControllers/db_connection.js");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const generator = require("generate-password");
const verifyToken = require("../../middleware/verifyToken.js");
const { send } = require("../senders/smsSender.js");



exports.addTeacher = [
  verifyToken,
  body("name")
    .isLength({ min: 3 })
    .withMessage("name should contain atleast 3 letters")
    .trim()
    .notEmpty()
    .withMessage("name should not be empty")
    .matches(/^[\p{L}\s]+$/u)
    .withMessage("name must only contain letters and spaces"),
  body("phone")
    .isLength({ min: 10 })
    .withMessage("phone should contain 10 numbers")
    .isNumeric()
    .withMessage("phone must be number"),
  body("grade"),
  body("address"),
  async (req, res) => {
    const photoPath = req.file ? req.file.path : null;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

     //function which help username
    function generateUsername(name = "user") {
      const cleaned = name.toLowerCase().replace(/\s+/g, "");
      const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
      return `${cleaned}${random}`;
    }
    
      console.log(req.body);
console.log('FILE:', req.file);

    //getting students
    const [teachers] = await database.query(
      `SELECT 
      teachers.id AS Id,
      teachers.name AS name,
      teachers.grade AS grade,
      teachers.phone AS phone,
      teachers.photo AS photo
      FROM teachers WHERE is_deleted = 0`,
    );


    try {
      const {
        name,
        grade,
        phone,
        address
      } = req.body;

      for (const teacher of teachers) {
        if (
          name == teacher.teacher_name &&
          grade == teacher.teacher_grade &&
          phone == teacher.phone
        ) {
          return res.status(400).json({
            message: "teacher not registered due to duplication",
            student,
          });
        }
      }

     
      const username = generateUsername(name);
      const password = generator.generate({
        length: 4,
        numbers: true,
        symbols: false,
        uppercase: false,
        lowercase: true,
      });
      const Hashed = await bcrypt.hash(password, 10);

      const [userResult] = await database.query(
        "INSERT INTO users (`name`, `username`, `password`, `role`) VALUES (?,?,?,?)",
        [name, username, Hashed, "teacher"]
      );

      const userId = userResult.insertId;

      await database.query(
        "INSERT INTO teachers (`user_id`,`name`, `phone`,`grade`, `address`, `photo`) VALUES (?,?,?,?,?,?)",
        [
          userId,
          name,
          phone,
          grade,
          address,
          photoPath,
        ]
      );

      // Send SMS notifications (assuming a send function is defined)
      send(
        phone,
        `You have been successfully registered  to mehal hosaina kalehiwot sunday school program as a teacher with username = ${username} and password = ${password}.`
      );
    
      return res.status(201).json({
        message: "Teacher registered successfully",
        username: username,
        password: password
      });
    } catch (error) {
      console.error("Error during teacher creation:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
];

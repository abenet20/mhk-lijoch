const database = require("../dbControllers/db_connection.js");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const generator = require("generate-password");
const verifyToken = require("../../middleware/verifyToken.js");
const { send } = require("../senders/smsSender.js");



exports.editStudent = [
  verifyToken,
  // Convert fields to numbers if possible
  (req, res, next) => {
    if (req.body.id) req.body.id = Number(req.body.id);
    if (req.body.age) req.body.age = Number(req.body.age);
    if (req.body.parentPhone) req.body.parentPhone = String(req.body.parentPhone);
    next();
  },
  body("id")
  .isNumeric()
  .withMessage("id must be number")
  .isLength({min : 1})
  .withMessage("id must contain atleast one number")
  ,
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
    .isLength({ min: 9 })
    .withMessage("phone should contain 9 numbers")
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
    try {
      const {
        id,
        name,
        parentName,
        parentPhone,
        gender,
        age,
        address
      } = req.body;

      console.log(req.body);

      const [student] = await database.query(`SELECT * FROM students WHERE id = ? AND is_deleted = 0`, [id]);

       if (!student || student.length === 0) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      // If no new photo, keep the old one
      let finalPhotoPath = photoPath;
      if (!photoPath) {
        finalPhotoPath = student[0].photo;
      }

      await database.query(
        "UPDATE students SET name = ?, parent_name = ?,parent_phone = ?, age = ?, gender = ?,  address  = ?, photo = ? WHERE id = ?",
        [
          name,
          parentName,
          parentPhone,
          age,
          gender,
          address,
          photoPath,
          id
        ]
      );

      // Send SMS notifications (assuming a send function is defined)
      send(
        parentPhone,
        `Your child ${name} data has been updated successfully on mehal hosaina kalehiwot sunday school program.`
      );
    
      return res.status(201).json({
        message: "Student data updated successfully",
      });
    } catch (error) {
      console.error("Error during student/parent creation:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
];

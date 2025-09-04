const database = require("../dbControllers/db_connection.js");
const { body, validationResult } = require("express-validator");
const verifyToken = require("../../middleware/verifyToken.js");

exports.editTeacher = [
  verifyToken,
  (req, res, next) => {
    if (req.body.id) req.body.id = Number(req.body.id);
    next();
  },
  body("id")
    .isNumeric()
    .withMessage("id must be number")
    .isLength({ min: 1 })
    .withMessage("id must contain at least one number"),
  body("name")
    .isLength({ min: 3 })
    .withMessage("name should contain at least 3 letters")
    .trim()
    .notEmpty()
    .withMessage("name should not be empty")
    .matches(/^[\p{L}\s]+$/u)
    .withMessage("name must only contain letters and spaces"),
  body("phone")
    .isLength({ min: 9 })
    .withMessage("phone should contain at least 9 numbers")
    .isNumeric()
    .withMessage("phone must be number"),
  body("grade")
    .notEmpty()
    .withMessage("grade should not be empty"),
  body("address"),
  async (req, res) => {
    const photoPath = req.file ? req.file.path : null;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id, name, phone, grade, address } = req.body;
      const [teacher] = await database.query(
        `SELECT * FROM teachers WHERE id = ? AND is_deleted = 0`,
        [id]
      );
      if (!teacher || teacher.length === 0) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      let finalPhotoPath = photoPath;
      if (!photoPath) {
        finalPhotoPath = teacher[0].photo;
      }

      const [user] =   await database.query(
        "UPDATE users SET name = ? WHERE user_id = ?",
        [name, teacher[0].user_id]
      );

      await database.query(
        "UPDATE teachers SET name = ?, phone = ?, grade = ?, address = ?, photo = ? WHERE id = ?",
        [name, phone, grade, address, finalPhotoPath, id]
      );
      return res.status(201).json({ message: "Teacher data updated successfully" });
    } catch (error) {
      console.error("Error during teacher update:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
];

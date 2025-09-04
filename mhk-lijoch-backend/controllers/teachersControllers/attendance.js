const database = require("../dbControllers/db_connection.js");
const { body, validationResult } = require("express-validator");
const verifyToken = require("../../middleware/verifyToken.js");
const { toEthiopian } = require("ethiopian-date");
const { send } = require("../senders/smsSender.js");

exports.insertAttendance = [
  verifyToken,
  body("students")
  .isArray()
  .withMessage("Students must be an array")
  .isLength({min: 1})
  .withMessage("it should contain atleast one student"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const today = new Date();
    const [year, month, day] = toEthiopian(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    const ethDate = `${year}-${month}-${day}`; //ethiopian date format

    const {students} = req.body;
    let savedStudents = [];
    let notSavedStudents = [];
    console.log(students);

    try {
    for(const student of students){

      const [studentData] = await database.query(
        "SELECT * FROM students WHERE id = ? AND is_deleted = 0",
        [student.id]
      );

      // Check if the record exists
      const [attendance] = await database.query(
        "SELECT * FROM attendance WHERE student_id = ? AND date = ?",
        [student.id, ethDate]
      );

      if (attendance.length > 0) {
        notSavedStudents.push({
          student_id: student.id,
          name: student.name,
          date: ethDate,
          status: student.status,
          message: "Attendance already recorded for this student on this date.",
        });
        continue; // Skip to the next student if attendance already exists
      }
      {
        // Insert attendance record
        const [insertAttendance] = await database.query(
          "INSERT INTO attendance (student_id, name, date, status) VALUES (?, ?, ?, ?)",
          [student.id, student.name, ethDate, student.status]
        );

        if (student.status === "absent") {
          send(
           studentData[0].parent_phone,
            `Dear Ato/Wro. ${studentData.parent_name} Your Child ${student.name} has not attended our class session on ${ethDate}.`
          );
        }

        savedStudents.push({
          student_id: student.id,
          name: student.name,
          date: ethDate,
          status: student.status,
        });
       
      }
    }
    res.status(200).json({
      success: true,
      message: "Attendance recorded successfully",
      savedStudents,
      notSavedStudents,
    });
    
    } catch (error) {
      console.error("Error during attendance recording:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];

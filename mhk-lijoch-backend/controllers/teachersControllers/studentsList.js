const verifyToken = require("../../middleware/verifyToken.js");
const { body, validationResult } = require("express-validator");
const database = require("../dbControllers/db_connection.js");

exports.StudentsList = [
  verifyToken,
  async (req, res) => {
    const userId = req.user.id;
    try {
      const [teacher] = await database.query(
        `SELECT * FROM teachers WHERE user_id = ?`,
        [userId]
      );

      if (teacher.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No teacher found.",
        });
      }

      const classGuide = {"firstClass" : "4-6","secondClass" : "7-9","thirdClass" : "10-11","fourthClass" : "12-14"}

      let firstClass = [];//4-6
      let secondClass = [];//7-9
      let thirdClass = [];//10-11
      let fourthClass = [];//12-14
      let studentsList = [];

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

        for (const student of students){
          if (student.age <= 6){
            firstClass.push(student);
          } else if (student.age > 6 && student.age <= 9){
            secondClass.push(student);
          } else if (student.age > 9 && student.age <= 11){
            thirdClass.push(student);
          } else if (student.age > 11 && student.age <= 14){
            fourthClass.push(student);
          }
        }

        if(teacher[0].grade == "4-6"){
          studentsList = firstClass;
        } else if(teacher[0].grade == "7-9"){
          studentsList = secondClass;
        }else if(teacher[0].grade == "10-11"){
          studentsList = thirdClass;
        }else if(teacher[0].grade == "12-14"){
          studentsList = fourthClass;
        }

      res.status(200).json({
        success: true,
        message: "Students list fetched successfully.",
        students: studentsList,
        class: teacher[0].grade
      });
    } catch (error) {
      console.error("Error fetching students list:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  },
];

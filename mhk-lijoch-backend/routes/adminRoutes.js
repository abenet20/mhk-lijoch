const express = require("express");
const router = express.Router();
const { students } = require("../controllers/adminControllers/Students");
const { addStudent } = require("../controllers/adminControllers/addStudent");
const { addTeacher } = require("../controllers/adminControllers/addTeacher");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const { editStudent } = require("../controllers/adminControllers/editStudent");
const { editTeacher } = require("../controllers/adminControllers/editTeacher");
const {
  removeStudent,
  removeTeacher,
} = require("../controllers/adminControllers/remove");
const { adminDashboard } = require("../controllers/adminControllers/dashboard");
const { teachers } = require("../controllers/adminControllers/teachers");

router.get("/students", students);
router.get("/teachers", teachers);
router.post("/add/student", upload.single("photo"), addStudent);
router.post("/add/teacher", upload.single("photo"), addTeacher);
router.post("/edit/student", upload.single("photo"), editStudent);
router.post("/edit/teacher", upload.single("photo"), editTeacher);
router.post("/remove/student", removeStudent);
router.post("/remove/teacher", removeTeacher);
router.get("/dashboard", adminDashboard);

module.exports = router;

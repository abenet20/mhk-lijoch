const express = require("express");
const router = express.Router();
const {
  insertAttendance,
} = require("../controllers/teachersControllers/attendance");
const {
  StudentsList,
} = require("../controllers/teachersControllers/studentsList");
const {
  getAttendanceList,
} = require("../controllers/teachersControllers/attendanceList");
const {
  teacherDashboard,
} = require("../controllers/teachersControllers/dashboard");

router.get("/students", StudentsList);
router.get("/dashboard", teacherDashboard);
router.post("/insert-attendance", insertAttendance);
router.get("/prev-attendance", getAttendanceList);

module.exports = router;

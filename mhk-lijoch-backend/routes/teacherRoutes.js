const express = require("express");
const router = express.Router();
const {insertAttendance} = require('../controllers/teachersControllers/attendance');
const { StudentsList } = require("../controllers/teachersControllers/studentsList");
const { getAttendanceList } = require("../controllers/teachersControllers/attendanceList");


// router.post('/attendance', attendance);
router.get("/students", StudentsList);
router.post("/insert-attendance", insertAttendance);
router.get("/prev-attendance", getAttendanceList);

module.exports = router;
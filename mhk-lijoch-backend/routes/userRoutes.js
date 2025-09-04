const express = require("express");
const router = express.Router();
const { login } = require("../controllers/usersControllers/login");
const {
  forgetPassword,
  ValidateOtp,
  resetPassword
} = require("../controllers/usersControllers/forgetPassword");
const { changePassword } = require("../controllers/usersControllers/changePassword");
const {viewsCount} = require("../controllers/usersControllers/views");

router.post("/login", login);
router.get("/forget-password", forgetPassword);
router.post("/validate-otp", ValidateOtp);
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);
router.post("/views", viewsCount);

module.exports = router;

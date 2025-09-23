const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

app.use(
  cors({
    origin: "*", // allow all origins for production, or set to your domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);

app.listen(5000, "0.0.0.0", () =>
  console.log("server is running on port 5000")
);

const express = require("express");
const app = express();
const cors = require("cors");
const {login} = require("./users/login");

app.use(cors({
  origin: "http://localhost:8080", // your frontend local dev server
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use('/api/users/login', login);

app.listen(4000, '0.0.0.0', () => console.log("server is running on port 4000"));

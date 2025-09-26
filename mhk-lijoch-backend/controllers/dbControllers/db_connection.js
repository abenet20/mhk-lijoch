const mysql = require("mysql2/promise");

const database = mysql.createPool({
  user: "root",
  password: "",
  host: "localhost",
  database: "mhk-lijoch",
});

// const database = mysql.createPool({
//   user: "mhk-lijoch",
//   port: 33636,
//   password: "Mhk11j0c#",
//   host: "mysql-db03.remote",
//   database: "lihketco_mhk-lijoch",
// });

module.exports = database;

const bcrypt = require("bcrypt");

 bcrypt.hash("1234", 10, function(err, hash) {
   if (err) {
     console.error("Error hashing password:", err);
    } else {
        console.log("Hashed password:", hash);
    }
 });

 
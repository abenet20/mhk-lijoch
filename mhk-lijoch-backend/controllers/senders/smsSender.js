const express = require("express");
const router = express.Router();

const send = (to, message) => {
  fetch(`https://api.afromessage.com/api/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiU1RqdGtBUVR3ZzN3c1ZhNEpYa3hmT0VjVGNUbXJabEkiLCJleHAiOjE5MTUwNDYzMzYsImlhdCI6MTc1NzI3OTkzNiwianRpIjoiMjMyMGFmYTktNTYxZS00Nzk5LTgwYzMtZjk0YWI0MGJkZjVjIn0.hn9pTaD4vV_EuuM4S5U5IUlP4op9L7Aeu_yHlDgjXSE`,
    },
    body: JSON.stringify({
      from: "e80ad9d8-adf3-463f-80f4-7c4b39f7f164",
      sender: " 9786",
      to: to,
      message: message,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Message sent successfully:", data);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
};

send("920864496", "Hello, this is a test message from Lihket!");

// module.exports = {
//   send,
// };

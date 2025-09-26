import { useState } from "react";
import { Card, Typography, TextField, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: localStorage.getItem("name"),
    username: localStorage.getItem("username"),
    oldPassword: "",
    newPassword: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveSettings = () => {
    const token = localStorage.getItem("token");
    fetch("https://lihket.com.et/api/users/change-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.success) {
          alert(data.message);
          if (data.message == "settings changed successfully") {
            handleLogout();
          }
        } else if (Array.isArray(data.errors) && data.errors.length > 0) {
          // Alert the first error message from the errors array
          alert(data.errors[0].msg);
        } else if (data.error) {
          alert(data.error);
        } else {
          alert("Change failed. Please try again.");
        }
      })
      .catch((error) => {
        return { success: false, error: "change failed. Please try again." };
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        background: "#f4f8fb",
      }}
    >
      <Card
        style={{
          padding: 32,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 2px 16px rgba(44,62,80,0.10)",
          borderRadius: 16,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          style={{ fontWeight: 700 }}
        >
          የመለያ ቅንብሮች
        </Typography>
        <form
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
          onSubmit={(e) => {
            e.preventDefault();
            saveSettings();
          }}
        >
          <TextField
            name="name"
            label="ስም"
            variant="outlined"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="username"
            label="የተጠቃሚ ስም"
            variant="outlined"
            value={form.username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="oldPassword"
            label="የድሮ የይለፍ ቃል"
            type="password"
            variant="outlined"
            value={form.oldPassword}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="newPassword"
            label="አዲስ የይለፍ ቃል"
            type="password"
            variant="outlined"
            value={form.newPassword}
            onChange={handleChange}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ fontWeight: 600, borderRadius: 8, padding: "10px 0" }}
          >
            አስቀምጥ
          </Button>
        </form>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    console.log("Logging in with", form);
    e.preventDefault();
    if (form.username && form.password) {
      fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            if (data.token) {
              localStorage.setItem("token", data.token);
              localStorage.setItem("name", data.name);
              localStorage.setItem("username", form.username);
              localStorage.setItem("role", data.role);
            }
            navigate(`${data.role}/Dashboard`);
            return { success: true, user: data };
          } else {
            alert(data.error);
            return { success: false, error: data.error };
          }
        })
        .catch((error) => {
          console.error("Login error:", error);
          return { success: false, error: "Login failed. Please try again." };
        });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          p: { xs: 3, md: 4 },
          boxShadow: 3,
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            value={form.username}
            onChange={handleChange}
            fullWidth
            autoFocus
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ fontWeight: 600, borderRadius: 2, py: 1 }}
          >
            Login
          </Button>
        </Box>
      </Card>
    </Container>
  );
}

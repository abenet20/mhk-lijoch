import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form),
      credentials: "include" 

    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name);
            localStorage.setItem('username', form.username);
            localStorage.setItem('role', data.role);
          }
          navigate(`${data.role}/Dashboard`);
          return { success: true, user: data};
        } else {
          return { success: false, error: data.error };
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        return { success: false, error: 'Login failed. Please try again.' };
      });

  };
}

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          name="username"
          type="username"
          placeholder="username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

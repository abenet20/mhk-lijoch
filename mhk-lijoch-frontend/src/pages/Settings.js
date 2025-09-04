import { useState } from "react";

export default function Settings() {
  const [form, setForm] = useState({
    name: localStorage.getItem("name"),
    username: localStorage.getItem("username"),
    oldPassword: "",
    newPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveSettings = () => {
    const token = localStorage.getItem("token");
    fetch('http://localhost:5000/api/users/change-settings', {
      method: 'POST',
       headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
      body: JSON.stringify(form),
      credentials: "include" 

    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Settings saved!");
        } else {
          return { success: false, error: data.error };
        }
      })
      .catch(error => {
        console.error('change error:', error);
        return { success: false, error: 'change failed. Please try again.' };
      });

  };

  return (
    <div>
      <h2>Account Settings</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="username"
        placeholder="username"
        value={form.username}
        onChange={handleChange}
      />
      <input
        name="oldPassword"
        type="password"
        placeholder="old password"
        value={form.oldPassword}
        onChange={handleChange}
      />
      <input
        name="newPassword"
        type="password"
        placeholder="New Password"
        value={form.newPassword}
        onChange={handleChange}
      />
      <button onClick={saveSettings}>Save</button>
    </div>
  );
}

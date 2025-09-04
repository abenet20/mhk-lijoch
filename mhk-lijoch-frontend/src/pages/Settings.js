import { useState } from "react";

export default function Settings() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveSettings = () => {
    // TODO: Send to backend
    alert("Settings saved!");
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
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="New Password"
        value={form.password}
        onChange={handleChange}
      />
      <button onClick={saveSettings}>Save</button>
    </div>
  );
}

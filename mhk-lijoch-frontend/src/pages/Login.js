import { useState } from "react";
import axios from "axios";

export default function Login({ setAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username, password
      });
      localStorage.setItem("token", res.data.token);
      setAuth(true);
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-lg w-80" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4">Sunday School Login</h2>
        <input 
          type="text" placeholder="Username" 
          className="w-full p-2 border rounded mb-2"
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="bg-blue-500 text-white w-full py-2 rounded">Login</button>
      </form>
    </div>
  );
}

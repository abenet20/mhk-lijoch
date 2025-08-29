import { useState, useEffect } from "react";
import axios from "axios";

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/students", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setStudents(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <ul>
        {students.map(s => (
          <li key={s.id} className="p-2 border-b">{s.name} - Grade {s.grade}</li>
        ))}
      </ul>
    </div>
  );
}

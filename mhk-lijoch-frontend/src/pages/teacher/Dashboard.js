import { Link } from "react-router-dom";
import React, {useState, useEffect} from "react";

export default function TeacherDashboard() {
  const [studentsCount, setStudentsCount] = useState(null);
  useEffect(() => {
      const fetchDashboard = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            "http://localhost:5000/api/teacher/dashboard",
            {
              method: "GET",
              credentials: "include",
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );
          const data = await response.json();
          if (response.ok && data.success) {
            setStudentsCount(data.studentsCount);
            console.log(data);
          }
        } catch (error) {
          console.error("Fetch data error:", error);
          setError("Fetch data error: " + error.message);
        }
      };
  
      fetchDashboard();
    }, []);
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/teacher/attendance">ስም መጥሪያ</Link></li>
          <li><Link to="/teacher/prev-attendance">የተጠሩ ስሞች</Link></li>
          <li><Link to="/settings">Account Settings</Link></li>
        </ul>
      </nav>
    </div>
  );
}

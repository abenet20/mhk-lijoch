import { Link } from "react-router-dom";
import React, {useState, useEffect} from "react";

export default function Dashboard() {
  const [general, setGeneral] = useState(null);
  const [classesData, setClassesData] = useState(null);

  useEffect(() => {
      const fetchDashboard = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            "http://localhost:5000/api/admin/dashboard",
            {
              method: "GET",
              credentials: "include",
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );
          const data = await response.json();
          if (response.ok && data.success) {
            setClassesData(data.classesData);
            setGeneral(data.general);
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
      <h3>welcome {localStorage.getItem("name")}</h3>
      <nav>
        <ul>
          <li><Link to="/admin/students">Manage Students</Link></li>
          <li><Link to="/admin/teachers">Manage Teachers</Link></li>
          <li><Link to="/settings">Account Settings</Link></li>
        </ul>
      </nav>
      {general && (
      <>
      <div>
        Total Students {general.totalStudents}
      </div>
      <div>
        Total Teachers {general.totalTeachers}
      </div>
      </>
)}
 {classesData &&  (
  <ul>
   
      <li>class 4 - 6 - {classesData["class 4-6"]}</li>
   
  </ul>
)}

    </div>
  );
}


import { useEffect, useState } from "react";
import "../../styles.css";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [className, setClass] = useState("");
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/teacher/students",
          {
            method: "GET",
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setStudents(data.students);
          setClass(data.class);
        }
      } catch (error) {
        console.error("Fetch students error:", error);
        setError("Fetch students error: " + error.message);
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (id, name, status) => {
    setAttendance(prev =>
    [
      ...prev.filter(a => a.id !== id),
      { id, name, status }
    ]
  );
  };

  const saveAttendance = async(att = attendance) => {
     try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/teacher/insert-attendance",
          {
            method: "POST",
            body: JSON.stringify({students: att}),
            credentials: "include",
            headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setSuccess(data.message);
        }
      } catch (error) {
        console.error("inserting attendance error:", error);
        setError("inserting attendance error: " + error.message);
      }
  }


  // Helper to get attendance status for a student
  const getStatus = (id) => {
    const found = attendance.find((a) => a.id === id);
    return found ? found.status : null;
  };

  return (
    <div className="container">
      <h2>ዕድሜያቸዉ ከ{className} የሆኑ ልጆች ክፍል በ መምህር {localStorage.getItem("name")}</h2>
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      {success && (
        <div style={{ color: "green", marginTop: 10 }}>{success}</div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center", margin: "2rem 0" }}>
        {students.map((s) => {
          const status = getStatus(s.id);
          return (
            <div key={s.id} className="card" style={{ width: 220, minHeight: 340, position: "relative", boxShadow: "0 2px 12px rgba(44,62,80,0.10)", border: status === "present" ? "2px solid #27ae60" : status === "absent" ? "2px solid #e74c3c" : "2px solid #eee", background: "#f4f8fb" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", overflow: "hidden", marginBottom: 10, border: "3px solid #fff", boxShadow: "0 1px 6px rgba(44,62,80,0.10)" }}>
                  {s.photo ? (
                    <img
                      src={`http://localhost:5000/${s.photo.replace(/\\/g, "/")}`}
                      alt="student"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#e1e4ea" }} />
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 14, color: "#555", marginBottom: 2 }}>Age: {s.age}</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>Parent: {s.parentName}</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>Phone: {s.parentPhone}</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>Address: {s.address}</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Gender: {s.gender}</div>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn"
                    style={{
                      background: status === "present" ? "#27ae60" : "#e1e4ea",
                      color: status === "present" ? "#fff" : "#27ae60",
                      border: status === "present" ? "2px solid #27ae60" : "2px solid #e1e4ea",
                      fontSize: 22,
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      boxShadow: status === "present" ? "0 2px 8px rgba(39,174,96,0.10)" : "none",
                      transition: "all 0.2s"
                    }}
                    onClick={() => handleChange(s.id, s.name, "present")}
                  >
                    ✔️
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{
                      background: status === "absent" ? "#e74c3c" : "#e1e4ea",
                      color: status === "absent" ? "#fff" : "#e74c3c",
                      border: status === "absent" ? "2px solid #e74c3c" : "2px solid #e1e4ea",
                      fontSize: 22,
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      boxShadow: status === "absent" ? "0 2px 8px rgba(231,76,60,0.10)" : "none",
                      transition: "all 0.2s"
                    }}
                    onClick={() => handleChange(s.id, s.name, "absent")}
                  >
                    ❌
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <button className="btn" onClick={() => saveAttendance()}>Save Attendance</button>
      </div>
      <div className="card mt-2">
        <h3>Current Attendance State</h3>
        {attendance.length === 0 ? (
          <div style={{ color: "#888" }}>No attendance marked yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td style={{ color: a.status === "present" ? "#27ae60" : "#e74c3c", fontWeight: 600 }}>
                    {a.status === "present" ? "✔️ Present" : "❌ Absent"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

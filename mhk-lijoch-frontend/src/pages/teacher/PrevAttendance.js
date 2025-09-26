import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PrevAttendance() {
  const [attendanceByDate, setAttendanceByDate] = useState({});
  const [dates, setDates] = useState([]);
  const [studentNames, setStudentNames] = useState([]);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/teacher/dashboard");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://lihket.com.et/api/teacher/prev-attendance",
          {
            method: "GET",
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setAttendanceByDate(data.attendance);
          // Sensitive: Do not log attendance data in production
          // console.log('Attendance data:', data); // commented out

          // Extract and sort dates
          const dateList = Object.keys(data.attendance).sort();
          setDates(dateList);

          // Extract unique student names
          const nameSet = new Set();
          dateList.forEach((date) => {
            data.attendance[date].forEach((record) => {
              nameSet.add(record.name);
            });
          });
          setStudentNames(Array.from(nameSet).sort());
        }
      } catch (error) {
        // Only log errors, not sensitive data
        console.error("Fetch attendance error:", error);
      }
    };

    fetchAttendance();
  }, []);

  function formatDate(dateStr) {
    // "2016-02-15" => "15-02-2016"
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            color: "#388e3c",
            fontSize: "1.5rem",
            cursor: "pointer",
            marginBottom: 16,
          }}
          title="ወደ ዳሽቦርድ ተመለስ"
        >
          &#8592;
        </button>
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            color: "#e74c3c",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: 16,
          }}
          title="ውጣ"
        >
          ውጣ
        </button>
      </div>
      <h2>የቀድሞ ቆጣሪ</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        {dates.map((date) => (
          <div
            key={date}
            className="card"
            style={{
              minWidth: 320,
              maxWidth: 340,
              background: "#f4f8fb",
              border: "2px solid #eee",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "#2d6cdf",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {date}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {attendanceByDate[date]?.map((record) => (
                <div
                  key={record.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 1px 6px rgba(44,62,80,0.08)",
                    padding: "0.7rem 1.2rem",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 16 }}>
                    {record.name}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color:
                        record.status === "present" ? "#27ae60" : "#e74c3c",
                    }}
                  >
                    {record.status === "present" ? "✔️" : "❌"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

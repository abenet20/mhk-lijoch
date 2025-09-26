import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";

export default function TeacherDashboard() {
  const [studentsCount, setStudentsCount] = useState(null);
  const [error, setError] = useState(null);
  const [genderStatistics, setGenderStatistics] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://lihket.com.et/api/teacher/dashboard",
          {
            method: "GET",
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setStudentsCount(data.studentsCount);
          setGenderStatistics(data.genderStatistics);
          // console.log(data);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch dashboard data.");
        }
      } catch (error) {
        setError("Fetch data error: " + error.message);
      }
    };
    fetchDashboard();
  }, []);

  // Chart data for students count
  const barData = {
    labels: ["የክፍል ተማሪዎች"],
    datasets: [
      {
        label: "ተማሪዎች ብዛት",
        data: [studentsCount || 0],
        backgroundColor: "#388e3c",
      },
    ],
  };

  // Chart data for students gender statistics
  const genderBarData = {
    labels: Object.keys(genderStatistics || {}).map((key) =>
      key === "males" ? "ወንዶች" : key === "females" ? "ሴቶች" : key
    ),
    datasets: [
      {
        label: "የተማሪዎች ጾታ",
        data: Object.values(genderStatistics || {}),
        backgroundColor: "#388e3c",
      },
    ],
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ margin: 0 }}>የአስተማሪ ፓነል</h2>
        </div>
        <List>
          <ListItem button component={Link} to="/teacher/attendance">
            <ListItemText primary="ስም መጥሪያ" />
          </ListItem>
          <ListItem button component={Link} to="/teacher/prev-attendance">
            <ListItemText primary="የተጠሩ ስሞች" />
          </ListItem>
          <ListItem button component={Link} to="/settings">
            <ListItemText primary="መለያ ቅንብሮች" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="ውጣ" />
          </ListItem>
        </List>
      </aside>
      <main className={styles.mainContent}>
        <Typography variant="h4" gutterBottom>
          ዳሽቦርድ
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <div className={styles.cards}>
          <div className={styles.card}>
            <div>የተማሪዎች ብዛት</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {studentsCount !== null ? studentsCount : "-"}
            </div>
          </div>
        </div>
        <div className={styles.charts}>
          <div className={styles.chartContainer}>
            <Typography variant="h6">የክፍል ተማሪዎች(ባር ገበታ)</Typography>
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
          {genderStatistics && (
            <div className={styles.chartContainer}>
              <Typography variant="h6">የተማሪዎች ጾታ(ባር ገበታ)</Typography>
              <Bar
                data={genderBarData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [general, setGeneral] = useState(null);
  const [classesData, setClassesData] = useState(null);
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
          "https://lihket.com.et/api/admin/dashboard",
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
          setGenderStatistics(data.genderStatistics);
          // Sensitive: Do not log dashboard data in production
          // console.log("Dashboard data:", data); // commented out
        }
      } catch (error) {
        // Only log errors, not sensitive data
        console.error("Fetch dashboard error:", error);
      }
    };
    fetchDashboard();
  }, []);

  // Prepare chart data
  const barData = classesData
    ? {
        labels: Object.keys(classesData),
        datasets: [
          {
            label: "Students by Class",
            data: Object.values(classesData),
            backgroundColor: "#1976d2",
          },
        ],
      }
    : null;

  // Prepare chart data for gender
  const genderBarData = genderStatistics
    ? {
        labels: Object.keys(genderStatistics),
        datasets: [
          {
            label: "Students gender",
            data: Object.values(genderStatistics),
            backgroundColor: "#1976d2",
          },
        ],
      }
    : null;

  const pieData = classesData
    ? {
        labels: Object.keys(classesData),
        datasets: [
          {
            label: "Students by Class",
            data: Object.values(classesData),
            backgroundColor: [
              "#1976d2",
              "#388e3c",
              "#fbc02d",
              "#d32f2f",
              "#7b1fa2",
              "#0288d1",
            ],
          },
        ],
      }
    : null;

  const genderPieData = genderStatistics
    ? {
        labels: Object.keys(genderStatistics),
        datasets: [
          {
            label: "Students gender",
            data: Object.values(genderStatistics),
            backgroundColor: [
              "#1976d2",
              "#388e3c",
              "#fbc02d",
              "#d32f2f",
              "#7b1fa2",
              "#0288d1",
            ],
          },
        ],
      }
    : null;

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
          <h2 style={{ margin: 0 }}>አድሚን ፓነል</h2>
        </div>
        <List>
          <ListItem button component={Link} to="/admin/students">
            <ListItemText primary="ተማሪዎችን አስተዳድር" />
          </ListItem>
          <ListItem button component={Link} to="/admin/teachers">
            <ListItemText primary="አስተዳድር አስተማሪዎች" />
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
        <Typography variant="h6" gutterBottom>
          እንኳን ደህና መጡ፣ {localStorage.getItem("name")}
        </Typography>
        <div className={styles.cards}>
          {general && (
            <>
              <div className={styles.card}>
                <div>ጠቅላላ ተማሪዎች</div>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {general.totalStudents}
                </div>
              </div>
              <div className={styles.card}>
                <div>ጠቅላላ አስተማሪዎች</div>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {general.totalTeachers}
                </div>
              </div>
              <div className={styles.card}>
                <div>የዛሬ መገኘት</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {general.todayTotalAttendance}
                </div>
                <div style={{ color: "#388e3c" }}>
                  {general.todayAttendanceByPercent}%
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles.charts}>
          {barData && (
            <div className={styles.chartContainer}>
              <Typography variant="h6">ተማሪዎች በክፍል(ባር ገበታ)</Typography>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          )}
          {genderBarData && (
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
          {pieData && (
            <div className={styles.chartContainer}>
              <Typography variant="h6">ተማሪዎች በክፍል(ፓይ ገበታ)</Typography>
              <Pie data={pieData} options={{ responsive: true }} />
            </div>
          )}
          {genderPieData && (
            <div className={styles.chartContainer}>
              <Typography variant="h6">የተማሪዎች ጾታ(ፓይ ገበታ)</Typography>
              <Pie data={genderPieData} options={{ responsive: true }} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

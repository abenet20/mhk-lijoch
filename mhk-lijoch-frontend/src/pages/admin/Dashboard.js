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
        }
      } catch (error) {
        console.error("Fetch data error:", error);
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
          <h2 style={{ margin: 0 }}>Admin Panel</h2>
        </div>
        <List>
          <ListItem button component={Link} to="/admin/students">
            <ListItemText primary="Manage Students" />
          </ListItem>
          <ListItem button component={Link} to="/admin/teachers">
            <ListItemText primary="Manage Teachers" />
          </ListItem>
          <ListItem button component={Link} to="/settings">
            <ListItemText primary="Account Settings" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </aside>
      <main className={styles.mainContent}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom>
          Welcome, {localStorage.getItem("name")}
        </Typography>
        <div className={styles.cards}>
          {general && (
            <>
              <div className={styles.card}>
                <div>Total Students</div>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {general.totalStudents}
                </div>
              </div>
              <div className={styles.card}>
                <div>Total Teachers</div>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {general.totalTeachers}
                </div>
              </div>
              <div className={styles.card}>
                <div>Today's Attendance</div>
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
              <Typography variant="h6">Students by Class (Bar)</Typography>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          )}
          {pieData && (
            <div className={styles.chartContainer}>
              <Typography variant="h6">Students by Class (Pie)</Typography>
              <Pie data={pieData} options={{ responsive: true }} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

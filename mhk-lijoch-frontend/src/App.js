import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import Teachers from "./pages/admin/Teachers";
import Settings from "./pages/Settings";
import TeacherDashboard from "./pages/teacher/Dashboard"
import Attendance from "./pages/teacher/Attendance";
import PrevAttendance from "./pages/teacher/PrevAttendance";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/teachers" element={<Teachers />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/attendance" element={<Attendance />} />
        <Route path="/teacher/prev-attendance" element={<PrevAttendance />} />

      </Routes>
    </BrowserRouter>
  );
}

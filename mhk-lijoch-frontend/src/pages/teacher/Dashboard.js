import { Link } from "react-router-dom";

export default function TeacherDashboard() {
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
